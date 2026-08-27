# Examples

Worked prototypes built with this skill. Each is a single, self-contained, offline HTML
file — open with a double-click, no server or build.

| Example | What it demonstrates | Files |
|---------|----------------------|-------|
| **Built-in Case sample** | The starter shell itself — console nav, standard list view + record home (Details/Related + Activity/Chatter), path, and the docked Agentforce outcome rail — with sample Case data. | `../assets/shell-template.html` (bundle it, then open) |
| **Travel & Expense** | A full multi-tab standard-Lightning app from a one-paragraph brief: Department → Travel Approval → Expense Item, approval routing with an out-of-state secondary approver, a Home dashboard with a custom visualization component + approvals queue, reporting charts, and a "why it matters" outcome rail on every screen. | `travel-expense/travel-expense.html` · `travel-expense/PROMPT.md` · `travel-expense/NOTES.md` |
| **SaaS Company Welcome Cards** | A CEO-facing snail-mail welcome program: a Home dashboard (KPI tiles + Lightning-component visuals + SLA triage), a rep **queue** of new accounts with a 14-day verify-and-submit SLA countdown, and a Print Batches screen with a 30-day scheduled export + batch history. Shows how the skill **quizzes** for missing details (the brief ends with "quiz me") — see its NOTES. | `welcome-cards/welcome-cards.html` · `welcome-cards/PROMPT.md` · `welcome-cards/NOTES.md` |

Each example folder includes the **PROMPT** that produced it and **NOTES** (assumptions +
decisions the brief left open) — so you can see the input, the output, and the judgment
calls in between.
