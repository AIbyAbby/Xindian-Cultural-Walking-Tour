---
name: git-publish
description: 說明如何將「新店國校里與新店溪文史走讀網站」安全、正確地推送到 GitHub 儲存庫 (AIbyAbby/Xindian-Cultural-Walking-Tour) 並自動發布至 GitHub Pages。
---

# Git 網站發布與上傳指南 (Git Publish Guide)

當使用者（或 AI 助理自己）需要將修改後的網頁、新整理的田野調查故事或新圖片上傳（Push）到 GitHub，或更新線上的 GitHub Pages 網站時，請遵循本 Skill 的指引。

## 📌 儲存庫確切路徑與架構

在執行任何 Git 指令前，必須確認工作目錄位於**真正的 Git 儲存庫資料夾**中：
*   **Git 儲存庫路徑 (內層)**：`C:\Users\abby\OneDrive - 國立陽明交通大學\桌面\網站\Xindian-Cultural-Walking-Tour`
*   **原始資料與工作區 (外層)**：`C:\Users\abby\OneDrive - 國立陽明交通大學\桌面\網站`
*   **線上 GitHub 網址**：`https://github.com/AIbyAbby/Xindian-Cultural-Walking-Tour.git`
*   **發布後的公開網址**：👉 [巷弄裡的活歷史線上網站](https://aibyabby.github.io/Xindian-Cultural-Walking-Tour/)

---

## 🛠️ 標準上傳與部署工作流

### 1. 同步外層與內層檔案（非必要，但建議檢查）
如果網頁檔案（如 `index.html`、`style.css`、`script.js` 或 `pages/`、`content/` 內的故事檔）是在外層資料夾中被修改的，請先將其複製或同步覆蓋至內層 `Xindian-Cultural-Walking-Tour` 對應位置。

### 2. 執行安全掃描 (Safe Scan)
在推送前，請先執行 `safe-git-publish` 的安全掃描腳本，確保沒有意外包含本機絕對路徑（如 `C:\Users\abby\...`）、敏感金鑰或 Office 暫存鎖定檔：
```powershell
powershell -ExecutionPolicy Bypass -File "skills/safe-git-publish/scripts/scan-sensitive.ps1" -Path "."
```

### 3. 切換路徑並提交存檔 (Commit)
確認安全無虞後，在終端機中切換至本儲存庫，將變更加入追蹤並提交：
```powershell
# 切換至 Git 子資料夾
cd "C:\Users\abby\OneDrive - 國立陽明交通大學\桌面\網站\Xindian-Cultural-Walking-Tour"

# 檢查狀態
git status

# 加入所有異動檔案（會自動過濾 .gitignore 設定的暫存檔與大檔案）
git add .

# 提交存檔說明
git commit -m "更新網站故事內容與文史資料"
```

### 4. 推送至 GitHub (Push)
將本機的更新推送到 GitHub 遠端主分支：
```powershell
git push origin main
```
> 💡 *提示：如果是首次在該電腦推送，請配合彈出的瀏覽器登入視窗完成 GitHub 授權。*

### 5. 確認線上部署
推送成功後，GitHub Pages 會在 1 分鐘內自動完成背景部署。請至線上網站確認變更是否生效：
🔗 https://aibyabby.github.io/Xindian-Cultural-Walking-Tour/
