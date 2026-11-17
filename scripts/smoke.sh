#!/usr/bin/env bash
# Headless smoke test for a prototype (bundled or not). Optional: skips cleanly when no Chrome is installed.
#
# Usage: smoke.sh <file.html> [test.js] [--budget MS] [--screenshot out.png] [--size WxH]
#
#  - Never modifies <file.html>. A temp copy gets an error collector (plus your test.js) injected before </body>.
#  - test.js runs ~800 ms after window load, inside an async function (so `await` works).
#    Report with   smokeOut("any line")   — a line containing FAIL fails the run.
#    Call          smokeDone()            when finished. If you never call it, the run ends at the budget.
#  - Uncaught errors and unhandled promise rejections are collected and fail the run.
#  - --screenshot saves the settled end state (CSS transitions and animations are disabled for that pass, because Chrome's
#    virtual time does not advance them).
#  - --budget is Chrome's virtual-time budget in ms (default 30000). Timers run in virtual time, so a
#    long walkthrough finishes in seconds of wall-clock time.
#  - Exit codes: 0 ok (or skipped: no Chrome) | 1 errors or FAIL | 2 usage.
set -euo pipefail

FILE=""; TESTJS=""; BUDGET=30000; SHOT=""; SIZE="1500x1000"
while [ $# -gt 0 ]; do
  case "$1" in
    --budget) BUDGET="${2:?--budget needs a value}"; shift 2 ;;
    --screenshot) SHOT="${2:?--screenshot needs a path}"; shift 2 ;;
    --size) SIZE="${2:?--size needs WxH}"; shift 2 ;;
    -h|--help) sed -n '2,15p' "$0"; exit 0 ;;
    *) if [ -z "$FILE" ]; then FILE="$1"; elif [ -z "$TESTJS" ]; then TESTJS="$1"; else echo "unexpected argument: $1" >&2; exit 2; fi; shift ;;
  esac
done
[ -n "$FILE" ] || { echo "usage: smoke.sh <file.html> [test.js] [--budget MS] [--screenshot out.png] [--size WxH]" >&2; exit 2; }
[ -f "$FILE" ] || { echo "not found: $FILE" >&2; exit 2; }
if [ -n "$TESTJS" ] && [ ! -f "$TESTJS" ]; then echo "not found: $TESTJS" >&2; exit 2; fi

CHROME=""
for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
         "/Applications/Chromium.app/Contents/MacOS/Chromium"; do
  [ -x "$c" ] && { CHROME="$c"; break; }
done
if [ -z "$CHROME" ]; then
  for c in google-chrome google-chrome-stable chromium chromium-browser; do
    if command -v "$c" >/dev/null 2>&1; then CHROME="$(command -v "$c")"; break; fi
  done
fi
if [ -z "$CHROME" ]; then echo "smoke: skipped (no Chrome/Chromium found)"; exit 0; fi

TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
PAGE="$TMP/page.html"

# Build the instrumented temp copy. -I: isolated mode, so nothing in the current directory is imported.
python3 -I - "$FILE" "$TESTJS" "$PAGE" "$BUDGET" <<'PY'
import sys, re
src, testjs, out, budget = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4])
html = open(src, encoding="utf-8").read()
test = open(testjs, encoding="utf-8").read() if testjs else ""
early = """<script>
(function(){
  var out=[], errs=[];
  window.__smoke={ out:out, errs:errs };
  window.addEventListener("error",function(e){ errs.push(e.message||String(e)); });
  window.addEventListener("unhandledrejection",function(e){ errs.push("unhandledrejection: "+((e.reason&&e.reason.message)||e.reason)); });
  function render(){
    var o=document.getElementById("SMOKE_OUT"); if(o) o.remove();
    var d=document.createElement("pre"); d.id="SMOKE_OUT";
    d.textContent=out.join("\\n")+(errs.length?"\\nERRORS: "+errs.join(" | "):"");
    document.documentElement.appendChild(d);
  }
  window.smokeOut=function(s){ out.push(String(s)); };
  window.smokeDone=render;
  window.__smoke.render=render;
})();
</script>"""
late = """<script>
(function(){
  var BUDGET=%d, HASTEST=%s;
  window.addEventListener("load",function(){
    setTimeout(function(){
      (async function(){ try{
/*__TEST__*/
      }catch(e){ window.__smoke.errs.push("test threw: "+e.message); } })().then(function(){ if(!HASTEST) window.__smoke.render(); });
    },800);
    setTimeout(function(){ if(!document.getElementById("SMOKE_OUT")) window.__smoke.render(); }, Math.max(BUDGET-300,1000));
  });
})();
</script>""" % (budget, "true" if test.strip() else "false")
late = late.replace("/*__TEST__*/", test)
m = re.search(r"<head[^>]*>", html, re.I)
html = (html[:m.end()] + early + html[m.end():]) if m else (early + html)
i = html.rfind("</body>")
html = (html[:i] + late + html[i:]) if i != -1 else (html + late)
open(out, "w", encoding="utf-8").write(html)
PY

W="${SIZE%x*}"; H="${SIZE#*x}"
DOM="$("$CHROME" --headless=new --disable-gpu --no-first-run --window-size="$W,$H" \
        --virtual-time-budget="$BUDGET" --dump-dom "file://$PAGE" 2>/dev/null || true)"

RESULT="$(printf '%s' "$DOM" | python3 -I -c '
import sys, re, html
s = sys.stdin.read()
m = re.search(r"<pre id=\"SMOKE_OUT\">(.*?)</pre>", s, re.S)
print(html.unescape(m.group(1)) if m else "ERRORS: no result captured (page did not load, or the test never finished)")
')"
printf '%s\n' "$RESULT"

if [ -n "$SHOT" ]; then
  # Chrome's virtual time does not advance CSS transitions, so staged builds and fade-ins would be captured at their first
  # frame. The screenshot copy therefore disables transitions and animations: you see the settled end state.
  SHOTPAGE="$TMP/shot.html"
  python3 -I - "$PAGE" "$SHOTPAGE" <<'PY'
import sys
h = open(sys.argv[1], encoding="utf-8").read()
css = "<style>*,*::before,*::after{transition:none!important;animation:none!important}</style>"
i = h.rfind("</head>")
open(sys.argv[2], "w", encoding="utf-8").write((h[:i] + css + h[i:]) if i != -1 else (css + h))
PY
  "$CHROME" --headless=new --disable-gpu --no-first-run --window-size="$W,$H" \
    --virtual-time-budget="$BUDGET" --screenshot="$SHOT" "file://$SHOTPAGE" >/dev/null 2>&1 || true
  [ -f "$SHOT" ] && echo "screenshot: $SHOT"
fi

if printf '%s\n' "$RESULT" | grep -q -E 'FAIL|^ERRORS:'; then echo "smoke: FAILED"; exit 1; fi
echo "smoke: ok"
