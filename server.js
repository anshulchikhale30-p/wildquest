const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'public');
const port = Number(process.env.PORT || 3000);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent((req.url || '/').split('?')[0]);
  if (pathname === '/health') { res.writeHead(200, { 'content-type': 'text/plain' }); return res.end('ok'); }
  const safe = pathname === '/' ? '/index.html' : (pathname === '/receiptdesk' || pathname === '/receiptdesk/' ? '/receiptdesk/index.html' : pathname);
  const file = path.normalize(path.join(root, safe));
  if (!file.startsWith(root)) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(file, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, 'index.html'), (fallbackErr, fallback) => {
        if (fallbackErr) { res.writeHead(404); return res.end('Not found'); }
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(fallback);
      });
      return;
    }
    res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache' });
    res.end(data);
  });
});
server.listen(port, '0.0.0.0', () => console.log(`WildQuest listening on ${port}`));
