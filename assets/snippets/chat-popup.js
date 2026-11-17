/* chat-popup.js: an Agentforce "ask the record" chat, docked above the utility bar.
   Needs from the shell template: UTILITIES + toggleUtil/closeUtil (u.render / u.chat hooks), UTIL_OPEN,
   esc(), svg(), animOK(). Paste after those, with chat-popup.css in the style block.

   1) Add the utility-bar entry:   { id:"agent", label:"Agentforce", icon:"ai", body:"" }
   2) Create the chat:
        const chat = createChatPopup({
          utility: "agent",
          title: "Ask The Record",
          subtitle: () => "Case 00012345",
          greeting: () => "Hi, I'm Agentforce. Ask me about this case. Answers link to their source records.",
          suggestions: () => [ { q: "What changed on this order?", a: "The carrier **rescheduled** delivery twice.", refs: [2, 1] }, ... ],
          fallback: "In this demo, try one of the suggested questions.",
          cite: n => flashSource(n),               // called when a numbered citation chip is clicked
          citeTitle: n => SOURCES[n - 1].name,     // optional tooltip
        });
   Rules baked in: the suggestion row and input stay pinned (only the log re-renders), answers appear after a
   thinking-dots beat then type out (HTML-safe), asking again mid-answer completes the previous answer first,
   and everything is instant while animOK() is false (walkthrough replay or reduced motion).
   chat.ask(i) / chat.askText(text) / chat.reset() are exposed for auto-play steps and smoke tests. */

function createChatPopup(cfg) {
  const log = [];           // {q, a, refs, live}
  let timer = 0;
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
  const isOpen = () => typeof UTIL_OPEN !== "undefined" && UTIL_OPEN === cfg.utility;
  const sug = () => cfg.suggestions();

  const cites = refs => (refs || []).map(n =>
    `<a class="my-chat-cite" href="javascript:void(0)" data-cite="${n}" title="${esc(cfg.citeTitle ? cfg.citeTitle(n) : "Source " + n)}">${n}</a>`).join("");
  const bubbles = () =>
    `<div class="my-chat-a my-chat-hello">${md(cfg.greeting())}</div>` +
    log.map(t => `<div class="my-chat-q">${esc(t.q)}</div>` + (t.live
      ? `<div class="my-chat-a" id="chatLive"><span class="my-dots"><i></i><i></i><i></i></span></div>`
      : `<div class="my-chat-a my-fade">${md(t.a)} ${cites(t.refs)}</div>`)).join("");
  const chips = () => {
    const left = sug().filter(s => !log.some(t => t.q === s.q));
    return left.length ? `<div class="my-chat-lbl">Suggested</div><div class="my-chat-chips">${left.map(s =>
      `<button class="my-chat-chip" data-q="${esc(s.q)}">${esc(s.q)}</button>`).join("")}</div>` : "";
  };

  function finish() { clearTimeout(timer); log.forEach(t => { t.live = false; }); }   // complete any in-flight answer

  function typeOut(t) {
    if (!t.live) return;
    const html = md(t.a); let i = 0;
    const el = () => document.getElementById("chatLive"), box = () => document.getElementById("chatLog");
    const tick = () => {
      const e = el(); if (!e || !t.live || !log.includes(t)) return;
      for (let n = 0; n < 2 && i < html.length; n++) {
        if (html[i] === "<") { i = html.indexOf(">", i) + 1; n--; continue; }   // never emit half a tag
        if (html[i] === "&") { i = html.indexOf(";", i) + 1; continue; }        // or half an entity
        i++;
      }
      if (i >= html.length) { t.live = false; e.removeAttribute("id"); e.classList.add("my-fade"); e.innerHTML = html + " " + cites(t.refs); }
      else { e.innerHTML = html.slice(0, i) + '<span class="my-cursor"></span>'; timer = setTimeout(tick, 22); }
      if (box()) box().scrollTop = box().scrollHeight;
    };
    timer = setTimeout(tick, 700);   // thinking dots first
  }

  function update() {   // log + suggestions only; header, input and footer never move
    if (!isOpen()) return;
    const l = document.getElementById("chatLog"), s = document.getElementById("chatSug");
    if (!l || !s) { render(document.getElementById("utilpanel")); return; }
    l.innerHTML = bubbles(); s.innerHTML = chips(); l.scrollTop = l.scrollHeight;
  }

  function push(entry) { finish(); entry.live = animOK(); log.push(entry); update(); typeOut(entry); }
  function ask(i) { const s = sug()[i]; if (!s || log.some(t => t.q === s.q)) return; push({ q: s.q, a: s.a, refs: s.refs }); }
  function askText(v) {
    const q = (v || "").trim().toLowerCase(); if (!q) return;
    const m = sug().findIndex(s => s.q.toLowerCase().includes(q.slice(0, 12)));
    if (m >= 0) return ask(m);
    push({ q: v.trim(), a: cfg.fallback || "In this demo, try one of the suggested questions.", refs: [] });
  }

  function render(panel) {
    finish();
    panel.innerHTML =
      `<div class="my-chat-head"><span class="my-af-orb">${svg("einstein", 18)}</span>
         <div class="ttl"><div class="my-af-label">Agentforce</div><div class="slds-text-heading_small">${esc(cfg.title || "Ask The Record")}</div>
         <div class="sub">${esc(cfg.subtitle ? cfg.subtitle() : "")}</div></div>
         <button class="my-chat-x" type="button" aria-label="Close">&times;</button></div>
       <div class="my-chat-log" id="chatLog">${bubbles()}</div>
       <div class="my-chat-foot"><div id="chatSug">${chips()}</div>
         <input class="slds-input" id="chatInput" placeholder="${esc(cfg.placeholder || "Ask a question…")}"/>
         <div class="my-chat-note">${esc(cfg.note || "AI-generated from source records. Verify before use.")}</div></div>`;
    panel.querySelector(".my-chat-x").onclick = closeUtil;
    panel.querySelector("#chatLog").onclick = e => { const c = e.target.closest("[data-cite]"); if (c && cfg.cite) cfg.cite(+c.dataset.cite); };
    panel.querySelector("#chatSug").onclick = e => { const b = e.target.closest("[data-q]"); if (b) ask(sug().findIndex(s => s.q === b.dataset.q)); };
    const input = panel.querySelector("#chatInput");
    input.addEventListener("keydown", e => { if (e.key === "Enter") { askText(input.value); input.value = ""; } });
    const l = panel.querySelector("#chatLog"); l.scrollTop = l.scrollHeight;
  }

  function reset() { finish(); log.length = 0; if (isOpen()) render(document.getElementById("utilpanel")); }

  const u = UTILITIES.find(x => x.id === cfg.utility);
  if (!u) throw new Error("createChatPopup: no UTILITIES entry with id '" + cfg.utility + "'");
  u.chat = true; u.render = render;
  return { ask, askText, reset, update, log };
}
