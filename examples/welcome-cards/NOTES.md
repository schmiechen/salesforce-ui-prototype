# SaaS Company Welcome Cards — assumptions & decisions

The brief ended with "quiz me on what else I need to explain." These are the questions that
surfaced and how the prototype resolved them — defaulted so the demo is clickable, not final
product decisions.

## What the quiz asked (and the assumed answers)
- **Card lifecycle stages?** Assumed: **Address Review → Awaiting Approval → Ready to Print →
  Sent**. Reps verify the address (Address Review), CEO/manager approves (Awaiting Approval),
  approved cards queue for the next print run (Ready to Print), then export marks them Sent/Mailed.
- **Who approves?** Assumed the CEO (or a manager) signs off — the Home page centers on
  "cards awaiting approval." Approval is a manual sign-off step, not automatic.
- **The 14-day SLA — from what, measured how?** Assumed **14 calendar days from account
  onboarding to *submit*** (rep verifies + submits the address). Home surfaces "SLA at Risk";
  the New Accounts queue shows a per-card countdown (due soon / due today / overdue).
- **The 30-day export — scheduled or on-demand?** Assumed a **scheduled batch every 30 days**
  (next run shown on Print Batches), producing a print-ready CSV mail-merge for the card
  vendor and marking each card Sent. On-demand export is noted as an option for time-sensitive
  cards (the Agentforce rail flags the wait-vs-rush trade-off).
- **What visuals on Home?** Assumed KPI tiles (Awaiting Verification, Awaiting Approval, Ready
  to Print, Sent This Period, SLA at Risk) + a custom Lightning component set: Pipeline by
  Stage, Cards by Region, Cards by Rep, and SLA Health.
- **Nav / tabs?** Assumed standard Lightning nav: **Home · New Accounts · Welcome Cards ·
  Print Batches**. Company = "Nimbus Software" (illustrative). Data is fictitious.
- **Marketing Cloud journey?** Represented as a step that fires **on assignment** (drip
  onboarding campaign). Shown illustratively — not a live MC integration.

## Decisions for the project team
- **Address source & verification:** where does the mailing address come from (Account record,
  billing system), and what counts as "verified" (rep eyeball vs. address-validation service)?
- **SLA definition:** business days vs. calendar days; does the clock start at onboarding,
  contract signature, or first payment? What happens on breach (escalation, reassignment)?
- **Approval authority:** who approves — CEO only, or managers by region/plan tier? Any
  auto-approve threshold?
- **Batch cadence & vendor:** confirm the 30-day cycle, the export format the print vendor
  needs, and whether on-demand rush exports are allowed.
- **Marketing Cloud journey:** which journey, entry criteria (all new accounts vs. plan tier),
  and how card-mailed status feeds back into it.
- **Card content:** is the physical card personalized (plan, rep signature) or a single design?
- **Reassignment / opt-out:** can a rep reassign a card, and can an account opt out of a
  physical mailing?
