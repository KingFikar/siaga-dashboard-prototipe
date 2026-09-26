const fs = require('fs');
const path = require('path');

const replacements = [
  { match: /PT Freeport Indonesia/gi, replace: 'PT Freeport Indonesia' },
  { match: /PT Freeport Indonesia/g, replace: 'PT FREEPORT INDONESIA' },
  { match: /PT Kaltim Prima Coal/gi, replace: 'PT Kaltim Prima Coal' },
  { match: /PT Kaltim Prima Coal/g, replace: 'PT KALTIM PRIMA COAL' },
  { match: /PT Adaro Indonesia/gi, replace: 'PT Adaro Indonesia' },
  { match: /PT Adaro Indonesia/g, replace: 'PT ADARO INDONESIA' },
  { match: /PT Amman Mineral/gi, replace: 'PT Amman Mineral' },
  { match: /PT Amman Mineral/g, replace: 'PT AMMAN MINERAL' },
  { match: /PT Bukit Asam Tbk/gi, replace: 'PT Bukit Asam Tbk' },
  { match: /PT Vale Indonesia Tbk/gi, replace: 'PT Vale Indonesia Tbk' },
  { match: /PT Bumi Resources Minerals/gi, replace: 'PT Bumi Resources Minerals' },
  { match: /PT Bumi Resources Minerals/gi, replace: 'PT Bumi Resources Minerals' },
  { match: /PT Astra Agro Lestari Tbk/gi, replace: 'PT Astra Agro Lestari Tbk' },
  { match: /PT Pertamina Geothermal/gi, replace: 'PT Pertamina Geothermal' },
  { match: /PT Merdeka Copper Gold Tbk/gi, replace: 'PT Merdeka Copper Gold Tbk' },
  { match: /PT Salim Ivomas Pratama/gi, replace: 'PT Salim Ivomas Pratama' },
];

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let original = content;
      
      for (const rep of replacements) {
        content = content.replace(rep.match, rep.replace);
      }
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated:', fullPath);
      }
    }
  }
}

processDir(__dirname);
console.log('Replacement complete.');
