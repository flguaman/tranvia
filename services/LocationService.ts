import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
  userId: string;
  userType: 'passenger' | 'driver' | 'admin';
}

interface TramLocation {
  id: string;
  latitude: number;
  longitude: number;
  speed: number;
  direction: 'north' | 'south';
  timestamp: number;
}

class LocationService {
  private static instance: LocationService;
  private locationSubscription: Location.LocationSubscription | null = null;
  private userLocation: UserLocation | null = null;
  private tramLocations: TramLocation[] = [];
  private proximityCallbacks: ((distance: number, tramId: string) => void)[] = [];
  private isSharing = false;
  private proximityThreshold = 1000; // 1km in meters

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'web') {
        // For web, we'll simulate permission granted
        return true;
      }

      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      
      if (foregroundStatus !== 'granted') {
        Alert.alert(
          'Permisos de Ubicación',
          'La aplicación necesita acceso a tu ubicación para funcionar correctamente.',
          [{ text: 'OK' }]
        );
        return false;
      }

      // Request background permissions for driver mode
      const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
      
      if (backgroundStatus !== 'granted') {
        Alert.alert(
          'Permisos de Ubicación en Segundo Plano',
          'Para recibir alertas de proximidad cuando la app esté cerrada, necesitamos permisos de ubicación en segundo plano.',
          [{ text: 'OK' }]
        );
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async startLocationSharing(userType: 'passenger' | 'driver' | 'admin' = 'passenger'): Promise<void> {
    try {
      if (this.isSharing) {
        return;
      }

      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        return;
      }

      this.isSharing = true;

      if (Platform.OS === 'web') {
        // Simulate location for web
        this.simulateLocationForWeb(userType);
        return;
      }

      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          this.updateUserLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
            userId: 'current-user',
            userType,
          });
        }
      );

      // Start simulating tram locations
      this.startTramLocationSimulation();

    } catch (error) {
      console.error('Error starting location sharing:', error);
      Alert.alert('Error', 'No se pudo iniciar el seguimiento de ubicación');
    }
  }

  stopLocationSharing(): void {
    this.isSharing = false;
    
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }

    this.userLocation = null;
    this.proximityCallbacks = [];
  }

  private simulateLocationForWeb(userType: 'passenger' | 'driver' | 'admin'): void {
    // Simulate user location in Cuenca, Ecuador
    const cuencaCenter = {
      latitude: -2.8973,
      longitude: -79.0067,
    };

    // Add some random offset to simulate movement
    const updateLocation = () => {
      if (!this.isSharing) return;

      const randomOffset = 0.005; // ~500m radius
      const location: UserLocation = {
        latitude: cuencaCenter.latitude + (Math.random() - 0.5) * randomOffset,
        longitude: cuencaCenter.longitude + (Math.random() - 0.5) * randomOffset,
        timestamp: Date.now(),
        userId: 'current-user',
        userType,
      };

      this.updateUserLocation(location);
      
      // Continue simulation
      setTimeout(updateLocation, 5000);
    };

    updateLocation();
  }

  private startTramLocationSimulation(): void {
    // Simulate tram locations along the route
    const tramRoute = [
      { lat: -2.9001, lng: -79.0059, name: 'El Arenal' },
      { lat: -2.8832, lng: -79.0142, name: 'Pumapungo' },
      { lat: -2.8654, lng: -79.0234, name: 'El Ejido' },
      { lat: -2.8476, lng: -79.0326, name: 'Feria Libre' },
      { lat: -2.8298, lng: -79.0418, name: 'Capulispamba' },
      { lat: -2.8120, lng: -79.0510, name: 'Parque Industrial' },
    ];

    const trams = [
      { id: 'T-001', routeIndex: 0, direction: 'north' as const },
      { id: 'T-002', routeIndex: 2, direction: 'north' as const },
      { id: 'T-003', routeIndex: 4, direction: 'south' as const },
    ];

    const updateTramLocations = () => {
      if (!this.isSharing) return;

      this.tramLocations = trams.map(tram => {
        // Simulate tram movement along route
        const currentStop = tramRoute[tram.routeIndex];
        const speed = 25 + Math.random() * 10; // 25-35 km/h

        // Add small random movement to simulate real movement
        const movement = 0.001; // ~100m
        
        return {
          id: tram.id,
          latitude: currentStop.lat + (Math.random() - 0.5) * movement,
          longitude: currentStop.lng + (Math.random() - 0.5) * movement,
          speed,
          direction: tram.direction,
          timestamp: Date.now(),
        };
      });

      // Check proximity if user location is available
      if (this.userLocation) {
        this.checkProximity();
      }

      // Continue simulation
      setTimeout(updateTramLocations, 3000);
    };

    updateTramLocations();
  }

  private updateUserLocation(location: UserLocation): void {
    this.userLocation = location;
    
    // Send location to server (simulated)
    this.sendLocationToServer(location);
    
    // Check proximity to trams
    this.checkProximity();
  }

  private sendLocationToServer(location: UserLocation): void {
    // Simulate sending location to server
    console.log('Sending location to server:', location);
    
    // In a real app, this would be an API call
    // fetch('/api/location/update', {
    //   method: 'POST',
    //   body: JSON.stringify(location),
    // });
  }

  private checkProximity(): void {
    if (!this.userLocation) return;

    this.tramLocations.forEach(tram => {
      const distance = this.calculateDistance(
        this.userLocation!.latitude,
        this.userLocation!.longitude,
        tram.latitude,
        tram.longitude
      );

      if (distance <= this.proximityThreshold) {
        this.triggerProximityAlert(distance, tram.id);
      }
    });
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }

  private triggerProximityAlert(distance: number, tramId: string): void {
    // Trigger all registered callbacks
    this.proximityCallbacks.forEach(callback => {
      callback(distance, tramId);
    });

    // Show system notification
    this.showProximityNotification(distance, tramId);
  }

  private showProximityNotification(distance: number, tramId: string): void {
    const distanceKm = (distance / 1000).toFixed(1);
    
    Alert.alert(
      '🚊 Tranvía Cerca',
      `El tranvía ${tramId} está a ${distanceKm}km de tu ubicación. Conduce con precaución.`,
      [
        { text: 'Entendido', style: 'default' },
        { text: 'Ver en Mapa', onPress: () => this.openMapWithTram(tramId) }
      ],
      { cancelable: true }
    );
  }

  private openMapWithTram(tramId: string): void {
    // Navigate to map screen with tram selected
    console.log('Opening map with tram:', tramId);
  }

  // Public methods for components to use
  onProximityAlert(callback: (distance: number, tramId: string) => void): void {
    this.proximityCallbacks.push(callback);
  }

  removeProximityCallback(callback: (distance: number, tramId: string) => void): void {
    const index = this.proximityCallbacks.indexOf(callback);
    if (index > -1) {
      this.proximityCallbacks.splice(index, 1);
    }
  }

  getUserLocation(): UserLocation | null {
    return this.userLocation;
  }

  getTramLocations(): TramLocation[] {
    return this.tramLocations;
  }

  isLocationSharingActive(): boolean {
    return this.isSharing;
  }

  setProximityThreshold(meters: number): void {
    this.proximityThreshold = meters;
  }
}

export default LocationService.getInstance();