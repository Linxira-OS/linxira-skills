# Format Coverage And Limits

This skill separates checks that a byte-level tool can decide from judgements
that need provider information, external tools, or human review. The matrix is
the boundary of the claim: an item marked "not handled" must not be reported as
clean.

## Capability Matrix

| Capability | Decision type | Bundled handling |
| --- | --- | --- |
| Zero-width characters U+200B–200D, U+2060–2064 in text and DOCX body parts | Deterministic | `scan.py` reports; `clean.py` removes |
| Bidirectional controls U+202A–202E, U+2066–2069 | Deterministic | `scan.py` reports; `clean.py` removes |
| Byte-order mark U+FEFF and soft hyphen U+00AD | Deterministic | `scan.py` reports; `clean.py` removes |
| Variation selectors U+FE00–FE0F, U+E0100–E01EF | Deterministic presence, judgement required | Reported; retained by default; `--strip-variation-selectors` removes explicitly |
| U+3000 and full-width punctuation | Deterministic preservation | Never removed by the cleaner |
| DOCX `docProps/custom.xml` and its package references | Deterministic | `clean.py` removes the part, content-type override, and relationship |
| DOCX core author, last-modified-by, and modified timestamp | Deterministic | Cleared from `docProps/core.xml` |
| DOCX body `w:rsid*` attributes | Deterministic | Stripped from `word/document.xml` |
| DOCX comments, tracked changes, people metadata, embedded objects, thumbnails | Not handled | Report as residual; inspect in Word or with an OOXML tool |
| DOCX `docProps/app.xml` application/company fields | Not handled | Inspect or use a dedicated property editor |
| PNG `tEXt`, `zTXt`, `iTXt` textual chunks, including XMP | Deterministic | `clean.py` removes chunks, preserves other chunks and CRCs |
| PNG `eXIf`, ICC, proprietary chunks | Not handled | Use an image metadata tool |
| JPEG COM and APP1 XMP segments | Deterministic | `clean.py` removes those segments without re-encoding |
| JPEG EXIF, GPS, IPTC, APP13, proprietary segments | Not handled | Use `exiftool` or another metadata editor |
| PDF Info dictionary, XMP, annotations, attachments, incremental revisions | Not handled | Use a PDF-specific tool such as `qpdf` or `exiftool` |
| Statistical or model-side watermark | Not decidable from the file | Do not claim detection or removal |
| AI authorship, originality, or detector score | Not decidable from the file | Outside scope; see institutional policy |

## Format Risk Points

### TXT And Markdown

- A UTF-8 BOM may be re-added by editors or Git filters after cleaning.
- Zero-width characters can appear inside numbers, citations, URLs, and code
  spans, where deletion changes meaning or breaks an identifier.
- Markdown comments, reference-link definitions, raw HTML, and URLs can carry
  visible or invisible metadata that the cleaner does not interpret.
- Unicode tag characters (U+E0000–E007F) and other unusual code points are not
  in the removal set; confirm whether they are meaningful before editing.
- Line endings and trailing whitespace are preserved as bytes by `clean.py`.

### DOCX

- `docProps/core.xml`, `docProps/custom.xml`, and `docProps/app.xml` can each
  carry author, organization, application, and workflow information. Only the
  first two are partially handled.
- Tracked changes, comments, and `word/people.xml` may contain names and
  timestamps that are not removed by rsid stripping.
- Embedded fonts, images, OLE objects, and external relationships can carry
  their own metadata or live links.
- `word/settings.xml` can retain rsid values even after body attributes are
  stripped; this is a residual trace, not visible text.
- The thumbnail in `docProps/thumbnail.jpeg` is not regenerated or removed.
- Rewriting the ZIP changes compression and archive layout. Entry timestamps
  are copied from the source `ZipInfo`, but the file bytes and some container
  details can change without altering visible styles, paragraph text, or
  relationships that remain referenced.

### PNG And JPEG

- Text and XMP often survive format conversion from design tools.
- EXIF may contain GPS coordinates, device serial numbers, and editing history.
  The bundled cleaner intentionally leaves EXIF in place.
- ICC profiles and proprietary application segments are preserved to avoid
  changing rendering or breaking decoders.
- Steganographic payloads and pixel-level modifications cannot be detected by
  structural parsing.

### PDF

- The Info dictionary, XMP packet, annotations, attachments, form fields,
  digital signatures, and incremental updates are separate surfaces.
- Removing metadata can invalidate a signature and may not remove earlier
  revisions. Rebuild the PDF with a reviewed tool and verify the result.
- A PDF produced by exporting a cleaned DOCX is a new artifact; scan it again.

## What Cannot Be Determined

- **Statistical watermarks.** A provider may bias token choices or embed a
  signal in generation probabilities. A finished document does not expose the
  sampling process, and editing can destroy evidence without proving removal.
- **Model-side provenance.** API logs, account records, and service-side
  policies are not present in the document.
- **Authorship and intent.** Metadata is not a reliable authorship signal, and
  invisible characters are not proof of AI generation.
- **Detector output.** A score from a third-party detector is not a
  deterministic property and is not produced or validated here.

If a stakeholder asks for one of these determinations, say it is outside the
scope and identify the evidence or tool that would be required.

## Reporting Rules

Report three separate lists:

1. **Deterministic changes** made by `clean.py`, with counts from its JSON.
2. **Residual observations** from the post-clean scan, including retained
   variation selectors and unsupported metadata.
3. **Unverified questions**, such as watermarks, authorship, or PDF metadata.

Never merge these lists into a single "clean" claim.

## Citation

```text
Linxira OS. Linxira Skills: de-aigc-provenance. Version 0.1.0.
Skill path: skills/de-aigc-provenance/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
