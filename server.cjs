const http = require('http');
const fs = require('fs');
const path = require('path');

const root = fs.existsSync(path.join(__dirname, 'dist', 'index.html')) ? path.join(__dirname, 'dist') : __dirname;
const port = process.env.PORT || 5173;

const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8'
};

function resolveTarget(urlPath = '/') {
  const clean = urlPath === '/' ? '/index.html' : decodeURIComponent(urlPath);
  const file = path.normalize(path.join(root, clean));
  return file.startsWith(root) ? file : null;
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  const target = resolveTarget(url.pathname);
  if (!target) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(target, (err, data) => {
    if (err) {
      fs.readFile(path.join(root, 'index.html'), (e, html) => {
        if (e) {
          res.writeHead(404);
          return res.end('Not found');
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
        res.end(html);
      });
      return;
    }

    res.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-store'
    });
    res.end(data);
  });
}).listen(port, () => console.log(`Co Pilot Security v3.0.7 running on http://localhost:${port}`));
