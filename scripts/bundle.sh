#!/usr/bin/env bash
# Inline the genuine SLDS 2 "Cosmos" stylesheet into a prototype HTML file so it is
# fully self-contained and works offline.
#
# Usage:  bundle.sh <input.html> <output.html>
#         (in-place is fine: bundle.sh index.html index.html)
#
# The input must contain a marker line inside a <style> block:
#     /*__SLDS2_COSMOS_CSS__*/
# That marker is replaced with the downloaded stylesheet.
set -euo pipefail

IN="${1:?usage: bundle.sh <input.html> <output.html>}"
OUT="${2:?usage: bundle.sh <input.html> <output.html>}"
CSS_URL="https://cdn.jsdelivr.net/npm/@salesforce-ux/design-system-2/dist/css/bundled/slds2.cosmos.min.css"

if ! grep -q '__SLDS2_COSMOS_CSS__' "$IN"; then
  echo "ERROR: marker /*__SLDS2_COSMOS_CSS__*/ not found in $IN." >&2
  echo "       (If the file is already bundled, you don't need to run this.)" >&2
  exit 1
fi

TMP_CSS="$(mktemp)"; TMP_OUT="$(mktemp)"
trap 'rm -f "$TMP_CSS" "$TMP_OUT"' EXIT

echo "Downloading SLDS 2 Cosmos CSS..."
curl -fsSL "$CSS_URL" -o "$TMP_CSS"
echo "  $(wc -c < "$TMP_CSS") bytes"

# Replace the marker line with the CSS contents (awk avoids sed escaping issues).
awk -v cssfile="$TMP_CSS" '
  index($0, "__SLDS2_COSMOS_CSS__") {
    while ((getline line < cssfile) > 0) print line
    next
  }
  { print }
' "$IN" > "$TMP_OUT"

cp "$TMP_OUT" "$OUT"
echo "Wrote $OUT ($(wc -c < "$OUT") bytes) — self-contained, offline."
