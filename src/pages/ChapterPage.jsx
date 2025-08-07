import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { getModuleById, getChapterById } from '../data/modules';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  ArrowLeft, 
  ArrowRight,
  CheckCircle, 
  Clock,
  Award,
  Download,
  Play,
  RotateCcw,
  Presentation,
  Loader2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import SlideShow from '../components/SlideShow';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const ChapterPage = () => {
  const { moduleId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user, isPremium } = useAuth();
  const { 
    canAccessModule, 
    isChapterCompleted,
    saveQuizResult,
    getQuizResult
  } = useProgress();

  const [currentView, setCurrentView] = useState('content'); // 'content', 'slideshow' or 'quiz'
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizState, setQuizState] = useState({
    currentQuestion: 0,
    answers: [],
    showResults: false,
    timeStarted: null
  });

  const module = getModuleById(moduleId);
  const chapter = getChapterById(moduleId, chapterId);

  useEffect(() => {
    // Charger les résultats précédents du quiz
    if (user && module && chapter) {
      const previousResult = getQuizResult(module.id, chapter.id);
      if (previousResult) {
        setQuizState(prev => ({
          ...prev,
          answers: previousResult.answers || [],
          showResults: !!previousResult.score
        }));
      }
    }
  }, [user, module, chapter, getQuizResult]);

  if (!module || !chapter) {
    return <Navigate to="/modules" replace />;
  }

  const canAccess = user && canAccessModule(module.id, module.isFree, isPremium);
  
  if (!canAccess) {
    return <Navigate to={`/module/${moduleId}`} replace />;
  }

  const isCompleted = isChapterCompleted(module.id, chapter.id);
  const previousResult = getQuizResult(module.id, chapter.id);

  // Navigation entre chapitres
  const currentChapterIndex = module.chapters.findIndex(ch => ch.id === parseInt(chapterId));
  const previousChapter = currentChapterIndex > 0 ? module.chapters[currentChapterIndex - 1] : null;
  const nextChapter = currentChapterIndex < module.chapters.length - 1 ? module.chapters[currentChapterIndex + 1] : null;

  const handleStartQuiz = () => {
    setCurrentView('quiz');
    setQuizState({
      currentQuestion: 0,
      answers: new Array(chapter.questions.length).fill(null),
      showResults: false,
      timeStarted: new Date()
    });
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    setQuizState(prev => ({
      ...prev,
      answers: newAnswers
    }));
  };

  const handleNextQuestion = () => {
    if (quizState.currentQuestion < chapter.questions.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1
      }));
    } else {
      handleFinishQuiz();
    }
  };

  const handlePreviousQuestion = () => {
    if (quizState.currentQuestion > 0) {
      setQuizState(prev => ({
        ...prev,
        currentQuestion: prev.currentQuestion - 1
      }));
    }
  };

  const handleFinishQuiz = () => {
    const score = quizState.answers.reduce((total, answer, index) => {
      return total + (answer === chapter.questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const percentage = (score / chapter.questions.length) * 100;
    const passed = percentage >= 80;

    const result = {
      score,
      totalQuestions: chapter.questions.length,
      percentage: Math.round(percentage),
      passed,
      answers: quizState.answers,
      timeSpent: quizState.timeStarted ? Math.round((new Date() - quizState.timeStarted) / 1000) : 0
    };

    saveQuizResult(module.id, chapter.id, result);

    setQuizState(prev => ({
      ...prev,
      showResults: true
    }));

    if (passed) {
      toast.success(`Félicitations ! Vous avez réussi le quiz avec ${percentage}%`);
    } else {
      toast.error(`Quiz non réussi. Vous avez obtenu ${percentage}%. 80% requis.`);
    }
  };

  const handleRetakeQuiz = () => {
    setQuizState({
      currentQuestion: 0,
      answers: new Array(chapter.questions.length).fill(null),
      showResults: false,
      timeStarted: new Date()
    });
  };

  const downloadChapter = async () => {
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
      addCenteredText(cleanText(module.title), 18, true, '#1f2937');
      yPosition += 5;
      
      // Titre du chapitre (centré et en gras)
      addCenteredText(cleanText(chapter.title), 16, true, '#374151');
      yPosition += 10;
      
      // Ligne de séparation
      addCenteredText('─'.repeat(30), 12, false, '#cccccc');
      yPosition += 10;
      
      // Contenu du chapitre nettoyé et aligné à gauche
      const cleanedContent = cleanText(chapter.content);
      const paragraphs = cleanedContent.split('\n\n').filter(p => p.trim());
      
      for (const paragraph of paragraphs) {
        if (paragraph.trim()) {
          addText(paragraph.trim(), 12, false, '#374151', 'left');
          yPosition += 3; // Espacement entre paragraphes
        }
      }
      
      // Pied de page (centré)
      yPosition += 20;
      addCenteredText('─'.repeat(30), 12, false, '#cccccc');
      yPosition += 10;
      addCenteredText(`Généré le ${new Date().toLocaleDateString('fr-FR')} par ${user.firstName} ${user.lastName}`, 10, false, '#666666');
      addCenteredText('SYCEBNL Academy - Formation en ligne', 10, false, '#666666');
      addCenteredText('Module ' + module.id + ' - Chapitre ' + chapter.id, 10, false, '#666666');
      
      // Sauvegarder le PDF
      pdf.save(`Chapitre_${cleanText(module.title)}_${cleanText(chapter.title)}_${user.firstName}_${user.lastName}.pdf`);
      
      toast.success('Chapitre téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error('Erreur lors du téléchargement. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentQuestion = chapter.questions[quizState.currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/modules" className="hover:text-blue-600">Modules</Link>
          <span>/</span>
          <Link to={`/module/${moduleId}`} className="hover:text-blue-600">
            Module {module.id}
          </Link>
          <span>/</span>
          <span className="text-gray-900">Chapitre {chapter.id}</span>
        </nav>

        {/* Chapter Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{chapter.title}</h1>
                <p className="text-sm text-gray-600">
                  Module {module.id} • Chapitre {chapter.id} • {chapter.questions.length} questions
                </p>
              </div>
            </div>
            
            {isCompleted && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Terminé</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 border-b border-gray-200">
            <button
              onClick={() => setCurrentView('content')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'content'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Contenu du chapitre
            </button>
            <button
              onClick={() => setCurrentView('slideshow')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'slideshow'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Presentation className="w-4 h-4 inline mr-1" />
              Diaporama
            </button>
            <button
              onClick={() => setCurrentView('quiz')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                currentView === 'quiz'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Quiz ({chapter.questions.length} questions)
            </button>
          </div>
        </div>

        {/* Content View */}
        {currentView === 'content' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown>{chapter.content}</ReactMarkdown>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={downloadChapter}
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
                        Télécharger le chapitre
                      </>
                    )}
                  </Button>
                  {previousResult && (
                    <div className="text-sm text-gray-600">
                      Dernier score: {previousResult.percentage}%
                      {previousResult.passed && (
                        <CheckCircle className="w-4 h-4 text-green-600 inline ml-1" />
                      )}
                    </div>
                  )}
                </div>
                
                <Button onClick={() => setCurrentView('quiz')}>
                  <Award className="w-4 h-4 mr-2" />
                  {previousResult ? 'Refaire le quiz' : 'Commencer le quiz'}
                </Button>
                <Button onClick={() => setCurrentView('slideshow')} variant="outline">
                  <Presentation className="w-4 h-4 mr-2" />
                  Voir en diaporama
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Slideshow View */}
        {currentView === 'slideshow' && (
          <div className="mb-6">
            <SlideShow 
              content={chapter.content}
              title={chapter.title}
              onComplete={() => {
                toast.success('Diaporama terminé !');
                setCurrentView('quiz');
              }}
            />
            <div className="mt-4 text-center">
              <Button 
                variant="outline" 
                onClick={() => setCurrentView('content')}
                className="mr-4"
              >
                Retour au contenu
              </Button>
              <Button onClick={() => setCurrentView('quiz')}>
                Passer au quiz
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Quiz View */}
        {currentView === 'quiz' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {!quizState.showResults ? (
              <>
                {/* Quiz Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Quiz du chapitre
                    </h2>
                    <p className="text-sm text-gray-600">
                      Question {quizState.currentQuestion + 1} sur {chapter.questions.length}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    Seuil de réussite: 80%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((quizState.currentQuestion + 1) / chapter.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {currentQuestion.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`w-full text-left p-4 rounded-lg border transition-colors ${
                          quizState.answers[quizState.currentQuestion] === index
                            ? 'border-blue-600 bg-blue-50 text-blue-900'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            quizState.answers[quizState.currentQuestion] === index
                              ? 'border-blue-600 bg-blue-600'
                              : 'border-gray-300'
                          }`}>
                            {quizState.answers[quizState.currentQuestion] === index && (
                              <div className="w-full h-full rounded-full bg-white scale-50"></div>
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={quizState.currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  
                  <div className="text-sm text-gray-600">
                    {quizState.answers.filter(a => a !== null).length} / {chapter.questions.length} réponses
                  </div>
                  
                  <Button
                    onClick={handleNextQuestion}
                    disabled={quizState.answers[quizState.currentQuestion] === null}
                  >
                    {quizState.currentQuestion === chapter.questions.length - 1 ? (
                      <>
                        Terminer le quiz
                        <CheckCircle className="w-4 h-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Suivant
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </>
            ) : (
              /* Quiz Results */
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  previousResult?.passed ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {previousResult?.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <RotateCcw className="w-8 h-8 text-red-600" />
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {previousResult?.passed ? 'Félicitations !' : 'Quiz non réussi'}
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Vous avez obtenu {previousResult?.score} / {previousResult?.totalQuestions} 
                  ({previousResult?.percentage}%)
                </p>

                {previousResult?.passed ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <p className="text-green-800">
                      Excellent ! Vous avez validé ce chapitre. Vous pouvez maintenant passer au chapitre suivant.
                    </p>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-800">
                      Vous devez obtenir au moins 80% pour valider ce chapitre. 
                      Relisez le contenu et refaites le quiz.
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button onClick={handleRetakeQuiz}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Refaire le quiz
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentView('content')}>
                    Revoir le contenu
                  </Button>
                  {previousResult?.passed && nextChapter && (
                    <Link to={`/module/${moduleId}/chapter/${nextChapter.id}`}>
                      <Button>
                        Chapitre suivant
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between">
          <div>
            {previousChapter ? (
              <Link to={`/module/${moduleId}/chapter/${previousChapter.id}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {previousChapter.title}
                </Button>
              </Link>
            ) : (
              <Link to={`/module/${moduleId}`}>
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour au module
                </Button>
              </Link>
            )}
          </div>

          <div>
            {nextChapter ? (
              <Link to={`/module/${moduleId}/chapter/${nextChapter.id}`}>
                <Button disabled={!isCompleted}>
                  {nextChapter.title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <Link to={`/module/${moduleId}`}>
                <Button>
                  Retour au module
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;

