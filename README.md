# KeyFlip 🪄

A lightweight tool that automatically remaps mistyped text between Hebrew and English layouts using a simple global hotkey.

This project is now available in **two versions**:

* **Electron/JavaScript (Windows tray app)**
* **Python (cross-platform CLI/GUI, early stage)**

---

## ✅ Features (Electron Version)

* **Bidirectional Layout Remapping**
  Convert text typed in the wrong keyboard layout — Hebrew ↔ English.

* **Global Hotkey**
  Default: `Ctrl + Shift + U`
  Automatically copies selected text, remaps it, and pastes it back.

* **Runs Silently**
  Lives in the Windows system tray and starts automatically on boot.

* **Tray Menu Options**

  * Help / Guide
  * Change Keybind
  * Quit

---

## 🐍 Python Version (Preview)

This version is a work-in-progress alternative implementation using Python.

* Does not yet have tray icon or GUI.
* Primarily intended for testing layout flipping logic.
* Keyboard automation (copy/paste) done using `pyautogui`.

To run:

```bash
python keyflip.py
```

---

## 🛠️ Install & Build (Electron App)

```bash
git clone https://github.com/PoH-rull/keyflip.git
cd keyflip
npm install

# Start in dev mode
npm start

# Build .exe (portable)
npm run pack

# Build installer
npm run dist
```

### Output Files:

* `dist/win-unpacked/KeyFlip.exe` – portable
* `dist/KeyFlip Setup.exe` – Windows installer

---

## 👟 How to Use (Electron App)

1. Select the mistyped text.
2. Press the shortcut (`Ctrl + Shift + U` by default).
3. The app copies → remaps → pastes the corrected version.
4. Right-click tray icon → Help or Change Keybind.

---

## 🔧 Technical Overview

### Electron (JavaScript)

* `main.js`: entry point
* Keyboard simulation: `@nut-tree-fork/nut-js`
* Tray app with global shortcuts
* Mapping tables: `engToHeb`, `hebToEng`

### Python

* `keyflip.py`: single script
* Uses `pyperclip`, `pyautogui`
* Basic console functionality (no tray or persistence yet)

---

## 📦 Dependencies

**Electron Version:**

* `electron`
* `electron-builder`
* `@nut-tree-fork/nut-js`

**Python Version:**

* `pyautogui`
* `pyperclip`

---

## 🧩 Known Limitations

* Python version may not work reliably across all OSes (especially hotkey timing).
* Electron version hotkey may interfere with system-level developer shortcuts.

---

## 🤝 Contributing

Pull requests welcome!

* Fork the repo
* Branch from `main`
* Open a PR with a clear description

---

## 📝 License

Licensed under the **MIT License**. See `LICENSE` for details.

---

## 👤 Author

**PoH-rull**
Creator of KeyFlip – helping users type right with one hotkey. Suggestions welcome!
