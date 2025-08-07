// index.js - Conexión a Google Sheets
const SHEET_URL = 'https://spreadsheets.google.com/feeds/list/1k1EBYptoYHVg982yqQdPF9Glt0PJAUZWMW0J-z4ps-4/od6/public/values?alt=json';

const insightsList = document.getElementById('insights-list');
const spinner = document.querySelector('.spinner-container');
const updateBtn = document.getElementById('update-data');

let tempChart;

async function fetchData() {
  showSpinner();

  try {
    const res = await fetch(SHEET_URL);
    if (!res.ok) throw new Error('HTTP ' + res.status);

    const data = await res.json();
    const rows = data.feed.entry || [];

    if (rows.length === 0) throw new Error('No hay datos');

    const last = rows[rows.length - 1];

    // Extraer datos con nombres correctos
    const d = {
      fecha: last.gsx$fecha?.$t || '--',
      temp: last.gsx$temperaturaºc?.$t || '--',
      hum: last.gsx$humedad?.$t || '--',
      pm25: last.gsx$pm2_5_x0020_ug_m3?.$t || '--'
    };

    // Gráfico: últimas 20 temperaturas
    const recent = rows.slice(-20);
    const labels = recent.map(r => (r.gsx$fecha?.$t || '').split(' ')[1].substring(0, 5));
    const temps = recent.map(r => parseFloat(r.gsx$temperaturaºc?.$t)).filter(Boolean);

    const ctx = document.getElementById('tempChart');
    if (ctx && ctx.getContext) {
      if (tempChart) {
        tempChart.data.labels = labels;
        tempChart.data.datasets[0].data = temps;
        tempChart.update();
      } else {
        tempChart = new Chart(ctx.getContext('2d'), {
          type: 'line',
          data: {
            labels,
            datasets: [{
              label: 'Temperatura (°C)',
              data: temps,
              backgroundColor: 'rgba(0,119,204,0.2)',
              borderColor: '#0077cc',
              borderWidth: 2,
              pointBackgroundColor: '#0077cc',
              tension: 0.3
            }]
          },
          options: { responsive: true }
        });
      }
    }

    // Actualizar estado
    insightsList.innerHTML = `
      <li>📅 Última lectura: ${d.fecha}</li>
      <li>🌡️ Temperatura: ${d.temp} °C</li>
      <li>💧 Humedad: ${d.hum} %</li>
      <li>🌫️ PM2.5: ${d.pm25} µg/m³</li>
    `;

  } catch (err) {
    console.error('Error en index.js:', err);
    insightsList.innerHTML = '<li>❌ Error al cargar datos. ¿La hoja está pública?</li>';
  } finally {
    hideSpinner();
  }
}

function showSpinner() {
  if (spinner) spinner.style.display = 'block';
  if (updateBtn) updateBtn.disabled = true;
}

function hideSpinner() {
  if (spinner) spinner.style.display = 'none';
  if (updateBtn) updateBtn.disabled = false;
}

updateBtn?.addEventListener('click', fetchData);
window.addEventListener('load', fetchData);