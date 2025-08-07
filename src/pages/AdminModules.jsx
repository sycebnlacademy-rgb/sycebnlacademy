import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  BookOpen, 
  Search,
  Plus,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  Download,
  Upload,
  Play,
  Pause,
  Users,
  Clock,
  Award,
  Settings,
  Copy,
  Archive
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const AdminModules = () => {
  const { user, isAdmin } = useAuth();
  const [modules, setModules] = useState([]);
  const [filteredModules, setFilteredModules] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);

  // Simuler des données de modules
  useEffect(() => {
    const mockModules = [
      {
        id: 1,
        title: 'Introduction au SYCEBNL',
        description: 'Fondements et principes de base du système comptable des EBNL',
        status: 'published',
        duration: '2h',
        chapters: 3,
        students: 245,
        completionRate: 85,
        createdDate: '2024-01-01',
        lastUpdated: '2024-01-15',
        isFree: true,
        difficulty: 'beginner',
        category: 'fundamentals'
      },
      {
        id: 2,
        title: 'Plan comptable EBNL',
        description: 'Structure et utilisation du plan comptable spécialisé pour les EBNL',
        status: 'published',
        duration: '3h',
        chapters: 4,
        students: 189,
        completionRate: 72,
        createdDate: '2024-01-02',
        lastUpdated: '2024-01-16',
        isFree: false,
        difficulty: 'intermediate',
        category: 'accounting'
      },
      {
        id: 3,
        title: 'États financiers EBNL',
        description: 'Préparation et présentation des états financiers selon le SYCEBNL',
        status: 'published',
        duration: '4h',
        chapters: 5,
        students: 156,
        completionRate: 68,
        createdDate: '2024-01-03',
        lastUpdated: '2024-01-17',
        isFree: false,
        difficulty: 'intermediate',
        category: 'reporting'
      },
      {
        id: 4,
        title: 'Audit et contrôle interne',
        description: 'Procédures d\'audit et mise en place du contrôle interne dans les EBNL',
        status: 'draft',
        duration: '3h30',
        chapters: 4,
        students: 0,
        completionRate: 0,
        createdDate: '2024-01-04',
        lastUpdated: '2024-01-18',
        isFree: false,
        difficulty: 'advanced',
        category: 'audit'
      },
      {
        id: 5,
        title: 'Gestion budgétaire',
        description: 'Élaboration et suivi des budgets dans les organisations à but non lucratif',
        status: 'review',
        duration: '2h30',
        chapters: 3,
        students: 0,
        completionRate: 0,
        createdDate: '2024-01-05',
        lastUpdated: '2024-01-19',
        isFree: false,
        difficulty: 'intermediate',
        category: 'management'
      },
      {
        id: 6,
        title: 'Fiscalité des EBNL',
        description: 'Régime fiscal applicable aux entités à but non lucratif',
        status: 'archived',
        duration: '2h',
        chapters: 3,
        students: 78,
        completionRate: 45,
        createdDate: '2024-01-06',
        lastUpdated: '2024-01-10',
        isFree: false,
        difficulty: 'advanced',
        category: 'tax'
      }
    ];

    setTimeout(() => {
      setModules(mockModules);
      setFilteredModules(mockModules);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage des modules
  useEffect(() => {
    let filtered = modules;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(module => module.status === statusFilter);
    }

    setFilteredModules(filtered);
  }, [modules, searchTerm, statusFilter]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status) => {
    const variants = {
      published: 'bg-green-100 text-green-800',
      draft: 'bg-yellow-100 text-yellow-800',
      review: 'bg-blue-100 text-blue-800',
      archived: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      published: 'Publié',
      draft: 'Brouillon',
      review: 'En révision',
      archived: 'Archivé'
    };
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    
    const labels = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire',
      advanced: 'Avancé'
    };
    
    return (
      <Badge className={variants[difficulty] || 'bg-gray-100 text-gray-800'}>
        {labels[difficulty] || difficulty}
      </Badge>
    );
  };

  const handleModuleAction = (moduleId, action) => {
    const module = modules.find(m => m.id === moduleId);
    
    switch (action) {
      case 'publish':
        toast.success(`${module.title} a été publié`);
        break;
      case 'unpublish':
        toast.success(`${module.title} a été dépublié`);
        break;
      case 'archive':
        toast.success(`${module.title} a été archivé`);
        break;
      case 'duplicate':
        toast.success(`${module.title} a été dupliqué`);
        break;
      case 'delete':
        toast.success(`${module.title} a été supprimé`);
        break;
      default:
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Gestion des modules</h1>
                <p className="text-sm text-gray-600">{filteredModules.length} module(s) trouvé(s)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Importer
              </Button>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau module
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Créer un nouveau module</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour créer un nouveau module de formation.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Titre du module</label>
                      <Input placeholder="Ex: Introduction à la comptabilité EBNL" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Description</label>
                      <Textarea placeholder="Description détaillée du module..." rows={3} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Durée estimée</label>
                        <Input placeholder="Ex: 2h30" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Difficulté</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Débutant</SelectItem>
                            <SelectItem value="intermediate">Intermédiaire</SelectItem>
                            <SelectItem value="advanced">Avancé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium">Catégorie</label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fundamentals">Fondamentaux</SelectItem>
                            <SelectItem value="accounting">Comptabilité</SelectItem>
                            <SelectItem value="reporting">Reporting</SelectItem>
                            <SelectItem value="audit">Audit</SelectItem>
                            <SelectItem value="management">Gestion</SelectItem>
                            <SelectItem value="tax">Fiscalité</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="free-module" />
                        <label htmlFor="free-module" className="text-sm font-medium">
                          Module gratuit
                        </label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Annuler</Button>
                      <Button>Créer le module</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Rechercher un module..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published">Publié</SelectItem>
                    <SelectItem value="draft">Brouillon</SelectItem>
                    <SelectItem value="review">En révision</SelectItem>
                    <SelectItem value="archived">Archivé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <Card key={module.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </div>
                  <div className="flex flex-col gap-2">
                    {getStatusBadge(module.status)}
                    {getDifficultyBadge(module.difficulty)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {module.duration}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {module.chapters} chapitres
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {module.students} étudiants
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Award className="w-4 h-4 mr-2" />
                      {module.completionRate}% terminé
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {module.status === 'published' && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Taux de completion</span>
                        <span className="text-sm font-medium">{module.completionRate}%</span>
                      </div>
                      <Progress value={module.completionRate} className="h-2" />
                    </div>
                  )}

                  {/* Free/Premium Badge */}
                  <div className="flex items-center justify-between">
                    <Badge variant={module.isFree ? 'secondary' : 'default'}>
                      {module.isFree ? 'Gratuit' : 'Premium'}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Mis à jour le {module.lastUpdated}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {module.status === 'published' ? (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleModuleAction(module.id, 'unpublish')}
                        >
                          <Pause className="w-4 h-4 mr-1" />
                          Dépublier
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleModuleAction(module.id, 'publish')}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Publier
                        </Button>
                      )}
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Supprimer le module</DialogTitle>
                            <DialogDescription>
                              Êtes-vous sûr de vouloir supprimer "{module.title}" ? 
                              Cette action est irréversible.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Annuler</Button>
                            <Button 
                              variant="destructive"
                              onClick={() => handleModuleAction(module.id, 'delete')}
                            >
                              Supprimer
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredModules.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun module trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Aucun module ne correspond à vos critères de recherche.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Créer un nouveau module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminModules;

