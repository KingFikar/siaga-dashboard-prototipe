const fs = require('fs');

const src = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

/* ─── Ekstrak Sidebar ─── */
const asideStart = src.indexOf('<aside class="sidebar"');
const asideEnd   = src.indexOf('</aside>') + '</aside>'.length;
const sidebarHtml = src.slice(asideStart, asideEnd);

/* ─── Ekstrak GeoJSON ─── */
const geoTagOpen  = '<script type="application/json" id="geojson-data">';
const geoTagClose = '</script>';
const geoStart    = src.indexOf(geoTagOpen);
const geoEnd      = src.indexOf(geoTagClose, geoStart) + geoTagClose.length;
const geoJsonScript = src.slice(geoStart, geoEnd);

/* ─── Ekstrak MAP CARD — dari line 224 sampai 352 (tag "</div>" sebelum <!-- CHARTS ROW -->) ─── */
const mapCardStart = src.indexOf('<!-- MAP CARD -->');
const chartsRowIdx = src.indexOf('<!-- CHARTS ROW -->');
// mapCardHtml = dari <div class="card"> sampai </div> sebelum <!-- CHARTS ROW -->
const mapDivStart = src.indexOf('<div class="card">', mapCardStart);
// Find the </div> that closes the map card — it's 2 closing divs before CHARTS ROW
// We strip trailing whitespace and get the last </div> that ends map card
let mapSection = src.slice(mapDivStart, chartsRowIdx).trimEnd();
// Remove trailing whitespace lines
while (mapSection.endsWith('\r') || mapSection.endsWith('\n') || mapSection.endsWith(' ')) {
    mapSection = mapSection.slice(0, -1);
}
// The section ends with: </div>\n</div> (map-legend </div> then card </div>)
// It should end correctly. Let's verify:
const mapCardHtml = mapSection;

function buildSidebar(activeLinkId) {
    let sb = sidebarHtml.replace(/class="sb-link active"/g, 'class="sb-link"');
    sb = sb.replace(
        new RegExp(`class="sb-link" id="${activeLinkId}"`),
        `class="sb-link active" id="${activeLinkId}"`
    );
    return sb;
}

function buildHead(pageTitle, includeGeoJson = false) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIAGA Command Center — ${pageTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=31">
    ${includeGeoJson ? geoJsonScript : ''}
</head>
<body>
<div class="app-shell">`;
}

function buildTopbar(pageTitle, breadcrumb) {
    return `
        <div class="main-col">
            <header class="topbar">
                <div class="tb-left">
                    <div class="tb-page-info">
                        <h1 class="tb-title">${pageTitle}</h1>
                        <nav class="tb-breadcrumb" aria-label="breadcrumb">
                            <i class="ri-home-4-line"></i>
                            <span>Beranda</span>
                            <i class="ri-arrow-right-s-line"></i>
                            <span class="active">${breadcrumb}</span>
                        </nav>
                    </div>
                </div>
                <div class="tb-right">
                    <div class="tb-live"><span class="live-dot"></span>LIVE &mdash; 25 Sep 2026, 23:22 WIB</div>
                    <div class="tb-search">
                        <i class="ri-search-line"></i>
                        <input type="text" placeholder="Cari perusahaan, wilayah, kasus…" id="global-search">
                        <kbd>Ctrl K</kbd>
                    </div>
                    <button class="tb-icon-btn" id="notif-btn" aria-label="Notifikasi">
                        <i class="ri-notification-3-line"></i><span class="notif-bubble">7</span>
                    </button>
                    <button class="tb-icon-btn" aria-label="Pesan"><i class="ri-mail-line"></i></button>
                    <div class="tb-divider"></div>
                    <div class="tb-profile" role="button" tabindex="0">
                        <div class="tb-profile-ava">AD</div>
                        <div class="tb-profile-meta">
                            <div class="tb-profile-name">Admin Sistem</div>
                            <div class="tb-profile-role">Super Admin</div>
                        </div>
                        <i class="ri-arrow-down-s-line"></i>
                    </div>
                </div>
            </header>
            <div class="page-content">`;
}

function buildFooter(includeAppJs = false) {
    return `
            </div><!-- /page-content -->
            <footer class="page-footer">
                <div class="footer-left">
                    <span class="footer-logo"><i class="ri-radar-line"></i> SIAGA</span>
                    <span class="footer-sep">|</span>
                    <span>Platform Pemantauan Lingkungan dan Manajemen Risiko</span>
                    <span class="footer-sep">|</span>
                    <span>Kementerian Lingkungan Hidup dan Kehutanan RI &copy; 2026</span>
                </div>
                <div class="footer-right">
                    <span>v2.4.1-stable</span>
                    <span class="footer-sep">|</span>
                    <span class="footer-status"><span class="footer-dot"></span>Sistem Aktif</span>
                </div>
            </footer>
        </div><!-- /main-col -->
    </div><!-- /app-shell -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.3/dist/chart.umd.min.js"></script>
    ${includeAppJs ? '<script src="app.js?v=31"></script>' : ''}
</body>
</html>`;
}

/* ═══════════════════════════════════
   PETA RISIKO
   ═══════════════════════════════════ */
const petaContent = `
    <div class="kpi-grid">
        <div class="kpi-card red" id="kpi-pr-tinggi"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-fire-line"></i></div><div class="kpi-body"><div class="kpi-val">127</div><div class="kpi-lbl">Zona Risiko Tinggi</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+8 minggu ini</span></div></div></div>
        <div class="kpi-card amber" id="kpi-pr-sedang"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-alert-line"></i></div><div class="kpi-body"><div class="kpi-val">485</div><div class="kpi-lbl">Zona Risiko Sedang</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta flat"><i class="ri-checkbox-blank-circle-fill"></i>Stabil</span></div></div></div>
        <div class="kpi-card indigo" id="kpi-pr-rendah"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-leaf-line"></i></div><div class="kpi-body"><div class="kpi-val">1.841</div><div class="kpi-lbl">Zona Risiko Rendah</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta down"><i class="ri-arrow-down-s-fill"></i>-12 bulan ini</span></div></div></div>
        <div class="kpi-card violet" id="kpi-pr-provinsi"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-map-pin-line"></i></div><div class="kpi-body"><div class="kpi-val">34</div><div class="kpi-lbl">Provinsi Dipantau</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta flat"><i class="ri-checkbox-blank-circle-fill"></i>Seluruh Indonesia</span></div></div></div>
    </div>

    <div class="main-grid">
        <div class="col-left">
            ${mapCardHtml}
            <div class="card" style="overflow:hidden">
                <div class="card-header"><span class="ch-title"><i class="ri-list-ordered"></i>Hotspot Risiko Tertinggi</span></div>
                ${[['PT Freeport Indonesia','Kab. Kutai Timur, Kaltim','92','danger'],['PT Kaltim Prima Coal','Kota Cilegon, Banten','84','danger'],['PT Adaro Indonesia','Kab. Morowali, Sulteng','76','warning'],['PT Bukit Asam Tbk','Kab. Berau, Kaltim','71','warning'],['PT Vale Indonesia Tbk','Kab. Konawe, Sultra','68','warning'],['PT Bumi Resources Minerals','Kab. Gresik, Jatim','61','warning']].map((r,i)=>`
                <div style="display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border-soft)">
                    <span style="width:22px;height:22px;border-radius:6px;background:${i<2?'var(--danger-soft)':'var(--warning-soft)'};color:${i<2?'var(--danger-2)':'var(--warning-2)'};display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0">${i+1}</span>
                    <div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r[0]}</div><div style="font-size:10.5px;color:var(--text-4);margin-top:2px"><i class="ri-map-pin-line"></i> ${r[1]}</div></div>
                    <span style="font-size:16px;font-weight:800;color:var(--${r[3]}-2)">${r[2]}</span>
                </div>`).join('')}
            </div>
        </div>
        <div class="col-right">
            <div class="card">
                <div class="card-header"><span class="ch-title"><i class="ri-filter-3-line"></i> Filter Peta</span></div>
                <div style="padding:16px;display:flex;flex-direction:column;gap:14px">
                    <div>
                        <label style="font-size:11.5px;color:var(--text-3);font-weight:600;display:block;margin-bottom:6px">Sektor Industri</label>
                        <select style="width:100%;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-size:12.5px;color:var(--text-1);outline:none">
                            <option>Semua Sektor</option><option>Pertambangan</option><option>Petrokimia</option><option>Perkebunan</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:11.5px;color:var(--text-3);font-weight:600;display:block;margin-bottom:6px">Level Risiko</label>
                        <select style="width:100%;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-size:12.5px;color:var(--text-1);outline:none">
                            <option>Semua Level</option><option>Tinggi (≥75)</option><option>Sedang (50–74)</option><option>Rendah (&lt;50)</option>
                        </select>
                    </div>
                    <div>
                        <label style="font-size:11.5px;color:var(--text-3);font-weight:600;display:block;margin-bottom:6px">Provinsi</label>
                        <select style="width:100%;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-size:12.5px;color:var(--text-1);outline:none">
                            <option>Semua Provinsi</option><option>Kalimantan Timur</option><option>Jawa Timur</option><option>Sulawesi Tengah</option><option>Riau</option>
                        </select>
                    </div>
                    <button style="background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);padding:9px;font-size:12.5px;font-weight:600;cursor:pointer;width:100%">Terapkan Filter</button>
                    <button style="background:var(--bg-surface-2);color:var(--text-2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px;font-size:12.5px;font-weight:600;cursor:pointer;width:100%">Reset Filter</button>
                </div>
            </div>

            <div class="card">
                <div class="card-header"><span class="ch-title"><i class="ri-focus-3-line"></i> Fokus Wilayah</span></div>
                <div style="padding:12px 16px;display:flex;flex-direction:column;gap:10px">
                    ${[['Kalimantan Timur','82','danger'],['Jawa Timur','45','warning'],['Sulawesi Tengah','38','warning'],['Riau','26','success'],['Sumatera Selatan','21','success']].map(r=>`
                    <div style="display:flex;justify-content:space-between;align-items:center;padding:9px 12px;background:var(--bg-surface-2);border-radius:6px;border:1px solid var(--border-soft)">
                        <span style="font-size:12.5px;font-weight:600;color:var(--text-1)">${r[0]}</span>
                        <span style="background:var(--${r[2]}-soft);color:var(--${r[2]}-2);font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px">${r[1]} Titik</span>
                    </div>`).join('')}
                </div>
            </div>

            <div class="card">
                <div class="card-header"><span class="ch-title"><i class="ri-information-line"></i> Legenda</span></div>
                <div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px">
                    ${[['Risiko Tinggi (≥75)','#ef4444'],['Risiko Sedang (50–74)','#f59e0b'],['Risiko Rendah (<50)','#10b981']].map(r=>`
                    <div style="display:flex;align-items:center;gap:10px">
                        <span style="width:12px;height:12px;border-radius:50%;background:${r[1]};flex-shrink:0;box-shadow:0 0 0 3px ${r[1]}33"></span>
                        <span style="font-size:12.5px;color:var(--text-2)">${r[0]}</span>
                    </div>`).join('')}
                </div>
            </div>
        </div>
    </div>`;

const petaRisikoHtml = [
    buildHead('Peta Risiko Lingkungan', true),
    buildSidebar('nav-map'),
    buildTopbar('Peta Risiko Lingkungan', 'Peta Risiko'),
    petaContent,
    buildFooter(true)
].join('\n');

fs.writeFileSync('d:/JOB/SIAGA/TESTING/peta-risiko.html', petaRisikoHtml, 'utf8');
console.log('mapCardHtml ends with: ' + mapCardHtml.slice(-60));
console.log('✅  peta-risiko.html FIXED!');
