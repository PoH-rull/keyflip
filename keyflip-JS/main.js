// Electron App: KeyFlip - Windows Background Text Remapper (Hebrew <-> English)

const { app, Tray, Menu, globalShortcut, clipboard, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let tray;
let currentKeybind = 'Control+Shift+U';
let windows = [];

const engToHeb = {
  'q':'/', 'w':"'", 'e':'ק', 'r':'ר', 't':'א', 'y':'ט', 'u':'ו', 'i':'ן',
  'o':'ם', 'p':'פ', 'a':'ש', 's':'ד', 'd':'ג', 'f':'כ', 'g':'ע', 'h':'י',
  'j':'ח', 'k':'ל', 'l':'ך',';':'ף', 'z':'ז', 'x':'ס', 'c':'ב', 'v':'ה', 'b':'נ',
  'n':'מ', 'm':'צ', ',':'ת', '.':'ץ'
};

const hebToEng = {
  '/':'q', "'":'w', 'ק':'e', 'ר':'r', 'א':'t', 'ט':'y', 'ו':'u', 'ן':'i',
  'ם':'o', 'פ':'p', 'ש':'a', 'ד':'s', 'ג':'d', 'כ':'f', 'ע':'g', 'י':'h',
  'ח':'j', 'ל':'k', 'ך':'l', 'ף':';', 'ז':'z', 'ס':'x', 'ב':'c', 'ה':'v',
  'נ':'b', 'מ':'n', 'צ':'m', 'ת':',', 'ץ':'.'
};

function detectHebrew(text) {
  return /[\u0590-\u05FF]/.test(text);
}

function remapText(text) {
  const map = detectHebrew(text) ? hebToEng : engToHeb;
  return text.split('').map(char => map[char.toLowerCase()] || char).join('');
}

function setupHotkey(keybind = currentKeybind) {
  globalShortcut.unregisterAll();
  globalShortcut.register(keybind, () => {
    const text = clipboard.readText();
    if (!text) return;
    clipboard.writeText(remapText(text));
  });
}

function createHelpWindow() {
  const win = new BrowserWindow({
    width: 400,
    height: 400,
    resizable: false,
    title: "KeyFlip - How to Use",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  windows.push(win);
  win.on('closed', () => windows = windows.filter(w => w !== win));

  win.loadURL('data:text/html;charset=utf-8,' + encodeURI(`
    <h2>KeyFlip Guide</h2>
    <p><strong>What it does:</strong><br> Converts mistyped text between Hebrew and English layouts.</p>
    <p><strong>How to use:</strong><br>
    1. Copy the text you typed incorrectly (Ctrl+C)<br>
    2. Press your selected shortcut (default: Ctrl+Shift+U) – the corrected version is copied to your clipboard<br>
    3. Paste it (Ctrl+V)</p>
    <p><strong>To quit:</strong> Right-click the tray icon and select "Quit".</p>
  `));
}

function createKeybindWindow() {
  const win = new BrowserWindow({
    width: 300,
    height: 150,
    resizable: false,
    title: "Set Keybind",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  windows.push(win);
  win.on('closed', () => windows = windows.filter(w => w !== win));

  win.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
    <h3>Set new keybind:</h3>
    <input id="keybind" type="text" value="${currentKeybind}" style="width:200px"/>
    <button id="setBtn">Set</button>
    <script>
      const { ipcRenderer } = require('electron');
      document.getElementById('setBtn').addEventListener('click', () => {
        const keybind = document.getElementById('keybind').value;
        ipcRenderer.send('set-keybind', keybind);
      });
      ipcRenderer.on('close-keybind', () => window.close());
    </script>
  `));
}

ipcMain.on('set-keybind', (event, keybind) => {
  currentKeybind = keybind;
  setupHotkey(currentKeybind);
  event.sender.send('close-keybind');
});

app.whenReady().then(() => {
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath
  });

  tray = new Tray(path.join(__dirname, 'icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    { label: 'Help / Guide', click: () => createHelpWindow() },
    { label: 'Change Keybind', click: () => createKeybindWindow() },
    { label: 'Quit', click: () => app.quit() }
  ]);
  tray.setToolTip('KeyFlip is running');
  tray.setContextMenu(contextMenu);

  setupHotkey();
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});
