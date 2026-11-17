# Recipe: Guided auto-play walkthrough

A prototype can present itself: a caption bar, a simulated mouse, real clicks and typing, and
step-back / step-forward that always lands in a known state. Use it when a demo will be
screen-shared or when you want a self-running tour. Code: `assets/snippets/autoplay.js` +
`autoplay.css`.

## 1) Wire it up
Paste the snippet into the script block (after the shell helpers) and the CSS into the style block,
then describe the tour as **data**:

```js
const walk = createAutoPlay({
  container: "#work",                       // the scrollable region
  reset: () => { resetState(); renderAll(); },   // back to the first screen, all state cleared
  steps: [
    // [caption, actions[], dwellMs]  (dwell = pause after the actions before auto-advancing)
    ["Open the briefing.",      [ {click: byText(".my-navitem", "Case Briefing", true)} ], 3000],
    ["Ask the agent.",          [ {click: bySel('.my-utilbtn[data-u="agent"]')},
                                  {type: bySel("#chatInput"), text: "What changed?"}, {wait: 4500} ], 1500],
  ],
});
walk.bindKeys();
```
Keys: **ee** start/stop · **← →** step · **Space** auto/manual · **aa** mouse on/off · **Esc** exit.

## 2) Actions
`{click:fn}` `{move:fn}` (cursor only) `{type:fn, text}` (types, then presses Enter) `{wait:ms}`
`{scroll:y|-1}` (`-1` = bottom) `{run:fn, ms}` (any code, e.g. open a modal).
`fn` is a lazy resolver run when the action runs: `byText(selector, text, exact)`, `bySel(selector)`, or
your own. Return `null` to skip (use this for toggles, e.g. close a panel only if it is open).

## 3) Modes and step-back
- **anim**: mouse glides to the target, ripple, typing at human speed. **plain** (`aa`): same, no mouse.
  **inst**: no waits at all.
- Going to step *i* = `reset()` → replay steps `0..i-1` in **inst** mode → run step *i* live. Because every
  jump starts from `reset()`, the screen is always deterministic.
- While replaying, the snippet sets the template's `REPLAYING` flag so every animation (`animOK()`) jumps
  to its final state. Your own animations must honor `animOK()`.

## Gotchas
- **`reset()` must clear every mutable global**: open modals and panels, chat logs, selected rows,
  slide index, form values, timers. Anything missed leaks into the next replay.
- A resolver that finds nothing is skipped **silently**. The engine records it in `walk.missed`:
  assert `walk.missed.length === 0` in the smoke test so a renamed button cannot break the tour unnoticed.
- Timers that touch the DOM must check `el.isConnected` (or a generation counter) before acting.
- Captions are data, not code: write what the UI is doing, in the present tense.
- Keep dwell times honest: after a `type` action the answer may still be typing, so add a `{wait}`.

Working reference: `examples/guided-walkthrough/` (10 steps, replayed by its `smoke-test.js`).
