import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Lock, 
  CheckCircle, 
  Clock, 
  Award,
  Play,
  BarChart3
} from 'lucide-react';

const ModulesPage = () => {
  const { user, isPremium } = useAuth();
  const { getModuleProgress, isModuleCompleted, canAccessModule } = useProgress();

  const getModuleStatus = (module) => {
    if (!user) return 'locked';
    
    if (!canAccessModule(module.id, module.isFree, isPremium)) {
      return 'locked';
    }
    
    if (isModuleCompleted(module.id)) {
      return 'completed';
    }
    
    const progress = getModuleProgress(module.id, module.chapters.length);
    if (progress > 0) {
      return 'in-progress';
    }
    
    return 'available';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Play className="w-5 h-5 text-blue-600" />;
      case 'available':
        return <BookOpen className="w-5 h-5 text-gray-600" />;
      case 'locked':
        return <Lock className="w-5 h-5 text-gray-400" />;
      default:
        return <BookOpen className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'in-progress':
        return 'En cours';
      case 'available':
        return 'Disponible';
      case 'locked':
        return 'Verrouillé';
      default:
        return 'Disponible';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'available':
        return 'bg-gray-100 text-gray-800';
      case 'locked':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Modules de Formation SYCEBNL
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Parcours complet en 6 modules pour maîtriser le Système Comptable des Entités à But Non Lucratif
          </p>
        </div>

        {/* Progress Overview */}
        {user && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Votre progression</h2>
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  {modules.filter(m => isModuleCompleted(m.id)).length} / {modules.length} modules
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {modules.filter(m => isModuleCompleted(m.id)).length}
                </div>
                <div className="text-sm text-blue-700">Modules terminés</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {modules.filter(m => {
                    const progress = getModuleProgress(m.id, m.chapters.length);
                    return progress > 0 && !isModuleCompleted(m.id);
                  }).length}
                </div>
                <div className="text-sm text-yellow-700">En cours</div>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {isPremium ? 'Premium' : 'Gratuit'}
                </div>
                <div className="text-sm text-green-700">
                  {isPremium ? 'Accès complet' : 'Module 1 uniquement'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Premium Upgrade Banner */}
        {user && !isPremium && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Débloquez tous les modules
                </h3>
                <p className="text-blue-100">
                  Accédez aux 5 modules premium et obtenez votre certificat officiel
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-yellow-300 mb-1">
                  20 000 FCFA
                </div>
                <Link to="/payment">
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Passer Premium
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const status = getModuleStatus(module);
            const progress = user ? getModuleProgress(module.id, module.chapters.length) : 0;
            const isAccessible = status !== 'locked';

            return (
              <div
                key={module.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 ${
                  isAccessible ? 'hover:shadow-md hover:border-blue-300' : 'opacity-75'
                }`}
              >
                {/* Module Header */}
                <div className="p-6 pb-4">
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
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getStatusColor(status)}`}>
                        {getStatusText(status)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {module.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {module.description}
                  </p>

                  {/* Module Stats */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{module.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{module.chapters.length} chapitres</span>
                    </div>
                    {module.finalQuiz && (
                      <div className="flex items-center space-x-1">
                        <Award className="w-4 h-4" />
                        <span>Quiz final</span>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  {user && isAccessible && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progression</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Module Footer */}
                <div className="px-6 pb-6">
                  {isAccessible ? (
                    <Link to={`/module/${module.id}`}>
                      <Button className="w-full" variant={status === 'completed' ? 'outline' : 'default'}>
                        <div className="flex items-center justify-center space-x-2">
                          {getStatusIcon(status)}
                          <span>
                            {status === 'completed' ? 'Revoir le module' : 
                             status === 'in-progress' ? 'Continuer' : 
                             'Commencer'}
                          </span>
                        </div>
                      </Button>
                    </Link>
                  ) : (
                    <div className="text-center">
                      <Button disabled className="w-full">
                        <Lock className="w-4 h-4 mr-2" />
                        {user ? 'Premium requis' : 'Connexion requise'}
                      </Button>
                      {!user && (
                        <p className="text-xs text-gray-500 mt-2">
                          <Link to="/login" className="text-blue-600 hover:text-blue-500">
                            Connectez-vous
                          </Link> pour accéder au contenu
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        {!user && (
          <div className="text-center mt-12 p-8 bg-white rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à commencer votre formation ?
            </h3>
            <p className="text-gray-600 mb-6">
              Inscrivez-vous gratuitement et accédez immédiatement au Module 1
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Play className="w-5 h-5 mr-2" />
                  Commencer gratuitement
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  J'ai déjà un compte
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModulesPage;

