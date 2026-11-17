# Guided Walkthrough: assumptions & decisions

What the brief left open, and how the prototype resolved it.

## Assumptions made (defaulted in the prototype)
- **Scenario:** a fictional retail company ("Northwind Outfitters") with a standard Case record.
  All names, figures, and field values are illustrative and invented.
- **Chat answers:** three canned questions with canned, cited answers. Typing a question that
  matches one of them (first 12 characters) answers it; anything else gets a fallback line.
- **Mapper:** one data lake object (`Lead_Home`) mapped to four Data Model entities. Nine mappings
  are pre-built; Phone, Lead Source, and Created Date start unmapped. Field names are illustrative:
  check the Data Model tab of a real org for actual DMO field names.
- **Mapper interactions:** click a source port, then a target port, to create a mapping; click a
  transform node to remove one; the two search boxes filter fields; Save shows a confirmation toast.
  Nothing persists.
- **Results:** KPI values are placeholders, labeled illustrative.
- **Walkthrough:** 10 steps, about a minute at default pacing. `ee` start/stop · arrows step ·
  Space auto/manual · `aa` mouse on/off · Esc exit.

## Decisions for the project team
- **Real data model:** which DMOs and fields does the real stream map to, and which mappings need
  formula fields (the mapper shows plain one-to-one transforms only)?
- **Relationships:** should cardinality (one-to-one, many-to-one) and a graph view be shown?
  (Not built; see `references/data-360-field-mapper.md`.)
- **Agent scope:** which records may the agent cite, and who sees which suggested questions?

## Reusable pieces (see `assets/snippets/`)
`autoplay.js` · `chat-popup.js` · `field-mapper.js` (+ matching `.css` files). The staged-build and
pinned-banner slide pattern is documented in `references/outcome-panel.md`.
