// analysis.js - Todos los gráficos
const SHEET_URL = 'https://spreadsheets.google.com/feeds/list/1k1EBYptoYHVg982yqQdPF9Glt0PJAUZWMW0J-z4ps-4/od6/public/values?alt=json';
const spinner = document.querySelector('.spinner-container');

function createChart(canvasId, label, data, color) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return;
  if (Chart.getChart(ctx)) Chart.getChart(ctx).destroy();

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: data.labels,
      datasets: [{
        label: label,
        data: data.data,
        backgroundColor: `rgba(${color}, 0.2)`,
        borderColor: `rgb(${color})`,
        borderWidth: 2,
        pointBackgroundColor: `rgb(${color})`,
        tension: 0.3
      }]
    },
    options: { responsive: true }
  });
}

async function loadAllCharts() {
  if (spinner) spinner.style.display = 'block';

  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) throw new Error('Red');

    const data = await res.json();
    const rows = data.feed.entry || [];
    if (rows.length === 0) throw new Error('No hay datos');

    const recent = rows.slice(-20);
    const labels = recent.map(r => (r.gsx$fecha?.$t || '').split(' ')[1].substring(0, 5));

    const tempData = extractData(recent, 'gsx$temperaturaºc');
    const humData = extractData(recent, 'gsx$humedad');
    const presData = extractData(recent, 'gsx$presión');
    const altData = extractData(recent, 'gsx$altitude');
    const pm25Data = extractData(recent, 'gsx$pm2_5_x0020_ug_m3');
    const pm10Data = extractData(recent, 'gsx$pm10_x0020_ug_m3');
    const windSpeedData = extractData(recent, 'gsx$wind_speed');
    const gasData = extractData(recent, 'gsx$gas');
    const rainData = extractData(recent, 'gsx$lluvia');

    createChart('chart-temp', 'Temperatura (°C)', { labels, data: tempData }, '0,119,204');
    createChart('chart-hum', 'Humedad (%)', { labels, data: humData }, '30,144,226');
    createChart('chart-pres', 'Presión (hPa)', { labels, data: presData }, '75,0,130');
    createChart('chart-alt', 'Altitud (m)', { labels, data: altData }, '138,43,226');
    createChart('chart-pm25', 'PM2.5 (µg/m³)', { labels, data: pm25Data }, '255,99,132');
    createChart('chart-pm10', 'PM10 (µg/m³)', { labels, data: pm10Data }, '54,162,235');
    createChart('chart-wind-speed', 'Velocidad (km/h)', { labels, data: windSpeedData }, '75,192,192');
    createChart('chart-gas', '% Gas', { labels, data: gasData }, '255,159,64');
    createChart('chart-rain', '% Lluvia', { labels, data: rainData }, '153,102,255');

  } catch (err) {
    console.error('Error en analysis.js:', err);
    const container = document.querySelector('main');
    container.innerHTML = `<p style="color: red; text-align: center; margin: 2rem;">❌ Error: ${err.message}</p>`;
  } finally {
    if (spinner) spinner.style.display = 'none';
  }
}

function extractData(rows, field) {
  return rows
    .map(r => r[field]?.$t)
    .filter(Boolean)
    .map(v => parseFloat(v) || 0);
}

window.addEventListener('load', loadAllCharts);