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
      border-radius: 12px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    /* Panel de Control Estilo Glassmorphism Premium */
    .control-panel {
      position: absolute;
      top: 16px;
      left: 16px;
      z-index: 1000;
      background: rgba(15, 23, 42, 0.85); /* Slate 900 oscuro */
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 18px;
      box-shadow: 0 12px 40px 0 rgba(0, 0, 0, 0.4);
      width: 300px;
      color: #F8FAFC;
      transition: all 0.3s ease;
      display: none; /* Se muestra sólo cuando carga Leaflet */
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
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-safe {
      background-color: rgba(34, 197, 94, 0.2);
      color: #4ADE80;
      border: 1px solid rgba(34, 197, 94, 0.3);
    }

    .badge-warn {
      background-color: rgba(234, 179, 8, 0.2);
      color: #FACC15;
      border: 1px solid rgba(234, 179, 8, 0.3);
      animation: pulse 1.5s infinite;
    }

    .badge-danger {
      background-color: rgba(239, 68, 68, 0.2);
      color: #FCA5A5;
      border: 1px solid rgba(239, 68, 68, 0.3);
      animation: pulse-fast 0.8s infinite;
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
      background-color: #EF4444; /* Rojo desactivado (Peligro) */
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
      background-color: #22C55E; /* Verde activado (Seguro) */
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

    /* Custom Leaflet Marker Styles */
    .leaflet-div-icon {
      background: none;
      border: none;
    }

    .marker-label {
      background: #0F172A;
      color: white;
      font-size: 10px;
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
      width: 32px;
      height: 32px;
      background-color: #8B0000;
      border: 2.5px solid #FFD700;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(139, 0, 0, 0.5);
      color: white;
      font-size: 14px;
      font-weight: bold;
    }

    .car-icon-inner {
      width: 28px;
      height: 28px;
      background-color: #1E3A8A;
      border: 2px solid #60A5FA;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 10px rgba(30, 58, 138, 0.5);
      color: white;
      font-size: 12px;
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
    <div style="font-size: 20px; margin-bottom: 10px;">🍃</div>
    Cargando Mapa de Cuenca...
  </div>

  <!-- Superposición de Choque -->
  <div class="crash-overlay" id="crashOverlay">
    <div class="crash-card">
      <h1>💥 CHOQUE!</h1>
      <p>Colisión crítica detectada en el cruce de la Chola Cuencana. Vehículo particular invadió vía del tranvía sin sistema ADAS.</p>
      <button class="btn" onclick="restartSimulation()">Reiniciar Simulación</button>
    </div>
  </div>

  <!-- Panel de Control Premium -->
  <div class="control-panel" id="controlPanel">
    <div class="panel-title">
      <span>🚊 Seguridad Vial Cuenca</span>
    </div>
    <div class="panel-subtitle">Monitoreo y Simulación Anti-Choque</div>
    
    <div class="telemetry-row">
      <span class="telemetry-label">Distancia entre Vehículos</span>
      <span class="telemetry-value" id="uiDistance">Calculando...</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">Estado de Seguridad</span>
      <span id="uiSafetyStatus"><span class="alert-badge badge-safe">Seguro</span></span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">Velocidad Tranvía</span>
      <span class="telemetry-value" id="uiTramSpeed">30 km/h</span>
    </div>
    <div class="telemetry-row">
      <span class="telemetry-label">Velocidad Automóvil</span>
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

    <!-- Botón Reiniciar -->
    <button class="btn" onclick="restartSimulation()">Reiniciar Recorrido</button>
  </div>

  <div id="map"></div>

  <!-- Leaflet Map Script / Sistema Anti-Colisión -->
  <script>
    // Variables de simulación globales
    var adasActive = true;
    var simSpeedMultiplier = 1;
    var isCrashed = false;
    
    var tramIndex = 0;
    var carIndex = 0;
    
    var denseTramPath = [];
    var denseCarPath = [];
    
    var tramMarker = null;
    var carMarker = null;
    var map = null;

    // CDNs disponibles para cargar Leaflet de manera robusta
    var scriptLoadAttempts = 0;
    var cdns = [
      { js: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js", css: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css" },
      { js: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js", css: "https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css" },
      { js: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js", css: "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" }
    ];

    // Cargar dinámicamente Leaflet con tolerancias a fallos de red
    function loadLeafletCDN() {
      if (scriptLoadAttempts >= cdns.length) {
        document.getElementById('loadingIndicator').innerHTML = "❌ Error al cargar el mapa. Verifica tu conexión.";
        return;
      }

      var cdn = cdns[scriptLoadAttempts];
      scriptLoadAttempts++;

      console.log("Intentando cargar Leaflet desde CDN " + scriptLoadAttempts + ": " + cdn.js);

      // Cargar CSS
      document.getElementById('leaflet-css').href = cdn.css;

      // Cargar JS
      var script = document.createElement('script');
      script.src = cdn.js;
      script.async = true;
      script.onload = function() {
        console.log("Leaflet JS cargado con éxito.");
        checkAndStart();
      };
      script.onerror = function() {
        console.warn("Fallo carga de CDN " + scriptLoadAttempts + ", reintentando con el siguiente...");
        loadLeafletCDN();
      };
      document.head.appendChild(script);
    }

    function checkAndStart() {
      if (typeof L !== 'undefined') {
        // Ocultar cargador e iniciar
        document.getElementById('loadingIndicator').style.display = 'none';
        document.getElementById('controlPanel').style.display = 'block';
        initializeSimulation();
      } else {
        setTimeout(checkAndStart, 100);
      }
    }

    // Inicializar simulación una vez cargada la librería
    function initializeSimulation() {
      // 1. Inicializar el mapa en Cuenca, Ecuador
      map = L.map('map', {
        zoomControl: false
      }).setView([-2.8974, -79.0045], 14.5);

      // 2. Agregar tiles premium
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // Coordenadas reales del Tranvía de Cuenca
      var tramRoutePoints = [
        [-2.9238, -79.0345], // Estación Control Sur
        [-2.9158, -79.0282], 
        [-2.9062, -79.0205], // Estación El Arenal
        [-2.9018, -79.0160], 
        [-2.8988, -79.0118], // Estación El Ejido
        [-2.8948, -79.0042], 
        [-2.8912, -78.9972], // Intersección Chola Cuencana
        [-2.8852, -78.9912], 
        [-2.8805, -78.9868]  // Estación Parque Industrial
      ];

      var stations = [
        { name: "Control Sur", latlng: [-2.9238, -79.0345] },
        { name: "El Arenal", latlng: [-2.9062, -79.0205] },
        { name: "El Ejido", latlng: [-2.8988, -79.0118] },
        { name: "Chola Cuencana", latlng: [-2.8912, -78.9972] },
        { name: "Parque Industrial", latlng: [-2.8805, -78.9868] }
      ];

      // Trazar vías
      L.polyline(tramRoutePoints, {
        color: '#8B0000',
        weight: 5,
        opacity: 0.8,
        dashArray: '8, 6'
      }).addTo(map);

      // Estaciones
      stations.forEach(function(station) {
        var stationIcon = L.divIcon({
          className: 'custom-station-icon',
          html: '<div class="station-marker-inner"></div>',
          iconSize: [12, 12]
        });
        L.marker(station.latlng, { icon: stationIcon })
          .addTo(map)
          .bindPopup("<b>Estación: " + station.name + "</b>");
      });

      // Trayectoria del Automóvil
      var carRoutePoints = [
        [-2.8990, -78.9972], // Inicio Av. Huayna Cápac (Sur)
        [-2.8950, -78.9972],
        [-2.8912, -78.9972], // Cruce Chola Cuencana
        [-2.8870, -78.9972],
        [-2.8830, -78.9972]  // Fin Av. Huayna Cápac (Norte)
      ];

      // Trazar línea carro
      L.polyline(carRoutePoints, {
        color: '#1E3A8A',
        weight: 3,
        opacity: 0.4,
        dashArray: '4, 4'
      }).addTo(map);

      // Interpolación lineal
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

      denseTramPath = interpolateDensePoints(tramRoutePoints, 120);
      denseCarPath = interpolateDensePoints(carRoutePoints, 180);

      // Crear marcadores
      var tramIcon = L.divIcon({
        className: 'custom-icon',
        html: '<div class="marker-label">🚊 Tranvía T-01</div><div class="tram-icon-inner">T</div>',
        iconSize: [32, 32]
      });
      tramMarker = L.marker(denseTramPath[0], { icon: tramIcon }).addTo(map);

      var carIcon = L.divIcon({
        className: 'custom-icon',
        html: '<div class="marker-label">🚗 Automóvil</div><div class="car-icon-inner">🚗</div>',
        iconSize: [28, 28]
      });
      carMarker = L.marker(denseCarPath[0], { icon: carIcon }).addTo(map);

      // Iniciar el intervalo del bucle físico de simulación
      setInterval(runSimulationStep, 60);
    }

    // Fórmula Haversine
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
    }

    function setSimSpeed(speed) {
      simSpeedMultiplier = speed;
      document.getElementById('speed1').classList.remove('active');
      document.getElementById('speed2').classList.remove('active');
      document.getElementById('speed5').classList.remove('active');
      document.getElementById('speed' + speed).classList.add('active');
    }

    function restartSimulation() {
      tramIndex = 0;
      carIndex = 0;
      isCrashed = false;
      document.getElementById('crashOverlay').style.display = 'none';
      tramMarker.setLatLng(denseTramPath[0]);
      carMarker.setLatLng(denseCarPath[0]);
    }

    // Bucle físico anti-choque
    function runSimulationStep() {
      if (isCrashed) return;

      var tramPos = denseTramPath[tramIndex];
      var carPos = denseCarPath[carIndex];

      var distance = getDistanceMeters(tramPos, carPos);
      document.getElementById('uiDistance').innerText = Math.round(distance) + " metros";

      var carStepSize = 1;
      var carCurrentSpeed = 40;
      
      if (adasActive) {
        if (distance <= 55) {
          carStepSize = 0;
          carCurrentSpeed = 0;
          document.getElementById('uiSafetyStatus').innerHTML = '<span class="alert-badge badge-danger">Frenado ADAS Activo</span>';
        } else if (distance <= 120) {
          carStepSize = 0.3;
          carCurrentSpeed = 15;
          document.getElementById('uiSafetyStatus').innerHTML = '<span class="alert-badge badge-warn">Precaución ADAS</span>';
        } else {
          document.getElementById('uiSafetyStatus').innerHTML = '<span class="alert-badge badge-safe">Sistema Seguro</span>';
        }
      } else {
        document.getElementById('uiSafetyStatus').innerHTML = '<span class="alert-badge badge-warn" style="background-color: rgba(239, 68, 68, 0.2); color:#EF4444; border:1px solid #EF4444;">ADAS Desactivado</span>';
        
        if (distance <= 12) {
          isCrashed = true;
          document.getElementById('crashOverlay').style.display = 'flex';
          document.getElementById('uiCarSpeed').innerText = "0 km/h (Colisión)";
          document.getElementById('uiTramSpeed').innerText = "0 km/h (Colisión)";
          return;
        }
      }

      document.getElementById('uiCarSpeed').innerText = carCurrentSpeed + " km/h";
      document.getElementById('uiTramSpeed').innerText = (tramIndex === denseTramPath.length - 1 ? 0 : 30) + " km/h";

      var loops = simSpeedMultiplier;
      for (var l = 0; l < loops; l++) {
        if (tramIndex < denseTramPath.length - 1) {
          tramIndex++;
        } else {
          tramIndex = 0;
        }

        if (carIndex < denseCarPath.length - 1) {
          carIndex += carStepSize;
          if (carIndex >= denseCarPath.length) carIndex = denseCarPath.length - 1;
        } else {
          carIndex = 0;
        }
      }

      tramMarker.setLatLng(denseTramPath[Math.floor(tramIndex)]);
      carMarker.setLatLng(denseCarPath[Math.floor(carIndex)]);
    }

    // Iniciar carga del script Leaflet
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
          sandbox="allow-scripts allow-same-origin"
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

  // Fallback genérico en caso de que WebView falle
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