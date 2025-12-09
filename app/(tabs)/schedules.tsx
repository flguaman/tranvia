import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, MapPin, ArrowRight, Calendar, Filter } from 'lucide-react-native';

export default function SchedulesScreen() {
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedDay, setSelectedDay] = useState('weekday');

  const routes = [
    { id: 'all', name: 'Todas las Rutas', color: '#8B0000' },
    { id: 'line1', name: 'Línea 1', color: '#8B0000' },
    { id: 'express', name: 'Expreso', color: '#228B22' },
  ];

  const dayTypes = [
    { id: 'weekday', name: 'Lun-Vie', active: true },
    { id: 'saturday', name: 'Sábado', active: false },
    { id: 'sunday', name: 'Domingo', active: false },
  ];

  const schedules = [
    {
      id: 1,
      route: 'Línea 1',
      from: 'El Arenal',
      to: 'Parque Industrial',
      times: ['05:30', '06:00', '06:30', '07:00', '07:30', '08:00'],
      duration: '45 min',
      frequency: '15 min',
      color: '#8B0000',
    },
    {
      id: 2,
      route: 'Línea 1',
      from: 'Parque Industrial',
      to: 'El Arenal',
      times: ['06:00', '06:30', '07:00', '07:30', '08:00', '08:30'],
      duration: '45 min',
      frequency: '15 min',
      color: '#8B0000',
    },
    {
      id: 3,
      route: 'Expreso',
      from: 'El Arenal',
      to: 'El Ejido',
      times: ['06:15', '06:45', '07:15', '07:45', '08:15', '08:45'],
      duration: '22 min',
      frequency: '30 min',
      color: '#228B22',
    },
  ];

  const nextArrivals = [
    { station: 'El Arenal', time: '3 min', route: 'Línea 1' },
    { station: 'Pumapungo', time: '8 min', route: 'Línea 1' },
    { station: 'El Ejido', time: '12 min', route: 'Expreso' },
    { station: 'Feria Libre', time: '15 min', route: 'Línea 1' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Horarios</Text>
        <Text style={styles.headerSubtitle}>Consulta los horarios del tranvía</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Filters */}
        <View style={styles.section}>
          <View style={styles.filterHeader}>
            <Filter size={20} color="#8B0000" />
            <Text style={styles.filterTitle}>Filtros</Text>
          </View>
          
          {/* Route Filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
            {routes.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={[
                  styles.filterButton,
                  selectedRoute === route.id && [styles.filterButtonActive, { backgroundColor: route.color }],
                ]}
                onPress={() => setSelectedRoute(route.id)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedRoute === route.id && styles.filterButtonTextActive,
                ]}>
                  {route.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Day Filter */}
          <View style={styles.dayFilters}>
            {dayTypes.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedDay === day.id && styles.dayButtonActive,
                ]}
                onPress={() => setSelectedDay(day.id)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedDay === day.id && styles.dayButtonTextActive,
                ]}>
                  {day.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Next Arrivals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Próximas Llegadas</Text>
          <View style={styles.arrivalsContainer}>
            {nextArrivals.map((arrival, index) => (
              <View key={index} style={styles.arrivalCard}>
                <View style={styles.arrivalInfo}>
                  <MapPin size={16} color="#8B0000" />
                  <Text style={styles.arrivalStation}>{arrival.station}</Text>
                </View>
                <View style={styles.arrivalDetails}>
                  <Text style={styles.arrivalRoute}>{arrival.route}</Text>
                  <Text style={styles.arrivalTime}>{arrival.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Schedule Tables */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios Detallados</Text>
          {schedules.map((schedule) => (
            <View key={schedule.id} style={styles.scheduleCard}>
              <View style={styles.scheduleHeader}>
                <View style={[styles.routeIndicator, { backgroundColor: schedule.color }]} />
                <View style={styles.scheduleInfo}>
                  <Text style={styles.routeName}>{schedule.route}</Text>
                  <View style={styles.routeDirection}>
                    <Text style={styles.stationName}>{schedule.from}</Text>
                    <ArrowRight size={16} color="#666" />
                    <Text style={styles.stationName}>{schedule.to}</Text>
                  </View>
                </View>
                <View style={styles.scheduleMetrics}>
                  <View style={styles.metric}>
                    <Clock size={14} color="#666" />
                    <Text style={styles.metricText}>{schedule.duration}</Text>
                  </View>
                  <Text style={styles.frequencyText}>c/{schedule.frequency}</Text>
                </View>
              </View>
              
              <View style={styles.timesContainer}>
                <Text style={styles.timesLabel}>Horarios de Salida:</Text>
                <View style={styles.timesGrid}>
                  {schedule.times.map((time, index) => (
                    <View key={index} style={styles.timeSlot}>
                      <Text style={styles.timeText}>{time}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Operating Hours */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Horarios de Operación</Text>
          <View style={styles.operatingHours}>
            <View style={styles.hourRow}>
              <Calendar size={18} color="#8B0000" />
              <Text style={styles.hourLabel}>Lunes a Viernes:</Text>
              <Text style={styles.hourTime}>05:30 - 22:00</Text>
            </View>
            <View style={styles.hourRow}>
              <Calendar size={18} color="#8B0000" />
              <Text style={styles.hourLabel}>Sábados:</Text>
              <Text style={styles.hourTime}>06:00 - 21:00</Text>
            </View>
            <View style={styles.hourRow}>
              <Calendar size={18} color="#8B0000" />
              <Text style={styles.hourLabel}>Domingos:</Text>
              <Text style={styles.hourTime}>07:00 - 20:00</Text>
            </View>
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
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  filterTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginLeft: 8,
  },
  filterScroll: {
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  filterButtonActive: {
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
  dayFilters: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dayButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  dayButtonActive: {
    backgroundColor: '#8B0000',
    borderColor: '#8B0000',
  },
  dayButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 16,
  },
  arrivalsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  arrivalCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  arrivalInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  arrivalStation: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginLeft: 8,
  },
  arrivalDetails: {
    alignItems: 'flex-end',
  },
  arrivalRoute: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginBottom: 2,
  },
  arrivalTime: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#228B22',
  },
  scheduleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
  scheduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeIndicator: {
    width: 4,
    height: 50,
    borderRadius: 2,
    marginRight: 12,
  },
  scheduleInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#212529',
    marginBottom: 4,
  },
  routeDirection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginHorizontal: 8,
  },
  scheduleMetrics: {
    alignItems: 'flex-end',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginLeft: 4,
  },
  frequencyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
  },
  timesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#F1F3F4',
    paddingTop: 12,
  },
  timesLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginBottom: 8,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  timeSlot: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#8B0000',
  },
  operatingHours: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  hourLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#212529',
    marginLeft: 12,
  },
  hourTime: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#8B0000',
  },
});