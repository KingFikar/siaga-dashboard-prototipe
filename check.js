const fs = require('fs');
const http = require('http');

const HTML = fs.readFileSync('D:/JOB/SIAGA/TESTING/index.html', 'utf8');
const CSS  = fs.readFileSync('D:/JOB/SIAGA/TESTING/style.css', 'utf8');
const JS   = fs.readFileSync('D:/JOB/SIAGA/TESTING/app.js', 'utf8');

let chartFound = 0, sparkFound = 0, geojsonFound = 0;
const chartRegex = /id="chart(Distribusi|Tren)"/g;
let m;
while ((m = chartRegex.exec(HTML)) !== null) chartFound++;
const sparkRegex = /id="spark-\w+"/g;
while ((m = sparkRegex.exec(HTML)) !== null) sparkFound++;
if (HTML.includes('id="geojson-data"')) geojsonFound++;
console.log('Chart canvases:', chartFound);
console.log('Spark canvases:', sparkFound);
console.log('GeoJSON embedded:', geojsonFound);
console.log('app.js loaded:', JS.length, 'bytes');
console.log('CSS has chart-area canvas rule:', CSS.includes('.chart-area canvas'));

const chartAreaMatch = CSS.match(/\.chart-area\s*\{[^}]+\}/);
console.log('chart-area CSS block:');
console.log(chartAreaMatch ? chartAreaMatch[0] : '(not found)');
