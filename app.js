/* ═══════════════════════════════════════════════════════════
   SIAGA Command Center — app.js v3.1
   Real Indonesia map, charts, sparklines, interactions
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

    /* ════════════════════════════════════════════════════════
       SECTION 1 — Indonesia Map (real GeoJSON provinces)
       ════════════════════════════════════════════════════════ */
    const SVG_NS = 'http://www.w3.org/2000/svg';
    const VB_W = 1000, VB_H = 460;
    // Equirectangular projection over Indonesia
    // longitude → x: 94..142  → 60..940  (leaves 60px margin L/R)
    // latitude  → y: 6..-11.5 → 30..430  (leaves 30px margin T/B)
    const LNG_MIN = 94,  LNG_MAX = 142;
    const LAT_MIN = -11.5, LAT_MAX = 6;

    function project(lng, lat) {
        const x = ((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * (VB_W - 120) + 60;
        // latitude inverted (north positive up → smaller y)
        const y = ((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * (VB_H - 60) + 30;
        return [x, y];
    }

    function ringToPath(ring) {
        // ring = [[lng, lat], ...]
        if (!ring || !ring.length) return '';
        let d = '';
        for (let i = 0; i < ring.length; i++) {
            const [x, y] = project(ring[i][0], ring[i][1]);
            d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1);
        }
        return d + 'Z';
    }

    function polygonToPath(polygon) {
        // polygon = [ring, ring, ring...]  (outer + holes)
        return polygon.map(ringToPath).join(' ');
    }

    function loadAndRenderMap() {
        const dataEl = document.getElementById('geojson-data');
        if (!dataEl) return;
        const provinceLayer = document.getElementById('province-layer');
        const labelLayer    = document.getElementById('province-labels');
        if (!provinceLayer) return;

        let geo;
        try { geo = JSON.parse(dataEl.textContent); }
        catch (e) { console.error('GeoJSON parse error', e); return; }
        if (!geo || !geo.features) return;

        // Sort by area (rough) so smaller islands render on top
        const features = geo.features.slice();

        // Different palette per island group for visual variety
        const GROUP_PALETTE = {
            'sumatera':      { fill: '#fde68a', stroke: '#f59e0b' },
            'jawa':          { fill: '#fef3c7', stroke: '#d97706' },
            'kalimantan':    { fill: '#bbf7d0', stroke: '#059669' },
            'sulawesi':      { fill: '#fbcfe8', stroke: '#db2777' },
            'bali':          { fill: '#fef9c3', stroke: '#ca8a04' },
            'nusa tenggara': { fill: '#fed7aa', stroke: '#ea580c' },
            'maluku':        { fill: '#bae6fd', stroke: '#0284c7' },
            'papua':         { fill: '#c7d2fe', stroke: '#4f46e5' },
        };

        const islandGroup = (props) => {
            const s = (props.state || '').toLowerCase();
            if (s.includes('jakarta') || s.includes('jawa') || s.includes('banten') || s.includes('yogyakarta')) return 'jawa';
            if (s.includes('aceh') || s.includes('sumatera') || s.includes('riau') || s.includes('bengkulu') ||
                s.includes('jambi') || s.includes('lampung') || s.includes('bangka')) return 'sumatera';
            if (s.includes('kalimantan')) return 'kalimantan';
            if (s.includes('sulawesi') || s.includes('gorontalo')) return 'sulawesi';
            if (s === 'bali') return 'bali';
            if (s.includes('nusa tenggara')) return 'nusa tenggara';
            if (s.includes('maluku')) return 'maluku';
            if (s.includes('papua')) return 'papua';
            return 'sumatera';
        };

        // Render each province as a single <path> containing all rings
        features.forEach((f, idx) => {
            const name = f.properties.state || ('Prov #' + idx);
            const group = islandGroup(f.properties);
            const palette = GROUP_PALETTE[group] || GROUP_PALETTE.sumatera;
            const geom = f.geometry;
            const polys = (geom.type === 'MultiPolygon') ? geom.coordinates : [geom.coordinates];

            let d = '';
            polys.forEach(p => { d += polygonToPath(p) + ' '; });

            const path = document.createElementNS(SVG_NS, 'path');
            path.setAttribute('d', d.trim());
            path.setAttribute('fill',   palette.fill);
            path.setAttribute('stroke', palette.stroke);
            path.setAttribute('stroke-width', '0.6');
            path.setAttribute('stroke-linejoin', 'round');
            path.setAttribute('data-name', name);
            path.setAttribute('data-group', group);
            path.classList.add('province', 'province-' + group.replace(/\s+/g, '-'));

            // Hover highlight + show name
            path.addEventListener('mouseenter', () => path.classList.add('province-hover'));
            path.addEventListener('mouseleave', () => path.classList.remove('province-hover'));

            provinceLayer.appendChild(path);
        });

        // Add labels for major islands (positioned at centroid based on visual guess)
        const LABELS = [
            { name: 'SUMATERA',   x: 165, y: 195 },
            { name: 'JAWA',       x: 395, y: 313 },
            { name: 'KALIMANTAN', x: 510, y: 175 },
            { name: 'SULAWESI',   x: 705, y: 175 },
            { name: 'PAPUA',      x: 870, y: 185 },
            { name: 'NUSA TENGGARA', x: 685, y: 330 },
            { name: 'MALUKU',     x: 790, y: 200 },
        ];
        if (labelLayer) {
            LABELS.forEach(l => {
                const t = document.createElementNS(SVG_NS, 'text');
                t.setAttribute('x', l.x);
                t.setAttribute('y', l.y);
                t.setAttribute('text-anchor', 'middle');
                t.setAttribute('fill', '#475569');
                t.setAttribute('font-family', 'Inter');
                t.setAttribute('font-size', '11');
                t.setAttribute('font-weight', '700');
                t.setAttribute('letter-spacing', '1.2');
                t.setAttribute('opacity', '0.65');
                t.textContent = l.name;
                t.classList.add('province-label');
                labelLayer.appendChild(t);
            });
        }

        // Position every riskmarker that has data-lat / data-lng
        const markers = document.querySelectorAll('.riskmarker[data-lat]');
        markers.forEach(m => {
            const lat = parseFloat(m.dataset.lat);
            const lng = parseFloat(m.dataset.lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                const [x, y] = project(lng, lat);
                m.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
            }
        });
    }

    loadAndRenderMap();


    /* ════════════════════════════════════════════════════════
       SECTION 2 — Chart.js global defaults
       ════════════════════════════════════════════════════════ */
    Chart.defaults.color         = '#94a3b8';
    Chart.defaults.font.family   = "'Inter', system-ui, sans-serif";
    Chart.defaults.font.size     = 11;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.pointStyle    = 'circle';
    Chart.defaults.plugins.legend.labels.boxWidth      = 8;
    Chart.defaults.plugins.legend.labels.padding        = 14;

    const TOOLTIP_STYLE = {
        backgroundColor : 'rgba(15, 23, 42, 0.96)',
        titleColor      : '#ffffff',
        bodyColor       : '#e2e8f0',
        borderColor     : 'rgba(255,255,255,0.08)',
        borderWidth     : 1,
        titleFont       : { size: 12, weight: '700' },
        bodyFont        : { size: 11, weight: '500' },
        padding         : 10,
        cornerRadius    : 8,
        displayColors   : true,
        boxPadding      : 4,
    };


    /* ════════════════════════════════════════════════════════
       SECTION 3 — KPI Sparklines
       ════════════════════════════════════════════════════════ */
    const SPARKS = [
        { id: 'spark-companies', color: '#4f46e5', data: [18, 22, 21, 26, 28, 25, 30, 32, 34, 33, 36, 40], fill: 'rgba(79, 70, 229, 0.15)' },
        { id: 'spark-highrisk',  color: '#ef4444', data: [92, 96, 102, 99, 108, 112, 115, 119, 122, 120, 125, 127], fill: 'rgba(239, 68, 68, 0.15)' },
        { id: 'spark-aialerts',  color: '#8b5cf6', data: [22, 28, 30, 27, 31, 36, 33, 38, 40, 42, 41, 43], fill: 'rgba(139, 92, 246, 0.15)' },
        { id: 'spark-inspeksi',  color: '#f59e0b', data: [40, 38, 45, 52, 49, 50, 55, 54, 56, 57, 59, 58], fill: 'rgba(245, 158, 11, 0.15)' },
    ];

    SPARKS.forEach(s => {
        const el = document.getElementById(s.id);
        if (!el) return;

        const ctx = el.getContext('2d');
        const W = el.clientWidth || 84;
        const H = el.clientHeight || 36;

        const min = Math.min.apply(null, s.data);
        const max = Math.max.apply(null, s.data);
        const span = (max - min) || 1;

        const points = s.data.map((v, i) => {
            const x = (i / (s.data.length - 1)) * W;
            const y = H - ((v - min) / span) * (H - 6) - 3;
            return { x, y };
        });

        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, s.fill);
        grad.addColorStop(1, 'rgba(255,255,255,0)');

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const mx = (p0.x + p1.x) / 2;
            ctx.bezierCurveTo(mx, p0.y, mx, p1.y, p1.x, p1.y);
        }
        ctx.lineTo(points[points.length - 1].x, H);
        ctx.lineTo(points[0].x, H);
        ctx.closePath();
        ctx.fillStyle = grad;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[i];
            const p1 = points[i + 1];
            const mx = (p0.x + p1.x) / 2;
            ctx.bezierCurveTo(mx, p0.y, mx, p1.y, p1.x, p1.y);
        }
        ctx.strokeStyle = s.color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.stroke();

        const last = points[points.length - 1];
        ctx.beginPath();
        ctx.arc(last.x, last.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = s.color;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(last.x, last.y, 1.6, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        function redraw() {
            const dpr = window.devicePixelRatio || 1;
            const w = el.clientWidth || 84;
            const h = el.clientHeight || 36;
            el.width = w * dpr;
            el.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        redraw();
    });


    /* ════════════════════════════════════════════════════════
       SECTION 4 — Risk Distribution (Doughnut)
       ════════════════════════════════════════════════════════ */
    const elDist = document.getElementById('chartDistribusi');
    if (elDist) {
        new Chart(elDist, {
            type: 'doughnut',
            data: {
                labels   : ['Risiko Tinggi', 'Risiko Sedang', 'Risiko Rendah'],
                datasets : [{
                    data            : [127, 485, 1841],
                    backgroundColor : ['#ef4444', '#f59e0b', '#10b981'],
                    borderColor     : '#ffffff',
                    borderWidth     : 3,
                    hoverOffset     : 6,
                    spacing         : 2,
                }]
            },
            options: {
                responsive        : true,
                maintainAspectRatio: false,
                cutout            : '72%',
                plugins: {
                    legend: {
                        position : 'bottom',
                        labels   : {
                            color   : '#475569',
                            padding : 14,
                            font    : { size: 11, weight: '600' },
                        }
                    },
                    tooltip: {
                        ...TOOLTIP_STYLE,
                        callbacks: {
                            label: ctx => {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct   = ((ctx.parsed / total) * 100).toFixed(1);
                                return `  ${ctx.parsed.toLocaleString('id-ID')} perusahaan (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }


    /* ════════════════════════════════════════════════════════
       SECTION 5 — Trend (Area line)
       ════════════════════════════════════════════════════════ */
    const elTren = document.getElementById('chartTren');
    if (elTren) {
        const ctx      = elTren.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 220);
        gradient.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
        gradient.addColorStop(1, 'rgba(239, 68, 68, 0.02)');

        new Chart(elTren, {
            type: 'line',
            data: {
                labels  : ['Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep'],
                datasets: [{
                    label              : 'Perusahaan Risiko Tinggi',
                    data               : [82, 91, 88, 103, 118, 127],
                    borderColor        : '#ef4444',
                    backgroundColor    : gradient,
                    borderWidth        : 2.5,
                    tension            : 0.42,
                    fill               : true,
                    pointBackgroundColor: '#ffffff',
                    pointBorderColor   : '#ef4444',
                    pointBorderWidth   : 2,
                    pointRadius        : 4,
                    pointHoverRadius   : 6,
                }]
            },
            options: {
                responsive          : true,
                maintainAspectRatio : false,
                interaction         : { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        ...TOOLTIP_STYLE,
                        callbacks: {
                            label: ctx => `  ${ctx.parsed.y} perusahaan risiko tinggi`
                        }
                    }
                },
                scales: {
                    y: {
                        min       : 60,
                        max       : 140,
                        grid      : { color: '#f1f5f9', drawBorder: false, drawTicks: false },
                        ticks     : { color: '#94a3b8', padding: 8, font: { size: 10 }, stepSize: 20 },
                        border    : { display: false }
                    },
                    x: {
                        grid  : { display: false },
                        ticks : { color: '#64748b', font: { size: 10.5, weight: '600' } },
                        border: { display: false }
                    }
                }
            }
        });
    }


    /* ════════════════════════════════════════════════════════
       SECTION 6 — Marker tooltip
       ════════════════════════════════════════════════════════ */
    const tooltip = document.getElementById('html-tooltip');
    const mapWrap = document.querySelector('.map-wrap');
    const markers = document.querySelectorAll('.riskmarker');

    if (tooltip && mapWrap && markers.length) {
        markers.forEach(m => {
            m.addEventListener('mouseenter', function () {
                const name  = this.dataset.name  || '—';
                const risk  = this.dataset.risk  || '—';
                const loc   = this.dataset.loc   || '—';
                const cls   = this.classList.contains('orange') ? '#fbbf24'
                            : this.classList.contains('green')  ? '#34d399'
                            : '#f87171';

                tooltip.innerHTML = `
                    <strong>${name}</strong>
                    <span class="tt-loc"><i class="ri-map-pin-2-line"></i> ${loc}</span>
                    <span class="tt-risk" style="color:${cls}">Skor Risiko: ${risk}/100</span>
                `;
                tooltip.style.display = 'block';
                tooltip.style.opacity  = '0';
                requestAnimationFrame(() => {
                    tooltip.style.transition = 'opacity 120ms ease';
                    tooltip.style.opacity     = '1';
                });
            });

            m.addEventListener('mousemove', function (e) {
                const rect = mapWrap.getBoundingClientRect();
                let x = e.clientX - rect.left + 14;
                let y = e.clientY - rect.top  + 14;
                if (x + 200 > rect.width)  x = e.clientX - rect.left - 180;
                if (y + 100 > rect.height) y = e.clientY - rect.top  - 80;
                tooltip.style.left = x + 'px';
                tooltip.style.top  = y + 'px';
            });

            m.addEventListener('mouseleave', function () {
                tooltip.style.display = 'none';
                tooltip.style.opacity  = '0';
            });
        });
    }


    /* ════════════════════════════════════════════════════════
       SECTION 7 — Misc interactions
       ════════════════════════════════════════════════════════ */
    const taskBtn = document.getElementById('create-task-btn');
    if (taskBtn) {
        taskBtn.addEventListener('click', function () {
            const orig = '<i class="ri-add-circle-line"></i> Buat Tugas Inspeksi';
            this.innerHTML = '<i class="ri-check-line"></i> Tugas Inspeksi Dibuat';
            this.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            this.style.boxShadow  = '0 6px 18px rgba(16, 185, 129, 0.35)';
            setTimeout(() => {
                this.innerHTML = orig;
                this.style.background = '';
                this.style.boxShadow  = '';
            }, 2500);
        });
    }


    document.querySelectorAll('.kpi-card').forEach(card => {
        card.addEventListener('click', function () {
            this.style.transform = 'translateY(-3px) scale(0.985)';
            setTimeout(() => { this.style.transform = ''; }, 140);
        });
    });

    document.querySelectorAll('.card-header .ch-tab').forEach(tab => {
        tab.addEventListener('click', function (e) {
            e.preventDefault();
            this.parentElement.querySelectorAll('.ch-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

});
