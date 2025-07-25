#!/usr/bin/env python3
# keyflip_py.py — KeyFlip in Python with Tray, Help & Change Keybind

import re, time, threading, pyperclip, keyboard, tkinter as tk
from tkinter import simpledialog, messagebox
from pystray import Icon, MenuItem, Menu
from PIL import Image

# ─── Mapping Tables ────────────────────────────────────────────────────────────

eng_to_heb = {
    'q':'/', 'w':"'", 'e':'ק', 'r':'ר', 't':'א', 'y':'ט', 'u':'ו', 'i':'ן',
    'o':'ם', 'p':'פ', 'a':'ש', 's':'ד', 'd':'ג', 'f':'כ', 'g':'ע', 'h':'י',
    'j':'ח', 'k':'ל', 'l':'ך', ';':'ף', 'z':'ז', 'x':'ס', 'c':'ב', 'v':'ה',
    'b':'נ', 'n':'מ', 'm':'צ', ',':'ת', '.':'ץ'
}
heb_to_eng = {v:k for k,v in eng_to_heb.items()}
_hebrew_re = re.compile(r'[\u0590-\u05FF]')

def detect_hebrew(txt):
    return bool(_hebrew_re.search(txt))

def remap_text(txt):
    table = heb_to_eng if detect_hebrew(txt) else eng_to_heb
    out = []
    for ch in txt:
        low = ch.lower()
        mapped = table.get(low, ch)
        # preserve uppercase
        if ch.isupper() and mapped.isalpha():
            mapped = mapped.upper()
        out.append(mapped)
    return ''.join(out)

# ─── Hotkey Logic ───────────────────────────────────────────────────────────────

HOTKEY = 'ctrl+shift+u'

def on_hotkey():
    def work():
        keyboard.send('ctrl+c')
        time.sleep(0.15)
        text = pyperclip.paste()
        if not text:
            return
        fixed = remap_text(text)
        pyperclip.copy(fixed)
        time.sleep(0.05)
        keyboard.send('ctrl+v')
    threading.Thread(target=work, daemon=True).start()

def register_hotkey():
    keyboard.clear_all_hotkeys()
    keyboard.add_hotkey(HOTKEY, on_hotkey, suppress=True)

# ─── Tray & UI ─────────────────────────────────────────────────────────────────

def show_help(icon, item):
    messagebox.showinfo(
        "KeyFlip Guide",
        "Select text → Press {} → it will copy, convert, paste automatically.".format(HOTKEY)
    )

def change_keybind(icon, item):
    global HOTKEY
    root = tk.Tk()
    root.withdraw()
    new = simpledialog.askstring("KeyFlip", "Enter new hotkey (e.g. ctrl+alt+z):", initialvalue=HOTKEY)
    root.destroy()
    if new:
        HOTKEY = new
        register_hotkey()

def quit_app(icon, item):
    icon.stop()

# load a tray icon image (16×16 or 32×32 PNG)
icon_image = Image.open("icon.png")

menu = Menu(
    MenuItem("Help / Guide", show_help),
    MenuItem("Change Keybind", change_keybind),
    MenuItem("Quit", quit_app)
)

def main():
    register_hotkey()
    tray = Icon("KeyFlip", icon_image, "KeyFlip", menu)
    # Run the icon — this blocks
    tray.run()

if __name__ == "__main__":
    main()
