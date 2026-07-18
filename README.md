# 🌿 Critter Wilds — A Survival RPG

A tiny **Pokémon-style survival RPG** that runs entirely in your browser. No installs, no build step, no dependencies — just open `index.html` and play. Explore the wild, befriend critters, keep your **hunger** and **energy** up, and build a team of six.

![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e) ![No dependencies](https://img.shields.io/badge/dependencies-0-brightgreen) ![Playable in browser](https://img.shields.io/badge/play-in%20browser-5aa02c)

## ✨ Features

- **Explore a tile world** — a town, paths, water, beaches, and tall grass to wander through.
- **Survival mechanics** — hunger and energy drain as you walk. Let them hit zero and your lead critter starts losing HP. Eat berries, rest at home, and visit the nurse to recover.
- **Wild encounters** — step into tall grass and random critters appear.
- **Turn-based battles** — a full 6-type effectiveness chart (Leaf, Ember, Aqua, Spark, Stone, Gale), STAB bonuses, accuracy, and level scaling.
- **Catch 'em** — throw Orbs to catch wild critters. Catch rate depends on how low their HP is.
- **Team of six** — level up, learn how stats grow, swap your lead, and manage your bag.
- **Auto-save** — progress is saved in your browser (localStorage), with Continue / New Game on the title screen.
- **Works on desktop and mobile** — keyboard controls on desktop, on-screen D-pad + buttons on touch devices.
- **Zero assets** — every critter and tile is drawn procedurally with the Canvas API, so the whole game is a single HTML file.

## 🎮 Controls

| Action | Desktop | Mobile |
|---|---|---|
| Move | Arrow keys / WASD | D-pad |
| Interact / confirm | Space or E | **A** button |
| Team & Bag | P or B | **☰** button |

**Tips**
- Walk into the tall grass (the darker, textured patches to the north and south) to find wild critters.
- Bump into the **♥ nurse** in town to fully heal your team and restore energy.
- Walk into a **house** to sleep and restore energy.
- Walk into a **berry bush** (🍒) to pick berries — eat them from the Bag to restore hunger and heal.
- Weaken a wild critter before throwing an Orb for a much better catch rate.

## 🕹️ How to play

**Option A — just open it:** download the repo and double-click `index.html`. That's it.

**Option B — local server (recommended):**
```bash
# Python
python3 -m http.server 8000
# then open http://localhost:8000
```

**Option C — GitHub Pages:** push this repo to GitHub, then in **Settings → Pages** set the source to your `main` branch (root). Your game goes live at `https://<your-username>.github.io/<repo-name>/`.

## 🧪 Type chart

| Type | Strong vs | Weak vs |
|---|---|---|
| Leaf | Aqua, Stone | Ember, Gale |
| Ember | Leaf, Gale | Aqua, Stone |
| Aqua | Ember, Stone | Leaf, Spark |
| Spark | Aqua, Gale | Stone, Leaf |
| Stone | Ember, Spark | Aqua, Leaf |
| Gale | Leaf, Spark | Ember, Stone |

## 🛠️ Tech

Pure HTML + CSS + JavaScript with the Canvas 2D API. One file, no frameworks, no bundler. Everything — sprites, tiles, battles, save system — lives in `index.html`.

## 🗺️ Ideas for v2

- Multiple maps connected by exits
- An inventory shop and currency
- Evolution when critters reach a level threshold
- Day/night cycle tied to the survival loop
- Sound effects and music
- More critters, moves, and status effects

## 📄 License

MIT — see [LICENSE](LICENSE). Do whatever you like with it.

---

Built as a starter project — fork it, tweak the `SPECIES` and `MAP_STR` tables near the top of the script, and make it your own.
