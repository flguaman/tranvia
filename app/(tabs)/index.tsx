import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain as Train, MapPin, Clock, CreditCard, Bell, TrendingUp, Users, Zap, QrCode, Ticket, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import NotificationCenter from '@/components/NotificationCenter';
import QRCodeScanner from '@/components/QRCodeScanner';
import ProximityAlert from '@/components/ProximityAlert';
import LocationService from '@/services/LocationService';

export default function HomeScreen() {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showProximityAlert, setShowProximityAlert] = useState(false);
  const [proximityData, setProximityData] = useState({ distance: 0, tramId: '' });

  const quickActions = [
    {
      icon: MapPin,
      title: 'Ver Mapa',
      color: '#8B0000',
      action: () => console.log('Navigate to map')
    },
    {
      icon: Clock,
      title: 'Horarios',
      color: '#228B22',
      action: () => console.log('Navigate to schedules')
    },
    {
      icon: CreditCard,
      title: 'Recargar',
      color: '#FF8C00',
      action: () => console.log('Navigate to wallet')
    },
    {
      icon: QrCode,
      title: 'Escanear QR',
      color: '#9932CC',
      action: () => setShowQRScanner(true)
    },
  ];

  const news = [
    {
      id: 1,
      title: 'Nueva ruta hacia El Ejido',
      description: 'Ampliaremos el servicio con una nueva estación',
      color: '#8B0000',
      time: 'Hace 2 horas',
      priority: 'high'
    },
    {
      id: 2,
      title: 'Horarios extendidos los fines de semana',
      description: 'Servicio hasta las 11:00 PM sábados y domingos',
      color: '#228B22',
      time: 'Hace 1 día',
      priority: 'medium'
    },
    {
      id: 3,
      title: 'Mantenimiento programado',
      description: 'Interrupción temporal del servicio el domingo',
      color: '#FF8C00',
      time: 'Hace 3 días',
      priority: 'high'
    },
  ];

  const stats = [
    { icon: Users, value: '50K+', label: 'Usuarios Diarios', color: '#8B0000' },
    { icon: TrendingUp, value: '98%', label: 'Puntualidad', color: '#228B22' },
    { icon: Zap, value: '15 min', label: 'Frecuencia', color: '#FF8C00' },
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Mantenimiento en Estación El Ejido - 10:00 AM a 12:00 PM',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: 'Nuevo horario extendido disponible los fines de semana',
      priority: 'medium'
    }
  ];

  const handleQRScan = (data: string) => {
    setShowQRScanner(false);
    console.log('QR Scanned:', data);
  };

  useEffect(() => {
    // Set up proximity alert callback
    const handleProximityAlert = (distance: number, tramId: string) => {
      setProximityData({ distance, tramId });
      setShowProximityAlert(true);
    };

    LocationService.onProximityAlert(handleProximityAlert);

    return () => {
      LocationService.removeProximityCallback(handleProximityAlert);
    };
  }, []);

  const handleViewMap = () => {
    setShowProximityAlert(false);
    // Navigate to map with tram selected
    console.log('Navigate to map with tram:', proximityData.tramId);
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
            <View>
              <Text style={styles.greeting}>¡Hola, {user?.name}! 👋</Text>
              <Text style={styles.subtitle}>Bienvenido al Tranvía de Cuenca</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity
                style={styles.notificationButton}
                onPress={() => setShowNotifications(true)}
              >
                <Bell size={24} color="#FFFFFF" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.logoContainer}>
                <Train size={32} color="#FFD700" />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* System Alerts */}
        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            {alerts.map((alert) => (
              <View key={alert.id} style={[
                styles.alertCard,
                alert.type === 'warning' ? styles.warningAlert : styles.infoAlert
              ]}>
                <AlertTriangle
                  size={20}
                  color={alert.type === 'warning' ? '#FFC107' : '#17A2B8'}
                />
                <Text style={styles.alertText}>{alert.message}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Acciones Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionCard}
                onPress={action.action}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: `${action.color}20` }]}>
                  <action.icon size={24} color={action.color} />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estadísticas del Servicio</Text>
          <View style={styles.statsContainer}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <stat.icon size={24} color={stat.color} />
                <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* News */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Noticias y Actualizaciones</Text>
          {news.map((item) => (
            <TouchableOpacity key={item.id} style={styles.newsCard}>
              <View style={[styles.newsImage, { backgroundColor: item.color }]} />
              <View style={styles.newsContent}>
                <View style={styles.newsHeader}>
                  <Text style={styles.newsTitle}>{item.title}</Text>
                  {item.priority === 'high' && (
                    <View style={styles.priorityBadge}>
                      <Text style={styles.priorityText}>Importante</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.newsDescription}>{item.description}</Text>
                <Text style={styles.newsTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Digital Wallet Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mi Billetera</Text>
          <LinearGradient
            colors={['#8B0000', '#A52A2A']}
            style={styles.walletPreview}
          >
            <View style={styles.walletHeader}>
              <CreditCard size={24} color="#FFD700" />
              <Text style={styles.walletTitle}>Saldo Disponible</Text>
            </View>
            <Text style={styles.walletBalance}>$12.50</Text>
            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.walletButton}>
                <Text style={styles.walletButtonText}>Recargar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.walletButton}>
                <Ticket size={16} color="#8B0000" />
                <Text style={styles.walletButtonText}>Tickets</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      </ScrollView>

      <NotificationCenter
        visible={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      <QRCodeScanner
        visible={showQRScanner}
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
        title="Escanear para Pagar"
      />

      <ProximityAlert
        visible={showProximityAlert}
        distance={proximityData.distance}
        tramId={proximityData.tramId}
        onClose={() => setShowProximityAlert(false)}
        onViewMap={handleViewMap}
      />
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
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
    marginRight: 12,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#DC3545',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  logoContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertsSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  warningAlert: {
    backgroundColor: '#FFF3CD',
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  infoAlert: {
    backgroundColor: '#D1ECF1',
    borderLeftWidth: 4,
    borderLeftColor: '#17A2B8',
  },
  alertText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212529',
    marginLeft: 12,
    flex: 1,
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
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
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
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    textAlign: 'center',
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
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  newsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  newsImage: {
    width: '100%',
    height: 160,
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  newsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    flex: 1,
  },
  priorityBadge: {
    backgroundColor: '#DC3545',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  newsDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
  newsTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B0000',
  },
  walletPreview: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  walletHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  walletTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  walletBalance: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  walletActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.48,
    justifyContent: 'center',
  },
  walletButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
    marginLeft: 4,
  },
});