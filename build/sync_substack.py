#!/usr/bin/env python3
"""Pull posts from the Substack and Medium RSS feeds into index.html (one shared card deck + tree branch).

Run from the site root: python3 build/sync_substack.py
Only the text between the WRITING markers is rewritten. Every post becomes one card; both platforms look the same.
"""
import html
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from pathlib import Path

FEED = "https://zaursamadov.substack.com/feed"
MEDIUM_FEED = "https://medium.com/feed/@ZaurSamedov"
ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
IMG_DIR = ROOT / "assets" / "writing"
UA = "Mozilla/5.0 (site-sync)"
NS = {"c": "http://purl.org/rss/1.0/modules/content/"}


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()



def plain(text, n=170):
    text = html.unescape(re.sub(r"<[^>]+>", "", text or "")).strip()
    return text if len(text) <= n else text[: n - 3].rsplit(" ", 1)[0] + "..."


def substack_items():
    root = ET.fromstring(fetch(FEED)).find("channel")
    out = []
    for i in root.findall("item"):
        link = i.findtext("link")
        slug = link.rstrip("/").rsplit("/", 1)[-1]
        body = i.findtext("c:encoded", namespaces=NS) or ""
        when = parsedate_to_datetime(i.findtext("pubDate"))
        out.append({"src": "Substack", "slug": slug, "title": i.findtext("title"), "link": link, "when": when,
                    "desc": plain(i.findtext("description") or body)})
    return out


def medium_items():
    try:
        root = ET.fromstring(fetch(MEDIUM_FEED)).find("channel")
    except (urllib.error.URLError, ET.ParseError) as e:
        print(f"medium feed failed ({e}); Medium posts left out of this run")
        return None
    out = []
    for i in root.findall("item"):
        body = i.findtext("c:encoded", namespaces=NS) or ""
        link = i.findtext("link").split("?")[0]
        slug = "m-" + link.rstrip("/").rsplit("/", 1)[-1][-12:]
        first = re.search(r"<p[^>]*>(.*?)</p>", body, re.S)
        desc = plain(first.group(1) if first else "")
        title = i.findtext("title") or ""
        if desc.lower().rstrip(".") == title.lower().rstrip("."):
            desc = ""
        out.append({"src": "Medium", "slug": slug, "title": title, "link": link,
                    "when": parsedate_to_datetime(i.findtext("pubDate")), "desc": desc})
    return out


def render_cards(items):
    cards = []
    for it in items:
        e = lambda x: html.escape(x, quote=True)
        desc = f'\n        <p>{html.escape(it["desc"])}</p>' if it["desc"] else ""
        cards.append(f'''      <li class="wcard" id="w-{it["slug"]}" data-src="{it["src"].lower()}">
        <time class="wcard-date" datetime="{it["when"].date().isoformat()}">{it["when"].strftime("%d %b %Y").lstrip("0")}</time>
        <h3>{html.escape(it["title"])}</h3>{desc}
        <dl class="wcard-src"><dt>{it["src"][0]}</dt><dd>{it["src"]}</dd></dl>
        <a class="wcard-go" href="{e(it["link"])}" target="_blank" rel="noopener">Read on {it["src"]} <span aria-hidden="true">&#8599;</span></a>
      </li>''')
    return "\n".join(cards), ""


def swap(src, name, new):
    pat = re.compile(rf"(<!-- {name}:START -->).*?(<!-- {name}:END -->)", re.S)
    if not pat.search(src):
        sys.exit(f"marker {name} missing in index.html")
    return pat.sub(lambda m: m.group(1) + "\n" + new + "\n" + m.group(2), src)


def main():
    items = substack_items()
    med = medium_items()
    if med:
        items += med
    items.sort(key=lambda x: x["when"], reverse=True)
    cards, steps = render_cards(items)
    nav = ""  # the tree no longer lists post titles (review, 7 Nov 2026)
    src = INDEX.read_text()
    src = swap(src, "WCARDS", cards)
    src = swap(src, "WSTEPS", steps)
    src = swap(src, "WRITING-NAV", nav)
    src = re.sub(r'data-total="\d+"', f'data-total="{len(items)}"', src, count=1)
    src = re.sub(r'(<span class="whead-n" data-count>)[^<]*', lambda m: m.group(1) + f"{len(items)} articles", src, count=1)
    INDEX.write_text(src)
    print(f"synced {len(items)} post(s): {sum(i['src']=='Substack' for i in items)} Substack, {sum(i['src']=='Medium' for i in items)} Medium")


if __name__ == "__main__":
    main()
