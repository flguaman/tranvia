import React from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Text,
} from 'react-native';

// Si es móvil, importamos WebView de react-native-webview
let WebView: any = null;
if (Platform.OS !== 'web') {
  try {
    WebView = require('react-native-webview').WebView;
  } catch (e) {
    console.warn('react-native-webview no está disponible en este entorno');
  }
}

interface LiveMapProps {
  onTramSelect?: (tram: any) => void;
  onStationSelect?: (station: any) => void;
}

// Contenido HTML completo y autónomo con Leaflet para el mapa y la simulación
const MAP_HTML_CONTENT = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Simulador Anti-Colisión - Tranvía de Cuenca</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  
  <!-- Google Fonts: Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Leaflet CSS y JS dinámicos -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" id="leaflet-css" />
  
  <style>
    body, html, #map {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      font-family: 'Inter', sans-serif;
      overflow: hidden;
      background-color: #0F172A;
    }
    
    /* Indicador de carga inicial */
    #loadingIndicator {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #94A3B8;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      z-index: 9999;
      background: rgba(15, 23, 42, 0.9);
      padding: 20px;
      border-radius: 16px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Panel de Control Estilo Glassmorphism Premium */
    .control-panel {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.92);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.45);
      width: 320px;
      color: #F8FAFC;
      transition: all 0.3s ease;
      display: none;
      max-height: calc(100vh - 32px);
      overflow-y: auto;
    }

    .panel-title {
      font-size: 16px;
      font-weight: 800;
      margin: 0 0 6px 0;
      color: #F1F5F9;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .panel-subtitle {
      font-size: 11px;
      color: #94A3B8;
      margin: 0 0 16px 0;
    }

    .telemetry-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      font-size: 13px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      padding-bottom: 6px;
    }

    .telemetry-label {
      color: #94A3B8;
      font-weight: 500;
    }

    .telemetry-value {
      font-weight: 700;
      color: #F1F5F9;
    }

    /* Estados de Alerta Dinámicos */
    .alert-badge {
      display: inline-block;
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-safe {
      background-color: rgba(34, 197, 94, 0.2);
      color: #4ADE80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .badge-medium-safe {
      background-color: rgba(34, 197, 94, 0.15);
      color: #86EFAC;
      border: 1px solid rgba(34, 197, 94, 0.2);
    }

    .badge-medium-danger {
      background-color: rgba(234, 179, 8, 0.2);
      color: #FACC15;
      border: 1px solid rgba(234, 179, 8, 0.3);
      animation: pulse 1.5s infinite;
    }

    .badge-danger {
      background-color: rgba(251, 146, 60, 0.25);
      color: #FB923C;
      border: 1px solid rgba(251, 146, 60, 0.35);
      animation: pulse 1.2s infinite;
    }

    .badge-very-danger {
      background-color: rgba(239, 68, 68, 0.3);
      color: #FCA5A5;
      border: 1px solid rgba(239, 68, 68, 0.4);
      animation: pulse-fast 0.6s infinite;
    }

    /* Interruptor Premium (Toggle Switch) */
    .switch-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      background: rgba(255, 255, 255, 0.05);
      padding: 10px 14px;
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .switch-label {
      font-size: 13px;
      font-weight: 600;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 46px;
      height: 24px;
    }

    .switch input { 
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #EF4444;
      transition: .3s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .3s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #22C55E;
    }

    input:checked + .slider:before {
      transform: translateX(22px);
    }

    /* Controles de Simulación */
    .btn {
      background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%);
      color: white;
      border: none;
      padding: 10px 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 12px;
      cursor: pointer;
      width: 100%;
      margin-top: 10px;
      box-shadow: 0 4px 12px rgba(139, 0, 0, 0.2);
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(139, 0, 0, 0.3);
    }

    .btn:active {
      transform: translateY(1px);
    }

    /* Control de Velocidad de la Simulación */
    .speed-control {
      margin-top: 14px;
    }
    
    .speed-label {
      font-size: 12px;
      color: #94A3B8;
      margin-bottom: 6px;
      display: block;
    }

    .speed-btns {
      display: flex;
      gap: 6px;
    }

    .speed-btn {
      flex: 1;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #E2E8F0;
      padding: 6px;
      border-radius: 8px;
      font-size: 11px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .speed-btn.active {
      background: #E2E8F0;
      color: #0F172A;
      border-color: #E2E8F0;
    }

    /* Superposición de Explosión / Choque 💥 */
    .crash-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(239, 68, 68, 0.4);
      z-index: 9999;
      pointer-events: none;
      display: none;
      justify-content: center;
      align-items: center;
      animation: flash 0.5s infinite;
    }

    .crash-card {
      background: #000000;
      color: #EF4444;
      border: 3px solid #EF4444;
      border-radius: 20px;
      padding: 24px;
      text-align: center;
      box-shadow: 0 0 50px rgba(239, 68, 68, 0.8);
      pointer-events: auto;
      max-width: 320px;
    }

    .crash-card h1 {
      margin: 0 0 10px 0;
      font-size: 32px;
      animation: bounce 0.5s infinite alternate;
    }

    .crash-card p {
      margin: 0 0 16px 0;
      font-size: 14px;
      font-weight: 600;
      color: #F8FAFC;
      line-height: 1.4;
    }

    /* Notificaciones */
    .notification-container {
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 1001;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 320px;
    }

    .notification {
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(15px);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 12px;
      padding: 14px;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
      animation: slideIn 0.3s ease-out;
    }

    .notification-title {
      font-size: 13px;
      font-weight: 800;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .notification-message {
      font-size: 12px;
      color: #CBD5E1;
    }

    .notification.safe { border-left: 4px solid #22C55E; }
    .notification.warning { border-left: 4px solid #FACC15; }
    .notification.danger { border-left: 4px solid #EF4444; }

    /* Lista de tranvías */
    .tram-list {
      margin-top: 14px;
      background: rgba(255, 255, 255, 0.03);
      border-radius: 10px;
      padding: 10px;
    }

    .tram-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .tram-item:last-child {
      border-bottom: none;
    }

    .tram-name {
      font-size: 12px;
      font-weight: 600;
    }

    .tram-status {
      font-size: 11px;
      padding: 3px 8px;
      border-radius: 10px;
    }

    .tram-status.active {
      background: rgba(34, 197, 94, 0.2);
      color: #4ADE80;
    }

    /* Animaciones */
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 1; }
      100% { opacity: 0.6; }
    }
    @keyframes pulse-fast {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes flash {
      0% { background: rgba(239, 68, 68, 0.3); }
      50% { background: rgba(239, 68, 68, 0.6); }
      100% { background: rgba(239, 68, 68, 0.3); }
    }
    @keyframes bounce {
      from { transform: translateY(0); }
      to { transform: translateY(-10px); }
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }

    /* Custom Leaflet Marker Styles */
    .leaflet-div-icon {
      background: none;
      border: none;
    }

    .marker-label {
      background: #0F172A;
      color: white;
      font-size: 9px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      white-space: nowrap;
      position: absolute;
      top: -24px;
      left: 50%;
      transform: translateX(-50%);
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .tram-icon-inner {
      width: 30px;
      height: 30px;
      background-color: #8B0000;
      border: 2.5px solid #FFD700;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(139, 0, 0, 0.5);
      color: white;
      font-size: 12px;
      font-weight: bold;
    }

    .tram-icon-inner.return {
      background-color: #1E3A8A;
      border-color: #60A5FA;
    }

    .car-icon-inner {
      width: 32px;
      height: 32px;
      background-color: #059669;
      border: 3px solid #34D399;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(5, 150, 105, 0.5);
      color: white;
      font-size: 16px;
    }
    
    .station-marker-inner {
      width: 12px;
      height: 12px;
      background-color: #FFD700;
      border: 2px solid #8B0000;
      border-radius: 50%;
      box-shadow: 0 0 6px rgba(139,0,0,0.6);
    }
  </style>
</head>
<body>

  <!-- Indicador de carga inicial -->
  <div id="loadingIndicator">
    <div style="font-size: 20px; margin-bottom: 10px;">🚊</div>
    Cargando Mapa de Cuenca...
  </div>

  <!-- Superposición de Choque -->
  <div class="crash-overlay" id="crashOverlay">
    <div class="crash-card">
      <h1>💥 CHOQUE!</h1>
      <p id="crashMessage">Colisión detectada</p>
      <button class="btn" onclick="restartSimulation()">Reiniciar Simulación</button>
    </div>
  </div>

  <!-- Panel de Control Premium -->
  <div class="control-panel" id="controlPanel">
    <div class="panel-title">
      <span>🚊 Seguridad Vial Cuenca</span>
    </div>
    <div class="panel-subtitle">4 Tranvías • Monitoreo Anti-Colisión</div>
    
    <div class="telemetry-row">
      <span class="telemetry-label">⚠️ Estado Actual</span>
      <span id="uiSafetyStatus"><span class="alert-badge badge-safe">Seguro</span></span>
    </div>
    
    <div class="telemetry-row">
      <span class="telemetry-label">📏 Tranvía más cercano</span>
      <span class="telemetry-value" id="uiDistance">Calculando...</span>
    </div>
    
    <div class="telemetry-row">
      <span class="telemetry-label">🚗 Tu Velocidad</span>
      <span class="telemetry-value" id="uiCarSpeed">40 km/h</span>
    </div>

    <!-- Toggle ADAS -->
    <div class="switch-container">
      <span class="switch-label">Sistema Anti-Colisión (ADAS)</span>
      <label class="switch">
        <input type="checkbox" id="adasToggle" checked onchange="toggleAdas(this)">
        <span class="slider"></span>
      </label>
    </div>

    <!-- Control de Velocidad -->
    <div class="speed-control">
      <span class="speed-label">Velocidad de Simulación</span>
      <div class="speed-btns">
        <button class="speed-btn active" id="speed1" onclick="setSimSpeed(1)">1x</button>
        <button class="speed-btn" id="speed2" onclick="setSimSpeed(2)">2x</button>
        <button class="speed-btn" id="speed5" onclick="setSimSpeed(5)">5x</button>
      </div>
    </div>

    <!-- Lista de tranvías -->
    <div class="tram-list">
      <div style="font-size: 11px; color: #94A3B8; margin-bottom: 8px; font-weight: 600;">Estado de Tranvías</div>
      <div class="tram-item">
        <span class="tram-name">🚊 T-01 (Ida)</span>
        <span class="tram-status active" id="tram01-status">Activo</span>
      </div>
      <div class="tram-item">
        <span class="tram-name">🚊 T-02 (Ida)</span>
        <span class="tram-status active" id="tram02-status">Activo</span>
      </div>
      <div class="tram-item">
        <span class="tram-name">🚊 T-03 (Regreso)</span>
        <span class="tram-status active" id="tram03-status">Activo</span>
      </div>
      <div class="tram-item">
        <span class="tram-name">🚊 T-04 (Regreso)</span>
        <span class="tram-status active" id="tram04-status">Activo</span>
      </div>
    </div>

    <!-- Botón Reiniciar -->
    <button class="btn" onclick="restartSimulation()">Reiniciar Recorrido</button>
  </div>

  <!-- Notificaciones -->
  <div class="notification-container" id="notificationContainer"></div>

  <div id="map"></div>

  <!-- Leaflet Map Script / Sistema Anti-Colisión -->
  <script>
    // Variables de simulación globales
    var adasActive = true;
    var simSpeedMultiplier = 1;
    var isCrashed = false;
    
    // 4 Tranvías con más información
    var trams = [
      { id: 0, name: "T-01", color: "#8B0000", route: "ida", index: 0, marker: null, path: [], speed: 1 },
      { id: 1, name: "T-02", color: "#7C2D12", route: "ida", index: 0, marker: null, path: [], speed: 1 },
      { id: 2, name: "T-03", color: "#1E3A8A", route: "regreso", index: 0, marker: null, path: [], speed: 1 },
      { id: 3, name: "T-04", color: "#1E40AF", route: "regreso", index: 0, marker: null, path: [], speed: 1 }
    ];
    
    var carIndex = 0;
    var carCurrentSpeed = 1; // Velocidad actual del auto (para deceleración suave)
    var denseCarPath = [];
    var carMarker = null;
    var map = null;
    const MIN_TRAM_DISTANCE = 150; // Distancia mínima entre tranvías en puntos de la ruta

    // Sistema de notificaciones
    var notifications = [];
    var lastNotificationTime = 0;
    var lastNotificationLevel = "";
    const NOTIFICATION_COOLDOWN = 3000; // 3 segundos entre notificaciones del mismo nivel

    function addNotification(title, message, level) {
      var now = Date.now();
      // Evitar notificaciones repetidas del mismo nivel dentro del cooldown
      if (now - lastNotificationTime < NOTIFICATION_COOLDOWN && lastNotificationLevel === level) {
        return;
      }
      // Siempre notificar si el nivel empeora (más peligroso)
      if (lastNotificationLevel !== level && 
          ((level === "danger" && lastNotificationLevel !== "danger") || 
           (level === "very-danger" && lastNotificationLevel !== "very-danger"))) {
        // No aplicar cooldown para niveles más peligrosos
      } else if (now - lastNotificationTime < NOTIFICATION_COOLDOWN) {
        return;
      }
      
      lastNotificationTime = now;
      lastNotificationLevel = level;

      var container = document.getElementById('notificationContainer');
      var notification = document.createElement('div');
      notification.className = 'notification ' + level;
      notification.innerHTML = '<div class="notification-title">' + title + '</div><div class="notification-message">' + message + '</div>';
      
      container.insertBefore(notification, container.firstChild);
      notifications.push(notification);

      // Eliminar notificación después de 5 segundos
      setTimeout(function() {
        notification.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(function() {
          if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
          }
        }, 300);
      }, 5000);

      // Mantener máximo 5 notificaciones
      while (container.children.length > 5) {
        container.removeChild(container.lastChild);
      }
    }

    // CDNs disponibles para cargar Leaflet de manera robusta
    var scriptLoadAttempts = 0;
    var cdns = [
      { js: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js", css: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" },
      { js: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js", css: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" }
    ];

    function loadLeafletCDN() {
      if (scriptLoadAttempts >= cdns.length) {
        document.getElementById('loadingIndicator').innerHTML = "❌ Error al cargar el mapa";
        return;
      }

      var cdn = cdns[scriptLoadAttempts];
      scriptLoadAttempts++;
      document.getElementById('leaflet-css').href = cdn.css;

      var script = document.createElement('script');
      script.src = cdn.js;
      script.async = true;
      script.onload = function() {
        checkAndStart();
      };
      script.onerror = function() {
        loadLeafletCDN();
      };
      document.head.appendChild(script);
    }

    function checkAndStart() {
      if (typeof L !== 'undefined') {
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
        initializeSimulation();
      } else {
        setTimeout(checkAndStart, 100);
      }
    }

    function initializeSimulation() {
      // 1. Inicializar el mapa en Cuenca, Ecuador
      map = L.map('map', { zoomControl: false }).setView([-2.8974, -79.0045], 14.5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // 2. Rutas y estaciones reales del Tranvía de Cuenca
      var tranviaRoute = [
        { name: "1 - Río Tarqui", lat: -2.9194749, lng: -79.0389893 },
        { name: "2 - El Salado", lat: -2.9143274, lng: -79.0373833 },
        { name: "3 - Misicata", lat: -2.9104066, lng: -79.0352821 },
        { name: "4 - Río Yanuncay", lat: -2.9057337, lng: -79.0327683 },
        { name: "5 - Av. México", lat: -2.9026621, lng: -79.0302462 },
        { name: "6 - El Arenal", lat: -2.8982627, lng: -79.0262104 },
        { name: "7 - Río Tomebamba", lat: -2.8950573, lng: -79.0249240 },
        { name: "8 - Gran Colombia", lat: -2.8913823, lng: -79.0226190 },
        { name: "9 - Unidad Nacional", lat: -2.8919503, lng: -79.0191126 },
        { name: "10 - Corazón de Jesús", lat: -2.8931063, lng: -79.0150126 },
        { name: "11 - Coronel Talbot", lat: -2.8944090, lng: -79.0100825 },
        { name: "12 - Santo Domingo", lat: -2.8953746, lng: -79.0063456 },
        { name: "13 - Luis Cordero", lat: -2.8964380, lng: -79.0023076 },
        { name: "14 - Tomás Ordóñez", lat: -2.8977607, lng: -78.9970670 },
        { name: "15 - Gaspar Sangurima", lat: -2.8949979, lng: -78.9958053 },
        { name: "16 - Chola Cuencana", lat: -2.8949979, lng: -78.9958053 },
        { name: "17 - Terminal Terrestre", lat: -2.8927314, lng: -78.9924653 },
        { name: "18 - Aeropuerto", lat: -2.8895030, lng: -78.9876883 },
        { name: "19 - Milchichig", lat: -2.8859298, lng: -78.9833995 },
        { name: "20 - Parque Industrial", lat: -2.8822093, lng: -78.9748538 }
      ];

      var tramRoutePoints = [
        [-2.9208678, -79.0388793],
        [-2.9198121, -79.0389592],
        [-2.9194749, -79.0389893],
        [-2.9189657, -79.0390321],
        [-2.9184132, -79.0390399],
        [-2.9179424, -79.0389899],
        [-2.9173408, -79.0388753],
        [-2.9167866, -79.0386926],
        [-2.9160443, -79.0383670],
        [-2.9155932, -79.0381212],
        [-2.9149624, -79.0377340],
        [-2.9143274, -79.0373833],
        [-2.9131469, -79.0367730],
        [-2.9124893, -79.0363947],
        [-2.9114772, -79.0358577],
        [-2.9105880, -79.0353774],
        [-2.9104066, -79.0352821],
        [-2.9092811, -79.0346661],
        [-2.9085905, -79.0342909],
        [-2.9079402, -79.0339471],
        [-2.9072033, -79.0335257],
        [-2.9068571, -79.0333424],
        [-2.9065379, -79.0331861],
        [-2.9057337, -79.0327683],
        [-2.9053930, -79.0325817],
        [-2.9049896, -79.0323529],
        [-2.9045185, -79.0320330],
        [-2.9038003, -79.0314399],
        [-2.9032103, -79.0308865],
        [-2.9029584, -79.0306180],
        [-2.9026621, -79.0302462],
        [-2.9024687, -79.0300015],
        [-2.9019438, -79.0293623],
        [-2.9016921, -79.0290558],
        [-2.9012247, -79.0284928],
        [-2.9009416, -79.0281817],
        [-2.9005878, -79.0277981],
        [-2.9004601, -79.0276656],
        [-2.9002400, -79.0274930],
        [-2.8997646, -79.0271356],
        [-2.8993123, -79.0268476],
        [-2.8987671, -79.0265144],
        [-2.8985307, -79.0263700],
        [-2.8982627, -79.0262104],
        [-2.8976199, -79.0258154],
        [-2.8973229, -79.0255874],
        [-2.8972251, -79.0255255],
        [-2.8970881, -79.0254371],
        [-2.8966653, -79.0252496],
        [-2.8963625, -79.0251434],
        [-2.8960693, -79.0250718],
        [-2.8955362, -79.0249417],
        [-2.8950573, -79.0249240],
        [-2.8942976, -79.0248990],
        [-2.8939702, -79.0248990],
        [-2.8937692, -79.0248651],
        [-2.8913283, -79.0241269],
        [-2.8913823, -79.0226190],
        [-2.8912986, -79.0231363],
        [-2.8912353, -79.0235805],
        [-2.8911979, -79.0237728],
        [-2.8919503, -79.0191126],
        [-2.8920092, -79.0187313],
        [-2.8922437, -79.0175181],
        [-2.8925087, -79.0166555],
        [-2.8928939, -79.0156081],
        [-2.8931063, -79.0150126],
        [-2.8935571, -79.0136892],
        [-2.8937524, -79.0126326],
        [-2.8940063, -79.0116116],
        [-2.8944090, -79.0100825],
        [-2.8945046, -79.0095635],
        [-2.8947809, -79.0085695],
        [-2.8950507, -79.0075996],
        [-2.8953167, -79.0065879],
        [-2.8953746, -79.0063456],
        [-2.8955503, -79.0055981],
        [-2.8958087, -79.0046202],
        [-2.8960379, -79.0037543],
        [-2.8961521, -79.0033252],
        [-2.8963305, -79.0027717],
        [-2.8964380, -79.0023076],
        [-2.8966723, -79.0013289],
        [-2.8967960, -79.0008311],
        [-2.8970593, -78.9998320],
        [-2.8973167, -78.9988117],
        [-2.8975782, -78.9978021],
        [-2.8977607, -78.9970670],
        [-2.8977810, -78.9966765],
        [-2.8978107, -78.9968368],
        [-2.8976069, -78.9965840],
        [-2.8971203, -78.9966010],
        [-2.8962081, -78.9965577],
        [-2.8956372, -78.9965274],
        [-2.8954597, -78.9964611],
        [-2.8953643, -78.9963426],
        [-2.8949979, -78.9958053],
        [-2.8941692, -78.9945810],
        [-2.8937103, -78.9938958],
        [-2.8935436, -78.9936469],
        [-2.8934704, -78.9935350],
        [-2.8930161, -78.9928764],
        [-2.8927314, -78.9924653],
        [-2.8923614, -78.9919312],
        [-2.8920784, -78.9915139],
        [-2.8912274, -78.9902590],
        [-2.8901093, -78.9885903],
        [-2.8895030, -78.9876883],
        [-2.8892397, -78.9872962],
        [-2.8891834, -78.9871984],
        [-2.8889573, -78.9869161],
        [-2.8887935, -78.9867219],
        [-2.8881277, -78.9859629],
        [-2.8877268, -78.9854882],
        [-2.8874765, -78.9851923],
        [-2.8869659, -78.9845865],
        [-2.8867140, -78.9842989],
        [-2.8861239, -78.9836268],
        [-2.8859298, -78.9833995],
        [-2.8857713, -78.9832148],
        [-2.8856471, -78.9830699],
        [-2.8851776, -78.9824968],
        [-2.8849855, -78.9822576],
        [-2.8843499, -78.9814666],
        [-2.8841305, -78.9811931],
        [-2.8840455, -78.9810822],
        [-2.8838549, -78.9808336],
        [-2.8835367, -78.9791874],
        [-2.8835334, -78.9804141],
        [-2.8834043, -78.9799727],
        [-2.8834022, -78.9798089],
        [-2.8834290, -78.9796445],
        [-2.8835857, -78.9789796],
        [-2.8836222, -78.9787472],
        [-2.8836098, -78.9785953],
        [-2.8835113, -78.9783631],
        [-2.8834226, -78.9781969],
        [-2.8833584, -78.9780906],
        [-2.8832634, -78.9779387],
        [-2.8825207, -78.9776152],
        [-2.8822093, -78.9748538]
      ];

      // Ruta de regreso (invertida)
      var tramRouteReturn = [...tramRoutePoints].reverse();

      // 3. Estaciones
      var stations = tranviaRoute;
      L.polyline(tramRoutePoints, { color: '#8B0000', weight: 5, opacity: 0.7, dashArray: '8, 6' }).addTo(map);
      stations.forEach(function(station) {
        var stationIcon = L.divIcon({ className: 'custom-station-icon', html: '<div class="station-marker-inner"></div>', iconSize: [12, 12] });
        L.marker([station.lat, station.lng], { icon: stationIcon }).addTo(map).bindPopup("<b>" + station.name + "</b><br>Tranvía Cuenca");
      });

      // 4. Ruta mejorada del auto (recorre la ciudad)
      var carRoutePoints = [
        [-2.915, -79.04],
        [-2.912, -79.037],
        [-2.908, -79.034],
        [-2.904, -79.031],
        [-2.899, -79.028],
        [-2.896, -79.025],
        [-2.893, -79.022],
        [-2.8915, -79.02],
        [-2.892, -79.018],
        [-2.893, -79.015],
        [-2.894, -79.012],
        [-2.895, -79.008],
        [-2.896, -79.005],
        [-2.897, -79.002],
        [-2.8975, -78.998],
        [-2.896, -78.996],
        [-2.894, -78.994],
        [-2.892, -78.992],
        [-2.89, -78.988],
        [-2.888, -78.985],
        [-2.887, -78.987],
        [-2.8885, -78.99],
        [-2.89, -78.993],
        [-2.892, -78.996],
        [-2.894, -78.998],
        [-2.896, -79.002],
        [-2.8975, -79.006],
        [-2.8985, -79.01],
        [-2.899, -79.014],
        [-2.898, -79.018],
        [-2.896, -79.022],
        [-2.894, -79.026],
        [-2.892, -79.03],
        [-2.89, -79.033],
        [-2.888, -79.036],
        [-2.886, -79.038]
      ];
      
      L.polyline(carRoutePoints, { color: '#059669', weight: 3, opacity: 0.4, dashArray: '4, 4' }).addTo(map);

      // 5. Interpolación de rutas
      denseCarPath = interpolateDensePoints(carRoutePoints, 200);
      
      // Asignar rutas a tranvías y distribuirlos uniformemente
      var idaPath = interpolateDensePoints(tramRoutePoints, 120);
      var regresoPath = interpolateDensePoints(tramRouteReturn, 120);
      
      trams[0].path = idaPath;
      trams[0].index = 0; // Primer tranvía de ida al principio de la ruta
      
      trams[1].path = idaPath;
      trams[1].index = Math.floor(idaPath.length / 2); // Segundo tranvía de ida en la mitad
      
      trams[2].path = regresoPath;
      trams[2].index = 0; // Primer tranvía de regreso al principio de la ruta
      
      trams[3].path = regresoPath;
      trams[3].index = Math.floor(regresoPath.length / 2); // Segundo tranvía de regreso en la mitad

      // 6. Crear marcadores
      trams.forEach(function(tram) {
        var iconClass = tram.route === "regreso" ? "tram-icon-inner return" : "tram-icon-inner";
        var tramIcon = L.divIcon({
          className: 'custom-icon',
          html: '<div class="marker-label">' + tram.name + '</div><div class="' + iconClass + '">T</div>',
          iconSize: [30, 30]
        });
        var initialPos = tram.path[Math.floor(tram.index) % tram.path.length];
        tram.marker = L.marker(initialPos, { icon: tramIcon }).addTo(map);
      });

      var carIcon = L.divIcon({
        className: 'custom-icon',
        html: '<div class="marker-label">🚗 TU AUTO</div><div class="car-icon-inner">🚗</div>',
        iconSize: [32, 32]
      });
      carMarker = L.marker(denseCarPath[0], { icon: carIcon }).addTo(map);

      // 7. Iniciar simulación
      addNotification("✅ Simulación Iniciada", "¡Bienvenido! Tu sistema ADAS está activado.", "safe");
      setInterval(runSimulationStep, 60);
    }

    function interpolateDensePoints(points, stepsPerSegment) {
      var dense = [];
      for (var i = 0; i < points.length - 1; i++) {
        var p1 = points[i];
        var p2 = points[i+1];
        for (var s = 0; s < stepsPerSegment; s++) {
          var t = s / stepsPerSegment;
          var lat = p1[0] + (p2[0] - p1[0]) * t;
          var lon = p1[1] + (p2[1] - p1[1]) * t;
          dense.push([lat, lon]);
        }
      }
      dense.push(points[points.length - 1]);
      return dense;
    }

    function getDistanceMeters(p1, p2) {
      var R = 6371e3;
      var phi1 = p1[0] * Math.PI / 180;
      var phi2 = p2[0] * Math.PI / 180;
      var deltaPhi = (p2[0] - p1[0]) * Math.PI / 180;
      var deltaLambda = (p2[1] - p1[1]) * Math.PI / 180;
      var a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
              Math.cos(phi1) * Math.cos(phi2) *
              Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    }

    function toggleAdas(checkbox) {
      adasActive = checkbox.checked;
      if (adasActive) {
        addNotification("✅ ADAS Activado", "El sistema de seguridad está funcionando.", "safe");
      } else {
        addNotification("⚠️ ADAS Desactivado", "¡Ten cuidado! El sistema de seguridad está apagado.", "warning");
      }
    }

    function setSimSpeed(speed) {
      simSpeedMultiplier = speed;
      document.getElementById('speed1').classList.remove('active');
      document.getElementById('speed2').classList.remove('active');
      document.getElementById('speed5').classList.remove('active');
      document.getElementById('speed' + speed).classList.add('active');
    }

    function restartSimulation() {
      isCrashed = false;
      document.getElementById('crashOverlay').style.display = 'none';
      carIndex = 0;
      carCurrentSpeed = 1;
      lastNotificationLevel = ""; // Resetear nivel de notificación
      
      // Distribuir tranvías uniformemente al reiniciar
      trams[0].index = 0;
      trams[1].index = Math.floor(trams[1].path.length / 2);
      trams[2].index = 0;
      trams[3].index = Math.floor(trams[3].path.length / 2);
      
      trams.forEach(function(tram) {
        tram.speed = 1;
      });
      carMarker.setLatLng(denseCarPath[0]);
      trams.forEach(function(tram) {
        tram.marker.setLatLng(tram.path[Math.floor(tram.index) % tram.path.length]);
      });
      addNotification("🔄 Simulación Reiniciada", "Todo listo para continuar.", "safe");
    }

    function getSafetyLevel(distance) {
      if (distance > 300) return { level: "safe", badge: "badge-safe", text: "Seguro", speed: 40 };
      if (distance > 200) return { level: "medium-safe", badge: "badge-medium-safe", text: "Medio Seguro", speed: 35 };
      if (distance > 150) return { level: "medium-danger", badge: "badge-medium-danger", text: "Medio Peligroso", speed: 25 };
      if (distance > 100) return { level: "danger", badge: "badge-danger", text: "Peligroso", speed: 15 };
      return { level: "very-danger", badge: "badge-very-danger", text: "Muy Peligroso", speed: 5 };
    }

    // Función para calcular distancia entre dos tranvías en la misma ruta
    function getTramDistance(tram1, tram2, pathLength) {
      var d = Math.abs(tram1.index - tram2.index);
      return Math.min(d, pathLength - d);
    }

    function runSimulationStep() {
      if (isCrashed) return;

      var carPos = denseCarPath[Math.floor(carIndex) % denseCarPath.length];
      var minDistance = Infinity;
      var nearestTram = null;

      // Separar tranvías de la misma ruta
      var idaTrams = trams.filter(function(t) { return t.route === "ida"; });
      var regresoTrams = trams.filter(function(t) { return t.route === "regreso"; });

      // Ajustar velocidades para ida
      idaTrams.forEach(function(tram, i) {
        if (i < idaTrams.length - 1) {
          var nextTram = idaTrams[i + 1];
          var dist = getTramDistance(tram, nextTram, tram.path.length);
          if (dist < MIN_TRAM_DISTANCE) {
            tram.speed = 0; // Frenar si está demasiado cerca del siguiente
          } else if (dist < MIN_TRAM_DISTANCE * 1.5) {
            tram.speed = 0.5; // Reducir velocidad
          } else {
            tram.speed = 1; // Velocidad normal
          }
        }
      });

      // Ajustar velocidades para regreso
      regresoTrams.forEach(function(tram, i) {
        if (i < regresoTrams.length - 1) {
          var nextTram = regresoTrams[i + 1];
          var dist = getTramDistance(tram, nextTram, tram.path.length);
          if (dist < MIN_TRAM_DISTANCE) {
            tram.speed = 0; // Frenar si está demasiado cerca del siguiente
          } else if (dist < MIN_TRAM_DISTANCE * 1.5) {
            tram.speed = 0.5; // Reducir velocidad
          } else {
            tram.speed = 1; // Velocidad normal
          }
        }
      });

      // Mover todos los tranvías con su velocidad ajustada
      trams.forEach(function(tram) {
        tram.index = (tram.index + tram.speed) % tram.path.length;
        var tramPos = tram.path[Math.floor(tram.index)];
        tram.marker.setLatLng(tramPos);
        
        var distance = getDistanceMeters(carPos, tramPos);
        if (distance < minDistance) {
          minDistance = distance;
          nearestTram = tram;
        }
      });

      // Calcular nivel de seguridad
      var safety = getSafetyLevel(minDistance);
      var carSpeed = safety.speed;
      var targetStepSize;

      if (adasActive) {
        if (safety.level === "very-danger") {
          targetStepSize = 0;
          carSpeed = 0;
        } else if (safety.level === "danger") {
          targetStepSize = 0.3;
        } else if (safety.level === "medium-danger") {
          targetStepSize = 0.6;
        } else {
          targetStepSize = 1;
        }
        
        // Deceleración suave del auto
        carCurrentSpeed = carCurrentSpeed + (targetStepSize - carCurrentSpeed) * 0.1;
        
        // Notificaciones solo cuando el nivel cambia o es muy peligroso
        if (safety.level !== lastNotificationLevel) {
          if (safety.level === "very-danger") {
            addNotification("🔴 ¡MUY PELIGROSO!", "Tranvía " + nearestTram.name + " a " + Math.round(minDistance) + "m. ¡Frena YA!", "danger");
          } else if (safety.level === "danger") {
            addNotification("🟠 Peligro", "Tranvía " + nearestTram.name + " acercándose a " + Math.round(minDistance) + "m.", "danger");
          } else if (safety.level === "medium-danger") {
            addNotification("🟡 Precaución", "Tranvía " + nearestTram.name + " detectado a " + Math.round(minDistance) + "m.", "warning");
          } else if (safety.level === "medium-safe") {
            addNotification("🟢 Tranquilo", "El tranvía más cercano está a " + Math.round(minDistance) + "m.", "safe");
          } else if (safety.level === "safe" && lastNotificationLevel !== "safe" && lastNotificationLevel !== "") {
            addNotification("✅ Seguro", "Ya estás a salvo de los tranvías.", "safe");
          }
        }
      } else {
        carCurrentSpeed = 1;
        // ADAS desactivado - chequear colisión
        if (minDistance <= 15) {
          isCrashed = true;
          document.getElementById('crashOverlay').style.display = 'flex';
          document.getElementById('crashMessage').textContent = "Colisión con el tranvía " + nearestTram.name + "!";
          carSpeed = 0;
          carCurrentSpeed = 0;
          addNotification("💥 ¡CHOQUE!", "Has colisionado con " + nearestTram.name, "danger");
        }
      }

      // Actualizar UI
      document.getElementById('uiDistance').innerText = Math.round(minDistance) + "m";
      document.getElementById('uiSafetyStatus').innerHTML = '<span class="alert-badge ' + safety.badge + '">' + safety.text + '</span>';
      document.getElementById('uiCarSpeed').innerText = Math.round(carSpeed * (carCurrentSpeed || 0)) + " km/h";

      // Mover auto con velocidad suave
      var loops = simSpeedMultiplier;
      for (var i = 0; i < loops; i++) {
        carIndex = (carIndex + carCurrentSpeed) % denseCarPath.length;
      }
      carMarker.setLatLng(denseCarPath[Math.floor(carIndex)]);
    }

    window.addEventListener('DOMContentLoaded', loadLeafletCDN);
  </script>
</body>
</html>
`;

export default function LiveMap({ onTramSelect, onStationSelect }: LiveMapProps) {
  // Para la plataforma web (Navegador)
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webContainer}>
        <iframe
          title="Mapa Real e Interactivo de Cuenca"
          srcDoc={MAP_HTML_CONTENT}
          style={styles.iframe}
          sandbox="allow-scripts allow-same-origin allow-images"
          referrerPolicy="no-referrer"
        />
      </View>
    );
  }

  // Para plataformas móviles (Android e iOS) usando WebView
  if (WebView) {
    return (
      <View style={styles.mobileContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: MAP_HTML_CONTENT }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />
      </View>
    );
  }

  // Fallback genérico
  return (
    <View style={styles.fallbackContainer}>
      <Text style={styles.fallbackText}>
        Mapa interactivo no soportado en esta plataforma.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    borderWidth: 0,
    borderRadius: 16,
  },
  mobileContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fallbackContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 20,
  },
  fallbackText: {
    color: '#94A3B8',
    fontSize: 16,
    textAlign: 'center',
  },
});
