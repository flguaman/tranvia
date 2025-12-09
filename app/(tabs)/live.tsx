import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  MapPin,
  Navigation,
  Clock,
  Brain as Train,
  Users,
  Zap,
  RefreshCw,
  CircleAlert as AlertCircle,
  CircleCheck as CheckCircle,
  Radio,
  Eye,
  Route,
  Shield,
  TriangleAlert as AlertTriangle,
  Phone,
} from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

interface TramUnit {
  id: string;
  number: string;
  route: string;
  currentStation: string;
  nextStation: string;
  status: 'active' | 'maintenance' | 'offline';
  passengers: number;
  capacity: number;
  speed: number;
  estimatedArrival: number; // minutos
  direction: 'north' | 'south';
  lastUpdate: Date;
  position: { latitude: number; longitude: number }; // Posición geográfica
}

interface StationStatus {
  id: string;
  name: string;
  waitingPassengers: number;
  nextTrams: TramUnit[];
  alerts: string[];
}

export default function LiveTrackingScreen() {
  const { user } = useAuth();
  const { colors, t } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedView, setSelectedView] = useState<'passenger' | 'driver'>('passenger');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Datos simulados en tiempo real
  const [tramUnits, setTramUnits] = useState<TramUnit[]>([
    {
      id: '1',
      number: 'T-001',
      route: 'Línea 1',
      currentStation: 'El Arenal',
      nextStation: 'Pumapungo',
      status: 'active',
      passengers: 45,
      capacity: 120,
      speed: 25,
      estimatedArrival: 3,
      direction: 'north',
      lastUpdate: new Date(),
      position: { latitude: -2.169, longitude: -78.470 },
    },
    {
      id: '2',
      number: 'T-002',
      route: 'Línea 1',
      currentStation: 'El Ejido',
      nextStation: 'Feria Libre',
      status: 'active',
      passengers: 67,
      capacity: 120,
      speed: 30,
      estimatedArrival: 5,
      direction: 'north',
      lastUpdate: new Date(),
      position: { latitude: -2.161, longitude: -78.480 },
    },
    {
      id: '3',
      number: 'T-003',
      route: 'Línea 1',
      currentStation: 'Capulispamba',
      nextStation: 'El Ejido',
      status: 'active',
      passengers: 23,
      capacity: 120,
      speed: 28,
      estimatedArrival: 7,
      direction: 'south',
      lastUpdate: new Date(),
      position: { latitude: -2.160, longitude: -78.490 },
    },
    {
      id: '4',
      number: 'T-004',
      route: 'Línea 1',
      currentStation: 'Taller',
      nextStation: 'Parque Industrial',
      status: 'maintenance',
      passengers: 0,
      capacity: 120,
      speed: 0,
      estimatedArrival: 0,
      direction: 'north',
      lastUpdate: new Date(Date.now() - 15 * 60 * 1000),
      position: { latitude: -2.150, longitude: -78.500 },
    },
  ]);

  const [stations, setStations] = useState<StationStatus[]>([
    {
      id: '1',
      name: 'El Arenal',
      waitingPassengers: 12,
      nextTrams: [],
      alerts: [],
    },
    {
      id: '2',
      name: 'Pumapungo',
      waitingPassengers: 8,
      nextTrams: [],
      alerts: ['Mantenimiento de andén programado'],
    },
    {
      id: '3',
      name: 'El Ejido',
      waitingPassengers: 15,
      nextTrams: [],
      alerts: [],
    },
    {
      id: '4',
      name: 'Feria Libre',
      waitingPassengers: 6,
      nextTrams: [],
      alerts: [],
    },
    {
      id: '5',
      name: 'Capulispamba',
      waitingPassengers: 4,
      nextTrams: [],
      alerts: [],
    },
    {
      id: '6',
      name: 'Parque Industrial',
      waitingPassengers: 9,
      nextTrams: [],
      alerts: ['Congestión vehicular en zona'],
    },
  ]);

  // Simulación de actualizaciones en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      // Actualizar tranvías
      setTramUnits((prev) =>
        prev.map((tram) => ({
          ...tram,
          passengers: Math.max(0, Math.min(tram.capacity, tram.passengers + Math.floor(Math.random() * 10 - 5))),
          speed: tram.status === 'active' ? Math.floor(Math.random() * 15 + 20) : 0,
          estimatedArrival: Math.max(1, tram.estimatedArrival - 1 + Math.floor(Math.random() * 2)),
          lastUpdate: new Date(),
          // Opcional: actualizar posiciones geográficas simuladas
        }))
      );
      // Actualizar estaciones
      setStations((prev) =>
        prev.map((station) => ({
          ...station,
          waitingPassengers: Math.max(0, station.waitingPassengers + Math.floor(Math.random() * 6 - 3)),
        }))
      );

      setLastUpdate(new Date());
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLastUpdate(new Date());
    setRefreshing(false);
  };

  const handleEmergencyCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  // Función para determinar si es necesario mantener distancia lateral
  const debeMantenerDistancia = (tram: TramUnit, distanciaMetros: number) => {
    // Supongamos que la distancia lateral para tranvía es 3 metros como recomendación
    return distanciaMetros < 3;
  };

  // Función para calcular proximidad en tiempo real (ejemplo simple)
  const calcularProximidad = (tram: TramUnit, miPos: { latitude: number; longitude: number }) => {
    // Aquí puedes usar fórmulas de distancia geográfica, por ejemplo Haversine
    // Para simplificar, asumamos que si la distancia en coordenadas es menor a cierto valor
    const distancia = Math.sqrt(
      Math.pow(tram.position.latitude - miPos.latitude, 2) +
      Math.pow(tram.position.longitude - miPos.longitude, 2)
    );
    // Convertir a metros (esto es solo un ejemplo)
    return distancia * 111000; // aproximadamente km a metros
  };

  // Función para emitir alertas en función de la proximidad y condiciones climatológicas
  const obtenerAlertaProximidad = (tram: TramUnit, miPos: { latitude: number; longitude: number }) => {
    const distancia = calcularProximidad(tram, miPos);
    if (distancia <= 100) {
      return { nivel: 'crítico', mensaje: '¡Emergencia! Reduce velocidad y prepárate para detenerte.' };
    } else if (distancia <= 250) {
      return { nivel: 'alta', mensaje: 'Alerta crítica: Tranvía cercano, disminuye velocidad.' };
    } else if (distancia <= 500) {
      return { nivel: 'media', mensaje: 'Alerta media: Tranvía a 500m, mantén precaución.' };
    } else if (distancia <= 1000) {
      return { nivel: 'temprana', mensaje: 'Alerta temprana: Tranvía a 1km, atención.' };
    }
    return null;
  };

  // Ejemplo de posición del usuario
  const miPosicion = { latitude: -2.169, longitude: -78.470 };

  // Función para mostrar recomendaciones de conducción segura
  const recomendacionesSeguras = (condicionesClimaticas: string) => {
    // Puedes ampliar con condiciones específicas
    const recomendaciones = [
      'Mantener siempre distancia lateral de al menos 3 metros del tranvía.',
      'Nunca detenerse sobre las vías.',
      'Extremar precaución en condiciones climáticas adversas.',
      'Prestar atención a peatones que puedan cruzar hacia el tranvía.',
      'Respetar las señales de tránsito específicas para tranvías.',
    ];

    if (condicionesClimaticas === 'adversas') {
      recomendaciones.push('Aumentar la distancia de seguridad debido a la lluvia o niebla.');
    }
    return recomendaciones;
  };

  // Estado para condiciones climáticas (puede venir de API o sensores)
  const [condicionesClimaticas, setCondicionesClimaticas] = useState<'normal' | 'adversas'>('normal');

  // Renderizado de alertas en función de proximidad
  const renderProximidadAlertas = () => {
    return tramUnits.map((tram) => {
      const alerta = obtenerAlertaProximidad(tram, miPosicion);
      if (alerta && alerta.nivel !== 'temprana') {
        return (
          <View key={tram.id} style={[styles.proximidadAlert, { borderColor: alerta.nivel === 'crítico' ? '#DC3545' : '#FFC107' }]}>
            <Text style={{ color: alerta.nivel === 'crítico' ? '#DC3545' : '#FFC107' }}>
              {alerta.mensaje}
            </Text>
          </View>
        );
      }
      return null;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Radio size={24} color="#8B0000" />
          <Text style={styles.headerTitle}>Seguimiento en Vivo</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <RefreshCw size={20} color="#8B0000" />
        </TouchableOpacity>
      </View>

      {/* Alternar vista */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedView === 'passenger' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedView('passenger')}
        >
          <Eye
            size={16}
            color={selectedView === 'passenger' ? '#FFFFFF' : '#8B0000'}
          />
          <Text
            style={[
              styles.toggleText,
              selectedView === 'passenger' && styles.toggleTextActive,
            ]}
          >
            {t('live.passengerView')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedView === 'driver' && styles.toggleButtonActive,
          ]}
          onPress={() => setSelectedView('driver')}
        >
          <Route
            size={16}
            color={selectedView === 'driver' ? '#FFFFFF' : '#8B0000'}
          />
          <Text
            style={[
              styles.toggleText,
              selectedView === 'driver' && styles.toggleTextActive,
            ]}
          >
            {t('live.driverView')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Información de última actualización */}
        <View style={styles.updateInfo}>
          <Clock size={14} color="#666" />
          <Text style={styles.updateText}>{formatLastUpdate(lastUpdate)}</Text>
        </View>

        {/* Mostrar alertas de proximidad */}
        {renderProximidadAlertas()}

        {selectedView === 'passenger' ? (
          <>
            {/* Estado de estaciones para pasajeros */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Estado de Estaciones</Text>
              {stations.map((station) => {
                const nextTrams = tramUnits
                  .filter(
                    (tram) =>
                      tram.nextStation === station.name &&
                      tram.status === 'active'
                  )
                  .sort((a, b) => a.estimatedArrival - b.estimatedArrival);

                return (
                  <View key={station.id} style={styles.stationCard}>
                    <View style={styles.stationHeader}>
                      <MapPin size={20} color="#8B0000" />
                      <Text style={styles.stationName}>{station.name}</Text>
                      <View style={styles.waitingBadge}>
                        <Users size={14} color="#666" />
                        <Text style={styles.waitingText}>{station.waitingPassengers}</Text>
                      </View>
                    </View>

                    {station.alerts.length > 0 && (
                      <View style={styles.alertsContainer}>
                        {station.alerts.map((alert, index) => (
                          <View key={index} style={styles.alertItem}>
                            <AlertCircle size={14} color="#FFC107" />
                            <Text style={styles.alertText}>{alert}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    <View style={styles.arrivalsContainer}>
                      <Text style={styles.arrivalsTitle}>Próximas llegadas:</Text>
                      {nextTrams.length > 0 ? (
                        nextTrams.slice(0, 2).map((tram) => {
                          const occupancy = getOccupancyLevel(tram.passengers, tram.capacity);
                          return (
                            <View key={tram.id} style={styles.arrivalItem}>
                              <Train size={16} color="#8B0000" />
                              <Text style={styles.tramNumber}>{tram.number}</Text>
                              <Text style={styles.arrivalTime}>{tram.estimatedArrival} min</Text>
                              <View
                                style={[
                                  styles.occupancyBadge,
                                  { backgroundColor: `${occupancy.color}20` },
                                ]}
                              >
                                <Text style={[styles.occupancyText, { color: occupancy.color }]}>
                                  {occupancy.level}
                                </Text>
                              </View>
                            </View>
                          );
                        })
                      ) : (
                        <Text style={styles.noArrivals}>No hay tranvías próximos</Text>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </>
        ) : (
          <>
            {/* Modo Conductor y simulación de proximidad */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Modo Conductor (Simulación Anti-Choque)</Text>
              <View style={styles.safetyFeaturesContainer}>
                {/* Simulación visual de proximidad */}
                {(() => {
                  // Buscar el tranvía más cercano
                  let minDist = Infinity;
                  let tramCercano: TramUnit | null = null;
                  tramUnits.forEach(tram => {
                    const dist = calcularProximidad(tram, miPosicion);
                    if (dist < minDist) {
                      minDist = dist;
                      tramCercano = tram;
                    }
                  });
                  if (!tramCercano) return null;
                  const tCercano = tramCercano as TramUnit;
                  // Determinar nivel de riesgo
                  let riesgo = 'Seguro';
                  let color = '#28A745';
                  let consejo = 'Mantén tu velocidad y atención.';
                  if (minDist <= 100) {
                    riesgo = '¡Emergencia!'; color = '#DC3545'; consejo = 'Detente inmediatamente, tranvía extremadamente cerca.';
                  } else if (minDist <= 250) {
                    riesgo = 'Crítico'; color = '#FF8C00'; consejo = 'Reduce velocidad, tranvía muy próximo.';
                  } else if (minDist <= 500) {
                    riesgo = 'Precaución'; color = '#FFC107'; consejo = 'Disminuye velocidad y mantente alerta.';
                  } else if (minDist <= 1000) {
                    riesgo = 'Atención'; color = '#17A2B8'; consejo = 'Tranvía a 1km, prepárate.';
                  }
                  return (
                    <View style={{ backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF', alignItems: 'center' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16, color }}>Distancia al tranvía más cercano</Text>
                      <View style={{ width: '100%', height: 18, backgroundColor: '#E9ECEF', borderRadius: 9, marginVertical: 12, overflow: 'hidden' }}>
                        <View style={{ width: `${Math.max(0, 1000 - minDist) / 10}%`, height: '100%', backgroundColor: color, borderRadius: 9 }} />
                      </View>
                      <Text style={{ fontSize: 22, fontWeight: 'bold', color }}>{Math.round(minDist)} m</Text>
                      <Text style={{ marginTop: 8, color, fontWeight: 'bold' }}>{riesgo}</Text>
                      <Text style={{ marginTop: 4, color: '#333', textAlign: 'center' }}>{consejo}</Text>
                      <Text style={{ marginTop: 12, color: '#666' }}>Velocidad tranvía: <Text style={{ color: '#8B0000' }}>{tCercano.speed} km/h</Text></Text>
                      <Text style={{ color: '#666' }}>Dirección: <Text style={{ color: '#8B0000' }}>{tCercano.direction === 'north' ? 'Norte' : 'Sur'}</Text></Text>
                      <Text style={{ color: '#666' }}>Estado puertas: <Text style={{ color: '#8B0000' }}>{tCercano.speed > 0 ? 'Cerradas' : 'Abiertas'}</Text></Text>
                      <Text style={{ color: '#666' }}>Tiempo estimado a punto crítico: <Text style={{ color: '#8B0000' }}>{tCercano.estimatedArrival} min</Text></Text>
                    </View>
                  );
                })()}
                {/* Consejos fijos y alertas */}
                <View style={{ backgroundColor: '#F8F9FA', borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#E9ECEF' }}>
                  <Text style={[styles.safetyTitle, { marginBottom: 8 }]}>Recomendaciones de Conducción Segura</Text>
                  <Text style={styles.recomendacionText}>• Mantener siempre distancia lateral de al menos 3 metros del tranvía</Text>
                  <Text style={styles.recomendacionText}>• Nunca detenerse sobre las vías</Text>
                  <Text style={styles.recomendacionText}>• Extremar precaución en condiciones climáticas adversas</Text>
                  <Text style={styles.recomendacionText}>• Prestar atención a peatones que puedan cruzar hacia el tranvía</Text>
                  <Text style={styles.recomendacionText}>• Respetar las señales de tránsito específicas para tranvías</Text>
                  <Text style={[styles.safetyTitle, { marginTop: 16, marginBottom: 8 }]}>Alertas de Proximidad en Tiempo Real</Text>
                  <Text style={styles.recomendacionText}>• Alerta temprana (1km): Notificación visual suave</Text>
                  <Text style={styles.recomendacionText}>• Alerta media (500m): Notificación sonora y visual</Text>
                  <Text style={styles.recomendacionText}>• Alerta crítica (250m): Alerta sonora intensa y vibración</Text>
                  <Text style={styles.recomendacionText}>• Alerta de emergencia (100m): Alerta máxima con instrucciones evasivas</Text>
                </View>
                {/* Alertas en tiempo real dinámicas */}
                {tramUnits.map((tram) => {
                  const proximidad = obtenerAlertaProximidad(tram, miPosicion);
                  if (proximidad && proximidad.nivel !== 'temprana') {
                    return (
                      <View key={tram.id} style={[styles.proximidadAlert, { borderColor: proximidad.nivel === 'crítico' ? '#DC3545' : '#FFC107' }]}>
                        <Text style={{ color: proximidad.nivel === 'crítico' ? '#DC3545' : '#FFC107' }}>
                          {proximidad.mensaje}
                        </Text>
                      </View>
                    );
                  }
                  return null;
                })}
              </View>
              {/* Contacto de emergencia */}
              <View style={styles.emergencyContainer}>
                <View style={styles.safetyFeatureHeader}>
                  <Phone size={20} color="#DC3545" />
                  <Text style={styles.safetyFeatureTitle}>Contacto de Emergencia</Text>
                </View>
                <Text style={styles.safetyFeatureDescription}>
                  En caso de incidente o emergencia, contactar inmediatamente:
                  {'\n'}• Central de Operaciones: 123-456-7890
                  {'\n'}• Emergencias: 911
                  {'\n'}• Asistencia Vial: 555-HELP
                </Text>
                <TouchableOpacity
                  style={styles.emergencyButton}
                  onPress={() => handleEmergencyCall('911')}
                >
                  <Text style={styles.emergencyButtonText}>Llamar a Emergencias</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        {/* Alertas del sistema */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Alertas del Sistema</Text>
          <View style={styles.systemAlert}>
            <AlertCircle size={20} color="#FFC107" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Congestión Vehicular</Text>
              <Text style={styles.alertDescription}>
                Retrasos de 2-3 minutos en zona de Parque Industrial debido a tráfico.
              </Text>
            </View>
          </View>
          <View style={styles.systemAlert}>
            <CheckCircle size={20} color="#28A745" />
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Sistema Operativo</Text>
              <Text style={styles.alertDescription}>Todos los sistemas funcionando correctamente.</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Funciones auxiliares

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return '#28A745';
    case 'maintenance':
      return '#FFC107';
    case 'offline':
      return '#DC3545';
    default:
      return '#6C757D';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'active':
      return <CheckCircle size={16} color="#28A745" />;
    case 'maintenance':
      return <AlertCircle size={16} color="#FFC107" />;
    case 'offline':
      return <AlertCircle size={16} color="#DC3545" />;
    default:
      return <Radio size={16} color="#6C757D" />;
  }
};

const getOccupancyLevel = (passengers: number, capacity: number) => {
  const percentage = (passengers / capacity) * 100;
  if (percentage < 30) return { level: 'Bajo', color: '#28A745' };
  if (percentage < 70) return { level: 'Medio', color: '#FFC107' };
  return { level: 'Alto', color: '#DC3545' };
};

const formatLastUpdate = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  if (minutes < 1) return `Actualizado hace ${seconds}s`;
  return `Actualizado hace ${minutes}m`;
};

// Estilos permanecen iguales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginLeft: 12,
  },
  refreshButton: {
    padding: 8,
  },
  viewToggle: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  toggleButtonActive: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
    marginLeft: 6,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  updateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    backgroundColor: '#E8F5E8',
  },
  updateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  stationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stationName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    flex: 1,
    marginLeft: 8,
  },
  waitingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  waitingText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginLeft: 4,
  },
  alertsContainer: {
    marginBottom: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 8,
    borderRadius: 6,
    marginBottom: 4,
  },
  alertText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#856404',
    marginLeft: 6,
    flex: 1,
  },
  arrivalsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    paddingTop: 12,
  },
  arrivalsTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 8,
  },
  arrivalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  tramNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
    marginLeft: 8,
    minWidth: 50,
  },
  arrivalTime: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginLeft: 12,
    minWidth: 50,
  },
  occupancyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  occupancyText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  noArrivals: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    fontStyle: 'italic',
  },
  fleetSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  summaryNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  tramCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tramHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tramInfo: {
    flex: 1,
  },
  tramRoute: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  tramStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 4,
  },
  tramDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  tramFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    paddingTop: 8,
  },
  lastUpdateText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  directionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  directionText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    marginLeft: 4,
  },
  systemAlert: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertContent: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    lineHeight: 16,
  },
  driverSafetyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 16,
  },
  safetyFeaturesContainer: {
    padding: 16,
  },
  safetyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 8,
  },
  recomendacionText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginVertical: 4,
    color: '#333',
  },
  safetyFeatureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  safetyFeatureTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginLeft: 12,
  },
  safetyFeatureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 32,
    lineHeight: 20,
  },
  emergencyContainer: {
    backgroundColor: '#FFF8F8',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  emergencyButton: {
    backgroundColor: '#DC3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  proximidadAlert: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginVertical: 8,
  },
});