# Genuine SLDS assets (logo + icons)

**Rule: never freehand a Salesforce logo or icon.** Use the genuine assets below (already
inlined in `assets/shell-template.html`) or fetch more from the SLDS package.

## Fetching more assets

The SLDS **skill** ships only metadata — no SVG files. Genuine SVGs come from the
`@salesforce-ux/design-system` npm package, mirrored on jsDelivr:

- **Logo (Salesforce cloud):** `https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system/assets/images/logo-noname.svg`
- **Utility icon:** `https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system/assets/icons/utility/<name>.svg`
- Find the right `<name>` with the companion skill: `node <slds-skill>/scripts/search-icons.cjs --query "..."`.

To inline: open the SVG, set `fill="currentColor"` (so CSS `color` controls it), drop the
fixed `width/height`, keep the `viewBox`, size via CSS. Utility icons use `viewBox="0 0 520 520"`
(a few use `0 0 52 52`). If you truly cannot fetch an icon, ask the user for the exact
icon name(s) rather than drawing one.

## Logo — inline markup

```html
<!-- Salesforce cloud (SLDS package assets/images/logo-noname.svg) -->
<svg viewBox="0 0 4000 2800" preserveAspectRatio="xMinYMid" role="img" aria-label="Salesforce"><path fill="#00a1e0" d="m1666 307a700 700 0 011123 148 866 866 0 011211 795c1 480-385 870-861 870a857 857 0 01-170-18 630 630 0 01-825 260 719 719 0 01-1337-33 671 671 0 01-805-659c0-250 134-468 333-584a776 776 0 011330-780"/></svg>
```
If the user supplies their own logo file, use it directly (inline `<svg>` or `<img>`),
sized ~22–28px tall in the header.

## Header utility icons (inline; `fill="currentColor"`, `viewBox="0 0 520 520"` unless noted)

| Role | SLDS name | path `d` |
|------|-----------|----------|
| Search | `utility:search` | `M496 453 362 320a189 189 0 1 0-340-92 190 190 0 0 0 298 135l133 133a14 14 0 0 0 21 0l21-21a17 17 0 0 0 1-22M210 338a129 129 0 1 1 130-130 129 129 0 0 1-130 130` |
| Agentforce | `utility:einstein` | *(2 paths — see template `svg` in the header)* |
| Favorites | `utility:favorite` | `m274 31 46 150c2 6 8 9 14 9h150c15 0 21 20 9 29l-122 90c-5 4-7 11-5 17l58 154c4 14-11 26-23 17l-131-98c-5-4-12-4-18 0l-132 98c-12 9-28-3-23-17l56-154c2-6 0-13-5-17L26 219c-12-9-5-29 9-29h150c7 0 12-2 14-9l47-151c4-14 24-13 28 1` |
| Chevron | `utility:chevrondown` | `M476 178 271 385c-6 6-16 6-22 0L44 178c-6-6-6-16 0-22l22-22c6-6 16-6 22 0l161 163c6 6 16 6 22 0l161-162c6-6 16-6 22 0l22 22c5 6 5 15 0 21` |
| New / Global actions | `utility:add` | `M300 290h165c8 0 15-7 15-15v-30c0-8-7-15-15-15H300c-6 0-10-4-10-10V55c0-8-7-15-15-15h-30c-8 0-15 7-15 15v165c0 6-4 10-10 10H55c-8 0-15 7-15 15v30c0 8 7 15 15 15h165c6 0 10 4 10 10v165c0 8 7 15 15 15h30c8 0 15-7 15-15V300c0-6 4-10 10-10` |
| Help | `utility:help` | `M284 380h-50c-8 0-14-6-14-14v-15c0-42 27-80 67-94a80 80 0 0 0-24-155c-22-1-43 7-59 22a70.4 70.4 0 0 0-23 44c-1 6-7 11-15 11h-50c-9 0-16-7-15-16 4-38 21-72 48-99 32-30 73-46 117-45 83 3 151 71 154 154 3 70-40 133-105 157-9 4-15 11-15 20v15c0 9-8 15-16 15m16 105c0 8-7 15-15 15h-50c-8 0-15-7-15-15v-50c0-8 7-15 15-15h50c8 0 15 7 15 15z` |
| Setup | `utility:setup` | *(gear — see template)* |
| Notifications | `utility:notification` | `M460 330h-5a35 35 0 0 1-35-35V180A160 160 0 0 0 252 20c-86 4-152 78-152 165v111c0 19-16 34-35 34h-5c-22 0-40 19-40 41v15c0 7 7 14 15 14h450c8 0 15-7 15-15v-15a40 40 0 0 0-40-40M309 440h-98a10 10 0 0 0-10 12c5 28 30 48 59 48s54-21 59-48a10 10 0 0 0-10-12` |
| App launcher | `utility:apps` | *(`viewBox="0 0 52 52"` — 3×3 rounded squares, see template)* |

## Object / content icons (for cards, rails, tables)

Rendered white on a colored rounded square (the Lightning "standard icon" look) via the
template's `objIcon(name)` helper. The template seeds a genuine set: `case`, `people`,
`metrics`, `database`, `moneybag`, `shield`, `alert`, `home`, `dayview` (calendar),
`email`, `list`. Add more by fetching `utility/<name>.svg` and appending to the `ICONS`
map with a color. See the `ICONS` object in `assets/shell-template.html` for exact paths.
