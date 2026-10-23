# Daylight V1.1｜DS-037 GitHub Pages

這是DS-037「象徵物件舞台」版本，和已發布預覽版使用相同網站程式及主視覺。

## GitHub Pages設定

1. 建立Public repository，例如daylight。若更新現有repo，保留原repo及原網站網址。
2. 把本資料夾內的網站檔案和assets資料夾上傳到repo最外層。必須在repo首頁直接看見index.html；不要再包一層UPLOAD_TO_GITHUB資料夾。
3. Settings → Pages → Build and deployment → Source：Deploy from a branch。
4. Branch選main，Folder選/(root)，按Save。
5. 等GitHub顯示發布完成，使用它提供的網站網址。

不需要npm、Terminal、API key或GitHub Actions workflow。app使用相對路徑，支援專案網站的子路徑。

## 首次使用

網站內按「匯入我的規劃」，從你電腦選交付包外層的personal-plan.json。個人規劃及備份不需要上傳到GitHub。

iPhone/iPad：Safari → 分享 → 加入主畫面。Mac可使用支援版本瀏覽器的安裝／加入Dock功能。

## 更新舊網站

先在App匯出備份，再更新原repo。沿用同一網址與瀏覽器；這次資料格式沒有變。若已有進度，毋須再次匯入初始personal-plan.json，以免覆蓋進度。看到舊樣式時，先關閉App重開或重新整理，讓新快取啟用。

## 每日提醒

在最終部署網址打開設定，下載並匯入日曆ICS，先測試3分鐘提醒。通知只提醒打開App，完整清單在App按當日日期產生；本版沒有背景Web Push或自動讀取Work Chat。

完成狀態保存在瀏覽器；跨裝置用JSON備份／還原，沒有自動雲端同步。

Pages官方說明：https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
