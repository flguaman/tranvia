import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Theme = 'light' | 'dark';
export type Language = 'es' | 'en';

interface ThemeContextType {
  theme: Theme;
  language: Language;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    border: string;
    card: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  t: (key: string) => string;
}

const lightColors = {
  background: '#F8F9FA',
  surface: '#FFFFFF',
  primary: '#8B0000',
  secondary: '#FFD700',
  text: '#212529',
  textSecondary: '#666',
  border: '#E9ECEF',
  card: '#FFFFFF',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
};

const darkColors = {
  background: '#121212',
  surface: '#1E1E1E',
  primary: '#B71C1C',
  secondary: '#FFD700',
  text: '#FFFFFF',
  textSecondary: '#B0B0B0',
  border: '#333333',
  card: '#2D2D2D',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
};

const translations = {
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.map': 'Mapa',
    'nav.live': 'En Vivo',
    'nav.schedules': 'Horarios',
    'nav.wallet': 'Billetera',
    'nav.profile': 'Perfil',

    // Profile
    'profile.darkMode': 'Modo Oscuro',
    'profile.language': 'Idioma',
    'profile.driverMode': 'Modo Conductor',
    'profile.locationSharing': 'Compartir Ubicación',
    'profile.proximityAlerts': 'Alertas de Proximidad',
    'profile.safetyTitle': 'Seguridad Vial',
    'profile.statistics': 'Estadísticas',
    'profile.recentTrips': 'Viajes Recientes',
    'profile.options': 'Opciones',
    'profile.logout': 'Cerrar Sesión',

    // Live Tracking
    'live.title': 'Seguimiento en Vivo',
    'live.passengerView': 'Vista Peatón',
    'live.driverView': 'Vista Conductor',
    'live.driverSafety': 'Modo Conductor (Seguridad)',
    'live.safetyRecommendations': 'Recomendaciones de Conducción Segura',
    'live.tramIndicators': 'Indicadores de Estado del Tranvía',
    'live.proximityAlerts': 'Alertas de Proximidad en Tiempo Real',
    'live.emergencyContact': 'Contacto de Emergencia',

    // Safety Messages
    'safety.recommendation1':
      'Mantener siempre distancia lateral de al menos 3 metros del tranvía',
    'safety.recommendation2': 'Nunca detenerse sobre las vías',
    'safety.recommendation3':
      'Extremar precaución en condiciones climáticas adversas',
    'safety.recommendation4':
      'Prestar atención a peatones que puedan cruzar hacia el tranvía',
    'safety.recommendation5':
      'Respetar las señales de tránsito específicas para tranvías',

    'safety.indicator1': 'Velocidad actual del tranvía (km/h)',
    'safety.indicator2': 'Tiempo estimado de llegada a puntos críticos',
    'safety.indicator3': 'Estado de las puertas (abiertas/cerradas)',
    'safety.indicator4': 'Dirección de movimiento (norte/sur)',
    'safety.indicator5': 'Distancia exacta desde tu posición actual',

    'safety.alert1': 'Alerta temprana (1km): Notificación visual suave',
    'safety.alert2': 'Alerta media (500m): Notificación sonora y visual',
    'safety.alert3': 'Alerta crítica (250m): Alerta sonora intensa y vibración',
    'safety.alert4':
      'Alerta de emergencia (100m): Alerta máxima con instrucciones evasivas',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.map': 'Map',
    'nav.live': 'Live',
    'nav.schedules': 'Schedules',
    'nav.wallet': 'Wallet',
    'nav.profile': 'Profile',

    // Profile
    'profile.darkMode': 'Dark Mode',
    'profile.language': 'Language',
    'profile.driverMode': 'Driver Mode',
    'profile.locationSharing': 'Location Sharing',
    'profile.proximityAlerts': 'Proximity Alerts',
    'profile.safetyTitle': 'Road Safety',
    'profile.statistics': 'Statistics',
    'profile.recentTrips': 'Recent Trips',
    'profile.options': 'Options',
    'profile.logout': 'Logout',

    // Live Tracking
    'live.title': 'Live Tracking',
    'live.passengerView': 'Passenger View',
    'live.driverView': 'Driver View',
    'live.driverSafety': 'Driver Mode (Safety)',
    'live.safetyRecommendations': 'Safe Driving Recommendations',
    'live.tramIndicators': 'Tram Status Indicators',
    'live.proximityAlerts': 'Real-Time Proximity Alerts',
    'live.emergencyContact': 'Emergency Contact',

    // Safety Messages
    'safety.recommendation1':
      'Always maintain a lateral distance of at least 3 meters from the tram',
    'safety.recommendation2': 'Never stop on the tracks',
    'safety.recommendation3':
      'Exercise extreme caution in adverse weather conditions',
    'safety.recommendation4':
      'Pay attention to pedestrians who may cross towards the tram',
    'safety.recommendation5': 'Respect traffic signals specific to trams',

    'safety.indicator1': 'Current tram speed (km/h)',
    'safety.indicator2': 'Estimated arrival time to critical points',
    'safety.indicator3': 'Door status (open/closed)',
    'safety.indicator4': 'Direction of movement (north/south)',
    'safety.indicator5': 'Exact distance from your current position',

    'safety.alert1': 'Early alert (1km): Soft visual notification',
    'safety.alert2': 'Medium alert (500m): Sound and visual notification',
    'safety.alert3': 'Critical alert (250m): Intense sound alert and vibration',
    'safety.alert4':
      'Emergency alert (100m): Maximum alert with evasive instructions',
  },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');
  const [language, setLanguageState] = useState<Language>('es');
  const [isLoaded, setIsLoaded] = useState(false);

  const safeAsyncStorage = {
    getItem: async (key: string) => {
      try {
        return await AsyncStorage.getItem(key);
      } catch (e) {
        console.warn('AsyncStorage getItem failed:', e);
        return null;
      }
    },
    setItem: async (key: string, value: string) => {
      try {
        await AsyncStorage.setItem(key, value);
      } catch (e) {
        console.warn('AsyncStorage setItem failed:', e);
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const storedTheme = await safeAsyncStorage.getItem('theme');
        const storedLang = await safeAsyncStorage.getItem('language');
        if (storedTheme === 'light' || storedTheme === 'dark')
          setTheme(storedTheme);
        if (storedLang === 'es' || storedLang === 'en')
          setLanguageState(storedLang);
      } catch (e) {
        console.warn('Theme init failed:', e);
      }
      setIsLoaded(true);
    })();
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      safeAsyncStorage.setItem('theme', next);
      return next;
    });
  };

  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
    safeAsyncStorage.setItem('theme', newTheme);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    safeAsyncStorage.setItem('language', lang);
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  if (!isLoaded) return null;

  return (
    <ThemeContext.Provider
      value={{
        theme,
        language,
        toggleTheme,
        setTheme: setThemeDirectly,
        setLanguage,
        colors,
        t,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
