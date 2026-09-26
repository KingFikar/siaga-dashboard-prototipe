const fs = require('fs');
const src = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

const mapCommentIdx = src.indexOf('<!-- MAP CARD -->');
console.log('MAP CARD comment at:', mapCommentIdx);

const cardStr = '<div class="card">';
const cardDiv = src.lastIndexOf(cardStr, mapCommentIdx);
console.log('Card div at:', cardDiv);

const mapLegendStr = 'class="map-legend"';
const mapLegendStart = src.indexOf(mapLegendStr, cardDiv);
const mapLegendDivOpen = src.lastIndexOf('<div', mapLegendStart);
console.log('map-legend div at:', mapLegendDivOpen);

// Close the map-legend div
const afterMapLegendClose = src.indexOf('</div>', mapLegendDivOpen) + 6;
console.log('After map-legend close:', afterMapLegendClose);
console.log('Snippet:', JSON.stringify(src.slice(afterMapLegendClose, afterMapLegendClose + 80)));

// Then the next </div> closes the card
const cardClose = src.indexOf('</div>', afterMapLegendClose) + 6;
console.log('Card close at:', cardClose);
console.log('After card:', JSON.stringify(src.slice(cardClose, cardClose + 80)));

const mapBlock = src.slice(cardDiv, cardClose);
console.log('Map block length:', mapBlock.length);
console.log('Has SVG:', mapBlock.includes('<svg'));
console.log('Has province-layer:', mapBlock.includes('province-layer'));
