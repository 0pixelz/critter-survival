# 🌿 Critter Wilds — A Survival Roguelite

### ▶️ [**Play now → 0pixelz.github.io/critter-survival**](https://0pixelz.github.io/critter-survival/)

*Best on a phone held sideways (landscape). Left thumb moves · right thumb attacks · tap the ✦ button when it glows to unleash your Super.*

A tiny **isometric action-survival roguelite** that runs entirely in your browser — think **Hades** meets Brawl Stars. **You are the hero** — your own HP, level, and XP — fighting off the wild in real time by drawing attack gestures. Play a **Warrior** (melee cleaves), **Mage** (arcane bolts), or **Ranger** (piercing arrows), each with its own element. Keep your **hunger** and **energy** up, gather and build, and grow a permanent skill tree. Fall in battle and you respawn in town, losing your loose loot but keeping every permanent upgrade. No installs, no build step, no dependencies — just open `index.html` and play.

[![Play in browser](https://img.shields.io/badge/▶%20play-0pixelz.github.io%2Fcritter--survival-5aa02c)](https://0pixelz.github.io/critter-survival/) ![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e) ![No dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

## ✨ Features

- **You are the hero** — not a trainer. You have your own **HP, level, XP, ATK, and DEF**, and you fight the wild directly. Leveling up (from kills and battles) earns skill points and makes you tougher.
- **Three classes, three playstyles** — pick **Warrior** (🪨 Stone; **melee cleaves** with knockback, no projectiles — get in close — plus +30% Super charge and a screen-shaking **Warcry** shockwave), **Mage** (🔥 Ember; **arcane bolts**, +spell power, −cooldown, and an **Arcane Nova** Super), or **Ranger** (🌪️ Gale; fast **piercing arrows**, +move speed, and an all-directions **Volley** Super). Your element comes from your class and decides type matchups.
- **Hades-style runs** — fall in battle (or let hunger/energy bottom out) and you respawn at the town campfire. You **lose your loose loot** — carried coins and gathered materials — but **keep every permanent upgrade**: your level, your skill tree, your crafting level, and every building you've placed. Die, grow stronger, go again.
- **Real-time gesture combat** — roaming monsters wander the map; fight them with your **right thumb**. Flick for a quick attack, or draw a shape for a bigger one — a **V** (Power), a **Z**/zigzag (Chain, pierces), or a **circle** (Nova, 3-way). Ranged classes auto-aim the nearest enemy and their shots are blocked by walls; the Warrior sweeps an arc of steel in front of you.
- **Charge-up Super** — dealing damage fills your ✦ Super meter (bottom-right). When it glows gold, unleash a screen-shaking class special: a ring of attacks plus an expanding elemental shockwave that blasts everything around you.
- **Animated brawler hero** — a proper little humanoid that **walks with swinging arms and legs**, faces the way you move, and idles with a breathing bob — Brawl Stars-style. Its gear matches your class: wizard hat + wand, hood + bow, or helmet + sword, with the weapon glowing in your element. Monsters are drawn as expressive cartoon brawlers too (big glossy eyes, eyebrows, cel-shaded bodies, type crests).
- **Diablo-style skill tree** — every level-up earns a skill point to spend across three branches (Arcane, Storm, Survival): spell power, cast haste, split shot, piercing, super focus/overload, swiftness, mending regen, **vitality** (+max HP), scholar (+XP), and fortune (+coins), with rank caps and prerequisites. Open it from the ☰ menu.
- **Sound** — procedural sound effects (attacks, hits, level-ups, coins, battle) generated live with the Web Audio API — no audio files. Toggle sound on/off in the ☰ menu.
- **Day/night cycle** — time flows on a real clock (top HUD shows the day + time + ☀️/🌇/🌙). Midday is bright; night falls dark and atmospheric, lit by campfires, torches, and your builds. Sleep in a Hut to skip to dawn.
- **Gather & craft & build** — **chop trees** for wood (Age-of-Empires style) and collect **🪵 wood, 🪨 stone, 🌿 fiber** from logs, rocks, and shrubs, then open **🔨 Craft & Build** in the ☰ menu. Building stays active so you can lay down a whole row of walls at once. Craft items (Potions, Rations) or place **buildables** — a **Campfire** or **Torch** (light), a **Wall** (blocks enemies), or your own **Hut** (a rest/heal/save point). Building enters a placement mode with a ghost preview (tap to place, ☰ to cancel). Your crafting level and buildings are **permanent** — they survive death.
- **Crafting level** — every craft earns crafting XP; leveling up unlocks better recipes (the Hut needs Craft Lv.2).
- **Alpha monsters (mini-bosses)** — rare, oversized enemies with a golden crown and a glowing aura that lights up the dark. They hit harder and take a beating, but give triple XP & coins and are a trophy to defeat.
- **Element matchups** — your attacks take your **class element**, so the 6-type chart (Leaf, Ember, Aqua, Spark, Stone, Gale) decides what's super effective. Floating damage numbers show the hits.
- **Snipe or duel** — pick off roaming monsters from range, *or* let one reach you and it pulls you into a **turn-based battle — you vs the enemy** (its wounded HP carries over, so softening it first helps). Draw a gesture right on the arena, or use the **Moves** menu.
- **Explore a tile world** — a town, paths, water, beaches, and tall grass, with a floating 360° joystick and a smooth follow camera.
- **Survival mechanics** — hunger and energy drain as you move; let them bottom out and you lose HP (and eventually fall). Enemies that touch you deal contact damage. Eat berries, rest at home, and visit the nurse to recover.
- **Coins & a shop** — defeat enemies for coins, then spend them at the **Trader's Mart** on Berries, Potions, and Rations.
- **Auto-save** — progress is saved in your browser (localStorage), with Continue / New Game on the title screen.
- **Isometric, moody atmosphere** — a 3/4 isometric world under a dusk/night sky with real **dynamic lighting**: a glowing campfire and lantern-lit shop/nurse cast warm pools of light in the dark, attacks glow, enemies shimmer faintly so you can spot them, and embers & fireflies drift by. Landscape, touch-first. Keyboard still works on desktop (WASD + J/K/L/U/O to attack).
- **Zero assets** — every tile, monster, effect, and light is drawn procedurally with the Canvas API, so the whole game is a single HTML file. (Drop in a pixel-art tileset later and it can be swapped onto the same engine.)

## 🛍️ Items & the shop

Beat wild monsters to earn **coins**, then walk into the **Mart** (the building with the blue awning, next to the nurse) to buy:

| Item | Price | Effect |
|---|---|---|
| Berry | 15c | Heals 40% HP + restores hunger |
| Potion | 30c | Restores 60 HP |
| Ration | 25c | Fully restores hunger |

Use Berries, Potions, and Rations any time from the **hero panel** (the ☰ button). Remember: carried coins and gathered materials are **lost when you fall** — spend or spend them before a risky push.

## 🎮 Controls

Built **touch-first for landscape phones**, with a Brawl Stars-style look — chunky outlined art, soft shadows, cel-shaded critters, depth-sorted buildings, and particle effects.

| Action | Touch | Desktop |
|---|---|---|
| Move | **Left thumb** — press and drag anywhere on the left half; 360° smooth movement | Arrow keys / WASD |
| Attack | **Right thumb** — flick or draw a shape on the right half | J = Bolt, K = Twin, L = Power, U = Chain, O = Nova |
| Interact / confirm | **A** button (also advances dialog) | Space or E |
| Hero & Bag | **☰** button | P or B |

**Attack gestures** (right thumb): a quick flick = **Bolt**, a gentle bend = **Twin**, a sharp **V** = **Power**, a **Z** zigzag = **Chain** (pierces), a **circle** = **Nova** (3-way). The name flashes when you attack, and it uses your **class element**. **Mages** fire arcane bolts, **Rangers** loose piercing arrows, and **Warriors** cleave a melee arc in front of them — so warriors need to get right up close.

Walk up to the nurse, shop, a berry bush, a house, or a resource node and a **tappable prompt** (Heal / Shop / Pick / Rest / Chop / Mine) floats above your head — tap the prompt (or **A**) to act. Dialog boxes advance when you tap them. A live **XP bar** with your level sits in the top HUD, and an in-game **Spell Guide** (☰ menu) shows every gesture. Hold your phone sideways for the best view.

**Tips**
- Walk into the tall grass (the darker, textured patches to the north and south) to find wild monsters.
- Bump into the **♥ nurse** in town to fully heal and restore energy.
- Walk into the **Mart** (blue awning) to spend coins on food and potions.
- Walk into a **house** or your own **Hut** to sleep, heal, and restore energy.
- Walk into a **berry bush** (🍒) to pick berries — eat them from the Bag to restore hunger and heal.
- **Spend before you risk it.** Coins and materials vanish when you fall, but your level, skills, crafting, and buildings are forever — so bank progress into permanent upgrades.
- **Play your class:** kite as a Mage or Ranger, but as a Warrior, close the distance and cleave.

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
- Boss arenas and a run-based descent
- More classes, weapons, and Super variants
- Meta-progression you unlock between runs (Hades-style)
- Even more monsters, attacks, and status effects (freeze, confusion, stat buffs)

## 📄 License

MIT — see [LICENSE](LICENSE). Do whatever you like with it.

---

Built as a starter project — fork it, tweak the `SPECIES` and `MAP_STR` tables near the top of the script, and make it your own.
