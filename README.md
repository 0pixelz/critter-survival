# 🌿 Critter Wilds — A Survival RPG

A tiny **Pokémon-style survival RPG** that runs entirely in your browser. No installs, no build step, no dependencies — just open `index.html` and play. Explore the wild, befriend critters, keep your **hunger** and **energy** up, and build a team of six.

![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e) ![No dependencies](https://img.shields.io/badge/dependencies-0-brightgreen) ![Playable in browser](https://img.shields.io/badge/play-in%20browser-5aa02c)

## ✨ Features

- **Explore a tile world** — a town, paths, water, beaches, and tall grass to wander through.
- **Survival mechanics** — hunger and energy drain as you walk. Let them hit zero and your lead critter starts losing HP. Eat berries, rest at home, and visit the nurse to recover.
- **Wild encounters** — step into tall grass and random critters appear.
- **Turn-based battles** — a full 6-type effectiveness chart (Leaf, Ember, Aqua, Spark, Stone, Gale), STAB bonuses, accuracy, and level scaling.
- **Status effects** — moves can **burn** or **poison** (damage over time), **paralyze** (chance to skip a turn), put a foe to **sleep**, or **chill** them (lowered attack). Status chips show on the nameplates, and a statused wild critter is easier to catch.
- **20 critters** — a roster spanning every type, each with its own stats, moves, and procedurally-drawn sprite.
- **Catch 'em** — throw Orbs (or Super Orbs for a big bonus) to catch wild critters. Catch rate scales with how low their HP is and whether they're affected by a status.
- **Coins & a shop** — win battles to earn coins, then spend them at the **Trader's Mart** on Orbs, Super Orbs, Berries, Potions, Revives, and Rations.
- **Team of six** — level up, learn how stats grow, swap your lead, and manage a full item bag.
- **Auto-save** — progress is saved in your browser (localStorage), with Continue / New Game on the title screen.
- **Touch-first, Brawl Stars-style** — landscape layout, a floating 360° joystick with smooth acceleration and camera, chunky outlined art, drop shadows, cel-shaded critters, depth-sorted props, and particle effects (dust, grass rustle, sparkles). Keyboard still works on desktop.
- **Zero assets** — every critter, tile, and effect is drawn procedurally with the Canvas API, so the whole game is a single HTML file.

## 🛍️ Items & the shop

Beat wild critters to earn **coins**, then walk into the **Mart** (the building with the blue awning, next to the nurse) to buy:

| Item | Price | Effect |
|---|---|---|
| Orb | 20c | Catches wild critters |
| Super Orb | 65c | Much better catch rate |
| Berry | 15c | Heals 40% HP + restores hunger |
| Potion | 30c | Restores 60 HP |
| Revive | 70c | Revives a fainted critter (to 50%) |
| Ration | 25c | Fully restores hunger |

Use Berries, Potions, Super Orbs, and Revives mid-battle from the **Bag** button, or from the Team & Bag panel out in the world.

## 🎮 Controls

Built **touch-first for landscape phones**, with a Brawl Stars-style look — chunky outlined art, soft shadows, cel-shaded critters, depth-sorted buildings, and particle effects.

| Action | Touch | Desktop |
|---|---|---|
| Move | **Floating joystick** — press and drag anywhere on the left; 360° smooth movement | Arrow keys / WASD |
| Interact / confirm | **A** button (also advances dialog) | Space or E |
| Team & Bag | **☰** button | P or B |

Walk up to the nurse, shop, a berry bush, a house, or a sign and a little label (Heal / Shop / Pick / Rest / Read) pops up — tap **A** to use it. Hold your phone sideways for the best view.

**Tips**
- Walk into the tall grass (the darker, textured patches to the north and south) to find wild critters.
- Bump into the **♥ nurse** in town to fully heal your team, cure status, and restore energy.
- Walk into the **Mart** (blue awning) to spend coins on gear.
- Walk into a **house** to sleep and restore energy.
- Walk into a **berry bush** (🍒) to pick berries — eat them from the Bag to restore hunger and heal.
- Weaken a wild critter — or hit it with a status like sleep or poison — before throwing an Orb for a much better catch rate.

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

## 🗺️ Ideas for the next version

- Multiple maps connected by exits
- Evolution when critters reach a level threshold
- Day/night cycle tied to the survival loop
- Sound effects and music
- Even more critters, moves, and status effects (freeze, confusion, stat buffs)

## 📄 License

MIT — see [LICENSE](LICENSE). Do whatever you like with it.

---

Built as a starter project — fork it, tweak the `SPECIES` and `MAP_STR` tables near the top of the script, and make it your own.
