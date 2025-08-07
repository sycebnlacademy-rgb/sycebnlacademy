import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Download,
  UserCheck,
  UserX,
  Shield
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const { user, isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler des données utilisateurs
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        name: 'Marie Dubois',
        email: 'marie.dubois@example.com',
        phone: '+33 6 12 34 56 78',
        status: 'active',
        role: 'student',
        joinDate: '2024-01-15',
        lastLogin: '2024-01-20',
        completedModules: 3,
        totalModules: 5,
        isPremium: true
      },
      {
        id: 2,
        name: 'Jean Martin',
        email: 'jean.martin@example.com',
        phone: '+33 6 23 45 67 89',
        status: 'pending',
        role: 'student',
        joinDate: '2024-01-14',
        lastLogin: null,
        completedModules: 0,
        totalModules: 5,
        isPremium: false
      },
      {
        id: 3,
        name: 'Sophie Laurent',
        email: 'sophie.laurent@example.com',
        phone: '+33 6 34 56 78 90',
        status: 'active',
        role: 'instructor',
        joinDate: '2024-01-13',
        lastLogin: '2024-01-19',
        completedModules: 5,
        totalModules: 5,
        isPremium: true
      },
      {
        id: 4,
        name: 'Pierre Moreau',
        email: 'pierre.moreau@example.com',
        phone: '+33 6 45 67 89 01',
        status: 'inactive',
        role: 'student',
        joinDate: '2024-01-12',
        lastLogin: '2024-01-15',
        completedModules: 1,
        totalModules: 5,
        isPremium: false
      },
      {
        id: 5,
        name: 'Claire Bernard',
        email: 'claire.bernard@example.com',
        phone: '+33 6 56 78 90 12',
        status: 'active',
        role: 'admin',
        joinDate: '2024-01-11',
        lastLogin: '2024-01-20',
        completedModules: 5,
        totalModules: 5,
        isPremium: true
      },
      {
        id: 6,
        name: 'Thomas Petit',
        email: 'thomas.petit@example.com',
        phone: '+33 6 67 89 01 23',
        status: 'active',
        role: 'student',
        joinDate: '2024-01-10',
        lastLogin: '2024-01-18',
        completedModules: 2,
        totalModules: 5,
        isPremium: false
      },
      {
        id: 7,
        name: 'Isabelle Roux',
        email: 'isabelle.roux@example.com',
        phone: '+33 6 78 90 12 34',
        status: 'suspended',
        role: 'student',
        joinDate: '2024-01-09',
        lastLogin: '2024-01-16',
        completedModules: 1,
        totalModules: 5,
        isPremium: false
      },
      {
        id: 8,
        name: 'Antoine Blanc',
        email: 'antoine.blanc@example.com',
        phone: '+33 6 89 01 23 45',
        status: 'active',
        role: 'student',
        joinDate: '2024-01-08',
        lastLogin: '2024-01-19',
        completedModules: 4,
        totalModules: 5,
        isPremium: true
      }
    ];

    setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
      suspended: 'bg-purple-100 text-purple-800'
    };
    
    const labels = {
      active: 'Actif',
      pending: 'En attente',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    
    return (
      <Badge className={variants[status] || 'bg-gray-100 text-gray-800'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getRoleBadge = (role) => {
    const variants = {
      admin: 'bg-red-100 text-red-800',
      instructor: 'bg-blue-100 text-blue-800',
      student: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      admin: 'Administrateur',
      instructor: 'Instructeur',
      student: 'Étudiant'
    };
    
    return (
      <Badge className={variants[role] || 'bg-gray-100 text-gray-800'}>
        {labels[role] || role}
      </Badge>
    );
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  const handleBulkAction = (action) => {
    if (selectedUsers.length === 0) {
      toast.error('Aucun utilisateur sélectionné');
      return;
    }

    switch (action) {
      case 'activate':
        toast.success(`${selectedUsers.length} utilisateur(s) activé(s)`);
        break;
      case 'deactivate':
        toast.success(`${selectedUsers.length} utilisateur(s) désactivé(s)`);
        break;
      case 'delete':
        toast.success(`${selectedUsers.length} utilisateur(s) supprimé(s)`);
        break;
      default:
        break;
    }
    
    setSelectedUsers([]);
  };

  const handleUserAction = (userId, action) => {
    const user = users.find(u => u.id === userId);
    
    switch (action) {
      case 'activate':
        toast.success(`${user.name} a été activé`);
        break;
      case 'deactivate':
        toast.success(`${user.name} a été désactivé`);
        break;
      case 'suspend':
        toast.success(`${user.name} a été suspendu`);
        break;
      case 'delete':
        toast.success(`${user.name} a été supprimé`);
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
                <h1 className="text-xl font-semibold text-gray-900">Gestion des utilisateurs</h1>
                <p className="text-sm text-gray-600">{filteredUsers.length} utilisateur(s) trouvé(s)</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvel utilisateur
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Créer un nouvel utilisateur</DialogTitle>
                    <DialogDescription>
                      Remplissez les informations pour créer un nouveau compte utilisateur.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Nom complet</label>
                      <Input placeholder="Nom et prénom" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Téléphone</label>
                      <Input placeholder="+33 6 12 34 56 78" />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Rôle</label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Étudiant</SelectItem>
                          <SelectItem value="instructor">Instructeur</SelectItem>
                          <SelectItem value="admin">Administrateur</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Annuler</Button>
                      <Button>Créer l'utilisateur</Button>
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
                    placeholder="Rechercher par nom ou email..."
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
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="suspended">Suspendu</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  Plus de filtres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} utilisateur(s) sélectionné(s)
                </span>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('activate')}
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Activer
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('deactivate')}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Désactiver
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleBulkAction('delete')}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Supprimer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Users Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Checkbox
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilisateur
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rôle
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progression
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dernière connexion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Checkbox
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={() => handleSelectUser(user.id)}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 flex items-center">
                              {user.name}
                              {user.isPremium && (
                                <Shield className="w-4 h-4 text-yellow-500 ml-2" />
                              )}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Mail className="w-3 h-3 mr-1" />
                              {user.email}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center">
                              <Phone className="w-3 h-3 mr-1" />
                              {user.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(user.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {user.completedModules}/{user.totalModules} modules
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(user.completedModules / user.totalModules) * 100}%` }}
                          ></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                          {user.lastLogin || 'Jamais'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleUserAction(user.id, 'delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Affichage de 1 à {filteredUsers.length} sur {filteredUsers.length} résultats
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              Précédent
            </Button>
            <Button variant="outline" size="sm" disabled>
              Suivant
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

