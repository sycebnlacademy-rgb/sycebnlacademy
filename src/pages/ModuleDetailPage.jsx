import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { getModuleById } from '../data/modules';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { 
  BookOpen, 
  Clock, 
  CheckCircle, 
  Lock, 
  Play,
  Award,
  ArrowLeft,
  Download,
  BarChart3,
  Loader2
} from 'lucide-react';

const ModuleDetailPage = () => {
  const { moduleId } = useParams();
  const { user, isPremium } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const { 
    getModuleProgress, 
    isModuleCompleted, 
    isChapterCompleted,
    canAccessModule,
    getFinalQuizResult
  } = useProgress();

  const module = getModuleById(moduleId);

  if (!module) {
    return <Navigate to="/modules" replace />;
  }

  const canAccess = user && canAccessModule(module.id, module.isFree, isPremium);
  const moduleProgress = user ? getModuleProgress(module.id, module.chapters.length) : 0;
  const isCompleted = user ? isModuleCompleted(module.id) : false;
  const finalQuizResult = user ? getFinalQuizResult(module.id) : null;

  const downloadModule = async () => {
    setIsGenerating(true);
    
    try {
      // Créer le PDF directement avec jsPDF sans html2canvas
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Configuration des styles
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      let yPosition = margin;
      
      // Fonction pour nettoyer le texte (supprimer les # et formater)
      const cleanText = (text) => {
        return text
          .replace(/#{1,6}\s*/g, '') // Supprimer les titres markdown (# ## ### etc.)
          .replace(/\*\*(.*?)\*\*/g, '$1') // Supprimer le gras markdown
          .replace(/\*(.*?)\*/g, '$1') // Supprimer l'italique markdown
          .replace(/`(.*?)`/g, '$1') // Supprimer le code inline
          .trim();
      };
      
      // Fonction pour ajouter du texte avec gestion des sauts de page
      const addText = (text, fontSize = 12, isBold = false, color = '#000000', align = 'left') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        // Diviser le texte en lignes qui tiennent dans la largeur
        const lines = pdf.splitTextToSize(text, contentWidth);
        
        // Vérifier si on a assez d'espace sur la page
        const lineHeight = fontSize * 0.4;
        const neededHeight = lines.length * lineHeight;
        
        if (yPosition + neededHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        // Ajouter le texte avec l'alignement spécifié
        pdf.text(lines, margin, yPosition, { align: align });
        yPosition += neededHeight + 5;
      };
      
      // Fonction pour centrer du texte
      const addCenteredText = (text, fontSize = 12, isBold = false, color = '#000000') => {
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
        pdf.setTextColor(color);
        
        // Calculer la position centrée
        const textWidth = pdf.getTextWidth(text);
        const centerX = pageWidth / 2;
        const xPosition = centerX - (textWidth / 2);
        
        // Vérifier si on a assez d'espace sur la page
        const lineHeight = fontSize * 0.4;
        const neededHeight = lineHeight;
        
        if (yPosition + neededHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          yPosition = margin;
        }
        
        pdf.text(text, xPosition, yPosition);
        yPosition += neededHeight + 5;
      };
      
      // En-tête centré
      addCenteredText('SYCEBNL ACADEMY', 16, true, '#1f2937');
      addCenteredText('Formation en ligne', 12, false, '#6b7280');
      yPosition += 10;
      
      // Ligne de séparation en-tête
      addCenteredText('─'.repeat(30), 12, false, '#cccccc');
      yPosition += 10;
      
      // Titre du module (centré et en gras)
      addCenteredText(cleanText(module.title), 20, true, '#1f2937');
      yPosition += 5;
      
      // Description du module (alignée à gauche)
      addText(cleanText(module.description), 14, false, '#6b7280', 'left');
      yPosition += 15;
      
      // Ligne de séparation
      addCenteredText('─'.repeat(30), 12, false, '#cccccc');
      yPosition += 10;
      
      // Section contenu du module (centré et en gras)
      addCenteredText('CONTENU DU MODULE', 16, true, '#374151');
      yPosition += 10;
      
      // Liste des chapitres
      module.chapters.forEach((chapter, index) => {
        // Titre du chapitre (aligné à gauche et en gras)
        addText(`Chapitre ${chapter.id}: ${cleanText(chapter.title)}`, 14, true, '#1f2937', 'left');
        
        // Description du chapitre (alignée à gauche)
        if (chapter.description) {
          addText(cleanText(chapter.description), 12, false, '#6b7280', 'left');
        }
        
        // Extrait du contenu (aligné à gauche)
        const contentPreview = cleanText(chapter.content).substring(0, 300);
        addText(contentPreview + (chapter.content.length > 300 ? '...' : ''), 11, false, '#374151', 'left');
        
        yPosition += 10; // Espacement entre chapitres
      });
      
      // Pied de page (centré)
      yPosition += 20;
      addCenteredText('─'.repeat(30), 12, false, '#cccccc');
      yPosition += 10;
      addCenteredText(`Généré le ${new Date().toLocaleDateString('fr-FR')} par ${user.firstName} ${user.lastName}`, 10, false, '#666666');
      addCenteredText('SYCEBNL Academy - Formation en ligne', 10, false, '#666666');
      addCenteredText(`Module ${module.id} - ${module.chapters.length} chapitres`, 10, false, '#666666');
      
      // Sauvegarder le PDF
      pdf.save(`Module_${cleanText(module.title)}_${user.firstName}_${user.lastName}.pdf`);
      
      toast.success('Module téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!canAccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Accès restreint
            </h1>
            <p className="text-gray-600 mb-6">
              {!user 
                ? "Vous devez être connecté pour accéder à ce module."
                : "Ce module nécessite un accès Premium."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!user ? (
                <>
                  <Link to="/login">
                    <Button>Se connecter</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline">Créer un compte</Button>
                  </Link>
                </>
              ) : (
                <Link to="/payment">
                  <Button>Passer Premium</Button>
                </Link>
              )}
              <Link to="/modules">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux modules
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/modules" className="hover:text-blue-600">
            Modules
          </Link>
          <span>/</span>
          <span className="text-gray-900">Module {module.id}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Module Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-blue-600">
                  Module {module.id}
                </span>
                <div className="flex items-center space-x-2">
                  {module.isFree ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Gratuit
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                  {isCompleted && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      <CheckCircle className="w-3 h-3 mr-1 inline" />
                      Terminé
                    </span>
                  )}
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {module.title}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {module.description}
              </p>

              {/* Module Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{module.duration}</div>
                  <div className="text-xs text-gray-600">Durée</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{module.chapters.length}</div>
                  <div className="text-xs text-gray-600">Chapitres</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Award className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">
                    {module.chapters.reduce((total, chapter) => total + chapter.questions.length, 0)}
                  </div>
                  <div className="text-xs text-gray-600">Questions</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-gray-600 mx-auto mb-1" />
                  <div className="text-sm font-medium text-gray-900">{moduleProgress}%</div>
                  <div className="text-xs text-gray-600">Progression</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Progression du module</span>
                  <span>{moduleProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${moduleProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/modules">
                  <Button variant="outline">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux modules
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={downloadModule}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger le contenu
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Chapters List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Chapitres du module
              </h2>

              <div className="space-y-4">
                {module.chapters.map((chapter, index) => {
                  const isChapterDone = isChapterCompleted(module.id, chapter.id);
                  
                  return (
                    <div
                      key={chapter.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isChapterDone 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {isChapterDone ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {chapter.questions.length} questions • Quiz inclus
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {isChapterDone && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                              Terminé
                            </span>
                          )}
                          <Link to={`/module/${module.id}/chapter/${chapter.id}`}>
                            <Button size="sm" variant={isChapterDone ? "outline" : "default"}>
                              {isChapterDone ? (
                                <>
                                  <CheckCircle className="w-4 h-4 mr-1" />
                                  Revoir
                                </>
                              ) : (
                                <>
                                  <Play className="w-4 h-4 mr-1" />
                                  {index === 0 || isChapterCompleted(module.id, module.chapters[index - 1].id) 
                                    ? 'Commencer' 
                                    : 'Verrouillé'
                                  }
                                </>
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Final Quiz */}
            {module.finalQuiz && module.finalQuiz.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Quiz final du module
                </h2>
                <p className="text-gray-600 mb-4">
                  Validez vos connaissances avec le quiz final de {module.finalQuiz.length} questions.
                  Vous devez obtenir au moins 80% pour valider le module.
                </p>
                
                {finalQuizResult ? (
                  <div className={`p-4 rounded-lg mb-4 ${
                    finalQuizResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`font-medium ${
                          finalQuizResult.passed ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {finalQuizResult.passed ? 'Quiz réussi !' : 'Quiz non réussi'}
                        </p>
                        <p className={`text-sm ${
                          finalQuizResult.passed ? 'text-green-600' : 'text-red-600'
                        }`}>
                          Score: {finalQuizResult.score}/{finalQuizResult.totalQuestions} 
                          ({Math.round((finalQuizResult.score / finalQuizResult.totalQuestions) * 100)}%)
                        </p>
                      </div>
                      {finalQuizResult.passed && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>{module.finalQuiz.length} questions</span>
                    <span>Seuil: 80%</span>
                    <span>Tentatives illimitées</span>
                  </div>
                  
                  {moduleProgress === 100 ? (
                    <Link to={`/module/${module.id}/final-quiz`}>
                      <Button>
                        <Award className="w-4 h-4 mr-2" />
                        {finalQuizResult ? 'Refaire le quiz' : 'Commencer le quiz'}
                      </Button>
                    </Link>
                  ) : (
                    <Button disabled>
                      <Lock className="w-4 h-4 mr-2" />
                      Terminez tous les chapitres
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Votre progression</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Chapitres terminés</span>
                    <span className="font-medium">
                      {module.chapters.filter(ch => isChapterCompleted(module.id, ch.id)).length} / {module.chapters.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ 
                        width: `${(module.chapters.filter(ch => isChapterCompleted(module.id, ch.id)).length / module.chapters.length) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>

                {finalQuizResult && (
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600">Quiz final</span>
                      <span className={`font-medium ${finalQuizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.round((finalQuizResult.score / finalQuizResult.totalQuestions) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${finalQuizResult.passed ? 'bg-green-600' : 'bg-red-600'}`}
                        style={{ 
                          width: `${(finalQuizResult.score / finalQuizResult.totalQuestions) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h3 className="font-semibold text-blue-900 mb-4">Prochaines étapes</h3>
              
              <div className="space-y-3 text-sm">
                {moduleProgress < 100 ? (
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Play className="w-4 h-4" />
                    <span>Terminez tous les chapitres</span>
                  </div>
                ) : !finalQuizResult ? (
                  <div className="flex items-center space-x-2 text-blue-700">
                    <Award className="w-4 h-4" />
                    <span>Passez le quiz final</span>
                  </div>
                ) : finalQuizResult.passed ? (
                  <div className="flex items-center space-x-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span>Module terminé avec succès !</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-red-700">
                    <Award className="w-4 h-4" />
                    <span>Refaites le quiz final (80% requis)</span>
                  </div>
                )}
                
                {isCompleted && (
                  <div className="flex items-center space-x-2 text-blue-700">
                    <BookOpen className="w-4 h-4" />
                    <span>Passez au module suivant</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleDetailPage;

