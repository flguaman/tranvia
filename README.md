# 🚊 Tranvía Cuenca - Sistema de Transporte Público

Una aplicación móvil moderna y completa para el sistema de tranvía de Cuenca, Ecuador. Desarrollada con React Native y Expo, ofrece funcionalidades avanzadas tanto para usuarios como administradores del sistema de transporte.

![Tranvía Cuenca](https://images.pexels.com/photos/681467/pexels-photo-681467.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1)

## 📱 Características Principales

### 🎯 **Para Usuarios (Pasajeros)**
- **Seguimiento en Tiempo Real**: Ubicación exacta de todos los tranvías
- **Horarios Inteligentes**: Consulta de horarios con tiempos de llegada precisos
- **Billetera Digital**: Sistema de pagos integrado con QR
- **Compra de Tickets**: Múltiples tipos de pases (sencillo, diario, semanal, mensual)
- **Mapa Interactivo**: Visualización de rutas y estaciones
- **Notificaciones Push**: Alertas de servicio y actualizaciones
- **Historial de Viajes**: Registro completo de todos los trayectos

### 🚗 **Para Conductores (Modo Seguridad)**
- **Alertas de Proximidad**: Notificaciones cuando el tranvía está cerca (1km)
- **Compartir Ubicación**: GPS en tiempo real para coordinación
- **Alertas Graduales**: Diferentes niveles de urgencia según distancia
- **Modo Conductor**: Activación específica para prevenir accidentes
- **Vibración y Sonido**: Alertas hápticas en dispositivos móviles

### 👨‍💼 **Para Administradores**
- **Panel de Control**: Vista completa del sistema operativo
- **Gestión de Usuarios**: Administración de cuentas y perfiles
- **Monitoreo de Flota**: Estado en tiempo real de todos los tranvías
- **Análisis y Reportes**: Estadísticas de uso y rendimiento
- **Modo Emergencia**: Alertas masivas a conductores cercanos
- **Control de Ubicaciones**: Monitoreo central de todas las posiciones

## 🛡️ **Características de Seguridad Vial**

### **Sistema de Prevención de Accidentes**
La aplicación incluye un innovador sistema de seguridad que ayuda a prevenir colisiones entre vehículos particulares y el tranvía:

- **Detección Automática**: GPS de alta precisión detecta proximidad al tranvía
- **Alertas Escalonadas**:
  - 🔴 **Crítica (< 500m)**: "¡ATENCIÓN INMEDIATA!"
  - 🟡 **Media (500-800m)**: "Precaución Requerida"  
  - 🟠 **Baja (800m-1km)**: "Tranvía Detectado"
- **Funcionamiento en Segundo Plano**: Protección continua
- **Consejos de Seguridad**: Educación vial integrada

## 💳 **Sistema de Pagos Digital**

### **Billetera Integrada**
- Recarga de saldo mediante múltiples métodos
- Pagos con código QR
- Historial de transacciones detallado
- Tickets digitales con validación automática

### **Tipos de Tickets Disponibles**
- **Viaje Sencillo**: $0.35 - Válido por 2 horas
- **Pase Diario**: $2.50 - Viajes ilimitados por día
- **Pase Semanal**: $15.00 - Válido por 7 días
- **Pase Mensual**: $50.00 - Válido por 30 días
- **Pase Estudiantil**: $25.00 - Descuento especial con ID

## 🗺️ **Sistema de Rutas y Horarios**

### **Cobertura Completa**
- **Línea 1**: El Arenal ↔ Parque Industrial (20.4 km)
- **Expreso**: El Arenal ↔ El Ejido (8.2 km)
- **Frecuencia**: Cada 15 minutos en horas pico
- **Horarios Extendidos**: Hasta 22:00 entre semana

### **Estaciones Principales**
1. **El Arenal** - Terminal principal
2. **Pumapungo** - Zona comercial
3. **El Ejido** - Centro histórico
4. **Feria Libre** - Mercado central
5. **Capulispamba** - Zona residencial
6. **Parque Industrial** - Terminal norte

## 🔧 **Tecnologías Utilizadas**

### **Frontend**
- **React Native** - Framework multiplataforma
- **Expo** - Plataforma de desarrollo
- **TypeScript** - Tipado estático
- **Expo Router** - Navegación moderna
- **Lucide Icons** - Iconografía consistente

### **Características Técnicas**
- **Geolocalización**: GPS de alta precisión
- **Cámara**: Escáner QR integrado
- **Notificaciones**: Push notifications
- **Almacenamiento**: Persistencia local
- **Animaciones**: Reanimated para fluidez

## 🎨 **Diseño y UX**

### **Identidad Visual**
- **Color Primario**: Rojo Oscuro (#8B0000) - Representa la identidad municipal
- **Color Secundario**: Dorado (#FFD700) - Elegancia y calidad
- **Tipografía**: Inter - Moderna y legible
- **Estilo**: Minimalista con elementos cuencanos

### **Experiencia de Usuario**
- **Navegación Intuitiva**: Tabs principales con acceso rápido
- **Feedback Visual**: Animaciones y micro-interacciones
- **Accesibilidad**: Diseño inclusivo y universal
- **Responsive**: Adaptable a todos los tamaños de pantalla

## 🚀 **Instalación y Configuración**

### **Prerrequisitos**
```bash
Node.js >= 18.0.0
npm >= 8.0.0
Expo CLI
```

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/cuenca/tranvia-app.git

# Instalar dependencias
cd tranvia-app
npm install

# Iniciar en modo desarrollo
npm run dev
```

### **Credenciales de Prueba**
```
Usuario Regular:
Email: usuario@example.com
Password: user123

Administrador:
Email: admin@tranvia.cuenca.ec  
Password: admin123
```

## 📊 **Estadísticas del Sistema**

### **Métricas de Rendimiento**
- **50,000+** usuarios diarios
- **98%** puntualidad promedio
- **15 minutos** frecuencia estándar
- **2,847** viajes diarios promedio
- **$5,398** ingresos diarios

### **Cobertura de Servicio**
- **6 estaciones** principales
- **20.4 km** de recorrido total
- **45 minutos** tiempo completo de ruta
- **120 pasajeros** capacidad por unidad

## 🌟 **Funcionalidades Avanzadas**

### **Inteligencia Artificial**
- Predicción de tiempos de llegada
- Optimización de rutas en tiempo real
- Análisis de patrones de uso
- Recomendaciones personalizadas

### **Internet de las Cosas (IoT)**
- Sensores de ocupación en tranvías
- Monitoreo de infraestructura
- Mantenimiento predictivo
- Calidad del aire en estaciones

### **Sostenibilidad**
- Cálculo de huella de carbono reducida
- Estadísticas de impacto ambiental
- Promoción del transporte público
- Gamificación de uso sostenible

## 🔐 **Seguridad y Privacidad**

### **Protección de Datos**
- Encriptación end-to-end
- Cumplimiento GDPR
- Anonimización de datos de ubicación
- Controles de privacidad granulares

### **Seguridad de Pagos**
- Tokenización de tarjetas
- Autenticación biométrica
- Transacciones seguras
- Monitoreo de fraude

## 🤝 **Contribución y Desarrollo**

### **Estructura del Proyecto**
```
tranvia-cuenca-app/
├── app/                    # Pantallas principales
│   ├── (tabs)/            # Navegación por pestañas
│   ├── auth/              # Autenticación
│   └── admin/             # Panel administrativo
├── components/            # Componentes reutilizables
├── contexts/              # Context API
├── services/              # Servicios y APIs
└── assets/               # Recursos estáticos
```

### **Guías de Contribución**
1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📞 **Soporte y Contacto**

### **Información de Contacto**
- **Email**: soporte@tranvia.cuenca.ec
- **Teléfono**: +593 7 123-4567
- **Dirección**: Av. 12 de Abril, Cuenca, Ecuador
- **Horario**: Lunes a Viernes, 8:00 AM - 6:00 PM

### **Recursos Adicionales**
- [Documentación Técnica](https://docs.tranvia.cuenca.ec)
- [Centro de Ayuda](https://help.tranvia.cuenca.ec)
- [Estado del Sistema](https://status.tranvia.cuenca.ec)
- [Blog Oficial](https://blog.tranvia.cuenca.ec)

## 📄 **Licencia**

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 🏆 **Reconocimientos**

### **Desarrollado por**
- **Municipio de Cuenca** - Visión y liderazgo
- **Equipo de Desarrollo** - Implementación técnica
- **Comunidad de Cuenca** - Feedback y testing

### **Agradecimientos Especiales**
- Ciudadanos de Cuenca por su participación
- Conductores y operadores del sistema
- Organizaciones de transporte público internacional
- Comunidad open source de React Native

---

**© 2024 Municipio de Cuenca - Sistema de Tranvía**  
*Conectando Cuenca con tecnología moderna y sostenible* 🚊✨