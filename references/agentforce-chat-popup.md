# Recipe: Agentforce chat popup (utility bar)

A conversational "ask the record" experience that behaves like a real chat: it opens from the docked
utility bar, keeps its suggestions and input pinned, types answers out, and links every answer back to
its source records. Code: `assets/snippets/chat-popup.js` + `chat-popup.css`. For the right-rail
outcome panel see `agentforce.md`; this recipe is the conversational surface.

## 1) Wire it up
The shell template's utility bar supports two hooks: `u.render(panel)` and `u.chat` (wider docked panel).
```js
const UTILITIES = [ { id:"agent", label:"Agentforce", icon:"ai", body:"" }, /* ... */ ];
const chat = createChatPopup({
  utility: "agent",
  title: "Ask The Record",
  subtitle: () => "Case 00012345",
  greeting: () => "Hi, I'm Agentforce. Ask me about this case. Every answer links to its source records.",
  suggestions: () => [ { q: "What is the customer reporting?", a: "The **widget** won't power on.", refs: [1] } ],
  cite: n => flashSource(n),                 // a numbered citation chip was clicked
  citeTitle: n => SOURCES[n - 1].name,       // optional tooltip
});
```
`suggestions` is a function so it can depend on the current record or role. `**bold**` is supported in answers.

## 2) Behaviors worth keeping
- **Pinned footer:** suggestions and the input never move; only the message log re-renders and scrolls.
  (Re-rendering the whole card makes the suggestions jump down after every answer.)
- **Thinking, then typing:** about 0.7 s of `.my-dots`, then a typewriter at about 90 characters/second with a
  `.my-cursor`. The reveal skips over HTML tags and entities so it never shows half a tag.
- **One at a time:** asking again mid-answer completes the previous answer instantly first. A suggestion that
  was already asked disappears from the list.
- **Citations:** each answer ends with numbered chips; `cite(n)` should scroll to and highlight the source card
  (switch screens first if the source lives elsewhere).
- **Instant paths:** when `animOK()` is false (walkthrough replay, reduced motion) answers render complete.

## 3) Driving it
`chat.ask(i)` asks suggestion *i*; `chat.askText("...")` mimics typing (matches on the first 12 characters, else
the `fallback` line); `chat.reset()` clears the log. Auto-play steps usually open the popup with a click on
`.my-utilbtn[data-u="agent"]`, type into `#chatInput`, wait for the answer, then close it.

## Gotchas
- Say "Agentforce" or "the agent", never "Copilot" (SKILL rule 8). The orb uses the genuine `einstein` icon.
- Close the popup before navigating in auto-play, or it will cover the next screen's content.
- Canned answers are illustrative; never imply the demo calls a live model.

Working reference: `examples/guided-walkthrough/` (Case Briefing screen).
