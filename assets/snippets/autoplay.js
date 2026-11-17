/* autoplay.js: guided walkthrough engine for a single-file prototype.
   Paste into the prototype's script block (after the shell helpers) and put autoplay.css in the style block.
   Host contract: a `reset()` that returns the whole app to its first-screen state and re-renders.

   const walk = createAutoPlay({
     container: "#work",                 // scrollable region (scroll actions, scrollIntoView)
     reset: () => { resetState(); renderAll(); },
     steps: [
       // [caption, actions[], dwellMs]  (dwellMs = pause after the actions before auto-advancing)
       ["Open the overview.",         [ {click: byText(".my-navitem", "Overview", true)} ], 2500],
       ["Ask the agent a question.",  [ {click: bySel('.my-utilbtn[data-u="agent"]')},
                                        {type: bySel("#chatInput"), text: "Summarize this case"},
                                        {wait: 4000} ], 1500],
     ],
   });
   walk.bindKeys();   // ee = start/stop · ← → = step · Space = auto/manual · aa = mouse on/off · Esc = exit

   Actions:  {click:fn} {move:fn} {type:fn,text} {wait:ms} {scroll:y|-1} {run:fn,ms}
   `fn` resolvers are lazy: they run when the action runs and may return null (the action is then
   skipped and recorded in walk.missed, so a smoke test can assert that nothing was missed).
   Modes: "anim" (mouse + ripples + typing), "plain" (no mouse), "inst" (no waits; used to replay earlier steps).
   Stepping back = reset() + instant replay of steps 0..i-1 + live run of step i, so state is always deterministic. */

const byText = (sel, txt, exact) => () => [...document.querySelectorAll(sel)]
  .find(e => exact ? e.textContent.trim() === txt : e.textContent.includes(txt)) || null;
const bySel = sel => () => document.querySelector(sel);

function createAutoPlay(cfg) {
  const st = { mode: "off", i: -1, mouse: true, token: 0, timer: 0 };   // mode: off | auto | manual
  const missed = [];
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const root = () => document.querySelector(cfg.container || "body");
  const setReplay = v => { if (typeof REPLAYING !== "undefined") REPLAYING = v; };   // template motion gate

  /* ---- chrome: cursor, ripple, caption bar ---- */
  function cursor() {
    let c = document.getElementById("apcur");
    if (!c) {
      c = document.createElement("div"); c.id = "apcur"; c.className = "my-apcur";
      // decorative simulated-mouse pointer (not a UI icon, so it is not an SLDS glyph)
      c.innerHTML = '<svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true"><path transform="scale(.9167)" d="M3 2l7 19 3-8 8-3z" fill="#111" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>';
      c.style.left = innerWidth * .55 + "px"; c.style.top = innerHeight * .65 + "px";
      document.body.appendChild(c);
    }
    return c;
  }
  function ripple(x, y) {
    const r = document.createElement("div"); r.className = "my-ripple"; r.style.left = x + "px"; r.style.top = y + "px";
    document.body.appendChild(r); setTimeout(() => r.remove(), 700);
  }
  function bar(msg) {
    let b = document.getElementById("apbar");
    if (!b) { b = document.createElement("div"); b.id = "apbar"; b.className = "my-apbar"; document.body.appendChild(b); }
    if (msg === false) { b.style.display = "none"; return; }
    const step = cfg.steps[st.i];
    const hint = (st.mode === "auto" ? "Auto-play · Space holds" : "Manual · Space auto-plays") + " · ← → step · aa mouse " + (st.mouse ? "on" : "off") + " · Esc exits";
    b.innerHTML = `<span class="n">Step ${st.i + 1} of ${cfg.steps.length}</span><span class="t">${msg || (step && step[0]) || ""}</span><span class="h">${hint}</span>`;
    b.style.display = "flex";
  }
  async function moveTo(el) {
    if (root() && root().contains(el)) el.scrollIntoView({ block: "center" });
    await sleep(120);
    const r = el.getBoundingClientRect(), x = r.left + Math.min(r.width / 2, 60), y = r.top + r.height / 2, c = cursor();
    c.style.display = "block"; c.style.left = x - 3 + "px"; c.style.top = y - 2 + "px";
    await sleep(900);
    return [x, y];
  }
  const fire = (el, type, key) => el.dispatchEvent(new KeyboardEvent(type, { key, bubbles: true }));

  /* ---- run one step's actions in a mode ---- */
  async function run(i, mode, tok) {
    setReplay(mode === "inst");
    try {
      for (const a of cfg.steps[i][1]) {
        if (tok !== st.token) return;
        if (a.wait) { if (mode !== "inst") await sleep(a.wait); continue; }
        if (a.scroll !== undefined) {
          const r = root(); if (!r) continue;
          const y = a.scroll === -1 ? r.scrollHeight : a.scroll;
          if (mode === "inst") r.scrollTop = y; else { r.scrollTo({ top: y, behavior: "smooth" }); await sleep(700); }
          continue;
        }
        if (a.run) { a.run(); if (mode !== "inst") await sleep(a.ms || 0); continue; }
        const el = (a.click || a.move || a.type)();
        if (!el) { missed.push({ step: i + 1, action: Object.keys(a).join(",") }); continue; }
        if (mode === "inst") {
          if (a.move) continue;
          if (a.type) { el.value = a.text; fire(el, "keydown", "Enter"); } else el.click();
        } else if (mode === "plain") {
          if (a.move) continue; await sleep(450);
          if (a.type) { el.value = a.text; fire(el, "keydown", "Enter"); } else el.click();
          await sleep(300);
        } else {
          const [x, y] = await moveTo(el); if (tok !== st.token) return;
          if (a.move) { await sleep(500); continue; }
          if (a.type) {
            el.focus(); await sleep(250);
            for (const ch of a.text) { if (tok !== st.token) return; el.value += ch; await sleep(45); }
            await sleep(350); fire(el, "keydown", "Enter"); await sleep(500);
          } else { await sleep(250); ripple(x, y); el.click(); await sleep(550); }
        }
      }
    } finally { setReplay(false); }
  }

  /* ---- navigation: always reset, replay earlier steps instantly, then run step i ---- */
  async function go(i, live) {
    const tok = ++st.token; clearTimeout(st.timer);
    st.i = i; bar(); cfg.reset();
    for (let k = 0; k < i; k++) { await run(k, "inst", tok); if (tok !== st.token) return; }
    await run(i, live ? (st.mouse ? "anim" : "plain") : "inst", tok);
    if (tok === st.token && st.mode === "auto") {
      const dwell = cfg.steps[i][2] || 2000;
      st.timer = setTimeout(i + 1 >= cfg.steps.length ? () => stop(true) : advance, dwell);
    }
  }
  function advance() { if (st.mode !== "off" && st.i + 1 < cfg.steps.length) go(st.i + 1, true); }
  function start() { st.mode = "auto"; go(0, true); }
  function stop(done) {
    st.token++; clearTimeout(st.timer); st.mode = "off"; setReplay(false);
    const c = document.getElementById("apcur"); if (c) c.style.display = "none";
    if (done) { bar("Walkthrough finished. Type ee to run it again, or ← to step back."); setTimeout(() => { if (st.mode === "off") bar(false); }, 4000); }
    else bar(false);
  }
  function next() {
    clearTimeout(st.timer);
    if (st.mode === "off") { st.mode = "manual"; go(0, true); return; }
    st.mode = "manual";
    if (st.i + 1 < cfg.steps.length) go(st.i + 1, true); else bar("End of walkthrough. ← goes back, Esc exits.");
  }
  function prev() { if (st.mode === "off") return; st.mode = "manual"; clearTimeout(st.timer); go(Math.max(0, st.i - 1), false); }
  function toggleAuto() {
    if (st.mode === "auto") { st.mode = "manual"; clearTimeout(st.timer); }
    else if (st.mode === "manual") { st.mode = "auto"; st.timer = setTimeout(advance, 1200); }
    bar();
  }
  function toggleMouse() {
    st.mouse = !st.mouse; const c = document.getElementById("apcur"); if (c && !st.mouse) c.style.display = "none";
    if (st.mode !== "off") bar();
  }

  /* ---- keyboard: ee / aa are double-taps (within 700 ms); ignored while typing in a field ---- */
  function bindKeys() {
    const last = {};
    const dbl = k => { const n = Date.now(), ok = n - (last[k] || 0) < 700; last[k] = ok ? 0 : n; return ok; };
    document.addEventListener("keydown", e => {
      if (e.target.closest && e.target.closest("input,textarea,select")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "e") { if (dbl("e")) (st.mode === "off" ? start() : stop(false)); }
      else if (k === "a") { if (dbl("a")) toggleMouse(); }
      else if (st.mode === "off") return;
      else if (e.key === "Escape") stop(false);
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === " ") { e.preventDefault(); toggleAuto(); }
    });
  }

  return { start, stop, next, prev, go, toggleAuto, toggleMouse, bindKeys, missed, state: st };
}
