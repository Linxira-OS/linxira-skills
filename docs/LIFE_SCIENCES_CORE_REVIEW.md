# Life Sciences Core Review

## Decision

`profiles/life-sciences-core.json` is the reviewed definition of the first
life-science expansion. It extends the first-party `core` profile with four
MIT-licensed `bioSkills` entries at source revision
`24f0694a125e53f04a7c66a54ba9b81461b7227f`.

The profile is approved for packaging. The payload builder copies exactly the
listed bodies, verifies their hashes, and includes the upstream MIT notice
before the CLI materializes it.

## Included Skills

| Skill | Scope and dependency | Load and action boundary | Safe verification |
| --- | --- | --- | --- |
| `bio-read-sequences` | Local FASTA, FASTQ, GenBank, EMBL, ABI, or SFF parsing with Biopython 1.83+. | `conditional`; read local files only. | Biopython 1.86 parsed a two-record FASTA fixture with the expected IDs and total length. |
| `bio-sequence-statistics` | Local assembly and sequence statistics with Biopython 1.83+. | `conditional`; read local files only. | Hand-checked fixture produced N50 7, auN 6.3, and GC removal fraction 1.0. |
| `bio-structural-biology-structure-navigation` | Local PDB/mmCIF structure traversal with Biopython 1.83+. | `conditional`; read local files only. | Bio.PDB parsed a one-residue PDB fixture and preserved its full residue tuple and B-factor. |
| `bio-structural-biology-alphafold-predictions` | AFDB metadata, coordinate, and PAE interpretation using `requests`, Biopython, NumPy, and Matplotlib as needed. | `required` before a public network read; require an explicit UniProt accession and do not turn a prediction into a biological conclusion. | The AFDB public metadata endpoint returned nine entries for `P04637` with `cifUrl` and `paeDocUrl`. |

The profile manifest records the exact `bodySha256` for every selected entry.
`catalog/source-skills.json` records the associated source path, source
revision, MIT license evidence, and frontmatter summary.

## Scientific And Operational Boundaries

- Sequence statistics treat N50 as contiguity, not assembly correctness; report
  auN and independent completeness/correctness evidence where relevant.
- Structure navigation preserves insertion codes, alternate conformers, model
  identity, and auth-versus-label numbering instead of silently flattening them.
- AlphaFold DB models are monomeric hypotheses without ligands, cofactors,
  PTMs, biological assemblies, or alternate conformations. pLDDT is local
  confidence and PAE governs relative-domain confidence.
- The profile does not contain clinical interpretation, automated submission,
  credentialed access, remote compute, or destructive file transformations.

## Deferred Candidates

| Candidate | Reason for deferral |
| --- | --- |
| `bio-structural-biology-structure-validation` | Comprehensive checks depend on optional `phenix.molprobity`, DSSP, and related tools not included in this profile. |
| `bio-workflow-management-cwl-workflows` | `cwltool` was not installed; execution can launch containers and compute, so it needs a separate execution contract. |
| `bio-experimental-design-sample-size` | `ssizeRNA`, PROPER, powsimR, DESeq2, and edgeR were not installed; study-design advice requires an explicit assumptions and evidence review. |
| `bio-uniprot-access` | Its API workflows include asynchronous ID mapping and need a dedicated public-service rate-limit and write-method contract. |

## Revalidation

Regenerate the source catalog and compare all four recorded hashes after any
approved `bioSkills` revision change. Re-run the local Biopython fixtures and
the AFDB metadata read before changing this profile from reviewed to packaged.
