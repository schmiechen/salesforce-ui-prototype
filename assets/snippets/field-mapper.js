/* field-mapper.js: a Data 360 (Data Cloud) style field-mapping canvas.
   Left: a data lake object (DLO) with its fields. Right: "Data Model entities" (DMOs) with their fields.
   Middle: one transform node per mapping, joined to both sides by wires. Needs esc() and animOK() from the
   shell template; put field-mapper.css in the style block.

   const mapper = renderFieldMapper(document.getElementById("mapHost"), {
     dlo: "Lead_Home", dataSpace: "default", callouts: true,       // callouts: numbered 1/2/3 badges on the searches
     fields: [ {id:"Email", type:"text"}, {id:"Annual Revenue", type:"number"}, {id:"Created Date", type:"date"} ],
     entities: [ {name:"Lead", fields:[ {id:"Lead Id", pk:true}, {id:"First Name"}, {id:"Annual Revenue", type:"number"} ]},
                 {name:"Contact Point Email", fields:[ {id:"Contact Point Email Id", pk:true}, {id:"Email Address"} ]} ],
     mappings: [ ["Email", "Contact Point Email.Email Address"] ],   // [sourceFieldId, "Entity.Field"]
     onChange: m => {}, onSave: m => {},                            // m = { sourceFieldId: "Entity.Field" }
   });
   Interactions: click a source port, then a target port, to create a mapping (the wire draws in). Click a transform
   node to remove its mapping. The searches filter fields. Save shows a toast. Everything is instant while animOK() is false.
   Controller: mapper.map(src, tgt) / unmap(src) / save() / get() / redraw(), for auto-play steps and smoke tests.
   Field names are illustrative: verify real DMO field names on the Data Model tab of your org. */

function renderFieldMapper(host, cfg) {
  const S = { map: {}, armed: null, qSrc: "", qTgt: "", open: {}, built: false };
  (cfg.mappings || []).forEach(([s, t]) => { S.map[s] = t; });
  const tgtKey = (e, f) => e.name + "." + f.id;
  const ico = t => ({ number: "#", date: "▦", id: "ID" }[t] || "Aa");
  const timers = [];

  host.innerHTML = `
    <div class="my-map">
      <div class="my-map-hd">
        <div><div class="slds-text-body_small slds-text-color_weak">Data Lake Objects</div><h3>${esc(cfg.dlo)} Mappings</h3>
          <div class="my-map-srch">Search Data Lake Objects…${cfg.callouts ? '<b class="my-map-co">1</b>' : ""}</div></div>
        <div class="my-map-ds"><b>Data Space</b><br>${esc(cfg.dataSpace || "default")}</div>
        <div class="my-map-btns"><button class="slds-button slds-button_neutral" data-act="close">Close</button>
          <button class="slds-button slds-button_neutral" data-act="saveclose">Save &amp; Close</button>
          <button class="slds-button slds-button_brand" data-act="save">Save</button></div>
      </div>
      <div class="my-map-canvas">
        <section class="my-map-pane"><h4>${esc(cfg.dlo)}</h4>
          <div class="my-map-q"><input class="slds-input" id="mapQSrc" placeholder="Search Fields…"/>${cfg.callouts ? '<b class="my-map-co">3</b>' : ""}</div>
          <div data-list="src"></div></section>
        <div class="my-map-mid"></div>
        <section class="my-map-pane"><h4>Data Model entities</h4>
          <div class="my-map-q"><input class="slds-input" id="mapQTgt" placeholder="Search Fields…"/>${cfg.callouts ? '<b class="my-map-co">2</b>' : ""}</div>
          <div data-list="tgt"></div></section>
        <svg class="my-map-wires" aria-hidden="true"></svg><div class="my-map-nodes"></div>
      </div>
      <div class="my-map-toast" role="status"></div>
    </div>`;
  const $ = s => host.querySelector(s);
  const canvas = $(".my-map-canvas"), svgEl = $(".my-map-wires"), nodes = $(".my-map-nodes");

  const srcMapped = () => cfg.fields.filter(f => S.map[f.id]);
  function paintLists() {
    const q1 = S.qSrc.trim().toLowerCase(), q2 = S.qTgt.trim().toLowerCase();
    const row = (f, key, side, mapped) =>
      `<div class="my-map-row ${mapped ? "" : "un"} ${S.armed === key ? "is-armed" : ""}" data-${side}="${esc(key)}">` +
      (side === "tgt" ? `<span class="my-map-port ${mapped ? "" : "un"}"></span>` : "") +
      `<span class="ty">${ico(f.type)}</span><span class="nm">${f.pk ? "* " : ""}${esc(f.label || f.id)}</span>${f.pk ? '<span class="pk">Primary Key</span>' : ""}` +
      (side === "src" ? `<span class="my-map-port ${mapped ? "" : "un"}"></span>` : "") + `</div>`;
    const sf = cfg.fields.filter(f => !q1 || (f.label || f.id).toLowerCase().includes(q1));
    const sm = sf.filter(f => S.map[f.id]), su = sf.filter(f => !S.map[f.id]);
    $('[data-list="src"]').innerHTML =
      `<div class="my-map-grp">Is Mapped (${sm.length})</div>${sm.map(f => row(f, f.id, "src", true)).join("")}` +
      `<div class="my-map-grp un">Unmapped (${su.length})</div>${su.map(f => row(f, f.id, "src", false)).join("")}`;
    const taken = new Set(Object.values(S.map));
    $('[data-list="tgt"]').innerHTML = cfg.entities.map(e => {
      const fs = e.fields.filter(f => !q2 || (f.label || f.id).toLowerCase().includes(q2));
      const m = fs.filter(f => taken.has(tgtKey(e, f))), u = fs.filter(f => !taken.has(tgtKey(e, f)));
      const show = S.open[e.name] || S.armed || q2;
      return `<div class="my-map-ent"><div class="my-map-eh">${esc(e.name)}</div><div class="my-map-grp">Is Mapped (${m.length})</div>` +
        m.map(f => row(f, tgtKey(e, f), "tgt", true)).join("") +
        `<div class="my-map-grp un my-map-tog" data-open="${esc(e.name)}">${show ? "▾" : "▸"} Unmapped (${u.length})</div>` +
        (show ? u.map(f => row(f, tgtKey(e, f), "tgt", false)).join("") : "") + `</div>`;
    }).join("");
  }

  function drawWires(hi) {
    timers.forEach(clearTimeout); timers.length = 0;
    const cr = canvas.getBoundingClientRect();
    svgEl.setAttribute("width", cr.width); svgEl.setAttribute("height", cr.height); svgEl.setAttribute("viewBox", `0 0 ${cr.width} ${cr.height}`);
    const mid = el => { const r = el.getBoundingClientRect(); return [r.left - cr.left + r.width / 2, r.top - cr.top + r.height / 2]; };
    const build = !S.built && animOK(); S.built = true;
    let paths = "", nd = ""; const list = [];
    srcMapped().forEach((f, k) => {
      const a = $(`[data-src="${CSS.escape(f.id)}"] .my-map-port`), b = $(`[data-tgt="${CSS.escape(S.map[f.id])}"] .my-map-port`);
      if (!a || !b) return;
      const [x1, y1] = mid(a), [x2, y2] = mid(b), nx = x1 + (x2 - x1) * .62, dx = (nx - 20 - x1) * .55;
      const pre = (build || (f.id === hi && animOK())) ? " pre" : "";
      paths += `<path class="${pre}" data-f="${esc(f.id)}" pathLength="1" d="M${x1} ${y1} C${x1 + dx} ${y1} ${nx - 20 - dx} ${y2} ${nx - 20} ${y2} L${x2} ${y2}"/>`;
      nd += `<button class="my-map-node${pre}" data-f="${esc(f.id)}" style="left:${nx}px;top:${y2}px" title="Remove mapping"><i></i><span>→</span><i></i></button>`;
      list.push(f.id);
    });
    svgEl.innerHTML = paths; nodes.innerHTML = nd;
    const show = id => { svgEl.querySelectorAll("path").forEach(p => p.dataset.f === id && p.classList.remove("pre"));
      nodes.querySelectorAll(".my-map-node").forEach(n => n.dataset.f === id && n.classList.remove("pre")); };
    if (build) list.forEach((id, k) => timers.push(setTimeout(() => show(id), 250 + k * 180)));
    else if (hi) timers.push(setTimeout(() => show(hi), 40));
  }

  function paint(hi) { paintLists(); drawWires(hi); }
  function toast(msg) { const t = $(".my-map-toast"); t.textContent = msg; t.classList.add("on"); timers.push(setTimeout(() => t.classList.remove("on"), 1800)); }
  const emit = () => cfg.onChange && cfg.onChange({ ...S.map });

  function map(src, tgt) {
    for (const k of Object.keys(S.map)) if (S.map[k] === tgt) delete S.map[k];   // a target takes one source
    S.map[src] = tgt; S.armed = null; paint(src); emit();
  }
  function unmap(src) { delete S.map[src]; S.armed = null; paint(); emit(); }
  function save() { toast("Mappings saved"); cfg.onSave && cfg.onSave({ ...S.map }); }

  host.addEventListener("click", e => {
    const act = e.target.closest("[data-act]");
    if (act) { if (act.dataset.act !== "close") save(); else toast("Closed without saving"); return; }
    const tog = e.target.closest("[data-open]"); if (tog) { S.open[tog.dataset.open] = !S.open[tog.dataset.open]; paint(); return; }
    const nd = e.target.closest(".my-map-node"); if (nd) { unmap(nd.dataset.f); return; }
    const s = e.target.closest("[data-src]"); if (s) { S.armed = S.armed === s.dataset.src ? null : s.dataset.src; paint(); return; }
    const t = e.target.closest("[data-tgt]"); if (t && S.armed) map(S.armed, t.dataset.tgt);
  });
  $("#mapQSrc").addEventListener("input", e => { S.qSrc = e.target.value; paint(); });
  $("#mapQTgt").addEventListener("input", e => { S.qTgt = e.target.value; paint(); });
  let rz = 0; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => host.isConnected && drawWires(), 150); });

  paint();
  return { map, unmap, save, get: () => ({ ...S.map }), redraw: () => paint() };
}
