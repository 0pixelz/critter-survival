# 🌿 Critter Wilds — A Survival RPG

### ▶️ [**Play now → 0pixelz.github.io/critter-survival**](https://0pixelz.github.io/critter-survival/)

*Best on a phone held sideways (landscape). Left thumb moves · right thumb casts spells · tap the ✦ button when it glows to unleash your Super.*

A tiny **isometric action survival RPG** that runs entirely in your browser — think Pokémon meets Brawl Stars, with Harry Potter-style spellcasting, all under a moody campfire-lit night. No installs, no build step, no dependencies — just open `index.html` and play. Roam the wild with a joystick, blast roaming critters in real time by drawing spell gestures, keep your **hunger** and **energy** up, and build a team of six.

[![Play in browser](https://img.shields.io/badge/▶%20play-0pixelz.github.io%2Fcritter--survival-5aa02c)](https://0pixelz.github.io/critter-survival/) ![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e) ![No dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

## ✨ Features

- **Character classes that play differently** — choose **Mage** (+spell power, −cooldown; balanced arcane bolts + Nova Super), **Ranger** (+move speed, +catch; fast **piercing arrows** + an all-directions **Volley** Super), or **Warrior** (+Super charge; heavy **knockback** bolts + a screen-shaking **Warcry** shockwave Super). Each has its own look (wizard/hood+bow/helmet+sword) with a weapon that glows in your lead's element.
- **Sound** — procedural sound effects (casts, hits, catches, level-ups, coins, battle) generated live with the Web Audio API — no audio files. Toggle sound on/off in the ☰ menu.
- **Diablo-style skill tree** — every level-up earns a skill point to spend across three branches (Arcane, Storm, Survival): spell power, cast haste, split shot, piercing, super focus/overload, swiftness, mending regen, beast tamer, scholar (XP), and fortune (coins), with rank caps and prerequisites. Open it from the ☰ menu.
- **Charge-up Super** — dealing damage fills your ✦ Super meter (bottom-right). When it glows gold, unleash a screen-shaking special: a ring of bolts plus an expanding elemental shockwave that blasts everything around you.
- **Expressive brawler art** — the hero is a chunky wand-wielding battle-mage, and every critter is drawn as an expressive cartoon brawler with big glossy eyes, eyebrows, cel-shaded bodies, thick outlines, and type crests (flames, lightning, fins, leaves).
- **Evolutions** — level your critters and they evolve into stronger forms (two-stage chains around Lv.14 and Lv.30), with a sparkle burst and an "EVOLVED!" flash. The party panel shows each critter's next evolution and level.
- **Alpha critters (mini-bosses)** — rare, oversized enemies with a golden crown and a glowing aura that lights up the dark. They hit harder and take a beating, but give triple XP & coins and are a trophy to defeat or catch.
- **Real-time gesture combat** — roaming enemy critters wander the map; blast them with your **right thumb**. Flick for a quick **Bolt**, or draw a shape for a bigger spell — a **V** (Power Blast), a **Z**/zigzag (Chain Bolt, pierces), or a **circle** (Nova, 3-way). Spells auto-aim the nearest enemy, fly as glowing projectiles, and are blocked by walls.
- **Element matchups** — your shots take on your **lead critter's type**, so the 6-type chart (Leaf, Ember, Aqua, Spark, Stone, Gale) still decides what's super effective. Floating damage numbers show the hits.
- **Explore a tile world** — a town, paths, water, beaches, and tall grass, with a floating 360° joystick and a smooth follow camera.
- **Survival mechanics** — hunger and energy drain as you move; let them bottom out and your lead loses HP. Enemies that touch you deal contact damage. Eat berries, rest at home, and visit the nurse to recover.
- **Snipe or duel** — pick off roaming critters from range with spells, *or* let one reach you and it pulls you into a **turn-based Pokémon-style battle** (its wounded HP carries over, so softening it first helps). Catch on the map by weakening a critter until it glows and tapping **A**, or catch it in battle.
- **Draw-to-cast in battle** — in a battle, **draw a spell gesture right on the arena** (a flick, a **V**, a **Z**, or a **◯**) to attack Harry Potter-style, with a glowing trail — or use the classic **Moves** menu instead.
- **20 critters** — a roster spanning every type, each with its own stats and procedurally-drawn sprite.
- **Coins & a shop** — defeat enemies for coins, then spend them at the **Trader's Mart** on Orbs, Super Orbs, Berries, Potions, Revives, and Rations.
- **Team of six** — level up from kills, swap your lead (which changes your spell element!), and manage a full item bag.
- **Auto-save** — progress is saved in your browser (localStorage), with Continue / New Game on the title screen.
- **Isometric, moody atmosphere** — a 3/4 isometric world under a dusk/night sky with real **dynamic lighting**: a glowing campfire and lantern-lit shop/nurse cast warm pools of light in the dark, spell projectiles glow, enemies shimmer faintly so you can spot them, and embers & fireflies drift by. Landscape, touch-first. Keyboard still works on desktop (WASD + J/K/L/U/O to cast).
- **Zero assets** — every tile, critter, spell, light, and effect is drawn procedurally with the Canvas API, so the whole game is a single HTML file. (Drop in a pixel-art tileset later and it can be swapped onto the same engine.)

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

Use Berries, Potions, Rations, and Revives any time from the **Team & Bag** panel (the ☰ button). Orbs are thrown with **A** when you're next to a weakened enemy.

## 🎮 Controls

Built **touch-first for landscape phones**, with a Brawl Stars-style look — chunky outlined art, soft shadows, cel-shaded critters, depth-sorted buildings, and particle effects.

| Action | Touch | Desktop |
|---|---|---|
| Move | **Left thumb** — press and drag anywhere on the left half; 360° smooth movement | Arrow keys / WASD |
| Cast a spell | **Right thumb** — flick or draw a shape on the right half | J = Bolt, K = Twin, L = Power, U = Chain, O = Nova |
| Interact / confirm / catch | **A** button (also advances dialog) | Space or E |
| Team & Bag | **☰** button | P or B |

**Spell gestures** (right thumb): a quick flick = **Bolt**, a gentle bend = **Twin**, a sharp **V** = **Power Blast**, a **Z** zigzag = **Chain Bolt** (pierces), a **circle** = **Nova** (3-way). The spell's name flashes when you cast, and it uses your lead critter's element.

Walk up to the nurse, shop, a berry bush, a house, or a weakened enemy and a **tappable prompt** (Heal / Shop / Pick / Rest / **Catch**) floats above your head — tap the prompt (or **A**) to act. Dialog boxes advance when you tap them. A live **XP bar** with your level sits in the top HUD, and an in-game **Spell Guide** (☰ menu) shows every gesture. Hold your phone sideways for the best view.

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
