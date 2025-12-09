import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search, Filter, UserPlus, MoveVertical as MoreVertical, User, Shield, CreditCard as Edit3, Trash2, Mail, Phone } from 'lucide-react-native';
import { router } from 'expo-router';

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const users = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@email.com',
      phone: '+593 99 123 4567',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-15',
      trips: 127,
      balance: '$12.50'
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria.gonzalez@email.com',
      phone: '+593 98 765 4321',
      role: 'user',
      status: 'active',
      joinDate: '2024-01-10',
      trips: 89,
      balance: '$8.75'
    },
    {
      id: 3,
      name: 'Carlos Admin',
      email: 'admin@tranvia.cuenca.ec',
      phone: '+593 97 111 2222',
      role: 'admin',
      status: 'active',
      joinDate: '2023-12-01',
      trips: 0,
      balance: '$0.00'
    },
    {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      phone: '+593 96 333 4444',
      role: 'user',
      status: 'inactive',
      joinDate: '2024-01-05',
      trips: 45,
      balance: '$2.25'
    },
  ];

  const filters = [
    { id: 'all', name: 'Todos', count: users.length },
    { id: 'active', name: 'Activos', count: users.filter(u => u.status === 'active').length },
    { id: 'inactive', name: 'Inactivos', count: users.filter(u => u.status === 'inactive').length },
    { id: 'admin', name: 'Admins', count: users.filter(u => u.role === 'admin').length },
  ];

  const handleUserAction = (action: string, userId: number) => {
    const user = users.find(u => u.id === userId);
    switch (action) {
      case 'edit':
        Alert.alert('Editar Usuario', `Editar información de ${user?.name}`);
        break;
      case 'delete':
        Alert.alert(
          'Eliminar Usuario',
          `¿Estás seguro que deseas eliminar a ${user?.name}?`,
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Eliminar', style: 'destructive', onPress: () => {} }
          ]
        );
        break;
      case 'suspend':
        Alert.alert('Suspender Usuario', `Suspender cuenta de ${user?.name}`);
        break;
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || 
                         user.status === selectedFilter || 
                         user.role === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#8B0000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gestión de Usuarios</Text>
        <TouchableOpacity style={styles.addButton}>
          <UserPlus size={24} color="#8B0000" />
        </TouchableOpacity>
      </View>

      {/* Search and Filters */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuarios..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersScroll}
        >
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter.id && styles.filterButtonTextActive
              ]}>
                {filter.name} ({filter.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Users List */}
      <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
        {filteredUsers.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userHeader}>
              <View style={styles.userAvatar}>
                {user.role === 'admin' ? (
                  <Shield size={24} color="#8B0000" />
                ) : (
                  <User size={24} color="#8B0000" />
                )}
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.userContact}>
                  <Mail size={14} color="#666" />
                  <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                {user.phone && (
                  <View style={styles.userContact}>
                    <Phone size={14} color="#666" />
                    <Text style={styles.userPhone}>{user.phone}</Text>
                  </View>
                )}
              </View>
              <View style={styles.userStatus}>
                <View style={[
                  styles.statusBadge,
                  user.status === 'active' ? styles.statusActive : styles.statusInactive
                ]}>
                  <Text style={[
                    styles.statusText,
                    user.status === 'active' ? styles.statusTextActive : styles.statusTextInactive
                  ]}>
                    {user.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.moreButton}
                  onPress={() => Alert.alert(
                    'Acciones',
                    `Selecciona una acción para ${user.name}`,
                    [
                      { text: 'Editar', onPress: () => handleUserAction('edit', user.id) },
                      { text: 'Suspender', onPress: () => handleUserAction('suspend', user.id) },
                      { text: 'Eliminar', style: 'destructive', onPress: () => handleUserAction('delete', user.id) },
                      { text: 'Cancelar', style: 'cancel' }
                    ]
                  )}
                >
                  <MoreVertical size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.userStats}>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.trips}</Text>
                <Text style={styles.statLabel}>Viajes</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.balance}</Text>
                <Text style={styles.statLabel}>Saldo</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.role === 'admin' ? 'Admin' : 'Usuario'}</Text>
                <Text style={styles.statLabel}>Rol</Text>
              </View>
              <View style={styles.stat}>
                <Text style={styles.statValue}>{user.joinDate}</Text>
                <Text style={styles.statLabel}>Registro</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#212529',
    marginLeft: 12,
  },
  filtersScroll: {
    marginBottom: -16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterButtonActive: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  userContact: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
  },
  userPhone: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
  },
  userStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  statusActive: {
    backgroundColor: '#D4F6D4',
  },
  statusInactive: {
    backgroundColor: '#FFE6E6',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  statusTextActive: {
    color: '#228B22',
  },
  statusTextInactive: {
    color: '#DC3545',
  },
  moreButton: {
    padding: 4,
  },
  userStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
});