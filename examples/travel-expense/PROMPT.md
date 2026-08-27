# Prompt: Travel & Expense app

The single-paragraph brief that produced `travel-expense.html`. Paste it to Claude Code
with this skill installed to replicate the build.

---

**Using the `salesforce-ui-prototype` skill:** Build a "Travel & Expense" Lightning app
that lets employees submit travel requests with itemized expenses, routes them through an
approval process, and gives managers reporting on travel activity by department and month.
If travel is out of state, it needs to be flagged and routed through a secondary approver.
Three custom objects, related: Department → Travel Approval → Expense Item. Standard
Lightning nav with Home, Travel Requests, Approvals, Reporting, and Departments tabs. The
Home page should give an overview with a custom Lightning component visualization and a
list-view queue of new approvals. Every screen should carry an Agentforce "why it matters"
outcome rail.

---

See `NOTES.md` for the assumptions and decisions this brief left open (the kind of list
the skill surfaces back to you when a brief is under-specified).
