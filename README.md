# Dune Drop Rates

A single-page tool for working out item drop rates per dungeon and level from Dune session exports (`dune-sessions-*.json`).

Everything runs in your browser. There is no server, no build step and nothing to install, and your exports never leave your machine.

## Getting started

1. Open `index.html` in a browser.
2. Drop one or more `dune-sessions-*.json` exports onto the page, or use **Add exports…**.
3. Work through the tabs from left to right.

Exports are remembered in the browser (IndexedDB), so you only need to add them once.

## Why sessions have to be picked

The export records loot per **session**, not per dungeon run. Loot can only be credited to a dungeon and level when every run in the session was the same dungeon at the same level. Even then, the session's loot may include items picked up outside the dungeon. Picking sessions keeps the drop rates honest.

## Tabs

### 1 · Exports

Lists the loaded exports. Each export is one account; give it a name so you can tell accounts apart.

You can combine exports from several accounts. If a session appears in more than one export, for example an older and a newer export from the same account, the copy from the most recent export is used.

### 2 · Pick sessions

Lists every session that has dungeon runs.

- **Included automatically:** sessions where every run was the same dungeon and level. Untick one to leave it out, for example if you looted outside the dungeon.
- **Mixed sessions:** shown but can't be selected, because their loot can't be credited to a single dungeon and level.
- **Dungeon column:** shows the dungeon, its level and the number of runs. Mixed sessions list each dungeon once, followed by its levels and run counts. For example: `Imperial Testing Station No. 152 · L14 ×1, L15 ×2, The Old Quarry · L10 ×1`.
- **Loot detail:** click a row to see the session's loot, sorted A–Z.
- **Filters and bulk actions:** filter by account, dungeon, level, character or status, then use **Include shown** or **Exclude shown** to change many rows at once.

### 3 · Items

Every item seen across all loaded sessions, in three sections:

| Section | Contents |
| --- | --- |
| Augments | Augment blueprints, grouped by in-game category (Garment, Generic, Melee and Ranged Weapon Augmentations) |
| Blueprints | Weapon, armor and accessory blueprints |
| Other | Everything else, including crafted items that share a name with a blueprint, resources and currencies |

Untick an item to leave it out of the drop rates. The Augments and Blueprints lists and their groups come from the master item catalog (see [Item catalog](#item-catalog)).

### 4 · Drop rates

Choose a dungeon, then either one level or **Compare all levels**.

When you choose one level, the item table shows these columns:

| Column | Meaning |
| --- | --- |
| Drop rate | Total amount dropped ÷ total runs. Stackable items can go over 100%. |
| Runs per 1 | Runs needed, on average, for one drop. |
| Total | Total amount dropped across the included sessions. |
| Sessions with drop | How many included sessions had the item at all. Useful for rare drops. |
| Active hrs per 1 | Active session hours needed, on average, for one drop. |

**Compare all levels** shows the drop rate for each level side by side.

Click an item to chart it over time:

- **Measure:** drop rate (drops ÷ runs) or sessions with a drop.
- **Lines:** a cumulative line using all data so far, plus a trailing moving average over a chosen number of sessions, runs or days.
- **Run-based moving average:** the window holds whole sessions. It keeps the fewest recent sessions that add up to at least N runs. It divides by the window's actual run total, not by N.
- **Show chart data:** lists each session with its runs, drops, per-session rate, cumulative rate and moving average.

## Permits page

`permits.html` (linked as **Permits** from the drop rates page) tracks how many crafting permits you hold for each augment and blueprint.

1. Open `permits.html`.
2. Drop a `dune-augments-*.json` export (and a blueprints export, if you have one) onto the page, or use **Load exports…**.

Loading a newer export of the same kind replaces the older one, and the data is remembered in the browser.

The table shows:

- **Tier:** S, A, B or C, from the [item catalog](#item-catalog).
- **Category:** the item's group from the item catalog, such as Ranged Weapon Augmentations. An item missing from the catalog is marked *not in catalog* and uses the export's own group.
- **G1 to G5:** permits held at each grade. A blank cell means the item can't be crafted at that grade, and ∞ means unlimited.
- **Total:** permits across all grades.

**Filters:** Type, Category, Tier and Grade are multi-select dropdowns. Tick several options in one filter to show items that match any of them; **All** and **Clear** in each dropdown reset it.

- **Type:** augments or blueprints. Only appears once both kinds are loaded.
- **Category:** the item catalog's groups.
- **Tier:** S, A, B, C or untiered.
- **Grade:** hides items that can't be crafted at any chosen grade, highlights those grade columns, and makes the totals count only those grades.
- **Name search.**
- **Only with permits.**

Click any column heading to sort.

## Item catalog

[`item-catalog.js`](item-catalog.js) is the single source of truth for how items are classified and ranked. Both pages read it.

```js
window.ITEM_CATALOG = {
  augments: {
    "Garment Augmentations": { "Blade-warding Weave": "S", ... },
    ...
  },
  blueprints: {
    "Weapons": { ... }, "Armor": { ... }, "Accessories": { ... }
  }
};
```

- **Kind:** `augments` or `blueprints`.
- **Group:** augment groups are the in-game `groupName` from the augments export; blueprint groups are Weapons, Armor and Accessories.
- **Tier:** `"S"`, `"A"`, `"B"`, `"C"`, or `""` for untiered. Tiers came from the *Dune Awakening* tier-list spreadsheet.
- **Names:** matched to exports without regard to capitals.

To add an item, change its group, or re-rank it, edit this file.

## Saving your choices

Session exclusions, item exclusions and chart settings are remembered in the browser (localStorage).

Use **Save selections** to write your session and item exclusions to a file. Use **Load selections** to restore them, for example in another browser or on another machine.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | The drop rates page: markup, styles and script |
| `permits.html` | The Permits page |
| `item-catalog.js` | Master item catalog: kind, group and tier for every augment and blueprint |
