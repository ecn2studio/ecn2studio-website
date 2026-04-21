// ============================================================
// ECN2 Studio — 片尾預覽系統 Apps Script
// 貼入：擴充功能 → Apps Script → 全部取代 → 儲存 → 部署
// ============================================================

// ── 主入口：部署為 Web App 後的 HTTP GET handler ──
function doGet(e) {
  const format   = e && e.parameter && e.parameter.format;
  const callback = e && e.parameter && e.parameter.callback;

  if (format === 'preview') {
    const data = getData();
    const html = HtmlService.createHtmlOutput(buildPreviewHTML(data))
      .setTitle('ECN2 片尾預覽')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    return html;
  }

  const data = getData();
  const json = JSON.stringify(data, null, 2);

  // 如果有 callback 參數，回傳 JSONP 格式（可繞過 CORS）
  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + json + ')')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  // 否則回傳純 JSON（給 Remotion / Claude 使用）
  return ContentService
    .createTextOutput(json)
    .setMimeType(ContentService.MimeType.JSON);
}

// ── 讀取所有分頁資料 ──
function getData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return {
    config:   readConfig(ss.getSheetByName('config')),
    credits:  readCredits(ss.getSheetByName('credits')),
    sponsors: readSponsors(ss.getSheetByName('sponsors')),
  };
}

// ── config 分頁：A=key, B=value ──
function readConfig(sheet) {
  if (!sheet) return {};
  const rows = sheet.getDataRange().getValues();
  const obj = {};
  rows.forEach(row => {
    const key = String(row[0]).trim();
    if (key) obj[key] = row[1];
  });
  return obj;
}

// ── credits 分頁：
//    組別行：A=組別中文, B=組別英文, C-G 空白
//    人員行：A-B 空白, C=職稱, D=職稱英文, E=姓名, F=英文姓名, G=排序
// ──
function readCredits(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();

  const groups = [];
  let currentGroup = null;

  // 跳過第一列（標題列）
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const groupZh  = String(row[0]).trim();
    const groupEn  = String(row[1]).trim();
    const roleZh   = String(row[2]).trim();
    const roleEn   = String(row[3]).trim();
    const nameZh   = String(row[4]).trim();
    const nameEn   = String(row[5]).trim();
    const order    = row[6] !== '' ? Number(row[6]) : 999;

    // 完全空白列就跳過
    if (!groupZh && !roleZh && !nameZh) continue;

    // A 欄有值 → 這是組別行
    if (groupZh) {
      currentGroup = {
        groupZh,
        groupEn,
        entries: [],
      };
      groups.push(currentGroup);
      continue;
    }

    // A 欄空白 → 這是人員行，加入當前組別
    if (currentGroup && nameZh) {
      currentGroup.entries.push({ roleZh, roleEn, nameZh, nameEn, order });
    }
  }

  // 組內依 order 排序
  groups.forEach(g => {
    g.entries.sort((a, b) => a.order - b.order);
  });

  return groups;
}

// ── sponsors 分頁：
//    等級行：A=等級中文, B=等級英文, C-F 空白
//    贊助商行：A-B 空白, C=名稱, D=英文名稱, E=Logo URL, F=排序
// ──
function readSponsors(sheet) {
  if (!sheet) return [];
  const rows = sheet.getDataRange().getValues();

  const tiers = [];
  let currentTier = null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const tierZh  = String(row[0]).trim();
    const tierEn  = String(row[1]).trim();
    const nameZh  = String(row[2]).trim();
    const nameEn  = String(row[3]).trim();
    const logoUrl = String(row[4]).trim();
    const order   = row[5] !== '' ? Number(row[5]) : 999;

    if (!tierZh && !nameZh) continue;

    if (tierZh) {
      currentTier = { tierZh, tierEn, items: [] };
      tiers.push(currentTier);
      continue;
    }

    if (currentTier && nameZh) {
      currentTier.items.push({ nameZh, nameEn, logoUrl, order });
    }
  }

  tiers.forEach(t => {
    t.items.sort((a, b) => a.order - b.order);
  });

  return tiers;
}

// ============================================================
// 工具：在 Sheets 工具列加入自訂選單
// ============================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🎬 片尾系統')
    .addItem('📋 匯出 JSON', 'exportJSON')
    .addItem('👁 開啟預覽', 'openPreview')
    .addItem('✅ 驗證資料', 'validateData')
    .addSeparator()
    .addItem('⚙️ 設定 Web App 網址', 'setWebAppUrl')
    .addToUi();
}

// ── 匯出 JSON 到 Google Drive ──
function exportJSON() {
  const data = getData();
  const json = JSON.stringify(data, null, 2);
  const filename = 'credits_' + formatDate() + '.json';

  // 存到 Drive 根目錄
  const file = DriveApp.createFile(filename, json, MimeType.PLAIN_TEXT);
  const url = file.getUrl();

  SpreadsheetApp.getUi().alert(
    '✅ JSON 匯出完成',
    '檔案已存到 Google Drive：\n' + filename + '\n\n連結：\n' + url,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// ── 開啟預覽頁 ──
function openPreview() {
  const WEBAPP_URL = PropertiesService.getScriptProperties().getProperty('WEBAPP_URL');

  if (!WEBAPP_URL) {
    SpreadsheetApp.getUi().alert(
      '⚠️ 尚未設定 Web App 網址',
      '請先從選單點「⚙️ 設定 Web App 網址」完成設定。',
      SpreadsheetApp.getUi().ButtonSet.OK
    );
    return;
  }

  const previewUrl = WEBAPP_URL + '?format=preview';
  const html = HtmlService.createHtmlOutput(
    '<div style="font-family:sans-serif;padding:24px;line-height:1.8">' +
    '<p style="margin-bottom:16px;font-size:14px">點擊下方按鈕開啟預覽：</p>' +
    '<a href="' + previewUrl + '" target="_blank" ' +
    'style="display:inline-block;padding:12px 24px;background:#c8a97e;color:#000;' +
    'text-decoration:none;border-radius:4px;font-weight:bold;font-size:14px">👁 開啟預覽頁面</a>' +
    '<hr style="margin:20px 0;border:none;border-top:1px solid #eee">' +
    '<p style="font-size:12px;color:#666;margin-bottom:6px">或手動複製網址到瀏覽器：</p>' +
    '<input type="text" value="' + previewUrl + '" readonly ' +
    'onclick="this.select()" ' +
    'style="width:100%;padding:8px;font-size:11px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;cursor:text">' +
    '</div>'
  ).setWidth(580).setHeight(200);
  SpreadsheetApp.getUi().showModalDialog(html, '👁 片尾預覽');
}

// ── 設定 Web App 網址（部署後執行一次）──
function setWebAppUrl() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '設定 Web App 網址',
    '請貼上部署後取得的 Web App 網址：\n（格式：https://script.google.com/macros/s/XXXXX/exec）',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() === ui.Button.OK) {
    const url = result.getResponseText().trim();
    PropertiesService.getScriptProperties().setProperty('WEBAPP_URL', url);
    ui.alert('✅ 已儲存 Web App 網址');
  }
}

// ── 驗證資料完整性 ──
function validateData() {
  const data = getData();
  const issues = [];

  // 檢查 config
  const requiredConfig = ['filmTitleZh', 'filmTitleEn', 'layout', 'mode'];
  requiredConfig.forEach(key => {
    if (!data.config[key]) issues.push('config 缺少欄位：' + key);
  });

  // 檢查 credits
  data.credits.forEach(group => {
    if (!group.groupEn) issues.push('組別缺少英文名稱：' + group.groupZh);
    group.entries.forEach(e => {
      if (!e.nameZh) issues.push(group.groupZh + ' 有一列缺少中文姓名');
      if (!e.roleZh) issues.push(group.groupZh + ' 有一列缺少中文職稱');
    });
  });

  // 檢查 sponsors
  data.sponsors.forEach(tier => {
    tier.items.forEach(item => {
      if (!item.logoUrl) issues.push(tier.tierZh + '「' + item.nameZh + '」缺少 Logo URL');
    });
  });

  if (issues.length === 0) {
    SpreadsheetApp.getUi().alert('✅ 驗證通過', '資料結構完整，可以匯出或預覽。', SpreadsheetApp.getUi().ButtonSet.OK);
  } else {
    SpreadsheetApp.getUi().alert('⚠️ 發現問題', issues.join('\n'), SpreadsheetApp.getUi().ButtonSet.OK);
  }
}

// ── 工具：格式化日期 ──
function formatDate() {
  const d = new Date();
  return d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0') + '_' +
    String(d.getHours()).padStart(2, '0') +
    String(d.getMinutes()).padStart(2, '0');
}

// ============================================================
// 預覽頁 HTML（內嵌在 Apps Script 回傳）
// ============================================================
function buildPreviewHTML(data) {
  const json = JSON.stringify(data);
  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>ECN2 片尾預覽</title>
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@300;400;600&family=Noto+Sans+TC:wght@300;400;500&family=DM+Serif+Display:ital@0;1&family=Space+Mono&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #0a0a0a;
    --text: #e8e4dc;
    --text-muted: #888;
    --accent: #c8a97e;
    --panel-bg: #141414;
    --panel-border: #2a2a2a;
    --font-zh: 'Noto Serif TC', serif;
    --font-en: 'DM Serif Display', serif;
    --font-mono: 'Space Mono', monospace;
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:var(--bg); color:var(--text); font-family:'Noto Sans TC',sans-serif; display:flex; height:100vh; overflow:hidden; }

  #panel { width:280px; min-width:280px; background:var(--panel-bg); border-right:1px solid var(--panel-border); display:flex; flex-direction:column; overflow-y:auto; }
  #panel-header { padding:20px; border-bottom:1px solid var(--panel-border); }
  .logo-label { font-family:var(--font-mono); font-size:10px; color:var(--accent); letter-spacing:2px; margin-bottom:4px; }
  #panel-header h1 { font-family:var(--font-en); font-size:18px; font-weight:400; }

  .section { padding:14px 18px; border-bottom:1px solid var(--panel-border); }
  .section-title { font-size:10px; letter-spacing:2px; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px; }

  .mode-toggle { display:flex; background:#1a1a1a; border-radius:6px; padding:3px; gap:3px; }
  .mode-btn { flex:1; padding:6px 8px; border:none; background:transparent; color:var(--text-muted); font-size:12px; font-family:'Noto Sans TC',sans-serif; border-radius:4px; cursor:pointer; transition:all .2s; }
  .mode-btn.active { background:var(--accent); color:#000; font-weight:500; }

  .ctrl-row { display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .ctrl-label { font-size:12px; color:var(--text-muted); }
  .ctrl-value { font-family:var(--font-mono); font-size:11px; color:var(--accent); }
  input[type=range] { width:100%; accent-color:var(--accent); margin:4px 0 10px; }
  .color-row { display:flex; gap:8px; margin-bottom:8px; align-items:center; }
  .color-row label { font-size:12px; color:var(--text-muted); flex:1; }
  input[type=color] { width:36px; height:28px; padding:2px; cursor:pointer; flex:none; background:#1a1a1a; border:1px solid var(--panel-border); border-radius:4px; }

  .action-btn { width:100%; padding:9px 10px; border:1px solid var(--panel-border); background:transparent; color:var(--text); font-size:12px; font-family:'Noto Sans TC',sans-serif; border-radius:6px; cursor:pointer; transition:all .2s; margin-bottom:6px; text-align:left; display:flex; align-items:center; gap:8px; }
  .action-btn:hover { border-color:var(--accent); color:var(--accent); }
  .action-btn.primary { background:var(--accent); color:#000; border-color:var(--accent); font-weight:500; }
  .action-btn.primary:hover { opacity:.85; }

  /* 預覽區 */
  #preview-area { flex:1; display:flex; flex-direction:column; }
  #preview-toolbar { height:44px; background:var(--panel-bg); border-bottom:1px solid var(--panel-border); display:flex; align-items:center; padding:0 16px; gap:12px; }
  .toolbar-label { font-size:11px; color:var(--text-muted); letter-spacing:1px; }
  .play-btn { margin-left:auto; padding:5px 14px; background:var(--accent); color:#000; border:none; border-radius:4px; font-size:12px; font-weight:500; cursor:pointer; font-family:'Noto Sans TC',sans-serif; }

  #preview-wrapper { flex:1; display:flex; align-items:center; justify-content:center; padding:24px; overflow:hidden; background:#050505; }
  #preview-frame { position:relative; overflow:hidden; box-shadow:0 0 0 1px #333,0 24px 80px rgba(0,0,0,.8); transition:all .3s; }
  #credit-viewport { width:100%; height:100%; overflow:hidden; position:relative; }

  /* credit 內容樣式（由 config 驅動） */
  #credit-scroll-container { position:absolute; width:100%; padding:0 10%; }
  @keyframes creditRoll { from{transform:translateY(0)} to{transform:translateY(var(--roll-end))} }

  .credit-film-title { text-align:center; padding-top:2em; margin-bottom:3em; }
  .credit-film-title .en { font-family:var(--font-en); font-style:italic; display:block; }
  .credit-film-title .zh { display:block; margin-top:.4em; letter-spacing:.3em; opacity:.5; }

  .credit-group { width:100%; margin-bottom:2.5em; text-align:center; }
  .credit-group-title-zh { letter-spacing:.15em; margin-bottom:.15em; }
  .credit-group-title-en { letter-spacing:.2em; opacity:.45; margin-bottom:.8em; border-bottom:1px solid rgba(255,255,255,.08); padding-bottom:.6em; }

  /* stack 版型 */
  .entry-stack { margin-bottom:.5em; }
  .entry-stack .row-zh { display:flex; justify-content:center; gap:2em; }
  .entry-stack .row-en { display:flex; justify-content:center; gap:2em; opacity:.4; }
  .entry-stack .role { text-align:right; }
  .entry-stack .name { text-align:left; }

  /* split 版型 */
  .entry-split { display:flex; justify-content:center; margin-bottom:.4em; gap:0; }
  .entry-split .col-zh { text-align:right; padding-right:1.5em; border-right:1px solid rgba(255,255,255,.12); }
  .entry-split .col-en { text-align:left; padding-left:1.5em; opacity:.55; }
  .entry-split .role { opacity:.6; font-size:.85em; }
  .entry-split .name { }

  /* 贊助商 */
  .sponsor-section { width:100%; margin-bottom:2.5em; text-align:center; }
  .sponsor-tier-zh { letter-spacing:.2em; margin-bottom:.15em; }
  .sponsor-tier-en { letter-spacing:.15em; opacity:.4; margin-bottom:1em; font-size:.75em; }
  .sponsor-grid { display:flex; flex-wrap:wrap; justify-content:center; gap:10px; }
  .sponsor-box { background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08); border-radius:4px; display:flex; align-items:center; justify-content:center; padding:0 14px; font-size:.75em; color:rgba(255,255,255,.6); }
  .sponsor-box img { max-width:100%; max-height:100%; object-fit:contain; }

  .credit-end { text-align:center; padding:4em 0 6em; opacity:.25; font-family:var(--font-mono); font-size:.7em; letter-spacing:.2em; }

  /* 分頁模式 */
  #page-container { position:absolute; inset:0; display:none; align-items:center; justify-content:center; flex-direction:column; padding:8%; opacity:0; transition:opacity .5s; }
  #page-container.visible { opacity:1; }
  .page-nav-btn { position:absolute; top:50%; transform:translateY(-50%); background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.1); color:rgba(255,255,255,.5); width:30px; height:30px; border-radius:50%; font-size:14px; cursor:pointer; display:none; align-items:center; justify-content:center; z-index:10; }
  #prev-page { left:8px; }
  #next-page { right:8px; }
  #page-indicator { position:absolute; bottom:12px; left:50%; transform:translateX(-50%); display:none; gap:5px; z-index:10; }
  .page-dot { width:5px; height:5px; border-radius:50%; background:rgba(255,255,255,.2); transition:all .3s; }
  .page-dot.active { background:var(--credit-accent,#c8a97e); width:14px; border-radius:3px; }
</style>
</head>
<body>
<div id="panel">
  <div id="panel-header">
    <div class="logo-label">ECN2 STUDIO</div>
    <h1>片尾預覽系統</h1>
  </div>

  <div class="section">
    <div class="section-title">播放模式</div>
    <div class="mode-toggle">
      <button class="mode-btn" id="btn-scroll" onclick="setMode('scroll')">捲動 Roll</button>
      <button class="mode-btn" id="btn-page" onclick="setMode('page')">分頁切換</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">排版版型</div>
    <div class="mode-toggle">
      <button class="mode-btn" id="btn-stack" onclick="setLayout('stack')">中上英下</button>
      <button class="mode-btn" id="btn-split" onclick="setLayout('split')">左中右英</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">風格</div>
    <div class="color-row"><label>背景色</label><input type="color" id="color-bg" oninput="applyColors()"></div>
    <div class="color-row"><label>文字色</label><input type="color" id="color-text" oninput="applyColors()"></div>
    <div class="color-row"><label>強調色</label><input type="color" id="color-accent" oninput="applyColors()"></div>
    <div class="ctrl-row"><span class="ctrl-label">字體大小</span><span class="ctrl-value" id="val-fs">18px</span></div>
    <input type="range" id="range-fs" min="12" max="28" value="18" oninput="applyFontSize()">
    <div class="ctrl-row"><span class="ctrl-label">行距</span><span class="ctrl-value" id="val-lh">1.8</span></div>
    <input type="range" id="range-lh" min="12" max="30" value="18" oninput="applyLineHeight()">
  </div>

  <div class="section" id="scroll-section">
    <div class="section-title">捲動速度</div>
    <div class="ctrl-row"><span class="ctrl-label">速度</span><span class="ctrl-value" id="val-spd">普通</span></div>
    <input type="range" id="range-spd" min="1" max="5" value="3" oninput="updateSpeed()">
  </div>

  <div class="section">
    <div class="section-title">畫幅</div>
    <div class="mode-toggle">
      <button class="mode-btn active" onclick="setAspect(2.35,this)">2.35:1</button>
      <button class="mode-btn" onclick="setAspect(16/9,this)">16:9</button>
      <button class="mode-btn" onclick="setAspect(4/3,this)">4:3</button>
    </div>
  </div>

  <div class="section">
    <div class="section-title">操作</div>
    <button class="action-btn primary" onclick="togglePlay()">▶ 播放預覽</button>
    <button class="action-btn" onclick="resetPreview()">↺ 重置</button>
    <button class="action-btn" onclick="copyJSON()">⬇ 複製 JSON</button>
  </div>
</div>

<div id="preview-area">
  <div id="preview-toolbar">
    <span class="toolbar-label">PREVIEW</span>
    <span class="toolbar-label" id="tb-mode" style="color:var(--accent)">SCROLL</span>
    <span class="toolbar-label" id="tb-layout" style="color:var(--accent)">STACK</span>
    <button class="play-btn" onclick="togglePlay()">▶ 播放</button>
  </div>
  <div id="preview-wrapper">
    <div id="preview-frame">
      <div id="credit-viewport">
        <div id="credit-scroll-container"></div>
        <div id="page-container"></div>
        <button class="page-nav-btn" id="prev-page" onclick="changePage(-1)">‹</button>
        <button class="page-nav-btn" id="next-page" onclick="changePage(1)">›</button>
        <div id="page-indicator" style="display:none"></div>
      </div>
    </div>
  </div>
</div>

<script>
// ── 從 Apps Script 注入的資料 ──
const RAW = ${json};

let mode = RAW.config.mode || 'scroll';
let layout = RAW.config.layout || 'stack';
let aspect = 2.35;
let isPlaying = false;
let currentPage = 0;
let pages = [];
const SPEED_DUR = [0, 120, 90, 60, 40, 25];
const SPEED_LABEL = ['', '很慢', '慢', '普通', '快', '很快'];

// ── 初始化 ──
window.addEventListener('load', () => {
  // 套用 config 顏色
  document.getElementById('color-bg').value    = RAW.config.bgColor     || '#000000';
  document.getElementById('color-text').value  = RAW.config.textColor   || '#ffffff';
  document.getElementById('color-accent').value= RAW.config.accentColor || '#c8a97e';
  const fs = RAW.config.fontSize || 18;
  document.getElementById('range-fs').value = fs;
  document.getElementById('val-fs').textContent = fs + 'px';

  applyColors();
  setMode(mode, true);
  setLayout(layout, true);
  setAspect(aspect, null, true);
});

function applyColors() {
  const frame = document.getElementById('preview-frame');
  frame.style.background = document.getElementById('color-bg').value;
  frame.style.color = document.getElementById('color-text').value;
  frame.style.setProperty('--credit-accent', document.getElementById('color-accent').value);
}

function applyFontSize() {
  const v = document.getElementById('range-fs').value;
  document.getElementById('val-fs').textContent = v + 'px';
  document.getElementById('preview-frame').style.fontSize = v + 'px';
  rebuild();
}

function applyLineHeight() {
  const v = (document.getElementById('range-lh').value / 10).toFixed(1);
  document.getElementById('val-lh').textContent = v;
  document.getElementById('preview-frame').style.lineHeight = v;
  rebuild();
}

function updateSpeed() {
  const v = document.getElementById('range-spd').value;
  document.getElementById('val-spd').textContent = SPEED_LABEL[v];
}

// ── 畫幅 ──
function setAspect(ratio, btn, init) {
  aspect = ratio;
  if (btn) {
    btn.closest('.mode-toggle').querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  }
  resizeFrame();
  if (!init) rebuild();
}

function resizeFrame() {
  const wrap = document.getElementById('preview-wrapper');
  const mw = wrap.clientWidth - 48, mh = wrap.clientHeight - 48;
  let w = mw, h = w / aspect;
  if (h > mh) { h = mh; w = h * aspect; }
  const frame = document.getElementById('preview-frame');
  frame.style.width  = Math.floor(w) + 'px';
  frame.style.height = Math.floor(h) + 'px';
}
window.addEventListener('resize', () => { resizeFrame(); });

// ── 模式 & 版型切換 ──
function setMode(m, init) {
  mode = m;
  document.getElementById('btn-scroll').classList.toggle('active', m === 'scroll');
  document.getElementById('btn-page').classList.toggle('active', m === 'page');
  document.getElementById('scroll-section').style.display = m === 'scroll' ? 'block' : 'none';
  document.getElementById('tb-mode').textContent = m === 'scroll' ? 'SCROLL' : 'PAGE';
  isPlaying = false;
  if (!init) rebuild();
}

function setLayout(l, init) {
  layout = l;
  document.getElementById('btn-stack').classList.toggle('active', l === 'stack');
  document.getElementById('btn-split').classList.toggle('active', l === 'split');
  document.getElementById('tb-layout').textContent = l === 'stack' ? 'STACK' : 'SPLIT';
  if (!init) rebuild();
}

// ── 內容建構 ──
function rebuild() {
  if (mode === 'scroll') buildScroll();
  else buildPages();
}

function buildCreditHTML() {
  const c = RAW.config;
  const fs = parseFloat(document.getElementById('range-fs').value);
  let html = '';

  // 片名
  html += \`<div class="credit-film-title">
    <span class="en" style="font-size:\${fs*2.4}px">\${c.filmTitleEn || ''}</span>
    <span class="zh" style="font-size:\${fs*1.0}px">\${c.filmTitleZh || ''}</span>
  </div>\`;

  // credits
  RAW.credits.forEach(group => {
    html += \`<div class="credit-group">
      <div class="credit-group-title-zh" style="font-size:\${fs*0.7}px;color:var(--credit-accent,#c8a97e);letter-spacing:.2em">\${group.groupZh}</div>
      <div class="credit-group-title-en" style="font-size:\${fs*0.55}px">\${group.groupEn}</div>\`;

    group.entries.forEach(e => {
      if (layout === 'stack') {
        html += \`<div class="entry-stack" style="font-size:\${fs}px">
          <div class="row-zh">
            <span class="role" style="min-width:6em">\${e.roleZh}</span>
            <span class="name" style="min-width:6em">\${e.nameZh}</span>
          </div>
          \${(e.roleEn || e.nameEn) ? \`<div class="row-en" style="font-size:\${fs*0.72}px">
            <span class="role" style="min-width:6em">\${e.roleEn || ''}</span>
            <span class="name" style="min-width:6em">\${e.nameEn || ''}</span>
          </div>\` : ''}
        </div>\`;
      } else {
        html += \`<div class="entry-split" style="font-size:\${fs}px">
          <div class="col-zh">
            <div class="role" style="font-size:\${fs*0.75}px">\${e.roleZh}</div>
            <div class="name">\${e.nameZh}</div>
          </div>
          <div class="col-en">
            <div class="role" style="font-size:\${fs*0.75}px">\${e.roleEn || ''}</div>
            <div class="name">\${e.nameEn || ''}</div>
          </div>
        </div>\`;
      }
    });
    html += \`</div>\`;
  });

  // 贊助商
  const tierSizes = { 0:{w:140,h:54}, 1:{w:110,h:44}, 2:{w:86,h:36}, 3:{w:110,h:34} };
  RAW.sponsors.forEach((tier, ti) => {
    const sz = tierSizes[ti] || {w:100,h:40};
    const scale = fs / 18;
    const sw = Math.round(sz.w * scale), sh = Math.round(sz.h * scale);
    html += \`<div class="sponsor-section">
      <div class="sponsor-tier-zh" style="font-size:\${fs*0.65}px;color:var(--credit-accent,#c8a97e);letter-spacing:.2em">\${tier.tierZh}</div>
      <div class="sponsor-tier-en" style="font-size:\${fs*0.5}px">\${tier.tierEn || ''}</div>
      <div class="sponsor-grid">\`;
    tier.items.forEach(item => {
      if (item.logoUrl && item.logoUrl !== 'undefined' && item.logoUrl.startsWith('http')) {
        html += \`<div class="sponsor-box" style="width:\${sw}px;height:\${sh}px"><img src="\${item.logoUrl}" alt="\${item.nameZh}"></div>\`;
      } else {
        html += \`<div class="sponsor-box" style="width:\${sw}px;height:\${sh}px">\${item.nameZh}</div>\`;
      }
    });
    html += \`</div></div>\`;
  });

  html += \`<div class="credit-end">© \${new Date().getFullYear()} 伊西恩兔映像有限公司</div>\`;
  return html;
}

function buildScroll() {
  const sc = document.getElementById('credit-scroll-container');
  const pc = document.getElementById('page-container');
  sc.style.display = 'block';
  pc.style.display = 'none';
  document.getElementById('prev-page').style.display = 'none';
  document.getElementById('next-page').style.display = 'none';
  document.getElementById('page-indicator').style.display = 'none';

  const fh = document.getElementById('preview-frame').clientHeight;
  sc.innerHTML = \`<div style="height:\${fh}px"></div>\` + buildCreditHTML() + \`<div style="height:\${fh}px"></div>\`;
  sc.style.animation = 'none';
  sc.style.transform = '';
  isPlaying = false;
}

function buildPages() {
  const sc = document.getElementById('credit-scroll-container');
  const pc = document.getElementById('page-container');
  sc.style.display = 'none';
  pc.style.display = 'flex';
  document.getElementById('prev-page').style.display = 'flex';
  document.getElementById('next-page').style.display = 'flex';
  document.getElementById('page-indicator').style.display = 'flex';

  const c = RAW.config;
  const fs = parseFloat(document.getElementById('range-fs').value);
  pages = [];

  // 片名頁
  pages.push(\`<div class="credit-film-title" style="margin-bottom:0">
    <span class="en" style="font-size:\${fs*2.4}px">\${c.filmTitleEn||''}</span>
    <span class="zh" style="font-size:\${fs*1.0}px">\${c.filmTitleZh||''}</span>
  </div>\`);

  // 各組頁
  RAW.credits.forEach(group => {
    let html = \`<div class="credit-group" style="margin-bottom:0;width:100%">
      <div class="credit-group-title-zh" style="font-size:\${fs*0.7}px;color:var(--credit-accent,#c8a97e);letter-spacing:.2em">\${group.groupZh}</div>
      <div class="credit-group-title-en" style="font-size:\${fs*0.55}px">\${group.groupEn}</div>\`;
    group.entries.forEach(e => {
      if (layout === 'stack') {
        html += \`<div class="entry-stack" style="font-size:\${fs}px">
          <div class="row-zh"><span class="role" style="min-width:6em">\${e.roleZh}</span><span class="name" style="min-width:6em">\${e.nameZh}</span></div>
          \${(e.roleEn||e.nameEn)?'<div class="row-en" style="font-size:'+fs*0.72+'px"><span class="role" style="min-width:6em">'+e.roleEn+'</span><span class="name" style="min-width:6em">'+e.nameEn+'</span></div>':''}
        </div>\`;
      } else {
        html += \`<div class="entry-split" style="font-size:\${fs}px">
          <div class="col-zh"><div class="role" style="font-size:\${fs*0.75}px">\${e.roleZh}</div><div class="name">\${e.nameZh}</div></div>
          <div class="col-en"><div class="role" style="font-size:\${fs*0.75}px">\${e.roleEn||''}</div><div class="name">\${e.nameEn||''}</div></div>
        </div>\`;
      }
    });
    html += '</div>';
    pages.push(html);
  });

  // 贊助商頁
  const tierSizes = [{w:140,h:54},{w:110,h:44},{w:86,h:36},{w:110,h:34}];
  RAW.sponsors.forEach((tier, ti) => {
    const sz = tierSizes[ti] || {w:100,h:40};
    const scale = fs/18;
    const sw=Math.round(sz.w*scale), sh=Math.round(sz.h*scale);
    let logos = tier.items.map(item =>
      (item.logoUrl&&item.logoUrl.startsWith('http'))
        ? \`<div class="sponsor-box" style="width:\${sw}px;height:\${sh}px"><img src="\${item.logoUrl}" alt="\${item.nameZh}"></div>\`
        : \`<div class="sponsor-box" style="width:\${sw}px;height:\${sh}px">\${item.nameZh}</div>\`
    ).join('');
    pages.push(\`<div class="sponsor-section" style="margin:0;width:100%">
      <div class="sponsor-tier-zh" style="font-size:\${fs*0.65}px;color:var(--credit-accent,#c8a97e);letter-spacing:.2em">\${tier.tierZh}</div>
      <div class="sponsor-tier-en" style="font-size:\${fs*0.5}px">\${tier.tierEn||''}</div>
      <div class="sponsor-grid">\${logos}</div>
    </div>\`);
  });

  currentPage = 0;
  showPage(0);
}

function showPage(idx) {
  const pc = document.getElementById('page-container');
  pc.classList.remove('visible');
  setTimeout(() => {
    pc.innerHTML = pages[idx] || '';
    pc.classList.add('visible');
    // dots
    const ind = document.getElementById('page-indicator');
    ind.innerHTML = pages.map((_,i)=>\`<div class="page-dot \${i===idx?'active':''}"></div>\`).join('');
  }, 280);
}

function changePage(dir) {
  currentPage = Math.max(0, Math.min(pages.length-1, currentPage+dir));
  showPage(currentPage);
}

// ── 播放控制 ──
function togglePlay() {
  if (mode === 'scroll') {
    isPlaying ? resetPreview() : startScroll();
  } else {
    changePage(1);
  }
}

function startScroll() {
  const sc = document.getElementById('credit-scroll-container');
  const fh = document.getElementById('preview-frame').clientHeight;
  const totalH = sc.scrollHeight;
  const spd = SPEED_DUR[document.getElementById('range-spd').value];
  sc.style.setProperty('--roll-end', \`-\${totalH - fh}px\`);
  sc.style.animation = \`creditRoll \${spd}s linear forwards\`;
  isPlaying = true;
  sc.addEventListener('animationend', () => { isPlaying=false; }, {once:true});
}

function resetPreview() {
  const sc = document.getElementById('credit-scroll-container');
  sc.style.animation = 'none';
  sc.style.transform = '';
  isPlaying = false;
  rebuild();
}

// ── 複製 JSON ──
function copyJSON() {
  const out = {
    config: {
      ...RAW.config,
      bgColor: document.getElementById('color-bg').value,
      textColor: document.getElementById('color-text').value,
      accentColor: document.getElementById('color-accent').value,
      fontSize: document.getElementById('range-fs').value,
      scrollSpeed: document.getElementById('range-spd').value,
      layout,
      mode,
    },
    credits: RAW.credits,
    sponsors: RAW.sponsors,
  };
  navigator.clipboard.writeText(JSON.stringify(out, null, 2))
    .then(() => alert('✅ JSON 已複製到剪貼簿，可直接貼給 Claude 或 Remotion 使用'));
}

// ── 首次建構 ──
setTimeout(() => { resizeFrame(); applyColors(); rebuild(); }, 80);
</script>
</body>
</html>`;
}
