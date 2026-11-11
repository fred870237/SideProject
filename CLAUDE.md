# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This folder holds four **independent** children's/learning web apps. Each is plain HTML/CSS/JS with no build step, no framework and no bundler, and each is an offline-capable PWA aimed at iPad/phone. They share no code. All UI text, comments and docs are in Traditional Chinese (zh-Hant, Taiwan); keep new comments and copy in that style.

| Folder | App | Served root | Local port |
|---|---|---|---|
| `animal-map/` | 動物世界地圖 — animal world map (multilingual: EN / 中文 / 台語 / 日本語) | `animal-map/` | 8765 |
| `nihongo/` | 小小日語樂園 — Japanese learning (kids mode + JLPT N5 adult mode) | `public/` | 8766 |
| `storybook/` | 經典故事書 — classic storybook reader with zhuyin and TTS | `public/` | 8767 |
| `popup-book/` | 機關書 — tap-to-animate pop-up book (themes → pages → scenes) | `public/` | 8768 |

`nihongo/README.md` and `storybook/README.md` are detailed and authoritative. Read them before larger changes to those apps.

## Running

There are no tests or linters. To preview, start the static server from `.claude/launch.json` (configs `animal-map`, `nihongo`, `storybook`, `popup-book`) or run it by hand from the app folder:

```bash
python -m http.server 8767 -d public
```

The apps must be served over HTTP. The storybook `fetch`es JSON, so opening `index.html` from disk does not work.

Deployment: `.github/workflows/pages.yml` deploys all four apps to GitHub Pages (https://fred870237.github.io/SideProject/) on push to `main`, copying them to `/animal-map/`, `/nihongo/`, `/storybook/` and `/popup-book/`, with `.github/pages-index.html` as the landing page. Each app also still has a `netlify.toml` for standalone Netlify hosting (publishes `public/`, with no build command). Keep all asset paths relative, because the apps run under a subpath on Pages.

## Cross-cutting conventions

- **Service worker caches share one origin.** The apps may be hosted side by side on one domain (e.g. GitHub Pages subpaths), so each `sw.js` deletes only old caches with its own name prefix on activate. Keep that prefix filter when touching `sw.js`.
- **Service worker cache versions.** Each app has a `sw.js` with a `CACHE` name (`animal-map-vNN`, `nihongo-kids-vN`, `storybook-vN`, `popup-book-vN`) and a precache list. When you add a file, add it to that list. Bump the version when you change cached assets.
  - The animal map uses **stale-while-revalidate**, so a stale cache really bites there. In `animal-map/index.html` (and the other pages), scripts and styles are loaded with `?v=N` query strings, and `sw.js` treats a changed `?v=` as a must-fetch. After editing a JS/CSS file, bump its `?v=` in every HTML page that includes it, and bump `CACHE` in `sw.js`.
  - The other three apps are network-first, so a version bump matters less there, but the precache list must still be complete.
- **Speech** uses the browser Web Speech API. There is no system voice for Taiwanese (台語); the animal map relies on recordings or mp3 files for it.
- **Storage** is `localStorage`, always wrapped in try/catch so private browsing doesn't break. Recordings and drawings go in IndexedDB.
- **Emoji**: the storybook README says to use only Emoji 12 (2019) or older, and no flag emoji, because Windows 10 renders newer ones as boxes. Follow the same rule in the other apps.

## animal-map (動物世界地圖)

The app itself is in `animal-map/animal-map/`; the outer folder also holds non-deployed song assets and `tools/`. Multi-page site. Every page is a separate HTML file with its own JS/CSS: `index.html` (world map), `city.html` (vehicles), `abc.html`, `draw.html`, `record.html`, `region.html?r=taiwan`, `town.html`, `trace.html`. Scripts are classic `<script>` tags that share globals, so **load order matters** (see the bottom of `index.html`).

- `app.js` drives both the animal map and the vehicle city. It picks `VEHICLES` or `ANIMALS` depending on whether `cityScene` (from `city-map.js`) is defined.
- **Adding an animal** takes two steps: add an entry to `ANIMALS` in `animals.js` (`id`, `lon`/`lat`, `place`, `en`/`zh`/`tw`/`twRom`, …), then draw art with the same `id` in one of `art/*.js` via `Object.assign(ART, { id: () => svgString })`. Drawing helpers and the style rules (coordinates -50…50, feet at y≈44, chibi style) are in `art/kit.js`.
- `map-shapes.js` is large generated map geometry. Don't hand-edit it.
- Audio priority: parent recording (IndexedDB) → `audio/<lang>/<id>.mp3` → TTS. Before falling back to browser TTS, pages ask `VoiceClips` (`voice-clips.js`) for a pre-generated clip in `audio/voice/<en|zh>/`, listed in the generated `voices.js` (also precached by `sw.js`). English clips come from Qwen3-TTS (`tools/voice/voice.py`, same narrator as popup-book) and Chinese from BreezyVoice (`tools/voice/breezy.py`) — the Chinese clips are switched off for now (`OFF` in `voice-clips.js`, and filtered in `sw.js`) because some have noise; turn them back on after regenerating; line lists are `tools/voice/lines-*.json`. Run GPU generation only when Fred asks. The 英文兒歌 player (`song-player.js`) also plays a sung vocal track `audio/songs/<id>.mp3` in sync with its synthesized accompaniment (normal speed only); vocals are sung by SoulX-Singer from `tools/voice/songs.json` (exported from `songs.js`) via `tools/voice/soulx.py`, so re-export and regenerate when a song's notes or lyrics change. Animal calls are in `audio/sound/`; when you add one, record its source in `audio/sound/CREDITS.md`. `audio/README.md` lists the Taiwanese wording per animal.
- **✈️ Travel (環遊世界):** the ✈️ 旅行 button on the world map turns on travel mode (`travel-map.js`, loaded after `app.js`). A plane flies from home (Taipei) to a trip, the map zooms in, clouds cover the screen, and it switches to `region.html?r=<id>`. The plane lands there, and the ✈️ back button or the corner mini-map flies back out (`index.html?back=<id>`). `travel.js` holds `TRIPS` (`ready: false` shows 敬請期待), the Miller projection shared with the main map (region.js uses it too, so both maps line up), and the cloud transition. To add a country, add `regions/<id>.js`, add the id to `REGION_FILES` in `region.js`, and set `ready: true` in `TRIPS`. Ready so far: Taiwan, Japan (`regions/japan.js`), China (`regions/china.js`), Europe (`regions/europe.js`, one cross-border trip) Africa (`regions/africa.js`, safari by jeep) Australia (`regions/australia.js`, long-distance trains) the USA (`regions/usa.js`, camper-van road trip) South America (`regions/south-america.js`: Amazon boat, Andes trains, jeep, flights), India (`regions/india.js`, Indian Railways and the Darjeeling toy train), Korea (`regions/korea.js`, KTX), Canada (`regions/canada.js`, VIA Rail; a stop's `hello`/`lang` override the country's, so Québec greets in French), Thailand (`regions/thailand.js`, SRT trains, ferry, tuk-tuk), New Zealand (`regions/new-zealand.js`, scenic trains, Interislander ferry, camper van), Russia (`regions/russia.js`, Trans-Siberian Railway), the Silk Road / Central Asia (`regions/silk-road.js`: Kazakhstan, Uzbekistan's Afrosiyob high-speed rail, jeep to Kyrgyzstan's Issyk-Kul), Southeast Asia (`regions/southeast-asia.js`: Vietnam's Reunification Railway, KTM to Singapore, Java's Sri Tanjung train, ferry to Bali, sailboat to Komodo, flights to Borneo and Bohol), Mexico & Central America (`regions/central-america.js`: Chepe Copper Canyon train, Tren Maya, water taxi to Belize, Panama Canal Railway), the Middle East & Turkey (`regions/middle-east.js`: YHT and the Pamukkale Express, Cappadocia balloons, Jordan by bus and jeep, Dubai–Muscat bus), Mongolia (`regions/mongolia.js`: Ulaanbaatar–Erdenet train, jeeps, riding a horse to Terelj and a camel to the Gobi dunes; the Altai stop greets in Kazakh), Iceland (`regions/iceland.js`: camper van round Route 1, Golden Circle, Herjólfur ferry to the Westman Islands; it sets `ownLand: true`, which skips the coarse `MAP_LAND` background and draws the coast from `islands`, with `polys: []` on the country so it only supplies hello and flag), the Himalayas (`regions/himalaya.js`: Nepal and Bhutan by bus, the Lukla flight then walking with a yak to Everest, Druk Air to Paro; Bhutan's words are romanized), the Arctic (`regions/arctic.js`, by icebreaker) and Antarctica (`regions/antarctica.js`). Antarctica uses `projection: 'south-pole'` (stereographic, `rotate` turns the peninsula up), because Miller stretches too much near the pole. That map has no `MAP_LAND` background; its land is drawn from `islands`, and each island can be `{ pts, fill }`. `insets` draws a dashed box for places moved closer so they fit; Hawaii's data is shifted into one. A stop's `vehicle` sets what is parked there; after a ride, the last vehicle used is parked. Region data can set:
  - `countries`: one entry per country (Europe), each with `color`, `flag`, `lang` and `hello`. The `polys` are hand-drawn rough borders that overlap the sea; they are clipped by `MAP_LAND`, so the coastline stays accurate. Flags are drawn as SVG by `flagSvg()`, never as emoji. When no suitable emoji exists, draw the landmark in `art/landmarks.js` (so far: windmill, Big Ben, Great Wall, terracotta warrior, jeep, pyramid, baobab, Sydney Opera House, Uluru, Statue of Liberty, Golden Gate Bridge, Machu Picchu, Iguazú waterfall, Taj Mahal, tuk-tuk, St. Basil's onion domes, matryoshka, Registan, Petronas Towers, Borobudur, Maya pyramid, Petra, Burj Khalifa, ger, Hallgrímskirkja, Boudhanath stupa, Tiger's Nest) and use `art:` in the data.
  - `lang3: 'local'`: greet in each stop's country language, using `stop.local` and `item.local`.
  - `bounds`: the area to show.
  - `islands`: several outlines.
  - `vehicle`: an ART name, nose facing left.
  - `lang3`: `'ja'` for Japanese via system TTS, `'none'` for Chinese and English only. The default is Taiwanese recordings.
  - `loop: false`: one line, not a loop.
  - `by: 'ship'` on a stop: a ship is parked there.
  - `lines` + `junctions`: the real railway network. Each line's `path` mixes stop or junction ids with `[lon, lat]` waypoints, and `mode` picks how each line is travelled: `'rail'` (the default), `'road'` (`R.roadVehicle`, e.g. jeep), `'boat'` (`vehicle` can override, e.g. sailboat on the Nile) or `'air'` (drawn as an arc automatically). The old `by: 'ship'` still means `mode: 'boat'`. The vehicle art switches along the way. The train takes the shortest path along the lines (Dijkstra in `region.js`). Use the real routes (Shinkansen, 高鐵), not a straight chain of stops. Taiwan stays a loop.

  Japan's outlines come from the same Natural Earth coastline as `map-shapes.js`, so the two maps line up. China's outline is hand-drawn because that data has no borders.
- Parent mode opens with a 2-second hold on ⚙️.
- `tools/` is not deployed. It contains `sing.py`, which synthesizes a sung nursery rhyme from a JSON melody spec (`python sing.py <song.json> <out.wav> <tmpdir>`, numpy only, uses Windows English TTS), and an art preview sheet.

## nihongo (小小日語樂園)

All code is in `public/`. `app.js` holds shared utilities and the kids mode; `adult.js` holds the adult mode (romaji→kana conversion, simplified SM-2 SRS, N5 pages). Data lives in `data.js` (kana and kid vocabulary), `n5.js`, `grammar.js` and `strokes*.js`. The stroke data comes from KanjiVG (CC BY-SA 3.0); keep the attribution on the 我的進度 page.

## storybook (經典故事書)

- Each book is defined by data. `public/books/<id>.json` holds the pages, quiz and talk prompts. In `quiz`, the **first option is the correct answer**; the app shuffles the options. Every book must also have an entry in `public/books/index.json`, with a `region` of `tw`/`cn`/`jp`/`uk`/`us`/`eu`.
- Node tooling is in `tools/`. It is not deployed. Run `npm install` in `tools/` once.
  - `node tools/add-zhuyin.mjs`: fills in missing or stale `zhuyin` fields without overwriting manual fixes. Use `--review` to list readings of polyphonic characters and `--force` to regenerate everything. Polyphone rules are in the script's `RULES`.
  - `node tools/scenes/<id>.mjs [--sheet]`: regenerates a book's SVG illustrations into `public/books/<id>/` (`cover.svg`, `01.svg`, …). `--sheet` also writes `tools/scenes/_preview/<id>.png`, which needs Microsoft Edge. Shared drawing code is in `tools/scenes/lib.mjs` (e.g. `person()`) and `<region>-common.mjs`.
  - `node tools/scenes/link-images.mjs`: links generated images into the book JSON files and `index.json`.
- Illustration constraints: the canvas is 800×600, and the top ~30% (y < 180) is covered by the text box, so keep characters below it. Backgrounds must bleed past the canvas (`BX`/`BW`/`BY`), and the root `<svg>` uses `preserveAspectRatio="xMidYMax meet"`.
- `開啟故事書.bat` is saved in Big5 encoding so `cmd` reads it correctly. Don't re-save it as UTF-8.

## popup-book (機關書)

A single-page app in `public/` with hash routes: `#/` is the bookshelf of themes, `#/<theme>` is a book's table of contents, and `#/<theme>/<page>` is a scene. Tapping a vehicle speaks its English name, shows an EN/中文 name label, then runs its animation. The book's look comes from a real pop-up book (*The Ultimate Book of Vehicles*). The illustrations are generated locally with open-source AI (ComfyUI + FLUX.1 schnell, from text prompts only). Never trace or copy the book's artwork, and never feed the reference photos in `datas/` to the AI (no img2img, style reference or training).

- `themes.js` defines `THEMES` (themes → pages) and the empty `SCENES` registry. A page with no `SCENES[id]`, and a theme with no ready pages, shows as 敬請期待.
- **Adding a page:** create `art/<page-id>.js` that assigns `SCENES['<page-id>'] = { w, h, bg(), front(), items: [...] }`, wrap the file in `{ }` so its top-level names don't clash with other pages, then add the script to `index.html` and to `CORE` in `sw.js`.
- Each item is `{ id, en, zh, x, y, s, r?, tag?, hint, label?, pivots, art(p), setup?(c), act(c) }`. `r` tilts the vehicle (e.g. climbing a mound), and `tag` overrides where its small lowercase English caption goes (by default it sits under the vehicle). Compose pages loosely, with overlap, varied sizes and some tilt, not in two tidy rows. Tapping a vehicle runs it in focus mode (`focus()` in `app.js`): the rest of the scene dims, the vehicle straightens and zooms to the centre, plays `act`, then returns to its place. `it.box = [x, y, w, h]` overrides the zoom area when `getBBox` is wrong or too big. Nested `<svg>` and clipped images report their unclipped size, and hidden parts that move far away (such as the lowered rescue basket) also count. The fire engine carries a small window of the background (the burning flat) inside its group, so focus mode brings the fire along. `focus: false` makes an item play in place instead. People (the toilet worker, courier and rescuer) are AI-generated images like the vehicles, because hand-drawn SVG figures clash with the art style. Sirens and the garbage truck's tune are synthesized with Web Audio (`siren()`, `playTune()` in `app.js`), not recordings. Changing page stops them. `art` draws in local coordinates (ground at y = 0, facing right), and moving parts are `<g id="<item id>-<part>">`. `act` animates them through the ctx from `makeCtx` in `app.js`: `c.anim(ms, { part: { r, tx, ty, sx, sy, o } }, onStep)`, `c.set`, `c.wheels(deg)` (spins every `.wheel` group around its `data-cx`/`data-cy`), `c.burst(part, x, y, opts)` for particles, and `c.state` for state that persists between taps (e.g. where the crane left the beam). Items are drawn in array order, back row first.
- **AI-image items** (the construction page): each vehicle is a transparent WebP in `art/img/<page-id>/`, drawn with `<image>` inside `<g transform="translate(0 -imgHeight)">`. Part polygons, pivots and burst points are therefore in **image-pixel coordinates**, while `hint` stays in ground = 0 coordinates.
  - A moving part is the same image clipped to a polygon (`CLIP`); the body image clips that polygon out (`HOLE`, evenodd).
  - Hint dots scale by `1 / it.s`, so they keep the same on-screen size.
  - Things too thin for the AI, like the crane cable, hook and beam, are drawn as flat SVG with no outline.
- Generating art: `popup-book/tools/ai-art/` (not deployed) holds the prompt JSONs and scripts. The steps are `gen.py` (queue to ComfyUI at 127.0.0.1:8188), `sheet.py` (contact sheet), `cutout.py` (green-screen key + flip + paper grain) and `export.py` (WebP + coordinate grid previews). See its README.
  - Generate on a chroma-key green background, because cutting white-background images also removes white vehicle bodies.
  - Add the new images to `CORE` in `sw.js` and bump `CACHE`.
- **Speech:** `speak(text, { queue })` in `app.js` plays a pre-generated mp3 from `audio/en/<slug>.mp3` through Web Audio when the slug is listed in `voices.js`, otherwise it falls back to Web Speech TTS. Use `queue: true` for sound effects inside `act` so they don't cut off the vehicle name. The clips are generated with Qwen3-TTS by `tools/voice/voice.py`. When you add a vehicle or a `speak('…')` line, add it to `LINES` there and regenerate (see `tools/voice/README.md`). Real animal calls (the Animals book) are `playSound(name)`, which queues `audio/sound/<name>.mp3` after the name; the files are Pixabay sounds copied from animal-map, so record each in `public/audio/sound/CREDITS.md` and add it to `CORE` in `sw.js`. Scene page ids are global across books (`SCENES[id]`), so the animal farm page is `farm-animals`, not `farm`.
- `art/kit.js` holds the older outlined SVG drawing helpers (`K.rect`, `K.wheel`, …) and `LINE`. It is still loaded, but the construction page no longer uses its outline style.
- Animations use `requestAnimationFrame`, so they pause while the browser pane is hidden. Verify them with the pane visible.
