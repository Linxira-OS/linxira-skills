# UI And Presentation Migration Review

## Decision

No donor UI or presentation skill body is migrated into a Linxira payload from
`frontend-ui-ux`, `frontend-philosophy`, `ai-slop-remover`, or
`document-formatting`.

## Reasoning

### `frontend-ui-ux` and `frontend-philosophy`

- Provenance remains unresolved in the donor repository.
- Their strongest guidance is stylistic expression rather than a tool or
  execution contract.
- The repository already enforces frontend behavior through first-party agent
  instructions and through the audited `html-reporting-core` selection.
- Several donor prescriptions conflict with repository goals, such as a blanket
  rejection of common UI fonts and a default push toward maximal visual styling
  independent of product context.

Outcome: do not package or rewrite as a standalone skill now. Continue to keep
frontend behavior in repository-native instructions and HTML profile review.

### `ai-slop-remover`

- Provenance is unresolved.
- Its useful core idea is already covered by the first-party
  `scientific-change-verification` guard: make the smallest justified change,
  preserve behavior, and verify results before claiming completion.
- The donor body assumes a single-file refactoring workflow and a verbose report
  format that is narrower than this repository's actual change surface.

Outcome: no separate migration. Revisit only if a future task needs a dedicated
single-file cleanup contract distinct from the current change-verification path.

### `document-formatting`

- The donor body is a localized DOCX formatting specification tied to a Chinese
  thesis layout, fixed typography choices, and local script paths.
- It overlaps with manuscript tooling and office deliverables already excluded
  from public payloads pending independent toolchain and asset review.

Outcome: keep as a donor reference only. Do not generalize it into a public
document-formatting standard.

## Result

`MIG-005` is complete without adding a new first-party skill. The reviewed
presentation path remains:

- repository-native frontend behavior rules for application work,
- `html-reporting-core` for approved HTML reporting layouts,
- future document and office work only after independent toolchain review.
