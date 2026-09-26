const fs = require('fs');
let src = fs.readFileSync('build-pages.js', 'utf8');

const mapStartIdx = src.indexOf('<!-- MAP CARD -->');
const mapStartDiv = src.indexOf('<div class="card">', mapStartIdx);
const chartRowIdx = src.indexOf('<!-- CHARTS ROW -->');
const beforeCharts = src.slice(mapStartDiv, chartRowIdx);
const lastDiv1 = beforeCharts.lastIndexOf('</div>');
const lastDiv2 = beforeCharts.lastIndexOf('</div>', lastDiv1 - 1);
const mapCardHtml = beforeCharts.slice(0, lastDiv2 + 6);

console.log('Ends with:');
console.log(mapCardHtml.slice(-150));
