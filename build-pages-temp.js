const fs = require('fs');

const src = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');
const lines = src.split('\n');

/* ─── Ekstrak Sidebar ─── */
const asideStart = src.indexOf('<aside class="sidebar"');
const asideEnd   = src.indexOf('</aside>') + '</aside>'.length;
const sidebarHtml = src.slice(asideStart, asideEnd);

/* ─── Ekstrak GeoJSON script tag ─── */
const geoTagOpen  = '<script type="application/json" id="geojson-data">';
const geoTagClose = '</script>';
const geoStart    = src.indexOf(geoTagOpen);
const geoEnd      = src.indexOf(geoTagClose, geoStart) + geoTagClose.length;
const geoJsonScript = src.slice(geoStart, geoEnd);

/* ─── Ekstrak MAP CARD HTML ─── */
const mapCardHtml = lines.slice(220, 350).join('\n');

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

/* ════════════════════════════════════════════
   PETA RISIKO
   ════════════════════════════════════════════ */
const petaRisikoHtml = [
    buildHead('Peta Risiko Lingkungan', true),
    buildSidebar('nav-map'),
    buildTopbar('Peta Risiko Lingkungan', 'Peta Risiko'),
    `
                <div class="kpi-grid">
                    <div class="kpi-card red" id="kpi-pr-tinggi"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-fire-line"></i></div><div class="kpi-body"><div class="kpi-val">127</div><div class="kpi-lbl">Zona Risiko Tinggi</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+8 minggu ini</span></div></div></div>
                    <div class="kpi-card amber" id="kpi-pr-sedang"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-alert-line"></i></div><div class="kpi-body"><div class="kpi-val">485</div><div class="kpi-lbl">Zona Risiko Sedang</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta flat"><i class="ri-checkbox-blank-circle-fill"></i>Stabil</span></div></div></div>
                    <div class="kpi-card indigo" id="kpi-pr-rendah"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-leaf-line"></i></div><div class="kpi-body"><div class="kpi-val">1.841</div><div class="kpi-lbl">Zona Risiko Rendah</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta down"><i class="ri-arrow-down-s-fill"></i>-12 bulan ini</span></div></div></div>
                    <div class="kpi-card violet" id="kpi-pr-provinsi"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-map-pin-line"></i></div><div class="kpi-body"><div class="kpi-val">34</div><div class="kpi-lbl">Provinsi Dipantau</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta flat"><i class="ri-checkbox-blank-circle-fill"></i>Seluruh Indonesia</span></div></div></div>
                </div>

                <div class="main-grid">
                    <div class="col-left">
                        ${mapCardHtml}
                        <div class="card" style="margin-top:0;overflow:hidden">
                            <div class="card-header"><span class="ch-title"><i class="ri-list-ordered"></i>Hotspot Risiko Tertinggi</span></div>
                            ${[['PT ABC Industries','Kab. Kutai Timur, Kaltim','92','danger'],['PT XYZ Petrochemical','Kota Cilegon, Banten','84','danger'],['PT MNO Mining','Kab. Morowali, Sulteng','76','warning'],['PT Borneo Coal','Kab. Berau, Kaltim','71','warning'],['PT Smelter Nusantara','Kab. Konawe, Sultra','68','warning'],['PT Industri Kimia Mas','Kab. Gresik, Jatim','61','warning']].map((r,i)=>`
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
                                <div><label style="font-size:11.5px;color:var(--text-3);font-weight:600;display:block;margin-bottom:6px">Sektor Industri</label><select style="width:100%;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 12px;font-size:12.5px;color:var(--text-1);outline:none"><option>Semua Sektor</option><option>Pertambangan</option><option>Petrokimia</option><option>Perkebunan</option></select></div>
                                <button style="background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);padding:9px;font-size:12.5px;font-weight:600;cursor:pointer;margin-top:6px;width:100%">Terapkan Filter</button>
                            </div>
                        </div>
                    </div>
                </div>
    `,
    buildFooter(true)
].join('\n');
fs.writeFileSync('d:/JOB/SIAGA/TESTING/peta-risiko.html', petaRisikoHtml, 'utf8');
console.log('✅  peta-risiko.html');

/* ════════════════════════════════════════════
   HALAMAN LAINNYA
   ════════════════════════════════════════════ */
const otherPages = {

'perusahaan.html': {
  title: 'Data Perusahaan', breadcrumb: 'Perusahaan', active: 'nav-companies',
  content: `
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:18px;flex-wrap:wrap">
    <div style="flex:1;min-width:220px;position:relative"><i class="ri-search-line" style="position:absolute;left:11px;top:50%;transform:translateY(-50%);color:var(--text-4);font-size:15px"></i><input id="co-search" type="text" placeholder="Cari perusahaan, NPWP, sektor..." style="width:100%;box-sizing:border-box;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 14px 9px 34px;font-size:13px;color:var(--text-1);outline:none"></div>
    <select style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 14px;font-size:13px;color:var(--text-2);outline:none"><option>Semua Sektor</option><option>Pertambangan</option><option>Manufaktur</option><option>Perkebunan</option></select>
    <select style="background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);padding:9px 14px;font-size:13px;color:var(--text-2);outline:none"><option>Semua Risiko</option><option>Tinggi</option><option>Sedang</option><option>Rendah</option></select>
    <button id="co-add-btn" style="background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);padding:9px 18px;font-size:13px;font-weight:600;cursor:pointer;white-space:nowrap"><i class="ri-add-line"></i> Tambah Perusahaan</button>
  </div>
  <div class="card" style="overflow:hidden">
    <div class="card-header"><span class="ch-title"><i class="ri-building-2-line"></i>Daftar Perusahaan &mdash; 2.453 Terdaftar</span><span style="font-size:11.5px;color:var(--text-4)">Menampilkan 1–10</span></div>
    <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px">
      <thead><tr style="background:var(--bg-surface-2);border-bottom:1px solid var(--border)">${['No','Perusahaan','Sektor','Wilayah','Izin Lingkungan','Skor','Status','Aksi'].map(h=>`<th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--text-3);font-size:11px;text-transform:uppercase;white-space:nowrap">${h}</th>`).join('')}</tr></thead>
      <tbody>${[['PT ABC Industries','Pertambangan Batubara','Kab. Kutai Timur','Aktif – 2027','92','Tinggi','danger'],['PT XYZ Petrochemical','Petrokimia','Kota Cilegon','Aktif – 2025','84','Tinggi','danger'],['PT MNO Mining','Tambang Nikel','Kab. Morowali','Aktif – 2028','76','Sedang','warning'],['PT Borneo Coal','Pertambangan Batubara','Kab. Berau','Aktif – 2026','71','Sedang','warning'],['PT Smelter Nusantara','Smelter Nikel','Kab. Konawe','Proses Perpanjangan','68','Sedang','warning'],['PT Industri Kimia Mas','Kimia Dasar','Kab. Gresik','Aktif – 2029','61','Sedang','warning'],['PT Sawit Raya','Perkebunan Sawit','Kab. Ketapang','Aktif – 2030','54','Rendah','success'],['PT Energi Baru','Pembangkit Listrik','Kab. Lahat','Aktif – 2027','47','Rendah','success'],['PT Tambang Emas','Tambang Emas','Kab. Sumbawa','Aktif – 2026','43','Rendah','success'],['PT Agro Nusantara','Pengolahan Kelapa','Kab. Indragiri','Aktif – 2028','38','Rendah','success']].map((r,i)=>`<tr style="border-bottom:1px solid var(--border-soft)" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''"><td style="padding:12px 14px;color:var(--text-4)">${i+1}</td><td style="padding:12px 14px;font-weight:700;color:var(--text-1);white-space:nowrap">${r[0]}</td><td style="padding:12px 14px;color:var(--text-2);white-space:nowrap">${r[1]}</td><td style="padding:12px 14px;color:var(--text-2);white-space:nowrap">${r[2]}</td><td style="padding:12px 14px;color:var(--text-2);white-space:nowrap">${r[3]}</td><td style="padding:12px 14px;text-align:center;font-weight:800;font-size:16px;color:var(--${r[6]}-2)">${r[4]}</td><td style="padding:12px 14px"><span style="background:var(--${r[6]}-soft);color:var(--${r[6]}-2);font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;text-transform:uppercase">${r[5]}</span></td><td style="padding:12px 14px"><button style="background:var(--primary-soft);color:var(--primary);border:none;border-radius:6px;padding:5px 12px;font-size:11.5px;font-weight:600;cursor:pointer">Detail</button></td></tr>`).join('')}</tbody>
    </table></div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:12px 16px;border-top:1px solid var(--border);background:var(--bg-surface-2)"><span style="font-size:12px;color:var(--text-4)">Halaman 1 dari 246</span><div style="display:flex;gap:5px">${['‹','1','2','3','›'].map((l,i)=>`<button style="background:${i===1?'var(--primary)':'var(--bg-surface)'};border:${i===1?'none':'1px solid var(--border)'};color:${i===1?'#fff':'var(--text-3)'};border-radius:6px;padding:5px 11px;font-size:12px;font-weight:${i===1?700:400};cursor:pointer">${l}</button>`).join('')}</div></div>
  </div>`
},

'peringatan.html': {
  title: 'Peringatan AI', breadcrumb: 'Peringatan', active: 'nav-alerts',
  content: `
  <div class="kpi-grid">
    <div class="kpi-card red" id="kpi-pw-kritis"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-alarm-warning-line"></i></div><div class="kpi-body"><div class="kpi-val">15</div><div class="kpi-lbl">Kritis</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+3 hari ini</span></div></div></div>
    <div class="kpi-card amber" id="kpi-pw-tinggi"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-error-warning-line"></i></div><div class="kpi-body"><div class="kpi-val">28</div><div class="kpi-lbl">Tinggi</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+5 minggu ini</span></div></div></div>
    <div class="kpi-card violet" id="kpi-pw-total"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-sparkling-2-line"></i></div><div class="kpi-body"><div class="kpi-val">43</div><div class="kpi-lbl">Total Aktif</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Diproses AI</span></div></div></div>
    <div class="kpi-card indigo" id="kpi-pw-resolved"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-check-double-line"></i></div><div class="kpi-body"><div class="kpi-val">187</div><div class="kpi-lbl">Diselesaikan</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">30 hari terakhir</span></div></div></div>
  </div>
  <div class="card" style="overflow:hidden">
    <div class="card-header"><span class="ch-title"><i class="ri-sparkling-2-line"></i>Daftar Peringatan AI</span><div style="display:flex;gap:6px"><button style="background:var(--danger-soft);color:var(--danger-2);border:none;border-radius:6px;padding:5px 12px;font-size:11.5px;font-weight:700;cursor:pointer">Kritis (15)</button><button style="background:var(--warning-soft);color:var(--warning-2);border:none;border-radius:6px;padding:5px 12px;font-size:11.5px;font-weight:700;cursor:pointer">Tinggi (28)</button><button style="background:var(--bg-surface-2);color:var(--text-3);border:1px solid var(--border);border-radius:6px;padding:5px 12px;font-size:11.5px;cursor:pointer">Semua</button></div></div>
    <div class="alert-list">${[['ri-drop-line','red-bg','Lonjakan Polutan BOD Sungai Mahakam','Sensor otomatis mendeteksi kadar BOD 340 mg/L (batas: 100 mg/L). Potensi pencemaran berat sungai.','Baru saja','Sensor S-42','PT ABC Industries','KRITIS','red'],['ri-fire-line','red-bg','Kebakaran Lahan Terdeteksi via Satelit','Citra MODIS menunjukkan 47 titik panas baru di area konsesi. Angin barat daya berpotensi memperluas kebakaran.','12 mnt lalu','Satelit LAPAN','PT Borneo Coal','KRITIS','red'],['ri-file-damage-line','amber-bg','Anomali Pelaporan Periodik','Perusahaan tidak mengirimkan laporan kuartalan Q3-2026. Tenggat 15 Sep 2026 terlewati +10 hari.','2 jam lalu','Sistem Otomatis','PT XYZ Petrochemical','TINGGI','orange'],['ri-satellite-line','amber-bg','Perubahan Penggunaan Lahan','Analisis citra multitemporal mendeteksi pembukaan lahan 280 ha di luar batas izin konsesi.','5 jam lalu','Citra Sentinel-2','Kab. Kutai Timur','TINGGI','orange'],['ri-cloud-windy-line','amber-bg','Kualitas Udara Melampaui Baku Mutu','PM2.5 = 78 µg/m³ (baku mutu: 55 µg/m³) selama 6 jam berturut-turut.','8 jam lalu','AQMS-07','PT Smelter Nusantara','TINGGI','orange'],['ri-temp-hot-line','info-bg','Peningkatan Suhu Air Pendingin','Temperatur air buangan meningkat 4°C di atas baseline. Perlu investigasi lebih lanjut.','1 hari lalu','Sensor T-12','PT Industri Kimia Mas','SEDANG','orange']].map(r=>`<div class="al-row"><div class="al-icon ${r[1]}"><i class="${r[0]}"></i></div><div class="al-body"><div class="al-title">${r[2]}</div><div style="font-size:11px;color:var(--text-3);margin-top:4px;line-height:1.5">${r[3]}</div><div class="al-sub"><i class="ri-time-line"></i>${r[4]} &bull; <i class="ri-sensor-line"></i>${r[5]} &bull; <i class="ri-building-line"></i>${r[6]}</div></div><span class="sev-chip ${r[8]}">${r[7]}</span></div>`).join('')}</div>
  </div>`
},

'inspeksi.html': {
  title: 'Manajemen Inspeksi', breadcrumb: 'Inspeksi', active: 'nav-inspection',
  content: `
  <div class="kpi-grid">
    <div class="kpi-card amber" id="kpi-ins-djdwl"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-clipboard-line"></i></div><div class="kpi-body"><div class="kpi-val">58</div><div class="kpi-lbl">Dijadwalkan</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">12 pending hari ini</span></div></div></div>
    <div class="kpi-card indigo" id="kpi-ins-inspektor"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-user-3-line"></i></div><div class="kpi-body"><div class="kpi-val">24</div><div class="kpi-lbl">Inspektor Aktif</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">18 provinsi</span></div></div></div>
    <div class="kpi-card" id="kpi-ins-selesai"><div class="kpi-top"><div class="kpi-icon" style="background:var(--success-soft);color:var(--success-2)"><i class="ri-check-double-line"></i></div><div class="kpi-body"><div class="kpi-val" style="color:var(--success-2)">143</div><div class="kpi-lbl">Selesai (30 Hari)</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+18% vs bulan lalu</span></div></div></div>
    <div class="kpi-card red" id="kpi-ins-gagal"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-close-circle-line"></i></div><div class="kpi-body"><div class="kpi-val">7</div><div class="kpi-lbl">Ditolak / Gagal</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Perlu tindak lanjut</span></div></div></div>
  </div>
  <div class="main-grid" style="align-items:start">
    <div class="card" style="overflow:hidden">
      <div class="card-header"><span class="ch-title"><i class="ri-calendar-line"></i>Jadwal Inspeksi</span><button id="ins-add-btn" style="background:var(--primary);color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;cursor:pointer"><i class="ri-add-line"></i> Buat Jadwal</button></div>
      <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px"><thead><tr style="background:var(--bg-surface-2);border-bottom:1px solid var(--border)">${['ID','Perusahaan','Inspektor','Tanggal','Status'].map(h=>`<th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--text-3);font-size:11px;text-transform:uppercase">${h}</th>`).join('')}</tr></thead><tbody>${[['INS-2026-001','PT ABC Industries','Budi Santoso','28 Sep 2026','Dijadwalkan','info'],['INS-2026-002','PT XYZ Petrochemical','Rina Kusuma','30 Sep 2026','Dijadwalkan','info'],['INS-2026-003','PT MNO Mining','Ahmad Fauzi','02 Okt 2026','Dijadwalkan','info'],['INS-2026-004','PT Borneo Coal','Siti Rahma','05 Okt 2026','Dijadwalkan','info'],['INS-2026-005','PT Smelter Nusantara','Hendra P.','10 Okt 2026','Pending','warning'],['INS-2026-006','PT Industri Kimia','Dewi Lestari','12 Okt 2026','Pending','warning'],['INS-2026-007','PT Sawit Raya','Rizky Amara','15 Sep 2026','Selesai','success'],['INS-2026-008','PT Tambang Emas','Bayu Nugroho','18 Sep 2026','Gagal','danger']].map(r=>`<tr style="border-bottom:1px solid var(--border-soft)" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''"><td style="padding:11px 14px;font-family:monospace;color:var(--text-4);font-size:11px">${r[0]}</td><td style="padding:11px 14px;font-weight:600;color:var(--text-1)">${r[1]}</td><td style="padding:11px 14px;color:var(--text-2)">${r[2]}</td><td style="padding:11px 14px;color:var(--text-2);white-space:nowrap">${r[3]}</td><td style="padding:11px 14px"><span style="background:var(--${r[5]}-soft);color:var(--${r[5]}-2);font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px">${r[4]}</span></td></tr>`).join('')}</tbody></table></div>
    </div>
    <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-user-star-line"></i>Kinerja Inspektor</span></div>${[['Budi Santoso','BS','12 selesai, 3 pending','92%','success'],['Rina Kusuma','RK','9 selesai, 2 pending','88%','success'],['Ahmad Fauzi','AF','7 selesai, 4 pending','75%','warning'],['Siti Rahma','SR','11 selesai, 1 pending','95%','success'],['Hendra P.','HP','5 selesai, 5 pending','60%','warning']].map(r=>`<div style="display:flex;align-items:center;gap:12px;padding:13px 16px;border-bottom:1px solid var(--border-soft)"><div style="width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#4f46e5,#7c3aed);display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;font-weight:700;flex-shrink:0">${r[1]}</div><div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--text-1)">${r[0]}</div><div style="font-size:10.5px;color:var(--text-4);margin-top:2px">${r[2]}</div><div style="height:4px;background:var(--bg-surface-3);border-radius:99px;margin-top:6px;overflow:hidden"><div style="height:100%;width:${r[3]};background:var(--${r[4]});border-radius:99px"></div></div></div><span style="font-size:13px;font-weight:800;color:var(--${r[4]}-2)">${r[3]}</span></div>`).join('')}</div>
  </div>`
},

'kasus.html': {
  title: 'Manajemen Kasus', breadcrumb: 'Kasus', active: 'nav-cases',
  content: `
  <div class="kpi-grid">
    <div class="kpi-card red" id="kpi-ks-aktif"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-folder-open-line"></i></div><div class="kpi-body"><div class="kpi-val">34</div><div class="kpi-lbl">Kasus Aktif</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+4 pekan ini</span></div></div></div>
    <div class="kpi-card amber" id="kpi-ks-hukum"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-scales-line"></i></div><div class="kpi-body"><div class="kpi-val">12</div><div class="kpi-lbl">Proses Hukum</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">3 sidang minggu ini</span></div></div></div>
    <div class="kpi-card indigo" id="kpi-ks-inv"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-time-line"></i></div><div class="kpi-body"><div class="kpi-val">18</div><div class="kpi-lbl">Investigasi</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Rata-rata 42 hari</span></div></div></div>
    <div class="kpi-card violet" id="kpi-ks-denda"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-money-dollar-circle-line"></i></div><div class="kpi-body"><div class="kpi-val">Rp 28,4M</div><div class="kpi-lbl">Denda Tertagih</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+Rp4,2M bulan ini</span></div></div></div>
  </div>
  <div class="card" style="overflow:hidden">
    <div class="card-header"><span class="ch-title"><i class="ri-folder-line"></i>Daftar Kasus</span><button id="ks-add-btn" style="background:var(--primary);color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;cursor:pointer"><i class="ri-add-line"></i> Buka Kasus Baru</button></div>
    ${[['KS-2026-089','Pencemaran Sungai Mahakam','PT ABC Industries','Pencemaran Air','Kritis','Investigasi','danger','4 Sep 2026'],['KS-2026-088','Emisi SO₂ Melebihi Baku Mutu','PT XYZ Petrochemical','Pencemaran Udara','Tinggi','Proses Hukum','warning','28 Ags 2026'],['KS-2026-087','Pembukaan Lahan Ilegal 280 Ha','PT Borneo Coal','Perusakan Lahan','Tinggi','Investigasi','warning','20 Ags 2026'],['KS-2026-086','Pelaporan AMDAL Tidak Valid','PT Smelter Nusantara','Administratif','Sedang','Mediasi','warning','15 Ags 2026'],['KS-2026-085','Pembuangan Limbah B3 Ilegal','PT Industri Kimia Mas','Limbah B3','Tinggi','Proses Hukum','warning','10 Ags 2026'],['KS-2026-084','Penambangan di Luar Batas Izin','PT MNO Mining','Pelanggaran Izin','Sedang','Penyelidikan','warning','5 Ags 2026'],['KS-2026-083','Tumpahan Minyak 500 Liter','PT Energi Baru','Pencemaran Air','Rendah','Selesai','success','1 Ags 2026']].map(r=>`<div style="display:flex;align-items:flex-start;gap:14px;padding:14px 18px;border-bottom:1px solid var(--border-soft);cursor:pointer;transition:background 0.15s" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''"><div style="flex:1;min-width:0"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;flex-wrap:wrap"><span style="font-family:monospace;font-size:10.5px;color:var(--text-4);background:var(--bg-surface-2);padding:1px 7px;border-radius:4px">${r[0]}</span><span style="font-size:13px;font-weight:700;color:var(--text-1)">${r[1]}</span></div><div style="display:flex;gap:14px;flex-wrap:wrap"><span style="font-size:11px;color:var(--text-4)"><i class="ri-building-line"></i> ${r[2]}</span><span style="font-size:11px;color:var(--text-4)"><i class="ri-price-tag-3-line"></i> ${r[3]}</span><span style="font-size:11px;color:var(--text-4)"><i class="ri-calendar-line"></i> ${r[7]}</span></div></div><div style="display:flex;flex-direction:column;align-items:flex-end;gap:5px;flex-shrink:0"><span style="background:var(--${r[6]}-soft);color:var(--${r[6]}-2);font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px">${r[4]}</span><span style="font-size:11px;color:var(--text-3);font-weight:600">${r[5]}</span></div></div>`).join('')}
  </div>`
},

'laporan.html': {
  title: 'Laporan & Analitik', breadcrumb: 'Laporan', active: 'nav-reports',
  content: `
  <div class="kpi-grid">
    <div class="kpi-card indigo" id="kpi-lp-total"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-file-chart-line"></i></div><div class="kpi-body"><div class="kpi-val">248</div><div class="kpi-lbl">Laporan Dibuat</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Tahun 2026</span></div></div></div>
    <div class="kpi-card amber" id="kpi-lp-bulan"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-send-plane-line"></i></div><div class="kpi-body"><div class="kpi-val">31</div><div class="kpi-lbl">Bulan Ini</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>+6 vs bulan lalu</span></div></div></div>
    <div class="kpi-card red" id="kpi-lp-terlambat"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-draft-line"></i></div><div class="kpi-body"><div class="kpi-val">14</div><div class="kpi-lbl">Terlambat</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Perlu follow-up</span></div></div></div>
    <div class="kpi-card violet" id="kpi-lp-unduh"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-download-cloud-line"></i></div><div class="kpi-body"><div class="kpi-val">1.204</div><div class="kpi-lbl">Total Unduhan</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Semua laporan</span></div></div></div>
  </div>
  <div class="main-grid" style="align-items:start">
    <div class="card" style="overflow:hidden">
      <div class="card-header"><span class="ch-title"><i class="ri-file-list-3-line"></i>Laporan Terbaru</span><div style="display:flex;gap:6px"><button style="background:var(--primary);color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:11.5px;font-weight:600;cursor:pointer"><i class="ri-add-line"></i> Buat Laporan</button><button style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:6px;padding:5px 12px;font-size:11.5px;color:var(--text-3);cursor:pointer"><i class="ri-download-line"></i> Export</button></div></div>
      ${[['RPT-2026-248','Rekap Risiko Lingkungan Q3 2026','Kuartalan','25 Sep 2026','Selesai','success'],['RPT-2026-247','Laporan Inspeksi September 2026','Bulanan','22 Sep 2026','Selesai','success'],['RPT-2026-246','Analisis Tren Pencemaran 2025–2026','Tahunan','20 Sep 2026','Selesai','success'],['RPT-2026-245','Laporan Kasus Aktif – Agustus 2026','Bulanan','18 Sep 2026','Selesai','success'],['RPT-2026-244','Evaluasi Kinerja Inspektor Q3','Kuartalan','15 Sep 2026','Selesai','success'],['RPT-2026-243','Rekap Peringatan AI – September','Bulanan','Dalam proses','Draft','warning'],['RPT-2026-242','Laporan Keuangan Denda 2026','Tahunan','Terlambat +5 hari','Terlambat','danger']].map((r,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid var(--border-soft)"><div style="width:36px;height:36px;border-radius:8px;background:var(--primary-soft);display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ri-file-pdf-2-line" style="font-size:18px;color:var(--primary)"></i></div><div style="flex:1;min-width:0"><div style="font-size:12.5px;font-weight:700;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${r[1]}</div><div style="display:flex;gap:10px;margin-top:3px;flex-wrap:wrap"><span style="font-size:10.5px;color:var(--text-4)">${r[0]}</span><span style="font-size:10.5px;color:var(--text-4)">${r[2]}</span><span style="font-size:10.5px;color:var(--text-4)"><i class="ri-calendar-line"></i> ${r[3]}</span></div></div><span style="background:var(--${r[5]}-soft);color:var(--${r[5]}-2);font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;white-space:nowrap;flex-shrink:0">${r[4]}</span><button style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:6px;padding:5px 10px;font-size:11px;color:var(--text-3);cursor:pointer;flex-shrink:0"><i class="ri-download-line"></i></button></div>`).join('')}
    </div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-pie-chart-2-line"></i>Distribusi Tipe</span></div><div style="padding:16px;display:flex;flex-direction:column;gap:12px">${[['Laporan Inspeksi','38%','var(--primary)'],['Laporan Risiko','25%','var(--danger)'],['Laporan Kasus','18%','var(--warning)'],['Laporan Keuangan','11%','#7c3aed'],['Lainnya','8%','var(--text-4)']].map(r=>`<div><div style="display:flex;justify-content:space-between;margin-bottom:4px"><span style="font-size:12px;color:var(--text-2)">${r[0]}</span><span style="font-size:12px;font-weight:700;color:var(--text-1)">${r[1]}</span></div><div style="height:6px;background:var(--bg-surface-3);border-radius:99px;overflow:hidden"><div style="height:100%;width:${r[1]};background:${r[2]};border-radius:99px"></div></div></div>`).join('')}</div></div>
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-calendar-check-line"></i>Jatuh Tempo</span></div>${[['RPT Risiko Q4','30 Sep 2026','2 hari','danger'],['Rekap Inspeksi Okt','31 Okt 2026','36 hari','warning'],['Eval. Tahunan 2026','31 Des 2026','97 hari','success']].map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid var(--border-soft)"><div><div style="font-size:12px;font-weight:600;color:var(--text-1)">${r[0]}</div><div style="font-size:10.5px;color:var(--text-4);margin-top:2px">${r[1]}</div></div><span style="background:var(--${r[3]}-soft);color:var(--${r[3]}-2);font-size:11px;font-weight:700;padding:3px 9px;border-radius:999px">${r[2]} lagi</span></div>`).join('')}</div>
    </div>
  </div>`
},

'ai-analytics.html': {
  title: 'AI Analytics', breadcrumb: 'AI Analytics', active: 'nav-ai',
  content: `
  <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 60%,#06b6d4 100%);border-radius:var(--radius);padding:24px 28px;display:flex;align-items:center;gap:20px;margin-bottom:18px;box-shadow:0 8px 32px rgba(79,70,229,0.25)">
    <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ri-sparkling-2-line" style="font-size:30px;color:#fff"></i></div>
    <div style="flex:1"><div style="font-size:20px;font-weight:800;color:#fff;margin-bottom:5px">SIAGA AI Engine v2.4</div><div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6">Model prediktif berbasis <b style="color:#fff">LLM + Computer Vision</b> untuk deteksi anomali lingkungan real-time.</div></div>
    <div style="background:rgba(255,255,255,0.15);border-radius:10px;padding:10px 16px;text-align:center;flex-shrink:0"><div style="font-size:24px;font-weight:800;color:#fff">97.3%</div><div style="font-size:10px;color:rgba(255,255,255,0.7);font-weight:600;text-transform:uppercase;letter-spacing:0.5px">Akurasi Model</div></div>
  </div>
  <div class="kpi-grid">
    <div class="kpi-card violet" id="kpi-ai-anomali"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-brain-line"></i></div><div class="kpi-body"><div class="kpi-val">43</div><div class="kpi-lbl">Anomali Terdeteksi</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Hari ini</span></div></div></div>
    <div class="kpi-card indigo" id="kpi-ai-pantau"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-eye-line"></i></div><div class="kpi-body"><div class="kpi-val">1.284</div><div class="kpi-lbl">Titik Pantau</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Sensor + Satelit</span></div></div></div>
    <div class="kpi-card amber" id="kpi-ai-respons"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-robot-line"></i></div><div class="kpi-body"><div class="kpi-val">2,4 dtk</div><div class="kpi-lbl">Respons AI</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta down"><i class="ri-arrow-down-s-fill"></i>-0.3 dtk</span></div></div></div>
    <div class="kpi-card red" id="kpi-ai-prediksi"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-shield-flash-line"></i></div><div class="kpi-body"><div class="kpi-val">15</div><div class="kpi-lbl">Prediksi Risiko Baru</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">7 hari ke depan</span></div></div></div>
  </div>
  <div class="main-grid" style="align-items:start">
    <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-line-chart-line"></i>Prediksi Skor Risiko (30 Hari)</span></div><div style="padding:0 16px 16px">${[['PT ABC Industries','92','→ 96','↑ +4','danger'],['PT XYZ Petrochemical','84','→ 89','↑ +5','danger'],['PT MNO Mining','76','→ 72','↓ -4','success'],['PT Borneo Coal','71','→ 74','↑ +3','warning'],['PT Industri Kimia Mas','61','→ 58','↓ -3','success']].map(r=>`<div style="display:flex;align-items:center;gap:10px;padding:11px 0;border-bottom:1px solid var(--border-soft)"><span style="flex:1;font-size:12px;font-weight:600;color:var(--text-1)">${r[0]}</span><span style="font-size:13px;font-weight:800;color:var(--text-2)">${r[1]} <span style="color:var(--text-4)">${r[2]}</span></span><span style="background:var(--${r[4]}-soft);color:var(--${r[4]}-2);font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px">${r[3]}</span></div>`).join('')}</div></div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-cpu-line"></i>Model AI Aktif</span></div>${[['Deteksi Anomali Sensor','XGBoost + LSTM','98.1%','success'],['Analisis Citra Satelit','Vision Transformer','96.4%','success'],['Prediksi Risiko','Gradient Boosting','95.8%','success'],['NLP Analisis Laporan','BERT-ID Fine-tuned','91.2%','warning']].map(r=>`<div style="padding:12px 16px;border-bottom:1px solid var(--border-soft)"><div style="display:flex;justify-content:space-between;margin-bottom:3px"><span style="font-size:12.5px;font-weight:700;color:var(--text-1)">${r[0]}</span><span style="font-size:12px;font-weight:700;color:var(--${r[3]}-2)">${r[2]}</span></div><span style="font-size:10.5px;color:var(--text-4)">${r[1]}</span><div style="height:4px;background:var(--bg-surface-3);border-radius:99px;margin-top:7px;overflow:hidden"><div style="height:100%;width:${r[2]};background:var(--${r[3]});border-radius:99px"></div></div></div>`).join('')}</div>
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-chat-ai-line"></i>Tanya AI</span></div><div style="padding:16px"><div style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:8px;padding:12px;font-size:12.5px;color:var(--text-2);margin-bottom:12px;line-height:1.6"><i class="ri-sparkling-2-fill" style="color:var(--primary);margin-right:6px"></i>PT ABC Industries memiliki probabilitas <b>87%</b> mengalami peningkatan risiko dalam 30 hari ke depan.</div><div style="display:flex;gap:8px"><input id="ai-chat-input" type="text" placeholder="Tanya tentang risiko atau perusahaan..." style="flex:1;background:var(--bg-surface);border:1px solid var(--border);border-radius:6px;padding:8px 12px;font-size:12.5px;color:var(--text-1);outline:none"><button style="background:var(--primary);color:#fff;border:none;border-radius:6px;padding:8px 14px;font-size:13px;cursor:pointer"><i class="ri-send-plane-fill"></i></button></div></div></div>
    </div>
  </div>`
},

'administrasi.html': {
  title: 'Administrasi Sistem', breadcrumb: 'Administrasi', active: 'nav-admin',
  content: `
  <div class="kpi-grid">
    <div class="kpi-card indigo" id="kpi-adm-users"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-user-3-line"></i></div><div class="kpi-body"><div class="kpi-val">47</div><div class="kpi-lbl">Total Pengguna</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">24 aktif hari ini</span></div></div></div>
    <div class="kpi-card violet" id="kpi-adm-roles"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-shield-user-line"></i></div><div class="kpi-body"><div class="kpi-val">5</div><div class="kpi-lbl">Peran (Role)</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Super Admin, Admin, dll.</span></div></div></div>
    <div class="kpi-card amber" id="kpi-adm-uptime"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-server-line"></i></div><div class="kpi-body"><div class="kpi-val">99.8%</div><div class="kpi-lbl">Uptime Server</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">30 hari terakhir</span></div></div></div>
    <div class="kpi-card red" id="kpi-adm-error"><div class="kpi-top"><div class="kpi-icon red"><i class="ri-alert-line"></i></div><div class="kpi-body"><div class="kpi-val">3</div><div class="kpi-lbl">Log Error Aktif</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Perlu ditinjau</span></div></div></div>
  </div>
  <div class="main-grid" style="align-items:start">
    <div class="card" style="overflow:hidden">
      <div class="card-header"><span class="ch-title"><i class="ri-user-settings-line"></i>Manajemen Pengguna</span><button style="background:var(--primary);color:#fff;border:none;border-radius:6px;padding:5px 14px;font-size:12px;font-weight:600;cursor:pointer"><i class="ri-user-add-line"></i> Tambah User</button></div>
      <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px"><thead><tr style="background:var(--bg-surface-2);border-bottom:1px solid var(--border)">${['Pengguna','Peran','Terakhir Aktif','Status','Aksi'].map(h=>`<th style="padding:10px 14px;text-align:left;font-weight:700;color:var(--text-3);font-size:11px;text-transform:uppercase">${h}</th>`).join('')}</tr></thead><tbody>${[['Admin Sistem','admin@klhk.go.id','Super Admin','Baru saja','Aktif','success'],['Budi Santoso','b.santoso@klhk.go.id','Inspektor Senior','5 mnt lalu','Aktif','success'],['Rina Kusuma','r.kusuma@klhk.go.id','Inspektor','1 jam lalu','Aktif','success'],['Ahmad Fauzi','a.fauzi@klhk.go.id','Analis','3 jam lalu','Aktif','success'],['Siti Rahma','s.rahma@klhk.go.id','Inspektor','Kemarin','Tidak Aktif','warning'],['Hendra P.','h.pratama@klhk.go.id','Pelaporan','3 hari lalu','Tidak Aktif','warning'],['Dewi Lestari','d.lestari@klhk.go.id','Analis','1 minggu lalu','Dinonaktifkan','danger']].map((r,i)=>`<tr style="border-bottom:1px solid var(--border-soft)" onmouseover="this.style.background='var(--bg-hover)'" onmouseout="this.style.background=''"><td style="padding:11px 14px"><div style="font-size:12.5px;font-weight:700;color:var(--text-1)">${r[0]}</div><div style="font-size:10.5px;color:var(--text-4)">${r[1]}</div></td><td style="padding:11px 14px;color:var(--text-2)">${r[2]}</td><td style="padding:11px 14px;color:var(--text-4)">${r[3]}</td><td style="padding:11px 14px"><span style="background:var(--${r[5]}-soft);color:var(--${r[5]}-2);font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px">${r[4]}</span></td><td style="padding:11px 14px"><div style="display:flex;gap:4px"><button style="background:var(--primary-soft);color:var(--primary);border:none;border-radius:5px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer">Edit</button><button style="background:var(--danger-soft);color:var(--danger-2);border:none;border-radius:5px;padding:4px 10px;font-size:11px;font-weight:600;cursor:pointer">Hapus</button></div></td></tr>`).join('')}</tbody></table></div>
    </div>
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-server-line"></i>Status Sistem</span></div>${[['API Gateway','Berjalan Normal','success'],['Database PostgreSQL','Berjalan Normal','success'],['AI Engine','Berjalan Normal','success'],['Sensor Data Stream','3 Sensor Offline','warning'],['Email Notifikasi','Berjalan Normal','success'],['Backup Harian','Gagal (Sep 24)','danger']].map(r=>`<div style="display:flex;justify-content:space-between;align-items:center;padding:11px 16px;border-bottom:1px solid var(--border-soft)"><span style="font-size:12.5px;font-weight:600;color:var(--text-1)">${r[0]}</span><div style="display:flex;align-items:center;gap:6px"><span style="width:8px;height:8px;border-radius:50%;background:var(--${r[2]});display:inline-block"></span><span style="font-size:11.5px;color:var(--${r[2]}-2);font-weight:600">${r[1]}</span></div></div>`).join('')}</div>
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-settings-3-line"></i>Pengaturan Umum</span></div><div style="padding:16px;display:flex;flex-direction:column;gap:14px">${[['Notifikasi Email','Aktif'],['Backup Otomatis','02:00 WIB'],['Batas Skor Tinggi','≥ 75'],['Interval Sensor','5 menit'],['Retensi Log','90 hari']].map(r=>`<div style="display:flex;justify-content:space-between"><span style="font-size:12.5px;color:var(--text-2)">${r[0]}</span><span style="font-size:12px;font-weight:700;color:var(--primary)">${r[1]}</span></div>`).join('')}<button style="background:var(--primary);color:#fff;border:none;border-radius:var(--radius-sm);padding:10px 18px;font-size:13px;font-weight:600;cursor:pointer;margin-top:4px">Simpan Pengaturan</button></div></div>
    </div>
  </div>`
},

};

for (const [filename, page] of Object.entries(otherPages)) {
    const html = [
        buildHead(page.title),
        buildSidebar(page.active),
        buildTopbar(page.title, page.title),
        `<div style="display:flex;align-items:center;justify-content:center;height:50vh;flex-direction:column;gap:15px;color:var(--text-3)">
            <i class="ri-hammer-line" style="font-size:48px"></i>
            <h2 style="font-size:18px;font-weight:600;color:var(--text-1)">Halaman ${page.title}</h2>
            <p style="font-size:13px">Halaman ini sedang dalam tahap pengembangan (Prototipe).</p>
        </div>`,
        buildFooter()
    ].join('\n');
    fs.writeFileSync('d:/JOB/SIAGA/TESTING/' + filename, html, 'utf8');
    console.log('✅  ' + filename);
}

/* ════════════════════════════════════════════
   DATA INTEGRATION
   ════════════════════════════════════════════ */
const diContent = `
  <div style="background:linear-gradient(135deg,#0ea5e9 0%,#3b82f6 60%,#4f46e5 100%);border-radius:var(--radius);padding:24px 28px;display:flex;align-items:center;gap:20px;margin-bottom:18px;box-shadow:0 8px 32px rgba(14,165,233,0.25)">
    <div style="width:60px;height:60px;background:rgba(255,255,255,0.15);border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="ri-git-merge-fill" style="font-size:30px;color:#fff"></i></div>
    <div style="flex:1"><div style="font-size:20px;font-weight:800;color:#fff;margin-bottom:5px">SIAGA Data Integration Layer</div><div style="font-size:13px;color:rgba(255,255,255,0.85);line-height:1.6"><b>Peran:</b> Menjadi pintu masuk dan pengelola aliran data dari berbagai sumber ke dalam SIAGA. Fokus prototipe adalah konektivitas, validasi, transformasi, sinkronisasi, monitoring, dan audit.</div></div>
    <div style="display:flex;gap:8px">
        <button style="background:rgba(255,255,255,0.2);color:#fff;border:1px solid rgba(255,255,255,0.4);border-radius:6px;padding:8px 14px;font-size:12px;font-weight:700;cursor:pointer"><i class="ri-add-line"></i> Add Source</button>
        <button style="background:#fff;color:#0ea5e9;border:none;border-radius:6px;padding:8px 14px;font-size:12px;font-weight:800;cursor:pointer"><i class="ri-loop-right-line"></i> Sync Now</button>
    </div>
  </div>
  
  <div class="kpi-grid">
    <div class="kpi-card indigo" id="kpi-di-comp"><div class="kpi-top"><div class="kpi-icon indigo"><i class="ri-building-4-line"></i></div><div class="kpi-body"><div class="kpi-val">2.453</div><div class="kpi-lbl">Companies</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Synced Entities</span></div></div></div>
    <div class="kpi-card violet" id="kpi-di-rep"><div class="kpi-top"><div class="kpi-icon violet"><i class="ri-file-copy-2-line"></i></div><div class="kpi-body"><div class="kpi-val">18.921</div><div class="kpi-lbl">Environmental Reports</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Processed Data</span></div></div></div>
    <div class="kpi-card amber" id="kpi-di-sens"><div class="kpi-top"><div class="kpi-icon amber"><i class="ri-sensor-line"></i></div><div class="kpi-body"><div class="kpi-val">94.201</div><div class="kpi-lbl">Sensor Readings</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-delta up"><i class="ri-arrow-up-s-fill"></i>Real-time Data</span></div></div></div>
    <div class="kpi-card" id="kpi-di-sat"><div class="kpi-top"><div class="kpi-icon" style="background:var(--success-soft);color:var(--success-2)"><i class="ri-satellite-line"></i></div><div class="kpi-body"><div class="kpi-val" style="color:var(--success-2)">1.248</div><div class="kpi-lbl">Satellite Images</div></div></div><div class="kpi-bot"><div class="kpi-bot-left"><span class="kpi-info">Geospatial Assets</span></div></div></div>
  </div>

  <div class="main-grid" style="align-items:start">
    <div class="card" style="overflow:hidden">
      <div class="card-header"><span class="ch-title"><i class="ri-database-2-line"></i>Data Source Status</span><button style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:6px;padding:5px 12px;font-size:11.5px;color:var(--text-2);font-weight:600;cursor:pointer"><i class="ri-file-list-3-line"></i> View Data Log</button></div>
      <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse;font-size:12.5px"><thead><tr style="background:var(--bg-surface-2);border-bottom:1px solid var(--border)">${['Data Source','Status','Last Sync','Trend','Action'].map(h=>`<th style="padding:11px 16px;text-align:left;font-weight:700;color:var(--text-3);font-size:11px;text-transform:uppercase">${h}</th>`).join('')}</tr></thead><tbody>${[['AMDALNET','Connected','10:30','success'],['SIMPEL','Connected','10:28','success'],['PROPER','Connected','10:25','success'],['SPARING','Connected','10:29','success'],['SISPEK','Connected','10:31','success'],['GIS','Connected','10:15','success'],['SATELLITE','Connected','10:00','success'],['SENSOR / IoT','Connected','10:29','success']].map(r=>`<tr style="border-bottom:1px solid var(--border-soft)"><td style="padding:12px 16px;font-weight:700;color:var(--text-1)"><i class="ri-arrow-right-s-line" style="color:var(--text-4)"></i> ${r[0]}</td><td style="padding:12px 16px"><span style="background:var(--${r[3]}-soft);color:var(--${r[3]}-2);font-size:10px;font-weight:700;padding:4px 10px;border-radius:999px;text-transform:uppercase"><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:currentColor;margin-right:4px"></span>${r[1]}</span></td><td style="padding:12px 16px;color:var(--text-2);font-family:monospace">${r[2]} WIB</td><td style="padding:12px 16px;color:var(--success-2)"><i class="ri-pulse-line"></i> Stable</td><td style="padding:12px 16px"><button style="background:var(--bg-surface-2);border:1px solid var(--border);border-radius:5px;padding:4px 10px;font-size:11px;cursor:pointer"><i class="ri-settings-3-line"></i></button></td></tr>`).join('')}</tbody></table></div>
    </div>
    
    <div style="display:flex;flex-direction:column;gap:18px">
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-apps-2-line"></i>Modul Utama</span></div><div style="padding:16px;display:flex;flex-direction:column;gap:10px">${['Data Source Management','API Gateway','Data Ingestion','Data Validation','Data Transformation','Data Synchronization','Data Monitoring','Data Error Log','Audit Trail'].map(r=>`<div style="display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg-surface-2);border-radius:6px;border:1px solid var(--border-soft)"><div style="width:28px;height:28px;background:#fff;border-radius:6px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 3px rgba(0,0,0,0.05);color:var(--primary)"><i class="ri-check-line"></i></div><span style="font-size:12.5px;font-weight:600;color:var(--text-1)">${r}</span></div>`).join('')}</div></div>
      
      <div class="card"><div class="card-header"><span class="ch-title"><i class="ri-node-tree"></i>Alur Data (Pipeline)</span></div><div style="padding:20px 16px;display:flex;flex-direction:column;gap:12px;position:relative">
        <div style="position:absolute;left:34px;top:40px;bottom:40px;width:2px;background:var(--border-soft);z-index:1"></div>
        ${[['Sumber Data','External APIs & DBs','ri-database-2-line'],['API / Ingestion','Data Collection Layer','ri-download-cloud-line'],['Validation','Sanity & Integrity Check','ri-shield-check-line'],['Transformation','ETL Process','ri-arrow-left-right-line'],['SIAGA Database','Central Data Warehouse','ri-server-line'],['AI Engine','Intelligence & Analytics','ri-brain-line']].map((r,i)=>`<div style="display:flex;align-items:center;gap:14px;position:relative;z-index:2"><div style="width:36px;height:36px;border-radius:50%;background:${i===5?'var(--primary)':'#fff'};border:2px solid ${i===5?'var(--primary)':'var(--border)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;box-shadow:0 1px 3px rgba(0,0,0,0.05)"><i class="${r[2]}" style="font-size:16px;color:${i===5?'#fff':'var(--text-3)'}"></i></div><div><div style="font-size:13px;font-weight:700;color:${i===5?'var(--primary)':'var(--text-1)'}">${r[0]}</div><div style="font-size:11px;color:var(--text-4);margin-top:2px">${r[1]}</div></div></div>`).join('')}
      </div></div>
    </div>
  </div>`;

const diHtml = [
    buildHead('SIAGA Data Integration Layer'),
    buildSidebar('nav-integration'),
    buildTopbar('SIAGA Data Integration Layer', 'Data Integration'),
    diContent,
    buildFooter()
].join('\n');

fs.writeFileSync('d:/JOB/SIAGA/TESTING/data-integration.html', diHtml, 'utf8');
console.log('✅  data-integration.html');
