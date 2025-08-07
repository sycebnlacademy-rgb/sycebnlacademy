import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Settings,
  UserPlus,
  FileText,
  BarChart3,
  Shield,
  Bell,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    premiumUsers: 0,
    pendingApprovals: 0,
    totalModules: 6,
    completedCourses: 0,
    revenue: 0
  });

  const [users, setUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  // Charger les données réelles
  useEffect(() => {
    loadUsersData();
  }, []);

  const loadUsersData = () => {
    try {
      const usersData = localStorage.getItem('sycebnl_users');
      const approvals = localStorage.getItem('sycebnl_pending_approvals');
      
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        setUsers(allUsers);
        
        // Calculer les statistiques
        const totalUsers = allUsers.length;
        const premiumUsers = allUsers.filter(u => u.isPremium).length;
        const activeUsers = allUsers.filter(u => {
          const lastLogin = new Date(u.lastLogin);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return lastLogin > thirtyDaysAgo;
        }).length;

        setStats(prev => ({
          ...prev,
          totalUsers,
          activeUsers,
          premiumUsers,
          revenue: premiumUsers * 20000 // 20,000 FCFA par utilisateur premium
        }));
      }

      if (approvals) {
        const pendingData = JSON.parse(approvals);
        setPendingApprovals(pendingData);
        setStats(prev => ({
          ...prev,
          pendingApprovals: pendingData.length
        }));
      }
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleApproveUser = (userId) => {
    try {
      // Mettre à jour l'utilisateur pour le rendre premium
      const usersData = localStorage.getItem('sycebnl_users');
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        const updatedUsers = allUsers.map(u => 
          u.id === userId ? { ...u, isPremium: true } : u
        );
        localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));
      }

      // Supprimer de la liste des approbations en attente
      const updatedPending = pendingApprovals.filter(p => p.userId !== userId);
      setPendingApprovals(updatedPending);
      localStorage.setItem('sycebnl_pending_approvals', JSON.stringify(updatedPending));

      // Recharger les données
      loadUsersData();
      
      toast.success('Utilisateur approuvé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  const handleRejectUser = (userId) => {
    try {
      // Supprimer de la liste des approbations en attente
      const updatedPending = pendingApprovals.filter(p => p.userId !== userId);
      setPendingApprovals(updatedPending);
      localStorage.setItem('sycebnl_pending_approvals', JSON.stringify(updatedPending));

      toast.success('Demande rejetée');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      toast.error('Erreur lors du rejet');
    }
  };

  const toggleUserPremium = (userId) => {
    try {
      const usersData = localStorage.getItem('sycebnl_users');
      if (usersData) {
        const allUsers = JSON.parse(usersData);
        const updatedUsers = allUsers.map(u => 
          u.id === userId ? { ...u, isPremium: !u.isPremium } : u
        );
        localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));
        loadUsersData();
        toast.success('Statut utilisateur mis à jour');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteUser = (userId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        const usersData = localStorage.getItem('sycebnl_users');
        if (usersData) {
          const allUsers = JSON.parse(usersData);
          const updatedUsers = allUsers.filter(u => u.id !== userId);
          localStorage.setItem('sycebnl_users', JSON.stringify(updatedUsers));
          loadUsersData();
          toast.success('Utilisateur supprimé');
        }
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  const getStatusBadge = (user) => {
    if (user.isPremium) {
      return <Badge className="bg-green-100 text-green-800">Premium</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">Gratuit</Badge>;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Administration SYCEBNL</h1>
                <p className="text-sm text-gray-600">Bienvenue, {user.firstName} {user.lastName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Link to="/">
                <Button variant="outline" size="sm">
                  Retour au site
                </Button>
              </Link>
              <Button variant="outline" size="sm" onClick={logout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeUsers} actifs ce mois
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Utilisateurs Premium</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? Math.round((stats.premiumUsers / stats.totalUsers) * 100) : 0}% du total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approbations en attente</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                Demandes à traiter
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus estimés</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.revenue.toLocaleString()} FCFA</div>
              <p className="text-xs text-muted-foreground">
                Basé sur les utilisateurs premium
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="approvals">Approbations</TabsTrigger>
            <TabsTrigger value="modules">Modules</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Users */}
              <Card>
                <CardHeader>
                  <CardTitle>Utilisateurs récents</CardTitle>
                  <CardDescription>
                    Les derniers utilisateurs inscrits
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {users.slice(-5).reverse().map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusBadge(user)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle>Approbations en attente</CardTitle>
                  <CardDescription>
                    Demandes d'accès premium à traiter
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingApprovals.length === 0 ? (
                    <p className="text-sm text-gray-600">Aucune demande en attente</p>
                  ) : (
                    <div className="space-y-4">
                      {pendingApprovals.slice(0, 3).map((approval) => {
                        const user = users.find(u => u.id === approval.userId);
                        return (
                          <div key={approval.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-yellow-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {formatDate(approval.requestDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleApproveUser(approval.userId)}
                              >
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleRejectUser(approval.userId)}
                              >
                                <XCircle className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h2>
                <p className="text-gray-600">Gérer les comptes utilisateurs et leurs permissions</p>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Utilisateur
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date d'inscription
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-blue-600" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                  {user.isAdmin && <Badge className="ml-2 bg-red-100 text-red-800">Admin</Badge>}
                                </div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(user)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(user.registrationDate)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => toggleUserPremium(user.id)}
                                disabled={user.isAdmin}
                              >
                                {user.isPremium ? 'Révoquer Premium' : 'Activer Premium'}
                              </Button>
                              {!user.isAdmin && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => deleteUser(user.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Approvals Tab */}
          <TabsContent value="approvals" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Approbations en attente</h2>
              <p className="text-gray-600">Gérer les demandes d'accès premium</p>
            </div>

            <Card>
              <CardContent className="p-6">
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucune demande en attente
                    </h3>
                    <p className="text-gray-600">
                      Toutes les demandes d'approbation ont été traitées.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((approval) => {
                      const user = users.find(u => u.id === approval.userId);
                      return (
                        <div key={approval.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                <Clock className="w-6 h-6 text-yellow-600" />
                              </div>
                              <div>
                                <h3 className="text-lg font-medium text-gray-900">
                                  {user ? `${user.firstName} ${user.lastName}` : 'Utilisateur inconnu'}
                                </h3>
                                <p className="text-sm text-gray-600">{user?.email}</p>
                                <p className="text-xs text-gray-500">
                                  Demande du {formatDate(approval.requestDate)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Button 
                                onClick={() => handleApproveUser(approval.userId)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approuver
                              </Button>
                              <Button 
                                variant="outline"
                                onClick={() => handleRejectUser(approval.userId)}
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Modules Tab */}
          <TabsContent value="modules" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Gestion des modules</h2>
              <p className="text-gray-600">Gérer le contenu des modules de formation</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((moduleNum) => (
                <Card key={moduleNum}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      Module {moduleNum}
                      {moduleNum === 1 && <Badge className="bg-green-100 text-green-800">Gratuit</Badge>}
                      {moduleNum > 1 && <Badge className="bg-blue-100 text-blue-800">Premium</Badge>}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {moduleNum === 1 && "Introduction au SYCEBNL"}
                      {moduleNum === 2 && "Le Plan Comptable SYCEBNL"}
                      {moduleNum === 3 && "Opérations Spécifiques des EBNL"}
                      {moduleNum === 4 && "États Financiers SYCEBNL"}
                      {moduleNum === 5 && "Mise en œuvre et Contrôle"}
                      {moduleNum === 6 && "Cas Pratiques et Exercices"}
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Voir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;

