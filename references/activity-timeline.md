# Recipe: Activity Timeline (genuine `slds-timeline`)

Use the real **`slds-timeline`** blueprint — the bundle styles it fully (chevron
connector, type colors, expand). Don't hand-roll a custom timeline.

> **Spec-driven:** activities (type, title, date, who, group, details) come from the spec.

## Item markup (expandable)
```html
<ul class="slds-timeline">
  <li><div class="slds-timeline__item_expandable slds-timeline__item_task">  <!-- type: _task|_call|_email|_event -->
    <span class="slds-assistive-text">task</span>
    <div class="slds-media">
      <div class="slds-media__figure">
        <button class="slds-button slds-button_icon slds-timeline__trigger" aria-controls="d1" aria-expanded="false">
          <span class="slds-button__icon slds-timeline__details-action-icon">‹chevronright svg›</span></button>
        <span class="slds-icon_container slds-icon-standard-task slds-timeline__icon" title="task">
          <svg class="slds-icon slds-icon_small" viewBox="0 0 520 520"><path d="…task glyph…"/></svg></span>
      </div>
      <div class="slds-media__body">
        <div class="slds-grid slds-grid_align-spread slds-timeline__trigger">
          <div class="slds-grid slds-grid_vertical-align-center slds-truncate_container_75 slds-no-space">
            <h3 class="slds-truncate"><a href="#">Title</a></h3>
          </div>
          <div class="slds-timeline__actions slds-timeline__actions_inline">
            <p class="slds-timeline__date">Due Today</p>
            <button class="slds-button slds-button_icon slds-button_icon-border-filled slds-button_icon-x-small">▾</button>
          </div>
        </div>
        <p class="slds-m-horizontal_xx-small slds-text-color_weak">You have an upcoming task</p>
        <article id="d1" class="slds-box slds-theme_shade slds-m-top_x-small slds-timeline__item_details slds-hide">details…</article>
      </div>
    </div>
  </div></li>
</ul>
```

## What SLDS gives you for free
- **Type-colored connector** — `.slds-timeline__item_<type>::before` (task green, call teal,
  email gray, event purple). **Do not add your own connector** (double line).
- **Type icon color** — `slds-icon-standard-<type>` sets the container color; put the white
  glyph inside as `<svg class="slds-icon slds-icon_small">` (offline = inline the genuine
  SLDS glyph; there's no sprite). `call` → class `slds-icon-standard-log-a-call`.

## Thin custom glue (`my-*`) — only these
- Rotate the trigger chevron on open, force glyph white, keep the whole header clickable.
- Group headers ("Upcoming & Overdue", "This Month") — just headings, no SLDS component.
- Composer above the list (Email/Call/Event/Task quick actions) — a small custom pill row.

## Interactivity (no data mutation)
Clicking a `.slds-timeline__trigger` toggles `slds-is-open` on the item and
`slds-hide`/`slds-show` on `.slds-timeline__item_details`; set `aria-expanded`. Working
reference: `renderActivity()` / `wireActivity()` in the shell template.
