import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ChartBar as BarChart3, Users, MapPin, Clock, TriangleAlert as AlertTriangle, TrendingUp, LogOut, Settings, Brain as Train, DollarSign, Activity, Bell, Navigation, Shield, Car } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import LocationService from '@/services/LocationService';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [locationSharing, setLocationSharing] = useState(false);
  const [emergencyMode, setEmergencyMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Cerrar Sesión', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/auth');
          }
        }
      ]
    );
  };

  const stats = [
    { icon: Users, title: 'Usuarios Activos', value: '15,423', change: '+12%', color: '#8B0000' },
    { icon: Train, title: 'Tranvías en Servicio', value: '8', change: '100%', color: '#228B22' },
    { icon: DollarSign, title: 'Ingresos Diarios', value: '$5,398', change: '+8%', color: '#FF8C00' },
    { icon: Activity, title: 'Viajes Hoy', value: '2,847', change: '+15%', color: '#9932CC' },
  ];

  const alerts = [
    { id: 1, type: 'warning', message: 'Mantenimiento programado - Línea 1', time: '10:30 AM' },
    { id: 2, type: 'info', message: 'Nueva estación en construcción', time: '09:15 AM' },
    { id: 3, type: 'error', message: 'Reporte de incidencia en El Ejido', time: '08:45 AM' },
  ];

  const quickActions = [
    { 
      icon: Users, 
      title: 'Gestionar Usuarios', 
      subtitle: 'Ver y administrar usuarios',
      action: () => router.push('/admin/users'),
      color: '#8B0000'
    },
    { 
      icon: MapPin, 
      title: 'Rutas y Estaciones', 
      subtitle: 'Configurar rutas del sistema',
      action: () => router.push('/admin/routes'),
      color: '#228B22'
    },
    { 
      icon: Clock, 
      title: 'Horarios', 
      subtitle: 'Gestionar horarios de servicio',
      action: () => router.push('/admin/schedules'),
      color: '#FF8C00'
    },
    { 
      icon: BarChart3, 
      title: 'Análisis', 
      subtitle: 'Reportes y estadísticas',
      action: () => router.push('/admin/analytics'),
      color: '#9932CC'
    },
  ];

  const recentActivity = [
    { action: 'Nuevo usuario registrado', user: 'Juan Pérez', time: '5 min ago' },
    { action: 'Horario actualizado', user: 'Sistema', time: '15 min ago' },
    { action: 'Reporte de incidencia resuelto', user: 'Ana García', time: '1 hora ago' },
    { action: 'Mantenimiento completado', user: 'Equipo Técnico', time: '2 horas ago' },
  ];

  const handleLocationSharingToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await LocationService.requestLocationPermission();
      if (hasPermission) {
        setLocationSharing(true);
        LocationService.startLocationSharing('admin');
        Alert.alert(
          'Ubicación Compartida',
          'Tu ubicación se está compartiendo con el sistema de control central.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setLocationSharing(false);
      LocationService.stopLocationSharing();
    }
  };

  const handleEmergencyMode = (value: boolean) => {
    setEmergencyMode(value);
    if (value) {
      Alert.alert(
        'Modo Emergencia Activado',
        'Se han enviado alertas de emergencia a todos los conductores en un radio de 2km.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={['#8B0000', '#A52A2A']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerInfo}>
              <Text style={styles.greeting}>Panel de Administración</Text>
              <Text style={styles.subtitle}>Bienvenido, {user?.name}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerButton}>
                <Bell size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
                <LogOut size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Admin Location Controls */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Control de Ubicación</Text>
          <View style={styles.locationControls}>
            <View style={styles.controlCard}>
              <View style={styles.controlHeader}>
                <Navigation size={24} color="#8B0000" />
                <Text style={styles.controlTitle}>Compartir Ubicación</Text>
                <Switch
                  value={locationSharing}
                  onValueChange={handleLocationSharingToggle}
                  trackColor={{ false: '#E9ECEF', true: '#8B0000' }}
                  thumbColor={locationSharing ? '#FFFFFF' : '#666'}
                />
              </View>
              <Text style={styles.controlDescription}>
                Permite al sistema central conocer tu ubicación para coordinación
              </Text>
            </View>

            <View style={styles.controlCard}>
              <View style={styles.controlHeader}>
                <Shield size={24} color="#DC3545" />
                <Text style={styles.controlTitle}>Modo Emergencia</Text>
                <Switch
                  value={emergencyMode}
                  onValueChange={handleEmergencyMode}
                  trackColor={{ false: '#E9ECEF', true: '#DC3545' }}
                  thumbColor={emergencyMode ? '#FFFFFF' : '#666'}
                />
              </View>
              <Text style={styles.controlDescription}>
                Envía alertas inmediatas a todos los conductores cercanos
              </Text>
              {emergencyMode && (
                <View style={styles.emergencyActive}>
                  <AlertTriangle size={16} color="#DC3545" />
                  <Text style={styles.emergencyText}>Modo emergencia activo</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Sistema</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={styles.statHeader}>
                  <stat.icon size={24} color={stat.color} />
                  <Text style={[styles.statChange, { color: stat.color }]}>
                    {stat.change}
                  </Text>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statTitle}>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Alerts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas del Sistema</Text>
          <View style={styles.alertsContainer}>
            {alerts.map((alert) => (
              <View key={alert.id} style={[styles.alertCard, styles[`alert${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]]}>
                <AlertTriangle size={20} color={
                  alert.type === 'error' ? '#DC3545' : 
                  alert.type === 'warning' ? '#FFC107' : '#17A2B8'
                } />
                <View style={styles.alertContent}>
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                  <Text style={styles.alertTime}>{alert.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index} 
                style={styles.actionCard}
                onPress={action.action}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <action.icon size={28} color={action.color} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad Reciente</Text>
          <View style={styles.activityContainer}>
            {recentActivity.map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <View style={styles.activityDot} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityAction}>{activity.action}</Text>
                  <Text style={styles.activityUser}>por {activity.user}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statChange: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  alertsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  alertError: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC3545',
  },
  alertWarning: {
    backgroundColor: '#FFFBEB',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  alertInfo: {
    backgroundColor: '#EBF8FF',
    borderLeftWidth: 4,
    borderLeftColor: '#17A2B8',
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 2,
  },
  alertTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  activityContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B0000',
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityAction: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 2,
  },
  activityUser: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B0000',
  },
  locationControls: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  controlCard: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  controlTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    flex: 1,
    marginLeft: 12,
  },
  controlDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 36,
    lineHeight: 20,
  },
  emergencyActive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 36,
    backgroundColor: '#FFE6E6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  emergencyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#DC3545',
    marginLeft: 4,
  },
});