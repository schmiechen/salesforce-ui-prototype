# Travel & Expense — assumptions & decisions

What the one-paragraph brief left open, and how the prototype resolved it. These are the
"decisions to take back to the project team" — defaulted so the demo is clickable, but not
final product decisions.

## Assumptions made (defaulted in the prototype)
- **Nav:** standard Lightning context-bar nav (white header), tabs Home · Travel Requests ·
  Approvals · Reporting · Departments. Current user = "Alex Bailey".
- **Routing path:** in-state = Submitted → Manager Approval → Approved; out-of-state inserts
  a **Secondary Approval** stage (Finance/Travel Office) after manager approval. Shown as a
  genuine `slds-path`. Approve advances one stage; Reject sets Rejected. Interactive only —
  no persistence.
- **Total:** Travel Approval Total is the sum of its Expense Items (rollup).
- **Home visualization:** a custom "Travel Insights" component — Spend by Month (bar) +
  Requests by Status (funnel), CSS/SVG, no libraries — plus KPI tiles and a top-5
  "Awaiting Your Approval" queue and "My Travel Requests".
- **Data:** ~6 illustrative requests across statuses and 4–5 departments, mix of in/out of
  state; figures are fictitious and internally consistent.
- **Outcome rails:** each screen's "why it matters" is drafted (Home = one place to submit/
  approve/see activity; Approvals = one prioritized queue + auto-routing; Reporting =
  real-time spend, no spreadsheets; etc.). Illustrative KPI tiles are labeled directional.

## Decisions for the project team
- **Approver determination:** who is the manager approver, and who/what team is the
  secondary approver for out-of-state? (Role hierarchy, queue, or named Finance approver?)
- **Out-of-state definition:** by destination state ≠ employee's work state, or a manual
  flag? Any per-diem / spend thresholds that also trigger secondary approval?
- **Expense policy:** allowed expense types, receipt requirements, and any auto-rejection
  rules (over cap, missing receipt).
- **Reporting scope:** which real fiscal periods, cost-center structure, and whether spend
  is estimated vs. actuals reconciled from finance.
- **Recall / edit after submit:** can a requester recall or edit a submitted request, and at
  which stages?
- **Notifications:** email/Slack/bell on stage changes — in scope?
