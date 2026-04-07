# 生日慶祝網站 - 部署指南

## 📁 檔案結構
```
hbd/
├── index.html      （主頁面）
├── style.css       （樣式）
├── script.js       （互動效果）
├── server.js       （簡易伺服器）
└── README.md       （本檔案）
```

## 🚀 本地測試

### 方法1：直接開啟 HTML
在瀏覽器中開啟 `index.html` 即可

### 方法2：使用 Node.js 伺服器
```bash
# 安裝依賴
npm install

# 啟動伺服器
node server.js

# 然後訪問 http://localhost:3000
```

### 方法3：使用 Python 簡易伺服器
```bash
# Python 3
python -m http.server 3000

# 然後訪問 http://localhost:3000
```

## 🌐 部署到 hbdlyr.site

### 步驟1：DNS 配置
1. 登入你的域名註冊商（例如 GoDaddy、Namecheap 等）
2. 進入 DNS 管理頁面
3. 添加 A 記錄指向你的伺服器 IP
   ```
   類型: A
   名稱: @ 或 www
   值: [你的伺服器IP]
   ```

### 步驟2：選擇託管方案

#### 方案A：使用免費託管（推薦新手）
- **Vercel** (最推薦)
  ```bash
  npm install -g vercel
  vercel
  ```
  然後在 Vercel 中連結你的 hbdlyr.site 域名

- **Netlify**
  - 將檔案推到 GitHub
  - 連結到 Netlify
  - 在設定中添加自訂域名

- **GitHub Pages**
  - 推送此專案到 GitHub
  - 在 Repository Settings 啟用 GitHub Pages
  - 設定自訂域名為 hbdlyr.site

#### 方案B：使用自己的伺服器
1. 購買或租用伺服器（VPS）
2. 將檔案上傳到伺服器
3. 使用 Nginx 或 Apache 設定網站
4. 配置 SSL 憑證（Let's Encrypt）
5. 更新 DNS 記錄指向伺服器 IP

### 步驟3：設定 SSL/HTTPS（可選但推薦）
```bash
# 使用 Let's Encrypt（免費）
sudo certbot certonly --standalone -d hbdlyr.site
```

## 🎨 自訂網站

### 修改文字
編輯 `index.html` 中的以下部分：
```html
<h1 class="title">🎂 生日快樂 🎂</h1>
<p class="subtitle">祝你生日快樂！</p>
<p>🎊 希望今年你會更快樂、更健康 🎊</p>
```

### 修改顏色
編輯 `style.css` 中的漸層色彩：
```css
background: linear-gradient(135deg, #ff6b9d 0%, #c06c84 25%, ...);
```

### 新增音樂
用你喜歡的生日歌音檔替換 `index.html` 中的音樂連結

## ✨ 功能介紹
- 🎉 點擊「慶祝」按鈕播放動畫和音樂
- 🎈 點擊氣球會有爆炸效果
- 📱 完全響應式設計，支援手機和桌面
- ⌨️ 按空格鍵也能觸發慶祝效果
- 🎊 自動產生彩紙動畫

## 🔧 技術棧
- HTML5
- CSS3（含特效動畫）
- Vanilla JavaScript
- 無需外部依賴

## 💡 需要幫助？
- 查看瀏覽器控制台以了解任何錯誤信息
- 確保所有檔案在同一目錄中
- 清除瀏覽器快取並重新載入頁面

祝你生日快樂！🎂🎉🎈