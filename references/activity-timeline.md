# Recipe: Activity Timeline (record sidebar)

The standard Lightning **Activity Timeline** in a record's right sidebar. Match the real
component closely — it's a common tell when it's off.

> **Spec-driven:** activities (type, title, date, who, group, details) come from the spec.

## Anatomy (top → bottom)
1. **Composer** — a row of **icon pill buttons**, one per activity type: Email (gray),
   Call (teal), Event (purple), Task (green). Each pill = a **colored circle** with the
   type glyph + a small dropdown caret. (Not text buttons.)
2. **Filters line** — right-aligned "Filters: All time · All activities · All types" + a
   settings gear; below it "Refresh · Expand All · View All" links.
3. **Grouped items** — group headers (e.g. **Upcoming & Overdue**, then **This Month** /
   a month·year), each a light gray bar with a collapse caret.
4. **Timeline items** — see below.

## Item structure
`[expand chevron ›] [circular type icon] [body]`, with a **type-colored connector line**
running down the icon column to the next item.
- Icon: a **circle** (border-radius 50%), colored by **type** — task `#4bc076`, call
  `#48c3cc`, email `#939393`, event `#cb65ff` — with the genuine SLDS glyph (`task`,
  `call`, `email`, `event`) inlined `fill=currentColor`.
- Body top row: a **blue link title** + the **date** (right) + a round **action caret**.
- Body sub: a short descriptive line ("You logged a call", "You have an upcoming event").
- **Expand** (chevron on the left, or clicking the title) reveals a details region.

## Icons (offline)
Inline genuine SLDS utility SVGs (`task`, `call`, `email`, `event`, `chevronright`,
`chevrondown`, `settings`) — `fill=currentColor`, `viewBox 0 0 520 520` (event is 52).
See `references/icons.md`.

## Gotchas
- **Circular icons, not squares** — a rounded-square icon reads as "not Salesforce."
- **One connector.** Draw a single line in the icon column (a flex-grow `<span>` below the
  circle, colored by type). Do **not** also enable SLDS's `slds-timeline__item_*::before`
  connector at the same time, or you get a double line.
- Titles are **blue links**; dates are muted and right-aligned.

## Interactivity (no data mutation)
Expand/collapse per item; composer/filter/links are visual. Working reference:
`renderActivity()` / `wireActivity()` in the shell template.
