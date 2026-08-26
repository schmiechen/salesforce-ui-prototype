# Recipe: SLDS Modals + Relationship Graphs (ARC-style)

Two reusable pieces that pair well: a real SLDS **modal**, and an **ARC-style
relationship graph** (root record → grouped related-record cards) to render inside it —
e.g. a household, a provider fraud ring, or an account hierarchy.

## Modal (genuine SLDS blueprint)
All classes are in the Cosmos bundle: `slds-modal`, `slds-modal__container`,
`slds-modal__header`, `slds-modal__title`, `slds-modal__content`, `slds-modal__footer`,
`slds-modal__close`, `slds-backdrop slds-backdrop_open`, `slds-fade-in-open`,
`slds-modal_large`.

**Pattern:** keep one empty host in the DOM (`<div id="modalHost"></div>`); an `openX()`
function fills it with the modal + backdrop; `close()` sets `host.innerHTML = ""`.

```js
function openThing(){
  document.getElementById("modalHost").innerHTML = `
    <section class="slds-modal slds-fade-in-open slds-modal_large" role="dialog" aria-modal="true" aria-labelledby="mTitle">
      <div class="slds-modal__container">
        <header class="slds-modal__header">
          <button class="slds-button slds-button_icon slds-modal__close" id="mClose" aria-label="Close">✕</button>
          <h2 id="mTitle" class="slds-modal__title">Title · Subtitle</h2>
        </header>
        <div class="slds-modal__content slds-p-around_medium"> …body… </div>
        <footer class="slds-modal__footer"><button class="slds-button slds-button_neutral" id="mCloseB">Close</button></footer>
      </div>
    </section>
    <div class="slds-backdrop slds-backdrop_open" id="mBackdrop"></div>`;
  const host = document.getElementById("modalHost"), close = () => host.innerHTML = "";
  document.getElementById("mClose").onclick = close;
  document.getElementById("mCloseB").onclick = close;
  document.getElementById("mBackdrop").onclick = close;   // click-out to dismiss
}
```
Wire the trigger after each render (the element is re-created on tab switch), e.g.
`document.getElementById("openLink").onclick = openThing;`.

## Relationship graph (root → groups → cards)
A compact, dependency-free graph: a highlighted **root node**, a left-bordered **branch**,
one **group** per relationship type (with a count), and **member cards** (link title +
actions chevron + label/value fields). Add a **Show Fields** toggle and **zoom** controls
for polish.

Custom classes (all `my-*`; use SLDS hooks with fallbacks):
- `.my-arc-root` — white card, **blue text**, thin border (do **NOT** fill it with
  `accent-container-1` — that token is saturated blue in Cosmos → blue-on-blue).
- `.my-arc-branch` — `border-left` + padding for the tree line.
- `.my-arc-group` / `.my-arc-ghead` / `.my-arc-count` — group header + count pill.
- `.my-arc-card` (+ `.is-subject` to highlight the focal record) — member card.
- `.my-arc-graph.hide-fields .my-arc-fields{display:none}` — the Show-Fields toggle target.
- `.my-arc-graph{transform-origin:top left}` — set `transform:scale(n)` for zoom.

Data shape: `{ root, groups:[{label, icon, members:[{name, role, fields:[[k,v],…], subject?}]}] }`.
A single `arcCard(m)` renderer works for every group (household members, providers,
shared identifiers, etc.). See `openARC` (household) and `openInvestigation` (provider
ring) in the child-welfare demo for a full working example, including the exposure tiles
and footer actions (Assign / Place Hold that swap to a "✓ done" state).

## Gotchas
- The modal/graph markup is re-created on each render — **(re)wire handlers after render**,
  not once at load.
- Toggle/zoom state is local to the open modal; that's fine (it resets on reopen).
- Keep the graph in a scroll container (`overflow:auto; max-height:60vh`) so large graphs
  don't blow out the modal.
