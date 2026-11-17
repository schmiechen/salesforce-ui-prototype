# Recipe: Testing and iterating on a prototype

Prototypes are single HTML files edited many times. These habits keep them from breaking or getting lost.

## 1) Keep a source and a bundle
`bundle.sh` writes the ~1 MB bundled file from a small source file that still contains the
`/*__SLDS2_COSMOS_CSS__*/` marker. Edit the **source**, rebundle to a temp file, test, then replace.
Never treat a browser "Save page as" copy as the source: it drops `<!DOCTYPE html>`, reformats markup,
and inlines the stylesheet. If the bundle is all you have, the stylesheet block is exactly the CDN file,
so you can recover a source by replacing that block with the marker line.
Prove they agree: `bundle.sh src.html /tmp/out.html && cmp /tmp/out.html bundle.html`.

## 2) Back up before each batch of edits
Copy both files to `name.vN.html` / `name.vN.src.html` before editing, and note the version in your log.
It costs nothing and makes any experiment reversible.

## 3) Run the checks
- `scripts/verify.sh file.html`: SLDS classes exist, tags balance, offline, genuine icons, DOCTYPE present,
  no relative file references, banned copy.
- `scripts/smoke.sh file.html [test.js]`: loads the page in headless Chrome on a temp copy, fails on uncaught
  errors, and runs your test.

## 4) Writing a smoke test
`test.js` runs in the page after load, inside an async function. Report with `smokeOut("PASS: ...")` /
`smokeOut("FAIL: ...")` and call `smokeDone()` at the end.
```js
for (let i = 0; i < steps; i++) {                 // replay every auto-play step instantly
  await walk.go(i, false);
  smokeOut((expect[i]() ? "PASS" : "FAIL") + ": step " + (i + 1));
}
smokeOut((walk.missed.length ? "FAIL" : "PASS") + ": no missing targets");
smokeDone();
```
- Timers run in Chrome's **virtual time**: `await sleep(4000)` costs milliseconds, so a full tour fits in one run
  (`--budget 60000`). Assert animations against a timeline (dots at 0 s, partial text at 1 s, finished at 5 s).
- CSS transitions and keyframe animations do **not** advance in virtual time. That is fine for DOM assertions;
  `--screenshot` handles it by capturing the settled end state.
- Check layouts at 1280, 1440 and 1600 px (`--size 1280x800`): long tab lists and right rails break first.

## 5) Common failures this catches
A renamed button that silently breaks an auto-play step · state not cleared on replay · a fixed-width box
that clips at laptop widths · a missing DOCTYPE (quirks mode) · a hand-typed relative image path.
