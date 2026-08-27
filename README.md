# salesforce-ui-prototype

Build a **single, self-contained, offline HTML file** that looks and behaves like a real
Salesforce **Lightning Experience** app — for demos, mockups, and click-through
prototypes. No Salesforce org, no server, no build step. Opens with a double-click.

Built on genuine **SLDS 2 ("Cosmos")** CSS + real `slds-*` blueprints + genuine SLDS
logo/icon assets (never freehand).

## What you can build
A multi-tab Lightning app in one file, with a persistent shell (global header + app-nav
tabs + left rail + right panel) and a small JS view engine that swaps the workspace per
tab. Recipes are included for the common pieces:

- **Standard list views** — list-view switcher, controls/filters, and a sortable,
  selectable data table (`references/list-view.md`).
- **Standard record home** — highlights + **Details / Related** tabs + an **Activity
  Timeline & Chatter** right sidebar (2- or 3-region) (`references/record-home.md`).
- **Standard vs console navigation** — context-bar app nav, or a **console** (workspace
  tabs, split view, utility bar); `NAV_MODE` defaults to console (`references/navigation.md`).
- **Identity resolution → golden record** — merge/animate disparate source records into
  one unified record (the pattern behind the reference demo).
- **Relationship graphs (ARC-style)** in **SLDS modals** — households, provider rings,
  hierarchies. (`references/modals-and-graphs.md`)
- **Agentforce** — the AF panel + a Generate → stream → Edit → Save-to-record flow.
  (`references/agentforce.md`)
- **Activity Timeline** — tasks/activities with expand + complete.
  (`references/activity-timeline.md`)
- **Dashboards** — dependency-free CSS bar charts / heatmaps that re-render on action.
- Plus a **talk-track template** to script the click-through demo.
  (`references/talk-track-template.md`)

## Install as a Claude Code skill

```bash
git clone https://github.com/schmiechen/salesforce-ui-prototype.git \
  ~/.claude/skills/salesforce-ui-prototype
```
Then just ask Claude Code to "prototype a Salesforce screen" (or invoke `/salesforce-ui-prototype`).
You can also use the scripts standalone (see below) without Claude Code.

## Quick start

```bash
SKILL=~/.claude/skills/salesforce-ui-prototype

# 1. Scaffold into your project
cp "$SKILL/assets/shell-template.html" ./index.html

# 2. Edit the config at the top of the <script> in index.html:
#    - NAV_MODE ("console" | "standard"), RECORD_LAYOUT ("2-region" | "3-region")
#    - APP + UTILITIES
#    - SPEC — object, columns, rows, detail sections, related lists, activities, feed
#    (spec-driven: replace the sample Case content with your project's object/fields)

# 3. Inline the SLDS 2 stylesheet -> offline single file
bash "$SKILL/scripts/bundle.sh" index.html index.html

# 4. Verify (classes exist, tag balance, offline, no freehand icons)
bash "$SKILL/scripts/verify.sh" index.html

# 5. open index.html   (macOS)
```

## Contents

| Path | Purpose |
|------|---------|
| `SKILL.md` | The method + golden rules (read this first). |
| `assets/shell-template.html` | Ready-to-copy **standard-Lightning** starter: console shell, standard list view + record home (Details/Related + Activity/Chatter), `NAV_MODE` + `SPEC` config, genuine inlined icons. Has the `/*__SLDS2_COSMOS_CSS__*/` marker for bundling. |
| `scripts/bundle.sh` | Downloads the SLDS 2 Cosmos CSS and inlines it at the marker. |
| `scripts/verify.sh` | Checks used `slds-*` classes exist + tag balance + offline + no freehand icons + no banned copy ("Copilot"/"Future") + blue-on-blue risk + a data-sanity reminder. |
| `references/icons.md` | Genuine SLDS logo + utility icon catalog and how to fetch more. |
| `references/activity-timeline.md` | Recipe: Salesforce Activity Timeline (tasks/activities) — type-colored connector, expand + complete, the no-double-line gotcha. |
| `references/list-view.md` | Recipe: standard Lightning list view (switcher + controls + filters + sortable/selectable table). |
| `references/record-home.md` | Recipe: standard record home (highlights + Details/Related tabs + Activity/Chatter sidebar). |
| `references/chatter-feed.md` | Recipe: full Chatter feed (publisher + posts + comments + like/mention). |
| `references/navigation.md` | Recipe: console vs standard nav (`NAV_MODE`), workspace tabs, split view, utility bar, `slds-path`. |
| `references/modals-and-graphs.md` | Recipe: SLDS modals + ARC-style relationship graphs (root → grouped cards + Show-Fields toggle + zoom). |
| `references/agentforce.md` | Recipe: the Agentforce panel + the Generate → stream → Edit → Save-to-record agent flow. |
| `references/talk-track-template.md` | Do/Say click-path talk-track template to hand a presenter after building. |

## Rules (non-negotiable)

1. Real SLDS 2 blueprints — not a hand-rolled lookalike.
2. Logo and icons are **asset-based, never freehand** (see `references/icons.md`).
3. Single file, fully offline (everything inline; no CDN links, no external images).
4. Custom CSS uses a `my-*` prefix + `var(--slds-g-*, fallback)` hooks; never override `.slds-*`.
5. Global header exact spec: 50px, centered ~600px search, 32×32 icon buttons /
   20×20 glyphs / 4px gaps, 24px avatar 16px from edge. Defaults to a **white**
   background with gray glyphs; flip to the classic **navy** `#16325C` (white glyphs)
   via the comment in the template's header CSS.
6. Illustrative only — include the footer disclaimer; keep fixture data internally consistent
   (ages match activities, totals add up; identity resolution = same person across systems,
   siblings/parents are relationships — not identity sources).
7. Copy case: section/card/tab titles and button labels use **Title Case** (minor words like
   a/the/of/on/by/to lowercase unless first); descriptive subtext and body copy use sentence case.
8. **Never say "Copilot"** (a Microsoft term) — use "Agentforce" / "agent" for AI features.
9. **Present as "now"** — avoid "Future" / "future state" labels unless explicitly asked.
10. **Prefer standard Lightning patterns** (list views, record home, related lists, Chatter,
    Activity Timeline; console or standard nav) over custom components — content is spec-driven.

Requires network access **once** (to download the SLDS CSS during `bundle.sh`); the
resulting file is fully offline. For blueprint/hook/icon lookups, use the companion skill
`design-systems-slds-apply`. This produces a **prototype**, not deployable Salesforce
metadata.

## License & attribution

- This skill's code and docs are released under the **MIT License** (see `LICENSE`).
- Prototypes bundle the **Salesforce Lightning Design System** (`@salesforce-ux/design-system-2`
  / `@salesforce-ux/design-system`), and the recipes include small SLDS icon/logo path
  snippets. Those assets are © Salesforce and licensed under **Apache-2.0**; SLDS and
  Salesforce names/logos are trademarks of Salesforce, Inc. This project is not affiliated
  with or endorsed by Salesforce. Prototypes are illustrative mockups, not Salesforce products.
