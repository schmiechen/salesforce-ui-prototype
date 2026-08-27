# Recipe: Standard List View

Build **this** for any "list of records" screen — not a custom card/table. It's the real
Lightning list view: a controls header + a selectable, sortable data table + a footer.

> **Spec-driven:** object, list-view name(s), columns, row actions, and filters come from
> the project spec. Map them into the frame below.

## Header (object home)
Use `slds-page-header slds-page-header_object-home`:
- **Left:** object icon + a **list-view switcher** — the list name with a caret that opens
  an `slds-dropdown` (`slds-listbox`) of saved list views; a "N items • sorted by X •
  updated ago" meta line.
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
