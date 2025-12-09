import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Navigation, Clock, Star, Radio, Map } from 'lucide-react-native';
import LiveMap from '@/components/LiveMap';

export default function MapScreen() {
  const [selectedStation, setSelectedStation] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'static' | 'live'>('static');

  const stations = [
    { id: 1, name: 'Estación El Arenal', time: '5 min', line: 'Línea 1' },
    { id: 2, name: 'Estación Pumapungo', time: '12 min', line: 'Línea 1' },
    { id: 3, name: 'Estación El Ejido', time: '18 min', line: 'Línea 1' },
    { id: 4, name: 'Estación Feria Libre', time: '25 min', line: 'Línea 1' },
    { id: 5, name: 'Estación Capulispamba', time: '32 min', line: 'Línea 1' },
    { id: 6, name: 'Estación Parque Industrial', time: '40 min', line: 'Línea 1' },
  ];

  const routes = [
    {
      id: 1,
      name: 'Ruta Completa',
      from: 'El Arenal',
      to: 'Parque Industrial',
      duration: '45 min',
      distance: '20.4 km',
      color: '#8B0000',
    },
    {
      id: 2,
      name: 'Ruta Centro',
      from: 'El Arenal',
      to: 'El Ejido',
      duration: '22 min',
      distance: '8.2 km',
      color: '#228B22',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mapa del Tranvía</Text>
        <Text style={styles.headerSubtitle}>Red de Transporte de Cuenca</Text>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'static' && styles.toggleButtonActive]}
          onPress={() => setViewMode('static')}
        >
          <Map size={16} color={viewMode === 'static' ? '#FFFFFF' : '#8B0000'} />
          <Text style={[styles.toggleText, viewMode === 'static' && styles.toggleTextActive]}>
            Mapa Estático
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleButton, viewMode === 'live' && styles.toggleButtonActive]}
          onPress={() => setViewMode('live')}
        >
          <Radio size={16} color={viewMode === 'live' ? '#FFFFFF' : '#8B0000'} />
          <Text style={[styles.toggleText, viewMode === 'live' && styles.toggleTextActive]}>
            Tiempo Real
          </Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'live' ? (
        <View style={styles.liveMapContainer}>
          <LiveMap
            onTramSelect={(tram) => console.log('Tram selected:', tram)}
            onStationSelect={(station) => console.log('Station selected:', station)}
          />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Static Map Placeholder */}
          <View style={styles.mapContainer}>
            <View style={styles.mapPlaceholder}>
              <MapPin size={48} color="#8B0000" />
              <Text style={styles.mapPlaceholderText}>
                Mapa Interactivo del Tranvía
              </Text>
              <Text style={styles.mapPlaceholderSubtext}>
                Vista detallada de rutas y estaciones
              </Text>
            </View>
          </View>

          {/* Routes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rutas Disponibles</Text>
            {routes.map((route) => (
              <TouchableOpacity key={route.id} style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={[styles.routeIndicator, { backgroundColor: route.color }]} />
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{route.name}</Text>
                    <Text style={styles.routeDescription}>
                      {route.from} → {route.to}
                    </Text>
                  </View>
                </View>
                <View style={styles.routeDetails}>
                  <View style={styles.routeDetail}>
                    <Clock size={16} color="#666" />
                    <Text style={styles.routeDetailText}>{route.duration}</Text>
                  </View>
                  <View style={styles.routeDetail}>
                    <Navigation size={16} color="#666" />
                    <Text style={styles.routeDetailText}>{route.distance}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Estaciones</Text>
            {stations.map((station) => (
              <TouchableOpacity
                key={station.id}
                style={[
                  styles.stationCard,
                  selectedStation === station.id && styles.stationCardSelected,
                ]}
                onPress={() => setSelectedStation(station.id)}
              >
                <View style={styles.stationHeader}>
                  <View style={styles.stationIcon}>
                    <MapPin size={20} color="#8B0000" />
                  </View>
                  <View style={styles.stationInfo}>
                    <Text style={styles.stationName}>{station.name}</Text>
                    <Text style={styles.stationLine}>{station.line}</Text>
                  </View>
                  <View style={styles.stationTime}>
                    <Text style={styles.stationTimeText}>{station.time}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Legend */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leyenda</Text>
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#8B0000' }]} />
                <Text style={styles.legendText}>Línea Principal</Text>
              </View>
              <View style={styles.legendItem}>
                <Star size={16} color="#FFD700" />
                <Text style={styles.legendText}>Estación Principal</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#228B22' }]} />
                <Text style={styles.legendText}>Ruta Directa</Text>
              </View>
              <View style={styles.legendItem}>
                <Radio size={16} color="#FF8C00" />
                <Text style={styles.legendText}>Tranvía en Tiempo Real</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
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
    paddingVertical: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#FFD700',
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
  liveMapContainer: {
    flex: 1,
  },
  mapContainer: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginTop: 16,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
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
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  routeIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginRight: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDetailText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginLeft: 8,
  },
  stationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  stationCardSelected: {
    borderColor: '#8B0000',
    backgroundColor: '#FFF5F5',
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 4,
  },
  stationLine: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#8B0000',
  },
  stationTime: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stationTimeText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#228B22',
  },
  legendContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#212529',
    marginLeft: 8,
  },
});