#!/usr/bin/env bash
# Verify a bundled Salesforce UI prototype:
#  1. every slds-* class used in markup/JS exists in the bundled stylesheet
#  2. <style>/<script> tags are balanced
#  3. no live network references (offline check)
#
# Usage: verify.sh <file.html>
set -euo pipefail
F="${1:?usage: verify.sh <file.html>}"

python3 - "$F" <<'PY'
import re, sys
f = sys.argv[1]
html = open(f, encoding="utf-8").read()

# Split the bundled SLDS CSS (inside <style>) from everything else so we only test
# classes that appear in MARKUP/JS against classes DEFINED in the stylesheet.
styles = re.findall(r'<style[^>]*>(.*?)</style>', html, re.S)
css = "\n".join(styles)
non_css = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.S)

defined = set(re.findall(r'\.(slds-[A-Za-z0-9_]+)', css))
used = set(re.findall(r'slds-[A-Za-z0-9_]+', non_css))
# false-positive fragments from hook names like --slds-g-*
used = {c for c in used if not c.startswith("slds-g")}
missing = sorted(used - defined - {"slds-scope"})  # slds-scope is a harmless wrapper

print(f"slds- classes used in markup/JS: {len(used)} | defined in bundle: {len(defined)}")
if missing:
    print("  MISSING (%d) — not in the bundled stylesheet:" % len(missing))
    for m in missing:
        print("    -", m)
else:
    print("  OK: every slds-* class used is defined in the bundle.")

# tag balance
for tag in ("style", "script"):
    o = len(re.findall(rf"<{tag}[ >]", html)); c = len(re.findall(rf"</{tag}>", html))
    print(f"<{tag}> balance: {o} open / {c} close", "OK" if o == c else "MISMATCH")

# offline check (ignore comment lines)
net = [ln for ln in non_css.splitlines()
       if re.search(r'(href|src)\s*=\s*["\']https?://', ln)]
print(f"live network refs in markup: {len(net)}", "OK (offline)" if not net else "-> "+net[0][:100])

# genuine assets sanity
print("Salesforce cloud logo (viewBox 4000 2800):", "present" if "4000 2800" in html else "MISSING")
freehand = len(re.findall(r'viewBox="0 0 24 24"', html))
print(f"freehand-style 24x24 icons: {freehand}", "(should be 0)" if freehand else "OK")

# banned copy (SKILL rules 8-9). Lookbehind skips internal identifiers like viewCopilot.
copilot = len(re.findall(r'(?<![A-Za-z])Copilot', non_css))
future  = len(re.findall(r'[Ff]uture[ -]state', non_css)) + len(re.findall(r'>\s*FUTURE\s*<', non_css))
print(f"banned 'Copilot' label: {copilot}", "OK" if copilot==0 else "-> use 'Agentforce' / 'agent'")
print(f"'future state' / FUTURE badge: {future}", "OK" if future==0 else "-> present as 'now' (rule 9)")

# blue-on-blue trap (saturated token used as a tint background)
bob = len(re.findall(r'background[^;]*accent-container-1', non_css) + re.findall(r'\.my-[^{]*\{[^}]*background[^;]*accent-container-1', css))
print(f"accent-container-1 as background (blue-on-blue risk): {bob}", "OK" if bob==0 else "-> use a light tint like #eaf5fe")

print("Reminder: eyeball fixture data — ages match activities, totals/percentages add up, "
      "dates plausible; identity resolution = same person across systems, siblings/parents are relationships.")
PY
