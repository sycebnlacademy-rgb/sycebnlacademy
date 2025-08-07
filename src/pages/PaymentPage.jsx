import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  CreditCard, 
  Shield, 
  CheckCircle, 
  ArrowLeft,
  ExternalLink,
  Smartphone,
  Banknote,
  Award,
  BookOpen,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { user, requestPremiumApproval } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRequestingApproval, setIsRequestingApproval] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Connexion requise
            </h1>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à cette page.
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

  if (user.isPremium) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Vous êtes déjà Premium !
            </h1>
            <p className="text-gray-600 mb-6">
              Vous avez accès à tous les modules de formation SYCEBNL.
            </p>
            <Link to="/modules">
              <Button>
                <BookOpen className="w-4 h-4 mr-2" />
                Accéder aux modules
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simuler un délai de traitement
    setTimeout(() => {
      // Rediriger vers FedaPay
      window.open('https://me.fedapay.com/formation-sycebnl', '_blank');
      setIsProcessing(false);
      
      // Afficher un message d'information
      toast.success('Redirection vers FedaPay. Revenez ici après le paiement pour activer votre compte Premium.');
    }, 1000);
  };



  const handleRequestApproval = () => {
    setIsRequestingApproval(true);
    
    setTimeout(() => {
      const result = requestPremiumApproval();
      
      if (result.success) {
        toast.success(result.message);
        navigate('/modules');
      } else {
        toast.error(result.error);
      }
      
      setIsRequestingApproval(false);
    }, 1000);
  };

  const features = [
    {
      icon: BookOpen,
      title: "Accès à tous les modules",
      description: "6 modules complets de formation SYCEBNL"
    },
    {
      icon: Award,
      title: "Certificat officiel",
      description: "Certificat de formation téléchargeable"
    },
    {
      icon: Clock,
      title: "Accès illimité",
      description: "Accès à vie à tous les contenus"
    },
    {
      icon: Shield,
      title: "Support prioritaire",
      description: "Assistance pédagogique dédiée"
    }
  ];

  const paymentMethods = [
    {
      icon: Smartphone,
      name: "Orange Money",
      description: "Paiement mobile sécurisé"
    },
    {
      icon: Smartphone,
      name: "MTN Mobile Money",
      description: "Paiement mobile rapide"
    },
    {
      icon: CreditCard,
      name: "Carte bancaire",
      description: "Visa, Mastercard acceptées"
    },
    {
      icon: Banknote,
      name: "Virement bancaire",
      description: "Transfert bancaire direct"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          <Link to="/modules" className="hover:text-blue-600">
            Modules
          </Link>
          <span>/</span>
          <span className="text-gray-900">Passer Premium</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Payment Info */}
          <div>
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Passez Premium
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Débloquez tous les modules de formation SYCEBNL et obtenez votre certificat officiel.
              </p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">
                      Formation complète SYCEBNL
                    </h3>
                    <p className="text-blue-700">
                      Accès à vie • 6 modules • Certificat inclus
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-900">
                      20 000 FCFA
                    </div>
                    <div className="text-sm text-blue-700">
                      Paiement unique
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Ce que vous obtenez
              </h2>
              
              <div className="space-y-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{feature.title}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Moyens de paiement acceptés
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                {paymentMethods.map((method, index) => {
                  const Icon = method.icon;
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                      <Icon className="w-6 h-6 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900 text-sm">{method.name}</div>
                        <div className="text-xs text-gray-600">{method.description}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Payment Action */}
          <div>
            {/* Payment Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Finaliser votre commande
              </h2>
              
              {/* Order Summary */}
              <div className="border border-gray-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Formation SYCEBNL Premium</span>
                  <span className="font-medium">20 000 FCFA</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Certificat officiel</span>
                  <span className="text-green-600">Inclus</span>
                </div>
                <div className="border-t border-gray-200 pt-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">20 000 FCFA</span>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <Button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mb-4"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Redirection...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Payer avec FedaPay
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>



              {/* Request Approval Button */}
              <Button 
                onClick={handleRequestApproval}
                disabled={isRequestingApproval}
                variant="outline"
                className="w-full mb-4 border-green-200 text-green-700 hover:bg-green-50"
                size="lg"
              >
                {isRequestingApproval ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Clock className="w-5 h-5 mr-2" />
                    Demander l'approbation admin
                  </>
                )}
              </Button>

              {/* Security Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-gray-900">Paiement sécurisé</span>
                </div>
                <p className="text-sm text-gray-600">
                  Vos données de paiement sont protégées par le chiffrement SSL et traitées par FedaPay, 
                  plateforme de paiement certifiée et sécurisée.
                </p>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-4">
              <h3 className="font-semibold text-blue-900 mb-3">
                Instructions de paiement
              </h3>
              <ol className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span className="font-medium">1.</span>
                  <span>Cliquez sur "Payer avec FedaPay"</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">2.</span>
                  <span>Choisissez votre moyen de paiement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">3.</span>
                  <span>Suivez les instructions de paiement</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="font-medium">4.</span>
                  <span>Revenez ici pour activer votre compte Premium</span>
                </li>
              </ol>
            </div>

            {/* Alternative Option */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 mb-3">
                Alternative : Demande d'approbation
              </h3>
              <p className="text-sm text-green-800 mb-3">
                Si vous ne pouvez pas effectuer le paiement en ligne, vous pouvez demander 
                l'approbation d'un administrateur pour accéder aux modules premium.
              </p>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• Votre demande sera examinée par un administrateur</li>
                <li>• Vous recevrez une notification une fois approuvée</li>
                <li>• Accès gratuit aux modules premium après approbation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <Link to="/modules">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux modules
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;

