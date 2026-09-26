const fs = require('fs');
let src = fs.readFileSync('build-pages-temp.js', 'utf8');

const loopStart = src.indexOf('for (const [filename, page] of Object.entries(otherPages))');
if (loopStart !== -1) {
    const dataIntStart = src.indexOf('/* ════════════════════════════════════════════', loopStart);
    const newLoop = `
for (const [filename, cfg] of Object.entries(otherPages)) {
    const html = [
        buildHead(cfg.title, false),
        buildSidebar(cfg.active),
        buildTopbar(cfg.title, cfg.breadcrumb || cfg.title),
        cfg.content,
        buildFooter(false)
    ].join('\\n');
    fs.writeFileSync('d:/JOB/SIAGA/TESTING/' + filename, html, 'utf8');
    console.log('✅  ' + filename);
}
`;
    src = src.slice(0, loopStart) + newLoop + src.slice(dataIntStart);
    fs.writeFileSync('build-pages.js', src, 'utf8');
    console.log('Fixed loop and saved to build-pages.js');
}
