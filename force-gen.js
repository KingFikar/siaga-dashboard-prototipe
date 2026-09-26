const fs = require('fs');

const pages = [
    { id: 'nav-dashboard', file: 'index.html', title: 'Dashboard', icon: 'ri-dashboard-2-line' },
    { id: 'nav-map', file: 'peta-risiko.html', title: 'Peta Risiko', icon: 'ri-map-2-line' },
    { id: 'nav-companies', file: 'perusahaan.html', title: 'Perusahaan', icon: 'ri-building-2-line' },
    { id: 'nav-alerts', file: 'peringatan.html', title: 'Peringatan', icon: 'ri-alarm-warning-line' },
    { id: 'nav-inspection', file: 'inspeksi.html', title: 'Inspeksi', icon: 'ri-shield-check-line' },
    { id: 'nav-cases', file: 'kasus.html', title: 'Kasus', icon: 'ri-folder-line' },
    { id: 'nav-reports', file: 'laporan.html', title: 'Laporan', icon: 'ri-bar-chart-grouped-line' },
    { id: 'nav-ai', file: 'ai-analytics.html', title: 'AI Analytics', icon: 'ri-sparkling-2-line' },
    { id: 'nav-admin', file: 'administrasi.html', title: 'Administrasi', icon: 'ri-settings-3-line' }
];

let baseHtml = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

pages.forEach(p => {
    // Just in case it has href="#" still, replace it globally
    baseHtml = baseHtml.replace(new RegExp(`href="#" (class="sb-link(?: active)?") id="${p.id}"`, 'g'), `href="${p.file}" $1 id="${p.id}"`);
});

fs.writeFileSync('d:/JOB/SIAGA/TESTING/index.html', baseHtml, 'utf8');

pages.forEach(page => {
    if (page.file === 'index.html') return;

    let pageHtml = baseHtml;
    
    // reset all active
    pageHtml = pageHtml.replace(/class="sb-link active"/g, 'class="sb-link"');
    
    // set target active
    const targetRegex = new RegExp(`class="sb-link" id="${page.id}"`);
    pageHtml = pageHtml.replace(targetRegex, `class="sb-link active" id="${page.id}"`);
    
    // write to dummy file
    fs.writeFileSync(`d:/JOB/SIAGA/TESTING/${page.file}`, pageHtml, 'utf8');
});

console.log('Force rewrite all dummy pages.');
