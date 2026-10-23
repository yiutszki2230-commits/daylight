# Daylight｜DS-037 整體視覺定型

日期：2026-10-23。狀態：使用者指定為整體風格，LOCKED。

## 正式來源

- Design_Style_Library_Complete_Guide_2026-10-23.pdf，第46頁，Design Style Library V2.2。
- DS-037_Prototype_Set_2026-10-07.png：只參照下方A（文學／閱讀）、B（城市／地理）、C（生活／心理）；上方DS-024-A不屬本風格。

## 不變特徵

一個巨大完整主物件，統領約5–10個同一概念世界的象徵物件；幾何或圖案舞台承托，維持統一平面印刷語言。背景pattern的對比低於主體。避免隨機貼紙、等權物件排陣、紙牌框依賴；資料庫提醒不適合直接承載密集數據、流程及表格。

## Daylight轉譯

- 主物件：打開的每日筆記本。
- 象徵場：時鐘（時間）、檯燈（專注）、杯碟（休息）、鋼筆（行動）、信封（等待）、鎖匙（可能性）、枝葉（成長）、星圖（探索）。
- 媒材：細密手繪線、木刻／絲網印刷感、紙粒與適量油墨磨損。
- 配色：暖紙色#F5EDDA、靛藍#193C54、赭紅#A94E32、暖金#D9A34C、灰青#6E9291。
- 三個主頁使用同一配色、平面線條、紙張底色與印刷章節標記；首頁完整展示象徵物件舞台，清單及設定頁採精簡題頭。
- 操作文字用清楚的系統中文字體；標題用本機襯線字體。離線不載入外部字型。
- 文字、勾選、表單及清單皆為真實HTML，主視覺只負責氣氛；不將重要資訊烘焙進圖片。

## 修改邊界

本輪只改視覺、PWA圖示配色及快取版本；engine.js、資料schema、localStorage key、個人規劃、考試日期、提醒及備份行為保持既有版本。AI每日學習課排程不變。

## 主視覺製作記錄

使用內建Imagegen，參照已批准DS-037 Prototype。專案資產：dist/assets/ds037-daylight-tableau.webp。原始生成檔留存於本輪generated_images，網站使用WebP以減少下載量。

原始prompt：

Use case: illustration-story. Asset type: hero illustration for Daylight, a personal To-do + Can-do PWA. Reference image is a STYLE REFERENCE, not an edit target. Use ONLY the THREE LOWER DS-037 prototypes in the reference sheet: Symbolic Object Tableau. Ignore the entire upper DS-024-A photography section and ignore all sheet labels. Create ONE original wide 3:2 landscape illustration, no collage, no UI mockup. One enormous open daily notebook is the unmistakable central hero object, physically complete and substantially larger than everything around it, upright with cream blank pages and an indigo book cover. Around it arrange about eight coherent symbolic objects from the world of everyday learning and gentle exploration: a small brass alarm clock, a warm desk lamp, a ceramic cup and saucer, a fountain pen, a folded envelope, a brass key, a small leafy sprig, a folded star chart. Objects share a believable tableau stage and overlap naturally; avoid equally weighted icon grids or isolated random stickers. A geometric patterned tiled stage supports the objects; the pattern remains lower contrast than the notebook. Deep indigo ink blue, warm parchment cream, burnt sienna red, muted ochre gold, restrained blue-green. Hand-drawn woodcut / linocut / vintage screen-printed book-cover aesthetic with fine imperfect ink contours, tactile paper grain, subtle ink wear and hatch shading. Richly illustrated like the LOWER reference prototypes, not minimal vector icons, not photorealistic, not 3D rendering. Calm, curious, optimistic, literary daily planning. Decorative sun-and-moon forms may unify the backdrop but the notebook remains dominant. Entire rectangular composition edge to edge, no ornamental playing-card border; no reliance on frame. No people, no faces. No typography, letters, words, numbers, labels, logos, watermarks; the notebook pages may have simple nonlinguistic horizontal rules and three small empty checkboxes only. Keep all main objects inside safe margins for a website, centre the notebook. Opaque parchment background.

