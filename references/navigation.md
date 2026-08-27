# Recipe: Standard vs Console navigation

Pick a nav model with a `NAV_MODE` config. **Default `NAV_MODE = "console"`**; `"standard"`
is the toggle. Both use the same global header; they differ below it.

## Standard
- App nav = **`slds-context-bar`** with the app name + tabs (Home, an object list, …).
- Selecting a list row **navigates the main region in place** to that record home.
- Back = a small breadcrumb or the object tab. One record open at a time.
- This is the lighter model; use it for internal/admin apps.

## Console (default)
Multi-record workspace, the way a service/agent console behaves:
- **Workspace tabs** across the top: each opened record is its own tab (with the object
  icon + record name + a close ✕). Clicking a list row **opens a new workspace tab**
  rather than replacing the page. Model it as an array of open tabs + an `activeTab`.
- **Split view** (optional) via `slds-split-view_container` / `slds-split-view` /
  `slds-split-view__list-item` + `slds-split-view__toggle-button` — a docked list on the
  left, the record on the right; clicking a list item swaps the record pane.
- **Docked utility bar** (bottom): utilities open upward as panels. Default items:
  **Omni-Channel · Phone · History**. Not in the SLDS bundle — build a small custom
  `my-utilitybar` (bottom bar of buttons) + `my-utility-panel` (pop-up), like the demo's
  app-launcher pattern.
- Subtabs (optional): a record tab can host subtabs (e.g. a related record opened within
  the parent's workspace) using a second `slds-tabs_default` strip.

## `slds-path` (bonus — stage/status path)
For records with a lifecycle (status/stage), add a path under the highlights:
`slds-path` › `slds-path__nav` › `slds-path__item` (`slds-is-complete` / `slds-is-current`
/ `slds-is-incomplete`) › `slds-path__link` › `slds-path__stage`. Clicking a stage can
mark it current (visual only).

## Wiring
- Keep `NAV_MODE`, the open-tabs array, and `activeTab` in module state; re-render the
  workspace on tab open/close/switch (same view-engine pattern as the base skill).
- **Spec-driven:** the tabs, objects, and utilities come from the project spec — don't
  hard-code a vertical. Map "what apps/objects does this org use?" → nav tabs; "what
  utilities?" → utility bar.
