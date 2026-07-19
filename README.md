# 🌿 Critter Wilds — A Survival Roguelite

### ▶️ [**Play now → 0pixelz.github.io/critter-survival**](https://0pixelz.github.io/critter-survival/)

*Best on a phone held sideways (landscape). Left thumb moves · right thumb attacks · tap the ✦ button when it glows to unleash your Super.*

A tiny **isometric action-survival roguelite** that runs entirely in your browser — think **Hades** meets Brawl Stars meets a pinch of Age of Empires. **You are the hero** — your own HP, level, and XP — fighting the wild in real time by drawing attack gestures. Play a **Warrior** (melee cleaves), **Mage** (arcane bolts), or **Ranger** (piercing arrows), each with its own element and a homestead perk. Roam a big generated world with **three towns** linked by roads, **buy land**, gather with tiered tools, and build a walled base with **auto-firing defense towers** — because periodic **raids** will march on everything you've built. Fall out there and you respawn in town, losing your loose loot but keeping every permanent upgrade (and everything banked in your chest). No installs, no build step, no dependencies — just open `index.html` and play.

[![Play in browser](https://img.shields.io/badge/▶%20play-0pixelz.github.io%2Fcritter--survival-5aa02c)](https://0pixelz.github.io/critter-survival/) ![Made with vanilla JS](https://img.shields.io/badge/made%20with-vanilla%20JS-f7df1e) ![No dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)

## ✨ Features

- **You are the hero** — not a trainer. You have your own **HP, level, XP, ATK, and DEF**, and you fight the wild directly. Leveling up (from kills and battles) earns skill points and makes you tougher.
- **Three classes, three playstyles** — pick **Warrior** (🪨 Stone; **melee cleaves** with knockback, no projectiles — get in close — plus +30% Super charge and a screen-shaking **Warcry** shockwave), **Mage** (🔥 Ember; **arcane bolts**, +spell power, −cooldown, and an **Arcane Nova** Super), or **Ranger** (🌪️ Gale; fast **piercing arrows**, +move speed, and an all-directions **Volley** Super). Your element comes from your class and decides type matchups.
- **Hades-style runs** — fall in battle (or let hunger/energy bottom out) and you respawn at the town campfire. You **lose your loose loot** — carried coins and gathered materials — but **keep every permanent upgrade**: your level, skill tree, crafting level, land, buildings, and anything **banked in a storage chest**. Die, grow stronger, go again.
- **A real overworld** — a big generated map with **three towns** (Oakvale, Emberport, Mossholm) connected by dirt roads, each with its own nurse, mart, land registrar, and chatty villagers. Towns are safe; the wilderness between them gets **meaner the further you stray** (enemy levels scale with distance from town — and so does the loot).
- **Land ownership** — staked plots ring every town (**gold stakes = for sale**, price on the sign; **green = yours**). Buy them from the 🏛 **registrar**, and structural building (walls, towers, chests…) only works on land you own.
- **Homestead class perks** — **Warrior · Builder** (+25% building HP, 20% cheaper repairs) · **Ranger · Forager** (+1 resource on every gather) · **Mage · Arcanist** (+15% tower damage, +10% tower range).
- **Class mobility** — a dedicated button with a 3-second cooldown ring: **Warrior & Ranger dash** in a burst of speed, the **Mage blinks** (teleports) about 3 tiles, walls permitting. The main action button is your **class weapon** (⚔️ sword / 🏹 bow / 🪄 wand) — tap it to attack even with no prompt up, and Ranger shots fly as real fletched **arrows**.
- **Tiered tools** — craft an **axe** to chop trees and a **pickaxe** to mine **⛏️ ore** (found in deeper wilderness only). Tier-2+ tools are smithed at a **forge** and add bonus yield. Resource nodes are fixed in the world and **respawn on their own timers**.
- **Base building with HP** — walls, a **door** (you pass, enemies don't), floors, a **storage chest** (banked materials survive death), **craft table** and **forge** stations that unlock recipes when you stand near them, decorative banners, and huts. Everything has **hit points**, shows a damage bar, and can be **repaired** with wood.
- **Defense towers** — an **Arrow Tower** (single target), **Frost Tower** (slows), and **Catapult** (AoE splash), each with a range ring at placement, **3 upgrade tiers**, and an **ammo** supply you load from materials (wood/fiber/stone). Plus **spike traps** and **snare traps** with limited uses.
- **Raid events** — once your base has a few structures, raider waves periodically **march on your buildings** and smash them (a ⚠️ warning comes first). They scale with your level, your base size, and each raid survived. Repel them for a coin bounty — walls funnel, frost slows, catapults delete.
- **Real-time gesture combat** — roaming monsters wander the map; fight them with your **right thumb**. Flick for a quick attack, or draw a shape for a bigger one — a **V** (Power), a **Z**/zigzag (Chain, pierces), or a **circle** (Nova, 3-way). Ranged classes auto-aim the nearest enemy and their shots are blocked by walls; the Warrior sweeps an arc of steel in front of you.
- **Charge-up Super** — dealing damage fills your ✦ Super meter (bottom-right). When it glows gold, unleash a screen-shaking class special: a ring of attacks plus an expanding elemental shockwave that blasts everything around you.
- **Animated brawler hero vs Hades-style monsters** — your hero walks with swinging arms and legs, Brawl Stars-style, in class gear with a glowing weapon. The monsters got the underworld treatment: **slanted glowing elemental eyes, heavy angry brows, jagged fanged maws, horns, spikes, and claws** — menacing silhouettes with cel-shaded bodies and type crests.
- **Diablo-style skill tree** — every level-up earns a skill point across four branches (Arcane, Storm, Survival, **Mastery**): spell power, cast haste, split shot, piercing, super focus/overload, swiftness, mending regen, vitality, **might** (+ATK), **iron skin** (+DEF), **critical strike** (2× hits), scholar, and fortune, with rank caps and prerequisites.
- **Class active abilities** — unlock your class's signature move in the Mastery branch and a new ability button appears (R on desktop): the **Mage's Spell Shield** absorbs damage in a glowing bubble, the **Warrior's War Cry** is a Diablo-style roar that heals, knocks enemies back, and hardens you for 10s, and the **Ranger's Swift Quiver** triples your fire rate. Ranks make each stronger.
- **Diablo-style loot & gear** — monsters drop equipment that lands on the ground under a **glowing rarity-colored light beam**: weapons, armor, and trinkets in four rarities (Common → **Magic** → **Rare** → **Epic**) with rolled affixes (+ATK, +DEF, +Max HP, +speed%, +XP%, +coins%). Equip one of each slot in the Inventory; salvage the rest for coins. Gear is permanent — it survives death.
- **Rare named monsters** — 💜 purple-aura elites with Diablo-style names ("Dread Voltail", "Gloom Craggle") roam the wilds: tougher, worth double XP and coins, and **guaranteed gear drops**. Alphas ⭐ drop Rare-or-better loot.
- **Sound** — procedural sound effects (attacks, hits, level-ups, coins, battle) generated live with the Web Audio API — no audio files. Toggle sound on/off in the ☰ menu.
- **Day/night cycle** — time flows on a real clock (top HUD shows the day + time + ☀️/🌇/🌙). Midday is bright; night falls dark and atmospheric, lit by campfires, torches, and your builds. Sleep in a Hut to skip to dawn.
- **Gather & craft & build** — collect **🪵 wood, 🪨 stone, 🌿 fiber, ⛏️ ore** from logs, rocks, shrubs, ore veins, and trees, then open **🔨 Craft & Build** in the ☰ menu (recipes are defined in one clearly-marked DATA block — easy to mod). Building enters a placement mode with a ghost preview and validity feedback (tap to place, ☰ to cancel). Your crafting level and buildings are **permanent** — they survive death.
- **Crafting level** — every craft earns crafting XP; leveling up unlocks better recipes (forge & traps at Lv.2, big towers at Lv.3).
- **Sell your haul** — the Mart now **buys materials** too, so a deep gathering run converts to coins… if you make it home.
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
| Weapon attack / interact | **Class weapon button** (⚔️ / 🏹 / 🪄) — attacks with your weapon, or acts on the floating prompt (also advances dialog) | Space or E |
| Dash / Blink | **💨 / 🌀 button** — Warrior & Ranger dash, Mage teleports ~3 tiles (3s cooldown ring) | Q or Shift |
| Super | **✦ button** when it glows gold | H |
| Menu (Inventory · Skills · Craft · Guide) | **☰** button | P or B |

**Attack gestures** (right thumb): a quick flick = **Bolt**, a gentle bend = **Twin**, a sharp **V** = **Power**, a **Z** zigzag = **Chain** (pierces), a **circle** = **Nova** (3-way). The name flashes when you attack, and it uses your **class element**. **Mages** fire arcane bolts, **Rangers** loose piercing arrows, and **Warriors** cleave a melee arc in front of them — so warriors need to get right up close.

Walk up to the nurse, shop, a berry bush, a house, or a resource node and a **tappable prompt** (Heal / Shop / Pick / Rest / Chop / Mine) floats above your head — tap the prompt (or **A**) to act. Dialog boxes advance when you tap them. A live **XP bar** with your level sits in the top HUD, and an in-game **Spell Guide** (☰ menu) shows every gesture. Hold your phone sideways for the best view.

**Tips**
- Walk into the tall grass to find wild monsters — and follow the **roads** to reach Emberport and Mossholm.
- Bump into the **♥ nurse** in town to fully heal and restore energy.
- Walk into the **Mart** (blue awning) to buy food — or **sell materials** for coins.
- **Buy a plot early** (gold stakes near town), drop a **chest**, and bank your materials — banked loot survives death.
- Craft an **axe and pickaxe first**; you can't chop trees or mine ore bare-handed.
- Build a **craft table**, then a **forge** — each unlocks the next tier of recipes and tools.
- Before a raid hits: **walls funnel, spikes soften, frost slows, arrows finish**. Keep your towers loaded with ammo (walk up to a tower → Load).
- **Spend before you risk it.** Coins and carried materials vanish when you fall; everything else is forever.
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
