---
name: academic-visual-evidence
description: Use when selecting, requesting, reviewing, generating, labeling, or placing images in a paper, report, poster, or academic PPT. Distinguishes evidence images from illustrative images, requires user confirmation before external image generation or collection, and defines how AI-generated visuals must be limited and labeled.
skill_class: guard
load_policy: conditional
risk_tags: [account-bound, controlled-data, paid]
---

# Academic Visual Evidence

Treat every image as either evidence or illustration. Never let an illustrative
image masquerade as empirical evidence.

## Classify The Image

Before using or requesting an image, label it as one of:

- **Evidence image**: experimental result, micrograph, gel, blot, pathology,
  instrument output, clinical image, field photo, spectrum, plot derived from
  real data, or a screenshot of an actual interface/state.
- **Explanatory schematic**: conceptual diagram, workflow chart, mechanism map,
  layout sketch, or pedagogical cartoon.
- **Decorative or atmospheric image**: background, cover visual, or mood-setting
  asset not used as scientific evidence.

Evidence images must come from real data or an explicitly declared simulation.
AI-generated images are not valid substitutes for real evidence images.

## Ask Before Using Images

When an artifact needs visual material, ask the user which of these exists:

1. user-provided real images or figures
2. real screenshots or exported plots from their workflow
3. a need for a schematic only
4. a need for a decorative presentation image

Prefer user-provided real images whenever the claim depends on visual evidence.
Do not autonomously invent a representative biological, medical, or
experimental image.

## AI-Generated Image Rules

AI-generated visuals may be used only for:

- conceptual schematics
- presentation cover or background art
- generic illustrative scene-setting
- clearly labeled mechanism or workflow mockups

AI-generated visuals must not be used as:

- microscope or pathology evidence
- assay output, western blot, gel, or instrument readout
- patient, cohort, or experimental-state proof
- example results that could be interpreted as observed data

If an AI-generated image is included, label it explicitly as `AI-generated
illustration`, `concept schematic`, or an equivalent visible note in the deck,
caption, or surrounding text. Do not let a reader infer that it is a captured
experimental image.

## PPT And Report Use

For slide decks and reports:

- real figures and screenshots support claims
- AI-generated visuals support orientation, narrative framing, or conceptual
  explanation only
- captions or speaker notes must make the image class clear
- if a slide compares real and generated visuals, label both categories
  directly on-slide

## External Generation And Retrieval

Before calling an image-generation model or retrieving external visuals, confirm:

- the intended image class
- whether user real images already exist
- whether controlled, unpublished, or patient-linked material is involved
- where the generated or retrieved image will appear
- whether attribution or source labeling is required

Do not upload protected scientific or patient material to an external image
service without an explicit approved data boundary.

## Controlled Generation Script

The bundled `scripts/generate-ai-illustration.mjs` supports OpenAI Images API
generation for schematic or decorative images only. It requires both
`externalGenerationApproved: true` in a request JSON file and the explicit
`--confirm-external-generation` command flag. It refuses evidence-image
requests, never overwrites an existing image, and writes a provenance sidecar
with the model, purpose, label, and prompt hash.

Use `scripts/validate-image-manifest.mjs images/manifest.json` before delivery
to verify that external images have attribution and AI-generated assets have a
matching provenance sidecar. The image manifest is a review record, not proof
that an image is scientifically valid evidence.

## Completion Criteria

- every image is classified as evidence, schematic, or decorative
- evidence images are real or explicitly declared simulations
- AI-generated visuals are limited to allowed roles and visibly labeled
- the user has been asked for real images before illustrative substitution

## Citation

```text
Linxira OS. Linxira Skills: academic-visual-evidence. Version 0.1.0.
Skill path: skills/academic-visual-evidence/SKILL.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
