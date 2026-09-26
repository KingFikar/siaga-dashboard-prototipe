const fs = require('fs');
let src = fs.readFileSync('index.html', 'utf8');

// Find a good place to insert the menu, e.g. before "AI Analytics" or after "Laporan"
const searchStr = '<a href="ai-analytics.html" class="sb-link" id="nav-ai">';
const insertIdx = src.indexOf(searchStr);

if (insertIdx !== -1) {
    const newItem = `
            <a href="data-integration.html" class="sb-link" id="nav-integration">
                <i class="ri-git-merge-line"></i> Data Integration
            </a>`;
    src = src.slice(0, insertIdx) + newItem + src.slice(insertIdx);
    fs.writeFileSync('index.html', src, 'utf8');
    console.log('Successfully added Data Integration menu to index.html');
} else {
    console.log('Failed to find AI Analytics menu item');
}
