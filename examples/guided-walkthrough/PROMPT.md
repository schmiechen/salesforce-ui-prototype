# Prompt: Guided Walkthrough

The brief that produced `guided-walkthrough.html`. Paste it to Claude Code with this skill
installed to replicate the build.

---

**Using the `salesforce-ui-prototype` skill:** Build a four-screen walkthrough demo for a fictional
retail company's support team. Screens: **Overview** (the standard case record), **Case Briefing**
(an agent summary plus numbered source records), **Data 360 Mapping** (a Data Cloud-style field
mapper: a data lake object on the left, Data Model entities on the right, wires between them), and
**Results** (two slides: KPI tiles that build in one at a time with a headline banner, then a
details slide where the banner stays pinned at the top).

Agentforce lives in the utility bar as a docked chat popup ("Ask The Record") with suggested
questions, typed-out answers, and numbered citations that jump to the source records. Add a guided
auto-play (type `ee`) that walks through every screen, with step back / forward, a simulated mouse,
and a caption bar. Every screen carries an Agentforce "why it matters" outcome rail. Use only
fictitious data.

---

See `NOTES.md` for the assumptions and decisions this brief left open, and `smoke-test.js` for the
headless test that replays every step.
