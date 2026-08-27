# Recipe: Lightning Record Home (highlights + Details/Related + Activity/Chatter)

The standard Lightning record page. Build **this** for any "open a record" screen — do not
invent a custom record layout. **Default layout: 2-region** (main + right sidebar);
**3-region** (add a left related-lists rail) is the option for dense objects.

> **Spec-driven:** object name, highlight fields, action buttons, detail sections/fields,
> and related lists all come from the project spec. The classes below are the frame; map
> real content into them.

## Regions
- **2-region (default):** `main` (highlights + tab set) + `right` sidebar (Activity/Chatter).
- **3-region:** add a left column of related-list cards; main narrows; right sidebar stays.

## Highlights panel
Use the base **`slds-page-header`** (there is no `_record-home` variant in the bundle):
`slds-page-header__row` → `slds-page-header__col-title` (media: object icon +
`slds-page-header__name` / `__name-title` / `__title` + `__name-meta` "Object • Type") and
`slds-page-header__col-actions` → `slds-page-header__controls` / `__control` with a
`slds-button-group` of actions (Edit, +Follow, etc.). Key fields go in a
`slds-page-header__detail-row` of `slds-page-header__detail-block`s (label + value).
Optionally add an `slds-path` under it (see navigation.md).

## Main tab set (`slds-tabs_default`)
`slds-tabs_default__nav` (role="tablist") of `slds-tabs_default__item` › `__link`; panels
are `slds-tabs_default__content slds-show|slds-hide`. Standard tabs: **Details**, **Related**
(+ optionally Activity/Chatter if not using the right sidebar).
- **Details tab** = read view of the record: field **sections** as a two-column
  `slds-grid slds-wrap slds-gutters`, each field an `slds-form-element slds-form-element_stacked`
  with `slds-form-element__label` + `slds-form-element__static` (the value). (`slds-form`
  isn't in the bundle; compose from `slds-form-element*`.)
- **Related tab** = one **`slds-card`** per related list (icon + title + count + "New"),
  body = a compact `slds-table` (a few columns) + a "View All" footer. See list-view.md
  for the table.

## Right sidebar — Activity + Chatter (tab set)
A second `slds-tabs_default` with two tabs:
- **Activity** — composer buttons (Log a Call / New Task / New Event / Email) + the
  **Activity Timeline** (see `activity-timeline.md`), grouped Upcoming / Past.
- **Chatter** — the feed (see `chatter-feed.md`).

## Interactivity (interactive, no data mutation)
- Tabs switch (main + sidebar), related lists expand/collapse, timeline items expand,
  table sort/select work — but nothing persists. **No inline-edit pencils** by default.

## Reuse
Factor `recordHome({highlights, tabs, related, right})` so multiple entry points (list-row
click, console subtab) render the same record. In console mode a row opens the record in a
new workspace tab (see navigation.md).
