# Recipe: SLDS Activity Timeline (tasks / activities)

Renders like a real Salesforce record's **Activity Timeline**: a type-colored vertical
connector, an icon per row, a title with an optional completion checkbox, a date on the
right, and an expand/collapse chevron that reveals details.

## Blueprint classes (all in the Cosmos bundle)
- List: `slds-timeline` (a `<ul>`).
- Item: `slds-timeline__item_expandable` **+** a type variant that colors the connector:
  - `slds-timeline__item_task` → **green** connector
  - `slds-timeline__item_call` → teal · `slds-timeline__item_email` → gray · `slds-timeline__item_event` → purple
- The connector line is drawn by `.slds-timeline__item_expandable::before` (color set by
  the type variant). Icon: `slds-icon_container slds-timeline__icon`. Right-side meta:
  `slds-timeline__actions` / `slds-timeline__date`. Layout uses `slds-media` +
  `slds-media__figure` / `slds-media__body`.

## Key gotcha — don't draw your own connector
SLDS already draws the vertical line via `::before`. **Do not add a second connector**
(that causes a double line). If your adapted layout puts the icon at a different x than
SLDS expects (its default is `inset-inline-start: 2.235rem`, assuming a leading chevron),
just realign SLDS's line to your icon center instead of adding one:
```css
.my-tl2 .slds-timeline__item_expandable::before{ inset-inline-start:.68rem; margin-inline-start:0; }
```
Give the icon `position:relative; z-index:1` so it sits on top of the line. Match the icon
color to the type (task = `#4bc076`) so icon and line read as one system.

## Icons (offline)
No sprite offline — inline a genuine SLDS utility SVG (`task`, `check`, `call`, `email`,
`event`) with `fill="currentColor"`, `viewBox="0 0 520 520"`, inside the
`slds-icon_container slds-timeline__icon` square (see references/icons.md for fetching).

## Interactions (vanilla JS)
- **Expand/collapse:** toggle `slds-is-open` on the item; show/hide the details region;
  rotate the caret.
- **Complete (task):** on checkbox change, add an `is-done` class → strike the title,
  swap the icon to `check`, tint it green, and flip the status badge to *Completed*. Use
  `onclick="event.stopPropagation()"` on the checkbox so completing doesn't also expand.

## Right-rail vs main
The full timeline wants width. In a ~340px right rail, use a compact adaptation (icon +
truncated title + date/assignee subtitle + expandable details) as done in the child-welfare
demo's `prepTasks()`. In the main column you can use the fuller SLDS markup (chevron
trigger on the left, inline actions on the right).

## Minimal item markup
```html
<ul class="slds-timeline">
  <li><div class="slds-timeline__item_expandable slds-timeline__item_task">
    <span class="slds-assistive-text">Task</span>
    <div class="slds-media">
      <div class="slds-media__figure">
        <span class="slds-icon_container slds-timeline__icon" style="background:#4bc076;position:relative;z-index:1">…task svg…</span>
      </div>
      <div class="slds-media__body">
        <div class="slds-grid slds-grid_align-spread"> <!-- click to expand -->
          <span class="slds-grid slds-grid_vertical-align-center">
            <input type="checkbox" onclick="event.stopPropagation()" />
            <span class="slds-truncate">Complete substance-use assessment</span>
          </span>
          <span class="slds-badge">New</span>
        </div>
        <p class="slds-text-body_small slds-text-color_weak">Due in 5 days · Maria Delgado · High</p>
        <div hidden> <!-- details --> …description… Related to CW-2026-04817 …</div>
      </div>
    </div>
  </div></li>
</ul>
```
