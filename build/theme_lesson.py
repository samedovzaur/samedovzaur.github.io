"""Re-skin lesson/gpu.html to the site palette without touching the lesson engine. Run after every build_lesson.py."""
import re, pathlib
p = pathlib.Path(__file__).resolve().parent.parent / "lesson" / "gpu.html"
s = p.read_text()
light = ("--paper:#F4F1EA;--card:#FBF9F4;--stage:#EBE7DD;--ink:#141411;--ink2:#3F3E39;--line:#D8D3C6;"
         "--acc:#1F7F67;--acc2:#A9681E;--good:#2F8A55;--bad:#B5443A;--dot:#D8D3C6;")
dark = ("--paper:#0F100E;--card:#171815;--stage:#131411;--ink:#ECE9E1;--ink2:#B9B5AA;--line:#2A2B26;"
        "--acc:#8FD3BD;--acc2:#E0A458;--dot:#2A2B26;--code:#121310;color-scheme:dark")
s = re.sub(r":root\{--paper:#ECEBE5;.*?--dot:#D3D0C6;", ":root{" + light, s, count=1, flags=re.S)
s = s.replace("--code:#F3F1EA;", "--code:#EFEBE2;", 1)
s = re.sub(r"--paper:#13161D;.*?--code:#151821;color-scheme:dark", dark, s, flags=re.S)
s = s.replace("--disp:'Barlow Condensed','Arial Narrow',system-ui,sans-serif", "--disp:'Instrument Serif',Georgia,serif")
s = s.replace("--font:'Atkinson Hyperlegible',system-ui,-apple-system,'Segoe UI',sans-serif", "--font:'Inter',system-ui,-apple-system,'Segoe UI',sans-serif")
fonts = '<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">'
if "fonts.googleapis.com/css2?family=Instrument+Serif" not in s:
    s = s.replace("<head>", "<head>" + fonts, 1) if "<head>" in s else s.replace("<style", fonts + "<style", 1)
for a,b in {"#14223A":"#1C2A24","#2A2E38":"#2A2B26","#2A2D33":"#2B2B27","#0F2A1C":"#17261D"}.items():
    s = s.replace(a, b)
p.write_text(s)
print("themed", p, "blue-slate left:", s.count("#13161D") + s.count("#1B1F29") + s.count("#2C3241"))
