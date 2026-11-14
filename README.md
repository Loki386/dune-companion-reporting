# Dune Reporting

Browser tools for Dune exports:

- **Drop rates:** item drop rates per dungeon and level, from session exports (`dune-sessions-*.json`).
- **Permits:** crafting permits held per grade across your characters, from augments and uniques exports.

Everything runs in your browser. There is no server, no build step and nothing to install, and your exports never leave your machine.

## Getting started

Open `index.html` in a browser. It is the home page, with a tab for each tool.

- The page loads when you first open its tab and keeps its state while you switch tabs.
- The open tab is shown in the address (`index.html#drop-rates` or `index.html#permits`) and is remembered for your next visit.
- Each page can also be opened on its own: `drop-rates.html` or `permits.html`.

## Drop rates

1. Open the **Drop rates** tab.
2. Drop one or more `dune-sessions-*.json` exports onto the page, or use **Add exports…**.
3. Work through the page's tabs from left to right.

Exports are remembered in the browser (IndexedDB), so you only need to add them once.

### Why sessions have to be picked

The export records loot per **session**, not per dungeon run. Loot can only be credited to a dungeon and level when every run in the session was the same dungeon at the same level. Even then, the session's loot may include items picked up outside the dungeon. Picking sessions keeps the drop rates honest.

### Drop rates tabs

#### 1 · Exports

Lists the loaded exports. Each export is one account; give it a name so you can tell accounts apart.

You can combine exports from several accounts. If a session appears in more than one export, for example an older and a newer export from the same account, the copy from the most recent export is used.

#### 2 · Pick sessions

Lists every session that has dungeon runs.

- **Included automatically:** sessions where every run was the same dungeon and level. Untick one to leave it out, for example if you looted outside the dungeon.
- **Mixed sessions:** shown but can't be selected, because their loot can't be credited to a single dungeon and level.
- **Dungeon column:** shows the dungeon, its level and the number of runs. Mixed sessions list each dungeon once, followed by its levels and run counts. For example: `Imperial Testing Station No. 152 · L14 ×1, L15 ×2, The Old Quarry · L10 ×1`.
- **Loot detail:** click a row to see the session's loot, sorted A–Z.
- **Filters and bulk actions:** filter by account, dungeon, level, character or status, then use **Include shown** or **Exclude shown** to change many rows at once.

#### 3 · Items

Every item seen across all loaded sessions, in three sections:

| Section | Contents |
| --- | --- |
| Augments | Augment blueprints, grouped by the item catalog's augment groups (Garment, Melee Weapon and Ranged Weapon) |
| Blueprints | Weapon, armor and utility blueprints (T6: Armor, Utility and Weapons) |
| Other | Everything else, including crafted items that share a name with a blueprint, resources and currencies |

Untick an item to leave it out of the drop rates. The Augments and Blueprints lists and their groups come from the master item catalog (see [Item catalog](#item-catalog)).

#### 4 · Drop rates

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

## Permits

The **Permits** tab tracks how many crafting permits you hold for augments, blueprints and other unique items, across all your characters.

1. Open the **Permits** tab.
2. Drop your exports onto the page, or use **Load exports…**. You can load several at once:
   - `dune-augments-*.json`: augment permits.
   - `dune-uniques-*.json`: weapon, armor and other unique item permits.
3. In **Loaded exports**, add each of your characters once under **Characters**.
4. Pick the character for each file from its **Character** dropdown. The exports don't record this themselves.

**Characters:**

- Names are matched without regard to capitals, so the same name can't be added twice.
- With only one character in the list, new files are assigned to it automatically.
- Removing a character (×) marks its files *Unassigned*. You're asked first if any files use it.
- The list is kept when you use **Clear all**, ready for your next exports.

**Exports:**

- Exports are made per character, so load one of each type for every character.
- When two exports of the same type have the same character, only the newest is counted. The older one is marked *not counted*, so re-exporting never double-counts.
- Use **Remove** to drop a file, or **Clear all** to start over.

Everything is remembered in the browser.

The table adds permits up across the selected characters and shows:

- **Rank:** S, A, B or C, from the [item catalog](#item-catalog).
- **Category:** the item's group from the item catalog, such as Augments: Ranged Weapon or T6: Weapons. Other uniques use the export's group, renamed by the [category overrides](#item-catalog), such as T3: Steel Products. An augment or blueprint missing from the catalog is marked *not in catalog*.
- **Held by:** which characters hold permits for the item. Only shown once more than one character is loaded.
- **G0 to G5:** permits held at each grade. G0 is ungraded, which covers most uniques. A blank cell means the item can't be crafted at that grade, and ∞ means unlimited.
- **Total:** permits across all grades.

**Filters:** Character, Type, Category, Rank and Grade are multi-select dropdowns. Tick several options in one filter to show items that match any of them; **All** and **Clear** in each dropdown reset it.

- **Character:** which characters' permits to add up. Only appears once more than one character is loaded.
- **Type:** augments, blueprints (uniques that are in the item catalog's blueprint lists) or uniques. Only appears once more than one type is loaded.
- **Category:** the categories shown in the table. Untagged categories such as Augments come first, then T6 down to T1, A–Z within each tier. Sorting by the Category column uses the same order.
- **Rank:** S, A, B, C or unranked.
- **Grade:** hides items that can't be crafted at any chosen grade, highlights those grade columns, and makes the totals count only those grades.
- **Name search.**
- **Only with permits.**
- **Hide unlimited:** hides items with unlimited (∞) permits, so the Permits total is a plain number.

Click any column heading to sort.

## Item catalog

[`item-catalog.js`](item-catalog.js) is the single source of truth for how items are classified and ranked. Both pages read it.

```js
window.ITEM_CATALOG = {
  augments: {
    "Augments: Garment": { "Blade-warding Weave": "S", ... },
    ...
  },
  blueprints: {
    "T6: Weapons": { ... }, "T6: Armor": { ... }, "T6: Utility": { ... }
  }
};

window.CATEGORY_OVERRIDES = {
  "Copper Products": "T1: Copper Products",
  ...
};
```

- **Kind:** `augments` or `blueprints`.
- **Category:** the name shown on both pages, such as `Augments: Garment` or `T6: Weapons`. A `T<n>:` prefix sets the category's tier for sorting.
- **Rank:** `"S"`, `"A"`, `"B"`, `"C"`, or `""` for unranked. Ranks came from the *Dune Awakening* tier-list spreadsheet.
- **Names:** matched to exports without regard to capitals.

To add an item, change its category, or re-rank it, edit `ITEM_CATALOG`.

**Category overrides** rename the export's own groups for items the catalog doesn't list, which covers most uniques. You don't have to add every item to the catalog. The "Products" groups are mapped to tiers:

| Export group | Shown as |
| --- | --- |
| Copper Products | T1: Copper Products |
| Iron Products | T2: Iron Products |
| Steel Products | T3: Steel Products |
| Aluminum Products | T4: Aluminum Products |
| Duraluminum Products | T5: Duraluminum Products |
| Plastanium Products | T6: Plastanium Products |

Catalog blueprints are also T6: Armor, T6: Utility and T6: Weapons. Groups with no override keep the export's name.

## Saving your choices

Session exclusions, item exclusions and chart settings are remembered in the browser (localStorage).

Use **Save selections** to write your session and item exclusions to a file. Use **Load selections** to restore them, for example in another browser or on another machine.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page: switches between the two tools with tabs |
| `drop-rates.html` | The Drop rates page |
| `permits.html` | The Permits page |
| `common.js` | Helpers shared by both pages |
| `item-catalog.js` | Master item catalog: kind, category and rank for every augment and blueprint, plus category overrides |
