/* Smoke test for examples/guided-walkthrough. Run:
     scripts/smoke.sh examples/guided-walkthrough/guided-walkthrough.html examples/guided-walkthrough/smoke-test.js --budget 40000
   Part 1 replays every walkthrough step in instant mode and checks the screen it leaves behind.
   Part 2 checks the live animations against a timeline (typewriter, wire build, staged build). */
const sleep = ms => new Promise(r => setTimeout(r, ms));
const one = s => document.querySelector(s);
const all = s => [...document.querySelectorAll(s)];
const check = (name, ok, extra) => smokeOut((ok ? "PASS" : "FAIL") + ": " + name + (ok ? "" : "  " + (extra || "")));

/* ---- Part 1: instant replay of every step ---- */
const expect = [
  () => ACTIVE === "overview" && /Widget|00001045/.test(one("#work").textContent),
  () => ACTIVE === "briefing" && !!one("#src1") && !!one("#src3"),
  () => UTIL_OPEN === "agent" && all("#chatLog .my-chat-q").length === 1 && all("#chatLog .my-chat-cite").length >= 1,
  () => UTIL_OPEN === null && !!one("#src1.is-flash"),
  () => ACTIVE === "mapping" && all(".my-map-wires path").length === 9 && all(".my-map-wires path.pre").length === 0,
  () => all(".my-map-wires path").length === 10 && !!one('.my-map-node[data-f="Phone"]'),
  () => all(".my-map-wires path").length === 9 && !one('.my-map-node[data-f="Annual Revenue"]'),
  () => /saved/i.test(one(".my-map-toast").textContent),
  () => ACTIVE === "results" && all("#work .my-build.is-in").length === 4 && !!one("#nextBtn"),
  () => SLIDE === 2 && !!one(".my-banner.is-pinned") && !!one("#backBtn"),
];
for (let i = 0; i < expect.length; i++) {
  await walk.go(i, false);
  let ok = false, err = "";
  try { ok = expect[i](); } catch (e) { err = e.message; }
  check("step " + (i + 1) + " leaves the expected screen", ok, err);
}
check("walkthrough has " + expect.length + " steps", walk.state.i === expect.length - 1);
check("no step skipped a missing target", walk.missed.length === 0, JSON.stringify(walk.missed));
walk.stop(false);

/* ---- Part 2: live animations (timers run in virtual time) ---- */
resetDemo();
goSection("briefing");
one('.my-utilbtn[data-u="agent"]').click();
chat.ask(0);
check("answer starts with thinking dots", !!one("#chatLive .my-dots"));
await sleep(1100);
check("answer types out with a cursor", !!one("#chatLive") && !!one("#chatLive .my-cursor"));
await sleep(3500);
check("answer finishes with citations", !one("#chatLive") && all("#chatLog .my-chat-a:not(.my-chat-hello) .my-chat-cite").length >= 1);
const inputTop = one("#chatInput").getBoundingClientRect().top;
chat.ask(1); await sleep(100);
check("input stays pinned while the log grows", Math.round(one("#chatInput").getBoundingClientRect().top) === Math.round(inputTop));
chat.ask(2); chat.ask(2);
check("asking the same suggestion twice adds one entry", chat.log.filter(t => t.q === CHAT_QA[2].q).length === 1);
closeUtil();

goSection("mapping");
check("wires start hidden", all(".my-map-wires path.pre").length === 9);
await sleep(1000);
const mid = all(".my-map-wires path.pre").length;
check("wires draw in one by one", mid > 0 && mid < 9, "pre=" + mid);
await sleep(3000);
check("all wires drawn after the build", all(".my-map-wires path.pre").length === 0);
one('[data-src="Phone"]').click();
check("armed source highlights and targets expand", !!one('[data-src="Phone"].is-armed') && !!one('[data-tgt="Contact Point Phone.Phone Number"]'));
one('[data-tgt="Contact Point Phone.Phone Number"]').click();
check("click-to-map adds a mapping", MAPPER.get()["Phone"] === "Contact Point Phone.Phone Number" && all(".my-map-wires path").length === 10);
one('.my-map-node[data-f="Phone"]').click();
check("clicking a node removes the mapping", !MAPPER.get()["Phone"] && all(".my-map-wires path").length === 9);
one("#mapQSrc").value = "email"; one("#mapQSrc").dispatchEvent(new Event("input"));
check("search filters source fields", all('[data-list="src"] .my-map-row').length <= 3);

goSection("results");
check("staged build starts empty", all("#work .my-build.is-in").length === 0);
await sleep(1200);
const built = all("#work .my-build.is-in").length;
check("items build in one at a time", built > 0 && built < 4, "built=" + built);
await sleep(2500);
check("all four items built", all("#work .my-build.is-in").length === 4);
goSection("overview"); goSection("results");
check("re-entering Results resets to slide 1", SLIDE === 1);
smokeDone();
