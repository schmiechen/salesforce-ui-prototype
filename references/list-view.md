# Recipe: Standard List View

Build **this** for any "list of records" screen — not a custom card/table. It's the real
Lightning list view: a controls header + a selectable, sortable data table + a footer.

> **Spec-driven:** object, list-view name(s), columns, row actions, and filters come from
> the project spec. Map them into the frame below.

## Header (object home)
Use `slds-page-header slds-page-header_object-home`. **Structure the title area correctly**
— stack it, don't jam the object name and list name inline (a common mistake that makes
them collide):
```html
<div class="slds-media__body">
  <p class="slds-line-height_reset">Object Name</p>                <!-- small eyebrow, on top -->
  <div class="slds-page-header__name">
    <div class="slds-page-header__name-title">
      <h1><span class="slds-page-header__title slds-truncate" title="…">List View Name</span></h1>
    </div>
    <div class="slds-page-header__name-switcher slds-dropdown-trigger slds-dropdown-trigger_click">
      <button class="slds-button slds-button_icon slds-button_icon-small">▾</button>   <!-- list switcher -->
    </div>
  </div>
  <p class="slds-page-header__meta-text">N items · sorted by X · updated a moment ago</p>
</div>
```
So: **object eyebrow → list-name `__title` + `__name-switcher` caret → `__meta-text`**,
each on its own line.
- **Right:** action buttons (New, Import, …) as a `slds-button-group`, then **list
  controls** as `slds-button_icon-border-filled` icons: Search this list, Refresh, Charts,
  Filters, and a list-settings gear.
- Optional **filter panel** (`slds-panel` or a simple dropdown) when Filters is toggled.

## Data table
`<table class="slds-table slds-table_bordered slds-table_col-bordered slds-table_fixed-layout slds-table_resizable-cols">`
- **Header row** (`slds-line-height_reset`): a leading `slds-cell-shrink` **select-all**
  checkbox cell; then `<th>` columns. Sortable columns use `slds-is-sortable` on the `th`
  with an inner `slds-th__action` button; the active sort column gets `slds-is-sorted`
  (+ `slds-is-sorted_asc|desc`) and shows the sort arrow. A trailing `slds-cell-shrink`
  action column.
- **Body rows** (`slds-hint-parent`): a `slds-checkbox` cell, data cells wrapped in
  `slds-truncate` (first cell as an `slds-cell-wrap`/link that opens the record), and a
  row-level **action menu** (`slds-button_icon-border-filled` ▾ → `slds-dropdown`).
- **Footer:** item count + "sorted by" note.

## Interactivity (interactive, no mutation)
- **Sort:** clicking a sortable header re-orders the rows (toggle asc/desc, move the
  `slds-is-sorted*` classes + arrow).
- **Select:** row checkboxes + select-all; show a "N selected" state (e.g. reveal bulk
  actions). No data changes.
- **Row → record:** standard nav = open the record in the main region; **console** = open
  it as a new **workspace tab** or select it in a **split view** (see navigation.md).

## Reuse
`listView({object, views, columns, rows, rowActions, onOpen})` renders the whole thing;
`onOpen(row)` decides standard-navigate vs console-open-tab.
