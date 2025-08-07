import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle, 
  Star,
  ArrowRight,
  Play,
  Download,
  Shield
} from 'lucide-react';

const HomePage = () => {
  const { user, isPremium } = useAuth();
  
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('contactMessage');
    const form = e.target;
    const formData = new FormData(form);
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Envoi en cours...';
    messageDiv.className = 'text-center hidden';
    
    try {
      const response = await fetch('/php/simple-contact.php', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        messageDiv.className = 'text-center text-green-600 font-medium';
        messageDiv.textContent = data.message;
        form.reset();
      } else {
        messageDiv.className = 'text-center text-red-600 font-medium';
        messageDiv.textContent = data.message;
      }
    } catch (error) {
      messageDiv.className = 'text-center text-red-600 font-medium';
      messageDiv.textContent = 'Une erreur est survenue. Veuillez réessayer.';
      console.error('Erreur:', error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Envoyer <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>';
    }
  };

  const features = [
    {
      icon: BookOpen,
      title: "6 Modules Complets",
      description: "Formation structurée couvrant tous les aspects du SYCEBNL"
    },
    {
      icon: CheckCircle,
      title: "Quiz d'Évaluation",
      description: "5 QCM par chapitre + quiz final pour valider vos acquis"
    },
    {
      icon: Award,
      title: "Certificat Officiel",
      description: "Obtenez votre certificat de formation SYCEBNL"
    },
    {
      icon: Download,
      title: "Contenu Téléchargeable",
      description: "Téléchargez les cours par chapitre pour étudier hors ligne"
    },
    {
      icon: Shield,
      title: "Seuil de Validation",
      description: "80% de réussite requis pour valider chaque module"
    },
    {
      icon: Users,
      title: "Support Pédagogique",
      description: "Accompagnement tout au long de votre formation"
    }
  ];

  const modules = [
    {
      id: 1,
      title: "Introduction au SYCEBNL",
      description: "Fondements et principes de base",
      isFree: true,
      duration: "2h"
    },
    {
      id: 2,
      title: "Plan comptable SYCEBNL",
      description: "Structure et organisation",
      isFree: false,
      duration: "3h"
    },
    {
      id: 3,
      title: "Comptabilisation des ressources",
      description: "Gestion des financements",
      isFree: false,
      duration: "4h"
    },
    {
      id: 4,
      title: "États financiers SYCEBNL",
      description: "Préparation et présentation",
      isFree: false,
      duration: "4h"
    },
    {
      id: 5,
      title: "Contrôle interne et audit",
      description: "Systèmes de contrôle",
      isFree: false,
      duration: "3h"
    },
    {
      id: 6,
      title: "Cas pratiques",
      description: "Applications réelles",
      isFree: false,
      duration: "5h"
    }
  ];

  const testimonials = [
    {
      name: "Marie Kouassi",
      role: "Directrice Administrative, ONG Espoir",
      content: "Cette formation m'a permis de maîtriser parfaitement le SYCEBNL. Les modules sont très bien structurés et les quiz permettent de valider ses acquis.",
      rating: 5
    },
    {
      name: "Jean-Baptiste Ouattara",
      role: "Comptable, Fondation Solidarité",
      content: "Excellente formation ! Le contenu est complet et adapté aux réalités des EBNL. Je recommande vivement.",
      rating: 5
    },
    {
      name: "Fatou Diallo",
      role: "Responsable Financière, Association Développement",
      content: "Formation de qualité avec un certificat reconnu. L'investissement en vaut vraiment la peine.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Maîtrisez le 
                <span className="text-yellow-300"> SYCEBNL</span>
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Formation complète au Système Comptable des Entités à But Non Lucratif. 
                Obtenez votre certification officielle en 6 modules.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {user ? (
                  <Link to="/modules">
                    <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                      <Play className="w-5 h-5 mr-2" />
                      Continuer ma formation
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                        <Play className="w-5 h-5 mr-2" />
                        Commencer gratuitement
                      </Button>
                    </Link>
                    <Link to="/modules">
                      <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-white">
                        Découvrir les modules
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              <div className="flex items-center space-x-6 text-blue-100">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Module 1 gratuit</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Certificat officiel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-yellow-300" />
                  <span>Accès illimité</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Formation SYCEBNL</h3>
                  <p className="text-blue-100">Système Comptable des EBNL</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Modules</span>
                    <span className="font-semibold">6 modules</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Durée totale</span>
                    <span className="font-semibold">21 heures</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quiz</span>
                    <span className="font-semibold">100+ questions</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Certificat</span>
                    <span className="font-semibold">Officiel</span>
                  </div>
                  <div className="border-t border-white/20 pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Prix</span>
                      <span className="text-yellow-300">20 000 FCFA</span>
                    </div>
                    <p className="text-sm text-blue-100 mt-1">Module 1 gratuit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi choisir notre formation ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Une formation complète et pratique pour maîtriser le SYCEBNL et obtenir votre certification officielle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center p-6 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Programme de formation
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              6 modules progressifs pour une maîtrise complète du SYCEBNL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
              <div key={module.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-blue-600">Module {module.id}</span>
                  {module.isFree ? (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Gratuit
                    </span>
                  ) : (
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Premium
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
                <p className="text-gray-600 mb-4">{module.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{module.duration}</span>
                  <Link to="/modules">
                    <Button variant="outline" size="sm">
                      Voir le module
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/modules">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Voir tous les modules
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ce que disent nos apprenants
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez les témoignages de professionnels qui ont suivi notre formation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.content}"</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              Contactez-nous
            </h2>
            <p className="text-lg text-gray-600">
              Une question ? N'hésitez pas à nous contacter
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <form id="contactForm" className="space-y-4" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="Votre nom"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Sujet *
                </label>
                <select
                  id="subject"
                  name="subject"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="">Choisir un sujet</option>
                  <option value="Information sur la formation">Information formation</option>
                  <option value="Problème technique">Problème technique</option>
                  <option value="Demande de certificat">Demande certificat</option>
                  <option value="Partenariat">Partenariat</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Votre message..."
                ></textarea>
              </div>

              <div className="text-center pt-2">
                <Button 
                  type="submit" 
                  size="default" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6"
                  id="submitBtn"
                >
                  Envoyer
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              <div id="contactMessage" className="text-center hidden"></div>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Prêt à commencer votre formation ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des centaines de professionnels qui ont déjà maîtrisé le SYCEBNL
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link to="/modules">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                  <Play className="w-5 h-5 mr-2" />
                  Continuer ma formation
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    <Play className="w-5 h-5 mr-2" />
                    Commencer gratuitement
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 border-white">
                    J'ai déjà un compte
                  </Button>
                </Link>
              </>
            )}
          </div>

          <p className="text-blue-100 mt-6">
            Module 1 gratuit • Certificat officiel • Accès illimité
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

