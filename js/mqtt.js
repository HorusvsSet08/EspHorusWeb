// mqtt.js - Conexión MQTT
const HOST = 'broker.hivemq.com';
const PORT = 8083; // WebSocket
const CLIENT_ID = 'web-client-' + Math.random().toString(16).substr(2, 8);
const CLIENT = new Paho.MQTT.Client(HOST, PORT, '/mqtt', CLIENT_ID);

// Topics (coinciden con tu Arduino)
const TOPICS = {
  temp: 'horus/vvb/temperatura',
  hum: 'horus/vvb/humedad',
  pres: 'horus/vvb/presion',
  alt: 'horus/vvb/altitud',
  pm25: 'horus/vvb/pm25',
  pm10: 'horus/vvb/pm10',
  windDir: 'horus/vvb/wind_direction',
  windSpeed: 'horus/vvb/wind_speed',
  gas: 'horus/vvb/gas',
  lluvia: 'horus/vvb/lluvia'
};

// Elementos del DOM
const els = {
  temp: document.getElementById('mqtt-temp'),
  hum: document.getElementById('mqtt-hum'),
  pres: document.getElementById('mqtt-pres'),
  pm25: document.getElementById('mqtt-pm25'),
  pm10: document.getElementById('mqtt-pm10'),
  windDir: document.getElementById('mqtt-wind-dir'),
  windSpeed: document.getElementById('mqtt-wind-speed'),
  gas: document.getElementById('mqtt-gas'),
  lluvia: document.getElementById('mqtt-lluvia'),
  status: document.getElementById('mqtt-status'),
  spinner: document.querySelector('.spinner-container'),
  btn: document.getElementById('mqtt-connect')
};

// Funciones de utilidad
function updateValue(el, value, unit = '') {
  if (el) el.textContent = `${value} ${unit}`.trim();
}

function setStatus(text, color = 'black') {
  if (els.status) {
    els.status.textContent = text;
    els.status.style.color = color;
  }
}

function showSpinner() {
  if (els.spinner) els.spinner.style.display = 'block';
}

function hideSpinner() {
  if (els.spinner) els.spinner.style.display = 'none';
}

// Conectar
function connectMQTT() {
  showSpinner();
  setStatus('Conectando...', 'orange');

  try {
    CLIENT.connect({
      onSuccess: () => {
        setStatus('✅ Conectado', 'lightgreen');
        hideSpinner();
        Object.values(TOPICS).forEach(topic => CLIENT.subscribe(topic));
      },
      onFailure: (error) => {
        setStatus(`❌ Error: ${error.errorMessage}`, 'red');
        hideSpinner();
      },
      useSSL: false
    });
  } catch (err) {
    setStatus(`❌ Excepción: ${err.message}`, 'red');
    hideSpinner();
  }
}

// Manejar mensajes
CLIENT.onMessageArrived = (message) => {
  const topic = message.destinationName;
  const payload = message.payloadString.trim();

  switch (topic) {
    case TOPICS.temp: updateValue(els.temp, payload, '°C'); break;
    case TOPICS.hum: updateValue(els.hum, payload, '%'); break;
    case TOPICS.pres: updateValue(els.pres, payload, 'hPa'); break;
    case TOPICS.pm25: updateValue(els.pm25, payload, 'µg/m³'); break;
    case TOPICS.pm10: updateValue(els.pm10, payload, 'µg/m³'); break;
    case TOPICS.windDir: updateValue(els.windDir, payload); break;
    case TOPICS.windSpeed: updateValue(els.windSpeed, payload, 'km/h'); break;
    case TOPICS.gas: updateValue(els.gas, payload, '%'); break;
    case TOPICS.lluvia: updateValue(els.lluvia, payload, '%'); break;
  }
};

// Manejar desconexión
CLIENT.onConnectionLost = (responseObject) => {
  if (responseObject.errorCode !== 0) {
    setStatus('⚠️ Desconectado', 'orange');
  }
};

// Evento del botón
els.btn?.addEventListener('click', connectMQTT);