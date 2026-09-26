const fs = require('fs');
let src = fs.readFileSync('build-pages.js', 'utf8');

const mapExtractor = `
/* ─── Ekstrak MAP CARD HTML (Robust) ─── */
const mapStartIdx = src.indexOf('<!-- MAP CARD -->');
const mapStartDiv = src.indexOf('<div class="card">', mapStartIdx);
const chartRowIdx = src.indexOf('<!-- CHARTS ROW -->');
const beforeCharts = src.slice(mapStartDiv, chartRowIdx);
const lastDiv1 = beforeCharts.lastIndexOf('</div>');
const lastDiv2 = beforeCharts.lastIndexOf('</div>', lastDiv1 - 1);
const mapCardHtml = beforeCharts.slice(0, lastDiv2 + 6);
`;

const replaceStart = src.indexOf('/* ─── Ekstrak MAP CARD HTML ─── */');
const replaceEnd = src.indexOf('function buildSidebar');

src = src.slice(0, replaceStart) + mapExtractor + '\n' + src.slice(replaceEnd);
fs.writeFileSync('build-pages.js', src, 'utf8');
console.log('Fixed build-pages.js mapCardHtml extraction');
