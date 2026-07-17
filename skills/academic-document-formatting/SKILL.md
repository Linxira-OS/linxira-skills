---
name: academic-document-formatting
description: Use when formatting the main body of a Chinese academic paper, report, thesis chapter, or research handout after the cover and institutional front matter are already defined. Covers title levels, body text, figure/table captions, reference-list typography, citation bracket style, and document-wide consistency.
skill_class: workflow
load_policy: conditional
risk_tags: []
---

# Academic Document Formatting

This skill governs the article body, not the cover, title page, institutional
declaration pages, or school-specific front matter. When a journal, university,
or department template conflicts with these defaults, follow the explicit local
template and record the exception.

## Default Chinese Academic Body Format

Apply these defaults unless the user or venue gives a stricter template:

- paper title in the body opening: **Sanhao**
- all heading levels from first-level through fourth-level: **Xiaosanhao**
- body text: **Sihao**
- figure captions and table captions: **Xiaosihao**, centered
- reference-list entries: **Xiaosihao**
- reference-list heading: **Xiaosanhao**

Keep the whole document internally consistent. Do not mix body fonts, heading
sizes, or caption alignment across sections without a declared template reason.

## Citation And Reference Marks

Use standard English half-width punctuation for in-text bracketed references:

- single citation: `[2]`
- non-contiguous grouped citations: `[2,7]`
- contiguous range: `[2-7]`

Rules:

- keep all grouped citations inside one pair of square brackets
- use the English comma `,` for separated citations
- use the hyphen `-` for continuous ranges
- do not mix full-width Chinese punctuation inside reference brackets
- keep the bracketed citation adjacent to the supported claim, figure, table, or
  method statement

## Heading And Layout Discipline

- Use one heading hierarchy consistently through the full body.
- Do not enlarge lower-level headings simply for emphasis.
- Keep captions visually distinct from the body and close to their figure/table.
- Keep references in one style family from first entry to last entry.
- If the user imports text from multiple drafts, normalize font size and caption
  style before final delivery.

## Tool Boundary

This skill defines formatting targets. It does not itself choose Word, LaTeX,
Markdown, HTML, Typst, or a journal class file. Apply the same semantic rules in
the active toolchain and preserve the user's chosen authoring system.

## Completion Criteria

- title, headings, body, captions, and references match one declared format
- bracketed references use half-width English punctuation consistently
- figure and table captions are centered and visually consistent
- the user-visible body no longer contains mixed legacy formatting

## Citation

```text
Linxira OS. Linxira Skills: academic-document-formatting. Version 0.1.0.
Skill path: skills/academic-document-formatting/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
