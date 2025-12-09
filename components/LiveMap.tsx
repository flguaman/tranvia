import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { MapPin, Brain as Train, Users, Navigation, Zap, Clock } from 'lucide-react-native';

interface TramPosition {
  id: string;
  number: string;
  latitude: number;
  longitude: number;
  direction: 'north' | 'south';
  speed: number;
  passengers: number;
  capacity: number;
  nextStation: string;
  estimatedArrival: number;
}

interface StationPosition {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  waitingPassengers: number;
}

interface LiveMapProps {
  onTramSelect?: (tram: TramPosition) => void;
  onStationSelect?: (station: StationPosition) => void;
}

export default function LiveMap({ onTramSelect, onStationSelect }: LiveMapProps) {
  const [tramPositions, setTramPositions] = useState<TramPosition[]>([
    {
      id: '1',
      number: 'T-001',
      latitude: -2.9001,
      longitude: -79.0059,
      direction: 'north',
      speed: 25,
      passengers: 45,
      capacity: 120,
      nextStation: 'Pumapungo',
      estimatedArrival: 3,
    },
    {
      id: '2',
      number: 'T-002',
      latitude: -2.8832,
      longitude: -79.0142,
      direction: 'north',
      speed: 30,
      passengers: 67,
      capacity: 120,
      nextStation: 'Feria Libre',
      estimatedArrival: 5,
    },
    {
      id: '3',
      number: 'T-003',
      latitude: -2.8654,
      longitude: -79.0234,
      direction: 'south',
      speed: 28,
      passengers: 23,
      capacity: 120,
      nextStation: 'El Ejido',
      estimatedArrival: 7,
    },
  ]);

  const [stations] = useState<StationPosition[]>([
    { id: '1', name: 'El Arenal', latitude: -2.9001, longitude: -79.0059, waitingPassengers: 12 },
    { id: '2', name: 'Pumapungo', latitude: -2.8832, longitude: -79.0142, waitingPassengers: 8 },
    { id: '3', name: 'El Ejido', latitude: -2.8654, longitude: -79.0234, waitingPassengers: 15 },
    { id: '4', name: 'Feria Libre', latitude: -2.8476, longitude: -79.0326, waitingPassengers: 6 },
    { id: '5', name: 'Capulispamba', latitude: -2.8298, longitude: -79.0418, waitingPassengers: 4 },
    { id: '6', name: 'Parque Industrial', latitude: -2.8120, longitude: -79.0510, waitingPassengers: 9 },
  ]);

  const [selectedTram, setSelectedTram] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  // Simulate real-time position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTramPositions(prev => prev.map(tram => ({
        ...tram,
        latitude: tram.latitude + (Math.random() - 0.5) * 0.001,
        longitude: tram.longitude + (Math.random() - 0.5) * 0.001,
        speed: Math.floor(Math.random() * 15 + 20),
        passengers: Math.max(0, Math.min(tram.capacity, tram.passengers + Math.floor(Math.random() * 10 - 5))),
        estimatedArrival: Math.max(1, tram.estimatedArrival - 1 + Math.floor(Math.random() * 2)),
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getOccupancyColor = (passengers: number, capacity: number) => {
    const percentage = (passengers / capacity) * 100;
    if (percentage < 30) return '#28A745';
    if (percentage < 70) return '#FFC107';
    return '#DC3545';
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#8B0000" />
          <Text style={styles.mapTitle}>Mapa en Tiempo Real</Text>
          <Text style={styles.mapSubtitle}>Vista interactiva del sistema de tranvía</Text>
        </View>

        {/* Simulated Map Elements */}
        <View style={styles.mapElements}>
          {/* Route Line */}
          <View style={styles.routeLine} />
          
          {/* Stations */}
          {stations.map((station, index) => (
            <TouchableOpacity
              key={station.id}
              style={[
                styles.stationMarker,
                { 
                  left: 50 + (index * 60),
                  top: 200 + (index % 2 === 0 ? 0 : 20),
                },
                selectedStation === station.id && styles.selectedMarker
              ]}
              onPress={() => {
                setSelectedStation(station.id);
                onStationSelect?.(station);
              }}
            >
              <MapPin size={16} color="#8B0000" />
              <Text style={styles.stationLabel}>{station.name}</Text>
              {station.waitingPassengers > 0 && (
                <View style={styles.waitingBadge}>
                  <Text style={styles.waitingText}>{station.waitingPassengers}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}

          {/* Trams */}
          {tramPositions.map((tram, index) => (
            <TouchableOpacity
              key={tram.id}
              style={[
                styles.tramMarker,
                { 
                  left: 70 + (index * 80),
                  top: 180 + (index * 15),
                  backgroundColor: getOccupancyColor(tram.passengers, tram.capacity),
                },
                selectedTram === tram.id && styles.selectedTramMarker
              ]}
              onPress={() => {
                setSelectedTram(tram.id);
                onTramSelect?.(tram);
              }}
            >
              <Train size={16} color="#FFFFFF" />
              <Text style={styles.tramLabel}>{tram.number}</Text>
              
              {/* Direction indicator */}
              <View style={[
                styles.directionIndicator,
                { backgroundColor: tram.direction === 'north' ? '#1976D2' : '#F57C00' }
              ]}>
                <Navigation size={8} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Selected Tram Info */}
        {selectedTram && (
          <View style={styles.infoPanel}>
            {(() => {
              const tram = tramPositions.find(t => t.id === selectedTram);
              if (!tram) return null;
              
              return (
                <View style={styles.tramInfo}>
                  <Text style={styles.infoTitle}>Tranvía {tram.number}</Text>
                  <View style={styles.infoRow}>
                    <Zap size={14} color="#666" />
                    <Text style={styles.infoText}>{tram.speed} km/h</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Users size={14} color="#666" />
                    <Text style={styles.infoText}>
                      {tram.passengers}/{tram.capacity} pasajeros
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.infoText}>
                      Próxima parada: {tram.nextStation} ({tram.estimatedArrival} min)
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        )}

        {/* Selected Station Info */}
        {selectedStation && (
          <View style={styles.infoPanel}>
            {(() => {
              const station = stations.find(s => s.id === selectedStation);
              if (!station) return null;
              
              return (
                <View style={styles.stationInfo}>
                  <Text style={styles.infoTitle}>{station.name}</Text>
                  <View style={styles.infoRow}>
                    <Users size={14} color="#666" />
                    <Text style={styles.infoText}>
                      {station.waitingPassengers} personas esperando
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>
        )}
      </View>
    );
  }

  // For mobile, you would integrate with react-native-maps here
  return (
    <View style={styles.mobileContainer}>
      <Text style={styles.mobileText}>
        Mapa interactivo disponible en dispositivos móviles
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#F0F8FF',
    position: 'relative',
  },
  mobileContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  mobileText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
  },
  mapPlaceholder: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  mapTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginTop: 8,
  },
  mapSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  mapElements: {
    flex: 1,
    position: 'relative',
    marginTop: 120,
  },
  routeLine: {
    position: 'absolute',
    left: 50,
    right: 50,
    top: 210,
    height: 4,
    backgroundColor: '#8B0000',
    borderRadius: 2,
  },
  stationMarker: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 2,
    borderColor: '#8B0000',
    minWidth: 60,
  },
  selectedMarker: {
    borderColor: '#FFD700',
    backgroundColor: '#FFF9C4',
  },
  stationLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#8B0000',
    textAlign: 'center',
    marginTop: 2,
  },
  waitingBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#DC3545',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  waitingText: {
    fontSize: 8,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  tramMarker: {
    position: 'absolute',
    alignItems: 'center',
    borderRadius: 12,
    padding: 8,
    minWidth: 50,
  },
  selectedTramMarker: {
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  tramLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  directionIndicator: {
    position: 'absolute',
    top: -4,
    right: -4,
    borderRadius: 8,
    padding: 2,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tramInfo: {
    // Styles for tram info
  },
  stationInfo: {
    // Styles for station info
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 8,
  },
});