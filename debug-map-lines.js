const fs = require('fs');

const src = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

const lines = src.split('\n');

const startIndex = lines.findIndex(line => line.includes('<!-- MAP CARD -->'));
let endIndex = -1;

for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes('class="map-legend"')) {
        // Find the </div> that closes the map card.
        // It's the 2nd </div> after map-legend
        let divCount = 0;
        for(let j = i; j < lines.length; j++) {
            if (lines[j].includes('</div>')) {
                divCount++;
            }
            if (divCount === 2) { // 1 for map-legend, 1 for card
                endIndex = j;
                break;
            }
        }
        break;
    }
}

console.log('Start line:', startIndex);
console.log('End line:', endIndex);

if (startIndex !== -1 && endIndex !== -1) {
    const mapBlock = lines.slice(startIndex + 1, endIndex + 1).join('\n'); // Start from <div class="card">
    console.log('Map block length:', mapBlock.length);
    console.log('Has SVG:', mapBlock.includes('<svg'));
}
