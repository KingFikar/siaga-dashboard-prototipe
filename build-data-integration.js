const fs = require('fs');

const src = fs.readFileSync('d:/JOB/SIAGA/TESTING/index.html', 'utf8');

const asideStart = src.indexOf('<aside class="sidebar"');
const asideEnd   = src.indexOf('</aside>') + '</aside>'.length;
const sidebarHtml = src.slice(asideStart, asideEnd);

function buildSidebar(activeLinkId) {
    let sb = sidebarHtml.replace(/class="sb-link active"/g, 'class="sb-link"');
    sb = sb.replace(
        new RegExp(`class="sb-link" id="${activeLinkId}"`),
        `class="sb-link active" id="${activeLinkId}"`
    );
    return sb;
}

function buildHead(pageTitle) {
    return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SIAGA Command Center — ${pageTitle}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css" rel="stylesheet">
    <link rel="stylesheet" href="style.css?v=31">
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
                    <div class="tb-profile" role="button" tabindex="0">
                        <div class="tb-profile-ava">AD</div>
                        <div class="tb-profile-meta">
                            <div class="tb-profile-name">Admin Sistem</div>
                            <div class="tb-profile-role">Super Admin</div>
                        </div>
                    </div>
                </div>
            </header>
            <div class="page-content">`;
}

function buildFooter() {
    return `
            </div>
            <footer class="page-footer">
                <div class="footer-left">
                    <span class="footer-logo"><i class="ri-radar-line"></i> SIAGA</span>
                </div>
                <div class="footer-right">
                    <span class="footer-status"><span class="footer-dot"></span>Sistem Aktif</span>
                </div>
            </footer>
        </div>
    </div>
</body>
</html>`;
}

const contentHtml = `
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

const html = [
    buildHead('Data Integration Layer'),
    buildSidebar('nav-integration'),
    buildTopbar('Data Integration Layer', 'Data Integration'),
    contentHtml,
    buildFooter()
].join('\n');

fs.writeFileSync('d:/JOB/SIAGA/TESTING/data-integration.html', html, 'utf8');
console.log('✅  data-integration.html');
