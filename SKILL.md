---
name: salesforce-ui-prototype
description: "Rapidly prototype realistic Salesforce Lightning (SLDS 2) interfaces as a single, self-contained, offline HTML file — for sales demos, mockups, and clickable prototypes with no Salesforce org and no build step. Use when asked to mock up / prototype / fake / stand up a Salesforce or Lightning UI, console, app, record page, dashboard, or 'SLDS screen', or to build a click-through Salesforce demo. Triggers: 'prototype a Salesforce screen', 'mock up a Lightning app', 'fake Salesforce UI', 'Lightning console demo', 'clickable Salesforce prototype', 'make it look like Salesforce'. Do NOT use for production LWC/Aura components deployed to an org (use experience-lwc-generate / platform-* skills) or for real Data Cloud/Agentforce work."
metadata:
  version: "1.0"
---

# Salesforce UI Prototype (SLDS 2, single-file, offline)

Produce **one self-contained `.html` file** that looks and behaves like a real
Salesforce **Lightning Experience** app — openable with a double-click, no server, no
build, works with **no internet** — for demos, mockups, and click-through prototypes.

This skill captures a proven method. It stands on the companion skill
**`design-systems-slds-apply`** (authoritative SLDS 2 blueprints, styling hooks, icons,
and verification scripts). Invoke that skill whenever you need exact blueprint markup or
to confirm a class/hook/icon exists — do not guess SLDS class names.

## Golden rules (do not skip)

1. **Use real SLDS 2, not a lookalike.** Bundle the genuine **SLDS 2 "Cosmos"**
   stylesheet inline and build UI from real `slds-*` blueprints (global header, cards,
   data tables, page headers, badges, buttons, vertical nav). Hand-rolled CSS that only
   *resembles* Lightning is not acceptable.
2. **Assets are asset-based, NEVER freehand.**
   - **Logo:** never draw/approximate the Salesforce logo from memory. Use a real asset —
     the official cloud ships in the bundled package
     (`@salesforce-ux/design-system/assets/images/logo-noname.svg`) — or a logo file the
     user supplies. See `references/icons.md`.
   - **Icons:** never draw utility icons from memory. Use genuine SLDS utility SVGs
     (`.../assets/icons/utility/<name>.svg`). A ready set is inlined in the template and
     catalogued in `references/icons.md`. If you need one that isn't there, fetch it from
     that path; if you can't fetch it, ask the user for the exact icon name(s).
3. **Single file, offline.** Everything inline (`<style>` + `<script>`). No CDN `<link>`,
   no Google Fonts link (SLDS supplies the font stack), no external image assets.
4. **Namespacing.** Custom classes use a `my-*` prefix; never override `.slds-*`. For
   custom values use `var(--slds-g-*, fallback)` styling hooks with a literal fallback so
   it renders even if a token is absent (SLDS 2 uses numbered `--slds-g-spacing-1..4` =
   4/8/12/16px; named `x-small` spacing tokens are NOT in the Cosmos bundle).
5. **Global header — exact spec** (Lightning): height **50px**; centered search
   (~**600px**, 4px radius); utility buttons **32×32** with **20×20** glyphs and **4px**
   gaps; avatar **24px**, 16px from the edge. Background defaults to **white** (modern
   console look) with **gray `#5c5c5c`** glyphs; for the classic **navy** header set it
   to `#16325C`/`#032D60` and switch glyphs to `#fff` (see the comment in the template's
   header CSS). Keep the glyph color consistent with the background either way.
6. **Illustrative, not real.** Add a footer/disclaimer ("Illustrative demo — not a live
   system; data is fictitious"). Keep data internally consistent (see checklist).
7. **Copy case.** Section/card/tab **titles** and **button** labels use **Title Case**
   (e.g., "Open Cases by Worker", "Resolve Identity", "Risk Concentration Heatmap") —
   minor words (a, an, the, and, or, of, on, by, to, in) stay lowercase unless they are
   the first word. Descriptive subtext, table cells, and body copy use sentence case.
8. **Never say "Copilot."** It's a Microsoft term. Name AI features **"Agentforce"** (the
   product) or **"agent"** / **"the agent"** (the thing acting). Applies to tab names, nav
   items, headings, buttons, and body copy.
9. **Present as "now," not "future."** Avoid "Future" / "future state" badges and labels
   unless the user explicitly asks — the demo represents current capability.

## The app-shell pattern

Every prototype uses the same shell (see `assets/shell-template.html`):

```
┌─ Global header (navy #16325C): cloud logo · centered search · utility icons · avatar ─┐
├─ Nav row (white): app-launcher waffle · App Name · [use-case TABS] · org context ─────┤
├──────────┬───────────────────────────────────────────────┬──────────────────────────┤
│ left rail│                main workspace                  │  right context / Agentforce│
│ (slds-nav│  (slds-page-header + slds-card + slds-table…)   │  panel                     │
│ -vertical)│                                                │                            │
├──────────┴───────────────────────────────────────────────┴──────────────────────────┤
└─ footer disclaimer ───────────────────────────────────────────────────────────────────┘
```

A tiny **view engine** in vanilla JS drives it: `TABS` config → `renderTabs()` renders the
nav tabs; clicking a tab calls `switchTab(id)` which calls the matching `view*()` function;
each view calls `setRail(html)`, `setMain(html)`, `setRight(html)` to swap the three
regions. Add a tab = add a `TABS` entry + a `view*()` function. That's the whole model.

## Workflow

1. **Scaffold.** Copy `assets/shell-template.html` into the target project as
   `index.html` (or the user's chosen name). It already contains the genuine header/nav,
   the view engine, genuine inlined icons, and two example views.
2. **Configure** the top of the `<script>`: `APP_NAME`, `ORG_CTX`, `AVATAR`, and the
   `TABS` array.
3. **Build the views.** For each tab write a `view*()` function. Use **real blueprints** —
   consult `design-systems-slds-apply` (`scripts/search-blueprints.cjs`, the
   `assets/blueprints/*.yaml`) for exact markup of cards, page-headers, data-tables,
   badges, buttons, timelines, etc. Reuse the template helpers (`card()`, `objIcon()`,
   `badge()`, `navItem()`, `navSection()`, `rail()`, `afPanel()`, bar chart).
4. **Bundle the SLDS CSS** to make it offline & self-contained:
   ```
   bash <skill>/scripts/bundle.sh index.html index.html
   ```
   This downloads the SLDS 2 Cosmos stylesheet and inlines it at the
   `/*__SLDS2_COSMOS_CSS__*/` marker. (Run it whenever you (re)create the file from the
   template; editing an already-bundled file is fine and doesn't require re-running.)
5. **Verify** (see below), then open the file in a browser to eyeball it.
6. **Offer a talk track.** After the prototype works, offer the presenter a Do/Say
   click-path script using `references/talk-track-template.md`.

## Verification (run before declaring done)

- **SLDS classes exist:** `bash <skill>/scripts/verify.sh index.html` — flags any
  `slds-*` class used in your markup/JS that isn't defined in the bundled stylesheet, and
  checks `<style>`/`<script>` tag balance.
- **No freehand assets:** confirm the logo and every icon are genuine SLDS SVGs
  (viewBoxes `0 0 4000 2800` for the cloud, `0 0 520 520` / `0 0 52 52` for icons) — no
  invented `0 0 24 24` stroke icons.
- **Offline:** `grep -n 'https\?://' index.html` should return **nothing** except
  comments — no live `<link>`/`<img>`/`<script src>` to the network.
- **Data logic (sanity-check the fixtures):** ages match activities (a 4-year-old has no
  K-12 school record); totals/percentages actually add up (e.g. worker loads sum to the
  "total open"); dates are plausible and consistent; names/IDs are stable across screens.
  Modeling note: **identity resolution matches the *same person* across systems** — a
  sibling or parent is a *relationship* (household), NOT an identity source.
- **No banned copy:** no "Copilot" and no "Future"/"future-state" in user-facing text
  (see rules 8–9); `verify.sh` flags these.
- **Optional SLDS lint:** `npx @salesforce-ux/slds-linter@latest lint index.html`.

## Files in this skill

| Path | What it is |
|------|-----------|
| `assets/shell-template.html` | Ready-to-copy starter: genuine header/nav, view engine, inlined icons, 2 example views. Contains the `/*__SLDS2_COSMOS_CSS__*/` marker for bundling. |
| `scripts/bundle.sh` | Downloads the SLDS 2 Cosmos CSS and inlines it at the marker → offline single file. |
| `scripts/verify.sh` | Checks used `slds-*` classes exist in the bundle + tag balance + offline. |
| `references/icons.md` | Genuine SLDS logo + utility icon catalog (inline SVGs) and how to fetch more. |
| `references/activity-timeline.md` | Recipe for a Salesforce-style Activity Timeline (tasks/activities): blueprint classes, type-colored connector, the no-double-line gotcha, expand + complete interactions. |
| `references/modals-and-graphs.md` | Recipe for SLDS modals (host + open/close/backdrop) and relationship graphs (ARC-style root → grouped cards + connector + Show-Fields toggle + zoom). |
| `references/agentforce.md` | Recipe for Agentforce UI: the AF panel (orb + label + bulleted card) and the Generate → stream → Edit → Save-to-record agent flow. |
| `references/talk-track-template.md` | Do/Say click-path talk-track template to hand the presenter after building. |

## Notes / gotchas

- The SLDS 2 Cosmos bundle (~1 MB) defines its global hooks via `light-dark()`; your
  `var(--slds-g-*, fallback)` calls resolve to real tokens, fallbacks are just safety.
- **Avoid blue-on-blue.** `--slds-g-color-accent-container-1` is a *saturated* brand blue
  in Cosmos (not a light tint), so dark/blue text on it is unreadable. For a light tint
  background use a literal light value (e.g. `#eaf5fe`) or pair a `-container-*` bg only
  with its matching on-color. When in doubt, check contrast on the resolved token, not on
  your fallback.
- The SLDS **skill** bundles only metadata (no SVG files); genuine icon/logo SVGs come
  from the `@salesforce-ux/design-system` npm package (mirrored on jsDelivr).
- Keep the header navy per the exact spec unless the user asks for the white
  modern-console header; if white, recolor utility glyphs from `#fff` to `#5c5c5c`.
- This produces a **prototype**, not deployable Salesforce metadata. For real LWC/Aura,
  Experience Cloud, or platform work, use the corresponding `platform-*` /
  `experience-*` skills instead.
