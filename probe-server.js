// Tiny HTTP server: serves files + accepts POST /probe and writes to disk
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve('D:/JOB/SIAGA/TESTING');
const OUT  = path.resolve('D:/Users/fhika/AppData/Local/Temp/kilo/shots/probe.out.json');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
};

http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/probe') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      fs.writeFileSync(OUT, body);
      res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
      res.end('ok');
    });
    return;
  }
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end(); return;
  }
  // GET — serve file
  const url = req.url.split('?')[0];
  let p = path.join(ROOT, url === '/' ? '/index.html' : url);
  if (!p.startsWith(ROOT)) { res.writeHead(403); res.end('forbidden'); return; }
  if (!fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  const ext = path.extname(p).toLowerCase();
  res.writeHead(200, {'Content-Type': MIME[ext] || 'application/octet-stream'});
  fs.createReadStream(p).pipe(res);
}).listen(8766, () => console.log('serving on 8766'));
