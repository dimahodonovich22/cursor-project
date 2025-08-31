// Minimal static file server for Playwright tests
// Serves files from the "LinkedIn Website" directory on http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, 'LinkedIn Website');
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

function send(res, status, data, type) {
  res.writeHead(status, { 'Content-Type': type || 'text/plain; charset=utf-8' });
  res.end(data);
}

function handler(req, res) {
  try {
    // Decode and normalize URL path
    const urlPath = decodeURI(new URL(req.url, `http://${req.headers.host}`).pathname);
    let filePath = path.join(ROOT_DIR, urlPath);

    // If directory, serve index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    // If root, serve root index.html
    if (urlPath === '/' || urlPath === '') {
      filePath = path.join(ROOT_DIR, 'index.html');
    }

    if (!fs.existsSync(filePath)) {
      return send(res, 404, 'Not Found');
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = MIME[ext] || 'application/octet-stream';
    const stream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': type });
    stream.pipe(res);
    stream.on('error', (e) => send(res, 500, String(e)));
  } catch (e) {
    send(res, 500, String(e));
  }
}

if (require.main === module) {
  http.createServer(handler).listen(PORT, () => {
    console.log(`Static server running at http://localhost:${PORT}`);
    console.log(`Serving: ${ROOT_DIR}`);
  });
}

module.exports = { handler };

