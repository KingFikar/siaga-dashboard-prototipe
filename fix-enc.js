const fs = require('fs');
let content = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

// Fix mojibake
content = content.replace(/â€”/g, '—'); // em dash
content = content.replace(/â€¦/g, '…'); // ellipsis
content = content.replace(/â€"/g, '—'); // sometimes em dash
content = content.replace(/â•/g, '═');
content = content.replace(/â"€/g, '─');

fs.writeFileSync('d:/JOB/SIAGA/TESTING/index.html', content, 'utf8');
console.log('Fixed encoding');
