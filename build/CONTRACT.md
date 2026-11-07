# Build contract, version 2 (three pages, strong colours, little text)

Site root: /Users/zaursamadov/sites/samedovzaur.github.io. Static. No build step except `python3 build/assemble.py` is NOT used any more; each page is a complete HTML file.
Pages: index.html (Now learning: the chip), about.html (Bio), cluster.html (Home AI cluster). Nav on every page: Now learning | About | Cluster | Projects (external: https://github.com/samedovzaur?tab=repositories) | Open Source (external: https://huggingface.co/zaursamadov) | Write-ups (external: https://zaursamadov.substack.com). External links open in a new tab with rel="noreferrer". Keep lesson/gpu.html as is (linked only from the chip page's terminal panel as "open the teardown lesson").
Facts: build/SOURCE.md only. Disclosure rules in SOURCE.md. `grep -inwFf build/banned-terms.txt` on every html/css/js must be empty.

## Owners
- HOME: index.html, css/site.css (shared), js/site.js (shared nav, theme, Lenis+GSAP), js/chip.js, js/terminal.js, assets/favicon.svg, 404.html.
- ABOUT: about.html, css/about.css.
- CLUSTER: cluster.html, css/cluster.css, assets/cluster.svg.
ABOUT and CLUSTER write against the tokens below and the shared classes; HOME must keep those names stable.

## Tokens (css/site.css). Strong, not pale.
Dark (default): --bg #0b0b0a; --bg-2 #141412; --fg #f6f2e8 (body text uses --fg, never muted); --fg-2 #d8d2c4; --muted #9a948a (labels only); --line rgba(246,242,232,.14); --line-2 rgba(246,242,232,.28); --accent #ff9f1c (hot copper-orange); --accent-2 #35e0b0 (die green, chip only); --glass rgba(20,20,18,.7).
Light: --bg #f7f3ea; --bg-2 #ece6d8; --fg #0f0f0d; --fg-2 #2b2a26; --muted #6e6a61; --line rgba(15,15,13,.14); --line-2 rgba(15,15,13,.3); --accent #c2410c; --accent-2 #0f8a6a.
Fonts: display "Instrument Serif"; body "Inter" at 18px/1.5 (17px mobile), weight 400 with 500 for labels; data "JetBrains Mono". --maxw 1120px; --gutter 16px/32px; --radius 14px.
Classes HOME must provide: .wrap, .nav (with .nav-links a, .is-active, .ext marker for external links), .btn, .btn-primary, .h-eyebrow (mono, numbered, trailing hairline), .h1, .h2, .lead, .mono, .tag, .glass, .reveal, .grid-2, .grid-3, .hairline, .side rails (optional). Theme toggle persisted. Lenis + GSAP ScrollTrigger wired on the GSAP ticker with lagSmoothing(0). Reduced motion respected.
Libraries only: three 0.160.0 (jsdelivr), gsap 3.12.5 + ScrollTrigger (cdnjs), lenis 1.1.14 (jsdelivr), Google Fonts. No frameworks.

## Design
Open-source references already ported (keep them): bchiang7/v4 numbered heading with trailing hairline, inline link underline grow, outlined button with hard offset shadow, fixed side rails; Naresh-Khatri/3d-portfolio preloader and Lenis setup. See CREDITS.md. No purple, no blue, no gradient blobs, no card drop shadows. Big serif display type, mono labels, hairlines, lots of space. Little text: every page fits in at most three screens on desktop.
