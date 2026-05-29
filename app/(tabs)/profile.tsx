import React, { useState, useEffect } from 'react';
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
import { User, Settings, CreditCard, History, Bell, CircleHelp as HelpCircle, LogOut, CreditCard as Edit3, MapPin, Clock, Star, Ticket, Car, Navigation, Shield } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import LocationService from '@/services/LocationService';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { theme, language, toggleTheme, setTheme, setLanguage, colors, t } = useTheme();
  const [showRecentTrips, setShowRecentTrips] = useState(true);
  const [driverMode, setDriverMode] = useState(false);
  const [locationSharing, setLocationSharing] = useState(false);
  const [proximityAlerts, setProximityAlerts] = useState(true);

  // Sincronizar tema con las preferencias del usuario
  useEffect(() => {
    if (user?.theme && user.theme !== theme) {
      setTheme(user.theme);
    }
    if (user?.language && user.language !== language) {
      setLanguage(user.language);
    }
  }, [user, theme, language, setTheme, setLanguage]);

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

  const recentTrips = [
    {
      id: 1,
      from: 'El Arenal',
      to: 'Pumapungo',
      date: '2024-01-15',
      time: '08:30',
      cost: '$0.35',
      route: 'Línea 1'
    },
    {
      id: 2,
      from: 'El Ejido',
      to: 'Feria Libre',
      date: '2024-01-14',
      time: '17:45',
      cost: '$0.35',
      route: 'Línea 1'
    },
    {
      id: 3,
      from: 'Pumapungo',
      to: 'El Arenal',
      date: '2024-01-14',
      time: '07:15',
      cost: '$0.35',
      route: 'Expreso'
    },
  ];

  const stats = [
    { icon: MapPin, label: 'Viajes Totales', value: '127', color: '#8B0000' },
    { icon: Clock, label: 'Tiempo Ahorrado', value: '42h', color: '#228B22' },
    { icon: Star, label: 'Puntos', value: '890', color: '#FFD700' },
  ];

  const menuItems = [
    { icon: CreditCard, title: 'Recargar Tarjeta', subtitle: 'Saldo: $12.50', action: () => { } },
    { icon: History, title: 'Historial de Viajes', subtitle: 'Ver todos los viajes', action: () => { } },
    { icon: Bell, title: 'Notificaciones', subtitle: 'Configurar alertas', action: () => { } },
    { icon: Settings, title: 'Configuración', subtitle: 'Preferencias de la app', action: () => { } },
    { icon: HelpCircle, title: 'Ayuda y Soporte', subtitle: 'Centro de ayuda', action: () => { } },
  ];

  const handleDriverModeToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await LocationService.requestLocationPermission();
      if (hasPermission) {
        setDriverMode(true);
        setLocationSharing(true);
        LocationService.startLocationSharing();
        Alert.alert(
          'Modo Conductor Activado',
          'Recibirás alertas cuando el tranvía esté cerca de tu ubicación (1km). Mantén la app abierta para mejor precisión.',
          [{ text: 'Entendido' }]
        );
      } else {
        Alert.alert(
          'Permisos Requeridos',
          'Para usar el modo conductor necesitamos acceso a tu ubicación para alertarte sobre la proximidad del tranvía.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setDriverMode(false);
      setLocationSharing(false);
      LocationService.stopLocationSharing();
    }
  };

  const handleLocationSharingToggle = async (value: boolean) => {
    if (value) {
      const hasPermission = await LocationService.requestLocationPermission();
      if (hasPermission) {
        setLocationSharing(true);
        LocationService.startLocationSharing();
      } else {
        Alert.alert(
          'Permisos de Ubicación',
          'Necesitamos acceso a tu ubicación para compartirla con el sistema.',
          [{ text: 'OK' }]
        );
      }
    } else {
      setLocationSharing(false);
      LocationService.stopLocationSharing();
      if (driverMode) {
        setDriverMode(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <User size={40} color="#8B0000" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.userName}>{user?.name}</Text>
              <Text style={styles.userEmail}>{user?.email}</Text>
              <Text style={styles.userRole}>
                {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editButton}>
              <Edit3 size={20} color="#8B0000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Theme & Language */}
        <View style={[styles.section, { marginTop: 10 }]}>
            <View style={[styles.settingsContainer, { backgroundColor: colors.card }]}>
              {/* Tema */}
              <View style={[styles.settingCard, { borderBottomColor: colors.border }]}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIcon}>
                    {theme === 'light' ? '🌙' : '☀️'}
                  </View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t('profile.darkMode')}</Text>
                  <Switch
                    value={theme === 'dark'}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor={theme === 'dark' ? '#FFFFFF' : '#666'}
                  />
                </View>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  {theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                </Text>
              </View>
              {/* Idioma */}
              <View style={[styles.settingCard, { borderBottomColor: colors.border }]}>
                <View style={styles.settingHeader}>
                  <View style={styles.settingIcon}>🌐</View>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>{t('profile.language')}</Text>
                </View>
                <Text style={[styles.settingDescription, { color: colors.textSecondary }]}>
                  Selecciona tu idioma preferido
                </Text>
                <View style={styles.languageButtons}>
                  <TouchableOpacity
                    style={[
                      styles.languageButton,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      language === 'es' && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setLanguage('es')}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      { color: colors.text },
                      language === 'es' && { color: '#FFFFFF' }
                    ]}>
                      🇪🇸 Español
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.languageButton,
                      { backgroundColor: colors.background, borderColor: colors.border },
                      language === 'en' && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setLanguage('en')}
                  >
                    <Text style={[
                      styles.languageButtonText,
                      { color: colors.text },
                      language === 'en' && { color: '#FFFFFF' }
                    ]}>
                      🇺🇸 English
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.statistics')}</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: colors.card }]}>
                <stat.icon size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.recentTrips')}</Text>
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowRecentTrips(!showRecentTrips)}
            >
              <Text style={styles.toggleText}>
                {showRecentTrips ? 'Ocultar' : 'Mostrar'}
              </Text>
            </TouchableOpacity>
          </View>

          {showRecentTrips && (
            <View style={[styles.tripsContainer, { backgroundColor: colors.card }]}>
              {recentTrips.map((trip) => (
                <View key={trip.id} style={[styles.tripCard, { borderBottomColor: colors.border }]}>
                  <View style={styles.tripRoute}>
                    <Ticket size={20} color="#8B0000" />
                    <View style={styles.tripDetails}>
                      <Text style={[styles.tripDirection, { color: colors.text }]}>
                        {trip.from} → {trip.to}
                      </Text>
                      <Text style={[styles.tripInfo, { color: colors.textSecondary }]}>
                        {trip.route} • {trip.date} • {trip.time}
                      </Text>
                    </View>
                    <Text style={styles.tripCost}>{trip.cost}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Safety Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.safetyTitle')}</Text>
          <View style={styles.safetyContainer}>
            <View style={styles.safetyCard}>
              <View style={styles.safetyHeader}>
                <Car size={24} color="#8B0000" />
                <Text style={[styles.safetyTitle, { color: colors.text }]}>{t('profile.driverMode')}</Text>
                <Switch
                  value={driverMode}
                  onValueChange={handleDriverModeToggle}
                  trackColor={{ false: '#E9ECEF', true: '#8B0000' }}
                  thumbColor={driverMode ? '#FFFFFF' : '#666'}
                />
              </View>
              <Text style={[styles.safetyDescription, { color: colors.textSecondary }]}>
                Recibe alertas cuando el tranvía esté cerca (1km) para evitar accidentes
              </Text>
              {driverMode && (
                <View style={{ marginTop: 10 }}>
                  <View style={styles.driverModeActive}>
                    <Shield size={16} color="#28A745" />
                    <Text style={styles.driverModeText}>Modo conductor activo - Alertas habilitadas</Text>
                  </View>
                  {/* Recomendaciones de Conducción Segura */}
                  <View style={{ marginTop: 12 }}>
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>Recomendaciones de Conducción Segura</Text>
                    <Text style={{ color: colors.textSecondary, marginTop: 4 }}>• Mantener siempre distancia lateral de al menos 3 metros del tranvía</Text>
                    <Text style={{ color: colors.textSecondary }}>• Nunca detenerse sobre las vías</Text>
                    <Text style={{ color: colors.textSecondary }}>• Extremar precaución en condiciones climáticas adversas</Text>
                    <Text style={{ color: colors.textSecondary }}>• Prestar atención a peatones que puedan cruzar hacia el tranvía</Text>
                    <Text style={{ color: colors.textSecondary }}>• Respetar las señales de tránsito específicas para tranvías</Text>
                  </View>
                  {/* Indicadores de Estado del Tranvía */}
                  <View style={{ marginTop: 16 }}>
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>Indicadores de Estado del Tranvía</Text>
                    <Text style={{ color: colors.textSecondary, marginTop: 4 }}>• Velocidad actual del tranvía: <Text style={{ color: '#8B0000' }}>28 km/h</Text></Text>
                    <Text style={{ color: colors.textSecondary }}>• Tiempo estimado de llegada a puntos críticos: <Text style={{ color: '#8B0000' }}>2 min</Text></Text>
                    <Text style={{ color: colors.textSecondary }}>• Estado de las puertas: <Text style={{ color: '#8B0000' }}>Cerradas</Text></Text>
                    <Text style={{ color: colors.textSecondary }}>• Dirección de movimiento: <Text style={{ color: '#8B0000' }}>Norte</Text></Text>
                    <Text style={{ color: colors.textSecondary }}>• Distancia exacta desde tu posición actual: <Text style={{ color: '#8B0000' }}>350 m</Text></Text>
                  </View>
                  {/* Alertas de Proximidad en Tiempo Real */}
                  <View style={{ marginTop: 16 }}>
                    <Text style={{ fontWeight: 'bold', color: colors.text }}>Alertas de Proximidad en Tiempo Real</Text>
                    <Text style={{ color: colors.textSecondary, marginTop: 4 }}>• Alerta temprana (1km): Notificación visual suave</Text>
                    <Text style={{ color: colors.textSecondary }}>• Alerta media (500m): Notificación sonora y visual</Text>
                    <Text style={{ color: colors.textSecondary }}>• Alerta crítica (250m): Alerta sonora intensa y vibración</Text>
                    <Text style={{ color: colors.textSecondary }}>• Alerta de emergencia (100m): Alerta máxima con instrucciones evasivas</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.safetyCard}>
              <View style={styles.safetyHeader}>
                <Navigation size={24} color="#8B0000" />
                <Text style={[styles.safetyTitle, { color: colors.text }]}>{t('profile.locationSharing')}</Text>
                <Switch
                  value={locationSharing}
                  onValueChange={handleLocationSharingToggle}
                  trackColor={{ false: '#E9ECEF', true: '#8B0000' }}
                  thumbColor={locationSharing ? '#FFFFFF' : '#666'}
                />
              </View>
              <Text style={[styles.safetyDescription, { color: colors.textSecondary }]}>
                Permite al sistema conocer tu ubicación para mejorar el servicio
              </Text>
            </View>

            <View style={styles.safetyCard}>
              <View style={styles.safetyHeader}>
                <Bell size={24} color="#8B0000" />
                <Text style={[styles.safetyTitle, { color: colors.text }]}>{t('profile.proximityAlerts')}</Text>
                <Switch
                  value={proximityAlerts}
                  onValueChange={setProximityAlerts}
                  trackColor={{ false: '#E9ECEF', true: '#8B0000' }}
                  thumbColor={proximityAlerts ? '#FFFFFF' : '#666'}
                />
              </View>
              <Text style={[styles.safetyDescription, { color: colors.textSecondary }]}>
                Notificaciones cuando el tranvía se acerque a tu ubicación
              </Text>
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile.options')}</Text>
          <View style={[styles.menuContainer, { backgroundColor: colors.card }]}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.menuItem, { borderBottomColor: colors.border }]}
                onPress={item.action}
              >
                <View style={styles.menuItemContent}>
                  <View style={[styles.menuIcon, { backgroundColor: `${colors.primary}10` }]}>
                    <item.icon size={24} color="#8B0000" />
                  </View>
                  <View style={styles.menuInfo}>
                    <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                    <Text style={[styles.menuSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#FFFFFF" />
            <Text style={styles.logoutText}>{t('profile.logout')}</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Tranvía Cuenca v1.0.0</Text>
          <Text style={styles.footerSubtext}>Sistema de Transporte Público</Text>
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
    backgroundColor: '#8B0000',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  editButton: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#8B0000',
    borderRadius: 15,
  },
  toggleText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  tripsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  tripCard: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetails: {
    flex: 1,
    marginLeft: 12,
  },
  tripDirection: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 4,
  },
  tripInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  tripCost: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#228B22',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
  },
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuInfo: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC3545',
    borderRadius: 12,
    padding: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  safetyContainer: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
  },
  safetyCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
    marginBottom: 8,
    borderRadius: 12,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    flex: 1,
    marginLeft: 12,
  },
  safetyDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 36,
    lineHeight: 20,
  },
  driverModeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginLeft: 36,
    backgroundColor: '#D4F6D4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  driverModeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#28A745',
    marginLeft: 4,
  },
  settingsContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingCard: {
    padding: 16,
    borderBottomWidth: 1,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
    width: 32,
    textAlign: 'center',
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginLeft: 44,
    lineHeight: 20,
  },
  languageButtons: {
    flexDirection: 'row',
    marginTop: 12,
    marginLeft: 44,
  },
  languageButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  languageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
});