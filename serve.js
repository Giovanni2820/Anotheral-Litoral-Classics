// Minimal static file server for local preview.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4321;
const TYPES = { '.html':'text/html', '.css':'text/css', '.js':'text/javascript',
                '.svg':'image/svg+xml', '.mp4':'video/mp4', '.json':'application/json',
                '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg',
                '.webp':'image/webp', '.avif':'image/avif', '.gif':'image/gif' };

http.createServer((req, res) => {
  const rel = decodeURIComponent(req.url.split('?')[0]);
  const file = path.join(__dirname, rel === '/' ? 'index.html' : rel);
  if (!file.startsWith(__dirname)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/plain'}).end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    res.end(buf);
  });
}).listen(PORT, () => console.log(`serving on http://localhost:${PORT}`));
