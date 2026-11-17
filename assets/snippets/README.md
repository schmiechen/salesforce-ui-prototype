# Snippets

Tested, host-agnostic building blocks. Each is plain JS or CSS: paste the `.js` into the prototype's script
block (after the shell template's helpers) and the `.css` into its style block, then follow the matching recipe.
`examples/guided-walkthrough/` uses all three, and its `smoke-test.js` exercises every one.

| Snippet | What it is | Needs from the shell | Recipe |
|---|---|---|---|
| `autoplay.js` + `autoplay.css` | Guided walkthrough engine: caption bar, simulated mouse, step back/forward by reset + replay | a `reset()` function; optional `REPLAYING` flag | `references/autoplay-walkthrough.md` |
| `chat-popup.js` + `chat-popup.css` | Agentforce chat docked above the utility bar: pinned suggestions, typewriter answers, citations | `UTILITIES`, `toggleUtil`/`closeUtil` hooks, `esc`, `svg`, `animOK` | `references/agentforce-chat-popup.md` |
| `field-mapper.js` + `field-mapper.css` | Data 360 style field-mapping canvas with wires, search, click-to-map | `esc`, `animOK` | `references/data-360-field-mapper.md` |

Shared motion primitives (`animOK()`, `.my-cursor`, `.my-dots`, `.my-build`) live in `assets/shell-template.html`.
