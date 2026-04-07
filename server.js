const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// MIME 類型對應
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
    // 安全的路徑處理
    let filePath = '.' + (req.url === '/' ? '/index.html' : req.url);
    filePath = path.normalize(filePath);
    
    // 防止目錄遍歷攻擊
    if (!filePath.startsWith('.')) {
        filePath = './index.html';
    }
    
    const ext = path.extname(filePath).toLowerCase();
    const contentType = mimeTypes[ext] || 'text/plain';
    
    // 讀取檔案
    fs.readFile(filePath, (err, data) => {
        if (err) {
            // 如果找不到檔案，返回 404 或首頁
            if (err.code === 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 - 找不到頁面</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('伺服器錯誤', 'utf-8');
            }
        } else {
            // 設定快取頭部
            if (ext === '.html') {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'no-cache'
                });
            } else {
                res.writeHead(200, {
                    'Content-Type': contentType,
                    'Cache-Control': 'public, max-age=31536000'
                });
            }
            res.end(data);
        }
    });
});

server.listen(PORT, () => {
    console.log(`🎉 生日網站伺服器已啟動！`);
    console.log(`📍 訪問地址: http://localhost:${PORT}`);
    console.log(`按 Ctrl+C 停止伺服器`);
});