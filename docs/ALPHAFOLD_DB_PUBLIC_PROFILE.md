# AlphaFold DB Public Profile

## Decision

`profiles/alphafold-db-public.json` is a reviewed connector profile for public
AlphaFold Protein Structure Database access. It does not introduce a new npm
payload because the required skill is already present in `life-sciences-core`.

The profile pins one MIT `bioSkills` body at revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`:

- `bio-structural-biology-alphafold-predictions`

## Verified Public Workflow

Local smoke verification used the public AFDB endpoint for UniProt accession
`P04637`.

Observed results:

- metadata endpoint returned 9 entries
- metadata included stable download links such as `cifUrl` and `paeDocUrl`
- mmCIF download returned HTTP 200
- PAE payload was the expected compact JSON list format
- the first PAE matrix was 393 x 393

These checks confirm the reviewed public route:

1. UniProt accession -> AFDB metadata
2. metadata -> mmCIF URL and PAE URL
3. mmCIF/PAE artifact manifest -> local interpretation of pLDDT and PAE

## Interpretation Boundary

- AFDB entries are monomeric predictions, not holo experimental structures.
- pLDDT is a per-residue confidence signal stored in the B-factor column and
  must not be interpreted as thermal motion.
- PAE governs inter-domain and relative-position confidence.
- Long low-pLDDT regions are often disorder signals, not generic model failure.

## Rate Limit And Provenance Notes

- The observed public responses did not expose a useful `x-ratelimit-remaining`
  header, so rate control must stay conservative and error-driven.
- Persist source URL, access date, accession, resolved download URLs, and local
  artifact hashes with any downstream analysis.

## Non-Goals

- No AlphaFold Server, AlphaFold 3, or account-gated execution flow.
- No browser automation substitute for an unsupported API.
- No packaging of additional structural-analysis tools beyond the reviewed
  retrieval and interpretation skill.
