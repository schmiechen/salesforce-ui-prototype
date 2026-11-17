# Recipe: Data 360 (Data Cloud) field mapper

A mapping canvas in the style of Data 360's data stream mapping screen: a **data lake object (DLO)** on the
left, **Data Model entities** (data model objects, DMOs) on the right, a transform node on every mapping, and
wires between them. Use it to show how source fields connect to the shared data model. Code:
`assets/snippets/field-mapper.js` + `field-mapper.css`. Unofficial look-alike; see the README disclaimer.

SLDS has no mapper blueprint, so this is a custom pattern (SKILL rule 10): `my-map-*` classes, SLDS hooks
with fallbacks, `slds-input` and `slds-button` for controls.

## 1) Vocabulary (use Salesforce's terms)
Data stream · data lake object (DLO) · data model object (DMO, also called an *entity*) · Customer 360 Data
Model · primary key · category · formula field · data space · relationships and cardinality (one-to-one,
many-to-one). Field and object names in a prototype are illustrative: verify real DMO field names on the
Data Model tab of an org before presenting them as fact.

## 2) Wire it up
```js
const mapper = renderFieldMapper(document.getElementById("mapHost"), {
  dlo: "Lead_Home", dataSpace: "default", callouts: true,        // callouts: numbered 1/2/3 badges on the searches
  fields: [ {id:"Email"}, {id:"Annual Revenue", type:"number"}, {id:"Created Date", type:"date"} ],
  entities: [
    {name:"Lead", fields:[ {id:"Lead Id", pk:true, type:"id"}, {id:"Annual Revenue", type:"number"} ]},
    {name:"Contact Point Email", fields:[ {id:"Contact Point Email Id", pk:true}, {id:"Email Address"} ]},
  ],
  mappings: [ ["Email", "Contact Point Email.Email Address"] ],  // [sourceFieldId, "Entity.Field"]
  onChange: m => {}, onSave: m => {},
});
```

## 3) Layout and behavior
- **Header:** "Data Lake Objects / `<DLO>` Mappings", Data Space, and Close / Save & Close / Save.
- **Left pane:** the DLO, "Search Fields…", an **Is Mapped (n)** group and an **Unmapped (n)** group; a port at each field.
- **Right pane:** "Data Model entities", its own search, one block per DMO with **Is Mapped (n)**, a primary-key
  tag (`* Id … Primary Key`), and a collapsible **Unmapped (n)** group (it expands automatically while a source is armed).
- **Create a mapping:** click a source field (it highlights), then a target field; the wire draws in. A target takes one source.
- **Remove:** click the transform node. **Save** shows a toast. The two searches filter their panes.
- **Geometry:** wires are cubic beziers from the source port to a node placed 62% of the way across, then straight to
  the target port; positions come from `getBoundingClientRect()` relative to the canvas, and resize redraws them.
  Each path uses `pathLength="1"` with `stroke-dasharray:1` so a CSS transition on `stroke-dashoffset` draws it in.
- The initial mappings build in one by one; later mappings animate individually. Everything is instant when `animOK()` is false.

## Gotchas
- The wires layer must not capture clicks (`pointer-events:none`), while the nodes layer re-enables them on each node.
- Redraw wires after anything that changes row positions (search, group expand/collapse, resize); the snippet does this on every `paint()`.
- Keep the canvas inside a card with its own width; very narrow containers squeeze the middle column to nothing.
- Optional follow-ups, not in the snippet: a Relationships tab with cardinality and a graph view; formula fields on a node.

Working reference: `examples/guided-walkthrough/` (Data 360 Mapping screen).
