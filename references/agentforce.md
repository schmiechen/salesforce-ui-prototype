# Recipe: Agentforce UI (panel + generate → stream → save)

How to render Agentforce in a prototype. **Naming:** it's "Agentforce" (product) or "the
agent" — **never "Copilot"** (Microsoft term), per SKILL rule 8.

## 1) Agentforce panel (right rail / record sidebar)
A gradient orb + `AGENTFORCE` eyebrow + heading, then a bulleted card. Used for
"Catch Me Up on This Case", "Why It Matters", "Supervisor Nudge", etc.

```html
<div class="slds-media slds-media_center slds-m-bottom_medium">
  <div class="slds-media__figure"><span class="my-af-orb">…ai svg…</span></div>
  <div class="slds-media__body">
    <div class="my-af-label">Agentforce</div>
    <div class="slds-text-heading_small">Catch Me Up on This Case</div>
  </div>
</div>
<div class="my-af-card"><ul><li>…bullet…</li></ul>
  <div class="my-af-action"><strong>Recommended next action:</strong> …</div></div>
```
Key CSS: `.my-af-orb` = ~2rem rounded square with a `linear-gradient(135deg,#0176d3,#5867e8,#9050e9)`
(the purple→blue Agentforce gradient); `.my-af-label` = tiny uppercase purple eyebrow;
`.my-af-card` = light gradient card (`#fbfaff→#f2f0fe`) with a subtle purple border.

## 2) Generate → stream → Edit → Save flow
The signature agent interaction: a prompt bar + **Generate**, streamed text output, then
**Edit** (in-place) and **Save to Case** that writes the result to the record.

- **Data sources chip row:** show what the agent reads (keep it in sync with the real
  golden-record/source list — derive from the same array, don't hardcode a divergent list).
- **Streaming ("typewriter"):** append each section into a `#body`, reveal text with a
  `setTimeout` char loop + a blinking `.my-cursor`. **Respect reduced motion:** if
  `matchMedia('(prefers-reduced-motion: reduce)').matches`, set the text instantly.
- **Edit:** toggle `contenteditable="true"` on the streamed `#body` (button ↔ "Done
  Editing"); this captures edits for save.
- **Save:** stash the body HTML in a module var (e.g. `CASE_PREP = {html, savedAt}`),
  create follow-up tasks, then **re-render the current tab** so it shows the record
  (`switchTab(activeId)` after the state is set) — the tab transforms from prompt → record.
- **Human-in-the-loop copy:** always include a line like "the agent summarizes / supports;
  a human makes every decision." Do **not** imply the agent decides.

## Reusing across the record
Once saved, render the summary as a card on the record and the created tasks as an
**Activity Timeline** (see `references/activity-timeline.md`). Factor the record into a
shared `renderCaseRecord({summary, right})` so multiple tabs (e.g. the Risk record and the
saved agent view) stay identical.

Working reference: `viewCopilot` / `runCopilot` / `savePrep` / `renderCaseRecord` in the
child-welfare demo.
