# Skill Citation Policy

## Goal

Scientific and bioinformatics skills in this repository are procedural research
artifacts. When a user, manuscript, report, benchmark, or another skill library
relies on one of these adapted skills, the citation must identify both the
repository release and the exact skill path.

## Cite The Repository

At minimum, cite the software artifact itself:

```text
Linxira OS. Linxira Skills. Version 0.1.0. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Use `CITATION.cff` when a tool can ingest a machine-readable software citation.

## Cite A Specific Skill

For a skill body, cite the repository and the exact path:

```text
Linxira OS. Linxira Skills: <skill-name>. Version <version or commit>.
Skill path: skills/<skill-name>/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

Example:

```text
Linxira OS. Linxira Skills: bulk-rnaseq-analysis. Version 0.1.0.
Skill path: skills/bulk-rnaseq-analysis/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```

If the work depends on an unreleased repository state, cite the full Git commit
instead of a version tag.

## Cite Upstream Methods Separately

An adapted skill is not a substitute for citing the underlying scientific method
or software. If a workflow depends on Salmon, tximport, DESeq2, fgsea, CAMERA,
FastQC, MultiQC, or another scientific tool or method, cite those primary
software or method papers separately in the manuscript or report.

Skill citations identify the operational workflow contract. Method citations
identify the scientific implementation and theory.

## Authoring Rule

Any first-party skill that contains a `## Provenance` section must also contain
a `## Citation` section with a repository citation template and any required
upstream-method reminder.
