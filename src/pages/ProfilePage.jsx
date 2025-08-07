import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { modules } from '../data/modules';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Mail, 
  Calendar, 
  Award,
  BookOpen,
  BarChart3,
  Settings,
  Shield,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { user, updateProfile, isPremium } = useAuth();
  const { getOverallProgress, resetProgress } = useProgress();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Connexion requise
            </h1>
            <p className="text-gray-600 mb-6">
              Vous devez être connecté pour accéder à votre profil.
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

  const progress = getOverallProgress();
  const completedModules = modules.filter(module => 
    // Simuler la completion pour la démo
    module.id === 1 || (isPremium && Math.random() > 0.5)
  ).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error('Tous les champs sont requis');
      return;
    }

    updateProfile(formData);
    setIsEditing(false);
    toast.success('Profil mis à jour avec succès');
  };

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    });
    setIsEditing(false);
  };

  const handleResetProgress = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser votre progression ? Cette action est irréversible.')) {
      resetProgress();
      toast.success('Progression réinitialisée');
    }
  };

  const registrationDate = new Date(user.registrationDate).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const lastLoginDate = new Date(user.lastLogin).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mon Profil</h1>
          <p className="text-gray-600">Gérez vos informations personnelles et suivez votre progression</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Informations personnelles
                </h2>
                {!isEditing ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      Sauvegarder
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      Annuler
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">Prénom</Label>
                  {isEditing ? (
                    <Input
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {user.firstName}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="lastName">Nom</Label>
                  {isEditing ? (
                    <Input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {user.lastName}
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="email">Adresse email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  ) : (
                    <div className="mt-1 p-3 bg-gray-50 rounded-md">
                      {user.email}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations du compte
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Membre depuis</p>
                    <p className="font-medium text-gray-900">{registrationDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dernière connexion</p>
                    <p className="font-medium text-gray-900">{lastLoginDate}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isPremium ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <Shield className={`w-5 h-5 ${
                      isPremium ? 'text-yellow-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type de compte</p>
                    <p className={`font-medium ${
                      isPremium ? 'text-yellow-700' : 'text-gray-900'
                    }`}>
                      {isPremium ? 'Premium' : 'Gratuit'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">ID Utilisateur</p>
                    <p className="font-medium text-gray-900">#{user.id}</p>
                  </div>
                </div>
              </div>

              {!isPremium && (
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-blue-900">Passez Premium</h3>
                      <p className="text-sm text-blue-700">
                        Débloquez tous les modules et obtenez votre certificat
                      </p>
                    </div>
                    <Link to="/payment">
                      <Button size="sm">
                        Passer Premium
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6">
              <h2 className="text-xl font-semibold text-red-900 mb-4">
                Zone de danger
              </h2>
              <p className="text-red-700 mb-4">
                Ces actions sont irréversibles. Procédez avec prudence.
              </p>
              
              <Button 
                variant="outline" 
                onClick={handleResetProgress}
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Réinitialiser ma progression
              </Button>
            </div>
          </div>

          {/* Right Column - Stats and Progress */}
          <div className="lg:col-span-1">
            {/* Progress Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Progression globale</h3>
              
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-blue-600 mb-1">{progress}%</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modules terminés</span>
                  <span className="font-medium">{completedModules} / {modules.length}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Modules disponibles</span>
                  <span className="font-medium">
                    {isPremium ? modules.length : 1} / {modules.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Chapitres étudiés</p>
                    <p className="font-medium text-gray-900">
                      {modules.reduce((total, module) => total + (module.id === 1 ? module.chapters.length : 0), 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Quiz réussis</p>
                    <p className="font-medium text-gray-900">
                      {modules.filter(m => m.id === 1).length * 3} {/* 3 chapitres du module 1 */}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Award className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Certificat</p>
                    <p className="font-medium text-gray-900">
                      {completedModules === modules.length && isPremium ? 'Disponible' : 'En cours'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Actions rapides</h3>
              
              <div className="space-y-3">
                <Link to="/modules">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Continuer la formation
                  </Button>
                </Link>
                
                <Link to="/certificate">
                  <Button variant="outline" className="w-full justify-start">
                    <Award className="w-4 h-4 mr-2" />
                    Voir mon certificat
                  </Button>
                </Link>
                
                {!isPremium && (
                  <Link to="/payment">
                    <Button className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Passer Premium
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

