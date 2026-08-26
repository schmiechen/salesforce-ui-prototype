# Template: Demo Click-Path Talk Track

After a prototype works, offer the presenter a **Do/Say** talk track. Save it next to the
demo as `TALK-TRACK.md`. Fill the brackets from the actual build.

## Structure
1. **Through-line (one sentence).** The single idea every screen reinforces (e.g. "the
   golden record is the foundation — nothing else works without it"). Repeat it 2–3×.
2. **Audience framing note.** Who's watching + how to reframe for a different room.
3. **Disclaimer once, early.** "Illustrative — fictitious data, not a live system."
4. **Opening (~30s):** the problem, then "watch what happens when we fix it."
5. **Per screen — `Do:` (what to click) + `Say:` (1–3 speakable sentences).** Cover every
   interaction you built (animations, modals, save flows) — that's the "wow."
6. **Close (~20s):** tie every screen back to the through-line + the outcome.
7. **Delivery tips:** full vs. short run time; let key animations finish before talking;
   the recurring refrain; tone (capability vs. commitment for competitive deals).
8. **Reset between runs:** note any state that persists until reload (resolved/saved
   states) — refresh for a clean run.

## Writing rules
- `Say:` lines are **spoken** — short, plain, outcome-first. No jargon dumps.
- Name the on-screen element the presenter clicks in `Do:` (exact button/label text).
- Lead with the user/mission outcome, then the mechanism ("…which is possible because…").
- For competitive/undecided deals, keep it **capability, not commitment** ("this approach
  can…"), and don't presume the vendor has won.
- Offer a **short version** (the 3 highest-impact screens) for tight meetings.

## Skeleton
```
# <App Name> — Demo Click-Path Talk Track
**Through-line:** …
**Audience framing:** …   **Disclaimer:** "Illustrative — fictitious data…"

## Opening (30s)
Do: … / Say: …

## <Screen 1 — the foundation>
Do: <click X> / Say: "<outcome>, because <mechanism>."
Do: <trigger the key interaction> / Say: "<the aha — tie to through-line>."

## <Screen 2..N>
Do: … / Say: …

## Close (20s)
Say: "Everything you saw sits on <through-line> … <outcome for the mission>."

## Delivery tips
- Full ~N min; short version: <screens>. Let <animation> finish. Refrain: "<one line>."
## Reset between runs
- <what persists> — refresh the browser for a clean run.
```
See `~/Data 360 for CCWIS/TALK-TRACK.md` for a complete worked example.
