const fs = require('fs');
const html = fs.readFileSync('peta-risiko.html', 'utf8');

const opens = (html.match(/<div/g) || []).length;
const closes = (html.match(/<\/div>/g) || []).length;
console.log('Opens:', opens, 'Closes:', closes, 'Diff:', opens - closes);

console.log('Has main-grid:', html.includes('class="main-grid"'));
console.log('Has col-left:', html.includes('class="col-left"'));
console.log('Has col-right:', html.includes('class="col-right"'));
console.log('Has map-wrap:', html.includes('class="map-wrap"'));
console.log('Has svg map:', html.includes('id="indonesia-svg"'));
