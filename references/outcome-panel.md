# Recipe: Agentforce Outcome Panel ("Why It Matters")

Every screen carries a persistent **outcome panel** in the **right rail** — a short
"why this screen matters" payoff that keeps the demo **outcome-first, not feature-first**.
This was the most persuasive element of the Data 360 demo.

## When
On **every top-level screen** (Home, list views, dashboards) and at the **top of the right
sidebar** on record pages (above Activity/Chatter). It's not optional — if a screen's
outcome isn't obvious, draft one and confirm with the user (see Execution model).

## Structure
- **Agentforce header:** a gradient orb holding the **same Agentforce (einstein/Astro)
  icon used in the global header** — `svg("einstein")`, not the generic `ai` glyph — so the
  panel reads as "clicked the Agentforce icon → got an impact agent." Plus a tiny
  `AGENTFORCE` eyebrow + a short title. Use a
  screen-specific title ("Case Impact", "Why It Matters", "Supervisor Nudge") — not a
  generic label repeated everywhere.
- **Message:** 2–3 short outcome lines — the mission result of using this screen ("a lapsed
  license becomes a *prevented* placement disruption, not a discovered failure"). Lead with
  the outcome, then the mechanism.
- **Illustrative tiles (optional):** 1–2 KPI tiles when they add punch ("Lapses Prevented",
  "Funds Protected"), under a **"Directional / Illustrative"** label. **Never invent
  sourced numbers** — mark them illustrative (an arrow/qualitative value is fine).

```html
<div class="my-af-head"><span class="my-af-orb">‹ai svg›</span>
  <div><div class="my-af-label">Agentforce</div><div class="slds-text-heading_small">Why It Matters</div></div></div>
<div class="my-af-card"><ul><li>…outcome line…</li><li>…outcome line…</li></ul></div>
<p class="slds-text-title_caps slds-text-color_weak">Directional / Illustrative</p>
<div class="my-tiles">…1–2 illustrative tiles…</div>
```

## SPEC shape (per screen)
```js
outcome: { title:"Why It Matters",
  points:["…", "…"],
  tiles:[["Lapses Prevented","↑"],["Funds Protected","Illustrative"]] }  // tiles optional
```
Render it with a single `outcomeRail(outcome)` helper (see the template). `OUTCOME_STYLE`
defaults to `"agentforce"` (purple orb + eyebrow); `"neutral"` drops the AI branding to a
plain "Outcome" card.

## Placement mechanics — a docked agent panel on the right
The panel should read as *"someone opened an Agentforce agent"*: **all** main content
(page header, list, record highlights/details) pushes **left**; the agent panel is a fixed
right column with a **left-border separator** (`.my-rail`), **top-aligned** (`align-items:start`).

- **Top-level screens (list/home/dashboard):** wrap the whole view in `.my-with-rail`
  (`grid-template-columns:1fr 21rem`). Put the **page header *inside* the left column** — not
  full-width above the grid — so the agent panel top-aligns with the header, not the table.
  Right column = `<div class="my-rail">${outcomeRail(SPEC.outcome)}</div>`.
- **Record pages:** highlights + path stay full-width; below them a `1fr 22rem` grid. The
  right column is the agent panel — outcome on top, Activity/Chatter below it.
  **Gotcha:** the right column must be a **single wrapper `<div>`**. If outcome and the
  Activity/Chatter `my-side` are two sibling divs, the grid wraps the second one to a new
  row and it drops to full width under the details ("pushed down"). Wrap both in one
  `<div class="my-rail">…</div>`.

## Execution (how outcomes get written)
During **Scope**, after the tab list is set: **draft** an outcome for each screen from the
brief, **ask only** for screens whose payoff you can't confidently infer, and **show all
drafts** for a quick confirm. Keep each to 2–3 lines; make them specific to the screen.

Styling reuses the Agentforce panel CSS (`my-af-orb`, `my-af-label`, `my-af-card`) — see
`references/agentforce.md`.
