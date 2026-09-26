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

// First, fix the hrefs in the base template so they point to the correct files
pages.forEach(p => {
    const regex = new RegExp(`href="#" (class="sb-link(?: active)?") id="${p.id}"`);
    baseHtml = baseHtml.replace(regex, `href="${p.file}" $1 id="${p.id}"`);
});

// Write the updated index.html
fs.writeFileSync('d:/JOB/SIAGA/TESTING/index.html', baseHtml, 'utf8');

// For other pages, we will replace the .page-content area with dummy content
// and update the active class on the sidebar
pages.forEach(page => {
    if (page.file === 'index.html') return; // We keep index.html as the full dashboard

    let pageHtml = baseHtml;
    
    // Remove "active" from nav-dashboard
    pageHtml = pageHtml.replace('class="sb-link active" id="nav-dashboard"', 'class="sb-link" id="nav-dashboard"');
    
    // Add "active" to the current page's nav item
    const targetRegex = new RegExp(`class="sb-link" id="${page.id}"`);
    pageHtml = pageHtml.replace(targetRegex, `class="sb-link active" id="${page.id}"`);
    
    // Update the breadcrumb/title
    pageHtml = pageHtml.replace('<h1 class="tb-title">Dashboard Pemantauan</h1>', `<h1 class="tb-title">${page.title}</h1>`);
    pageHtml = pageHtml.replace('<span class="active">Dashboard</span>', `<span class="active">${page.title}</span>`);
    
    // Replace everything inside <div class="page-content">...</div> with a dummy presentation view
    const pageContentStart = pageHtml.indexOf('<div class="page-content">');
    const pageFooterStart = pageHtml.indexOf('<footer class="page-footer">');
    
    const dummyContent = `
        <div class="page-content" style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 70vh; text-align: center;">
            <div style="font-size: 80px; color: var(--primary-soft); margin-bottom: 20px;">
                <i class="${page.icon}" style="color: var(--primary);"></i>
            </div>
            <h2 style="font-size: 28px; font-weight: 800; color: var(--text-1); margin-bottom: 12px;">Halaman ${page.title}</h2>
            <p style="font-size: 15px; color: var(--text-3); max-width: 500px; line-height: 1.6;">
                Ini adalah halaman *dummy* untuk presentasi prototipe antarmuka SIAGA Command Center. Konten sebenarnya untuk modul <b>${page.title}</b> sedang dalam tahap pengembangan.
            </p>
        </div>
            `;
            
    if (pageContentStart !== -1 && pageFooterStart !== -1) {
        pageHtml = pageHtml.substring(0, pageContentStart) + dummyContent + pageHtml.substring(pageFooterStart);
    }
    
    fs.writeFileSync(`d:/JOB/SIAGA/TESTING/${page.file}`, pageHtml, 'utf8');
});

console.log('Dummy pages created successfully!');
