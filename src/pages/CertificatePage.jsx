import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { Button } from '@/components/ui/button';
import { 
  Award, 
  Download, 
  CheckCircle, 
  Lock,
  ArrowLeft,
  Calendar,
  User,
  BookOpen,
  Star,
  Loader2
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const CertificatePage = () => {
  const { user, isPremium } = useAuth();
  const { canGenerateCertificate, getOverallProgress } = useProgress();
  const [isGenerating, setIsGenerating] = useState(false);
  const certificateRef = useRef(null);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Connexion requise
            </h1>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à votre certificat.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button>Se connecter</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Créer un compte</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const canGenerate = canGenerateCertificate();
  const progress = getOverallProgress();
  const completedModules = modules.filter(module => 
    // Simuler la completion pour la démo
    module.id === 1 || (isPremium && Math.random() > 0.5)
  ).length;

  const generateCertificate = async () => {
    if (!canGenerate) {
      toast.error('Vous devez terminer tous les modules pour générer votre certificat.');
      return;
    }

    setIsGenerating(true);

    try {
      // Attendre un peu pour que l'utilisateur voie le loading
      await new Promise(resolve => setTimeout(resolve, 1000));

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      
      const imgWidth = 297; // A4 landscape width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`Certificat_SYCEBNL_${user.firstName}_${user.lastName}.pdf`);
      
      toast.success('Certificat téléchargé avec succès !');
    } catch (error) {
      console.error('Erreur lors de la génération du certificat:', error);
      toast.error('Erreur lors de la génération du certificat. Veuillez réessayer.');
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDate = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateNumber = `SYCEBNL-${new Date().getFullYear()}-${user.id.toString().padStart(4, '0')}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/modules" className="hover:text-blue-600">
            Modules
          </Link>
          <span>/</span>
          <span className="text-gray-900">Certificat</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Status and Info */}
          <div className="lg:col-span-1">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Statut du certificat
              </h2>
              
              {canGenerate ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-900 mb-2">
                    Certificat disponible !
                  </h3>
                  <p className="text-green-700 mb-4">
                    Félicitations ! Vous avez terminé tous les modules et pouvez télécharger votre certificat.
                  </p>
                  <Button onClick={generateCertificate} disabled={isGenerating} className="w-full">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger le certificat
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Certificat non disponible
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {!isPremium 
                      ? "Vous devez passer Premium et terminer tous les modules."
                      : "Terminez tous les modules pour débloquer votre certificat."
                    }
                  </p>
                  {!isPremium && (
                    <Link to="/payment">
                      <Button className="w-full mb-2">
                        Passer Premium
                      </Button>
                    </Link>
                  )}
                  <Link to="/modules">
                    <Button variant="outline" className="w-full">
                      Continuer la formation
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Votre progression</h3>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Progression globale</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600">Modules terminés</span>
                    <span className="font-medium">{completedModules} / {modules.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedModules / modules.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    {isPremium ? (
                      <>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-green-700">Compte Premium actif</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">Compte gratuit</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Certificate Preview */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Aperçu du certificat
              </h2>
              
              {/* Certificate */}
              <div 
                ref={certificateRef}
                className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-lg p-8 aspect-[4/3] flex flex-col justify-center items-center text-center relative overflow-hidden"
                style={{ minHeight: '400px' }}
              >
                {/* Decorative elements */}
                <div className="absolute top-4 left-4 w-16 h-16 border-4 border-blue-300 rounded-full opacity-20"></div>
                <div className="absolute top-4 right-4 w-16 h-16 border-4 border-yellow-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 left-4 w-12 h-12 border-4 border-green-300 rounded-full opacity-20"></div>
                <div className="absolute bottom-4 right-4 w-12 h-12 border-4 border-purple-300 rounded-full opacity-20"></div>

                {/* Header */}
                <div className="mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-blue-900 mb-2">
                    CERTIFICAT DE FORMATION
                  </h1>
                  <h2 className="text-xl font-semibold text-blue-700">
                    Système Comptable des Entités à But Non Lucratif
                  </h2>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <p className="text-lg text-gray-700 mb-4">
                    Il est certifié que
                  </p>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 border-b-2 border-blue-300 pb-2 inline-block">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-lg text-gray-700 mb-4">
                    a suivi avec succès la formation complète au SYCEBNL
                  </p>
                  <p className="text-base text-gray-600">
                    comprenant 6 modules de formation, quiz d'évaluation et validation des acquis
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between w-full mt-auto">
                  <div className="text-left">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Délivré le {currentDate}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <BookOpen className="w-4 h-4" />
                      <span>N° {certificateNumber}</span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-1 mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm font-medium text-gray-700">
                      Formation certifiée
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={generateCertificate} 
                  disabled={!canGenerate || isGenerating}
                  className="flex-1"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger en PDF
                    </>
                  )}
                </Button>
                
                <Link to="/modules">
                  <Button variant="outline" className="flex-1">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour aux modules
                  </Button>
                </Link>
              </div>

              {!canGenerate && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note :</strong> Ceci est un aperçu de votre futur certificat. 
                    {!isPremium 
                      ? " Passez Premium et terminez tous les modules pour le débloquer."
                      : " Terminez tous les modules pour le débloquer."
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificatePage;

