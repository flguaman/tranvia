import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { Brain as Train, TriangleAlert as AlertTriangle, MapPin, X, Navigation } from 'lucide-react-native';
import LocationService from '@/services/LocationService';

interface ProximityAlertProps {
  visible: boolean;
  distance: number;
  tramId: string;
  onClose: () => void;
  onViewMap: () => void;
}

export default function ProximityAlert({ 
  visible, 
  distance, 
  tramId, 
  onClose, 
  onViewMap 
}: ProximityAlertProps) {
  const [pulseAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Vibrate on alert (mobile only)
      if (Platform.OS !== 'web') {
        Vibration.vibrate([0, 500, 200, 500]);
      }

      // Slide in animation
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();

      // Pulse animation for urgency
      const pulse = () => {
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start(() => {
          if (visible) pulse();
        });
      };
      pulse();
    } else {
      // Slide out animation
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const distanceKm = (distance / 1000).toFixed(1);
  const urgencyLevel = distance < 500 ? 'high' : distance < 800 ? 'medium' : 'low';

  const getUrgencyColor = () => {
    switch (urgencyLevel) {
      case 'high': return '#DC3545';
      case 'medium': return '#FFC107';
      default: return '#FF8C00';
    }
  };

  const getUrgencyMessage = () => {
    switch (urgencyLevel) {
      case 'high': return '¡ATENCIÓN INMEDIATA!';
      case 'medium': return 'Precaución Requerida';
      default: return 'Tranvía Detectado';
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View 
          style={[
            styles.alertContainer,
            { 
              backgroundColor: getUrgencyColor(),
              transform: [
                { translateY: slideAnim },
                { scale: pulseAnim }
              ]
            }
          ]}
        >
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={20} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              <View style={styles.tramIcon}>
                <Train size={32} color="#FFFFFF" />
              </View>
              <View style={styles.alertInfo}>
                <Text style={styles.urgencyText}>{getUrgencyMessage()}</Text>
                <Text style={styles.tramText}>Tranvía {tramId}</Text>
              </View>
            </View>

            <View style={styles.distanceContainer}>
              <MapPin size={20} color="#FFFFFF" />
              <Text style={styles.distanceText}>
                A {distanceKm} km de tu ubicación
              </Text>
            </View>

            <Text style={styles.warningText}>
              {urgencyLevel === 'high' 
                ? 'El tranvía está muy cerca. Detente y verifica antes de continuar.'
                : urgencyLevel === 'medium'
                ? 'Reduce la velocidad y mantente alerta.'
                : 'Mantén precaución al conducir en esta zona.'
              }
            </Text>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.mapButton} 
                onPress={onViewMap}
              >
                <Navigation size={16} color={getUrgencyColor()} />
                <Text style={[styles.mapButtonText, { color: getUrgencyColor() }]}>
                  Ver en Mapa
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.acknowledgeButton} 
                onPress={onClose}
              >
                <Text style={styles.acknowledgeText}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Safety Tips */}
        <View style={styles.safetyTips}>
          <Text style={styles.safetyTitle}>Consejos de Seguridad:</Text>
          <Text style={styles.safetyTip}>• Mantén distancia segura del tranvía</Text>
          <Text style={styles.safetyTip}>• No adelantes en zonas de tranvía</Text>
          <Text style={styles.safetyTip}>• Respeta las señales de tránsito</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-start',
    paddingTop: 100,
  },
  alertContainer: {
    marginHorizontal: 20,
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
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 8,
    zIndex: 1,
  },
  alertContent: {
    alignItems: 'center',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tramIcon: {
    marginRight: 16,
  },
  alertInfo: {
    flex: 1,
  },
  urgencyText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  tramText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  distanceText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  warningText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.45,
    justifyContent: 'center',
  },
  mapButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 6,
  },
  acknowledgeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 0.45,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  acknowledgeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  safetyTips: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 8,
  },
  safetyTip: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 4,
  },
});