# Image Integrity Red Lines

Decision rules for judging whether processing or assembly of an authentic image
crosses from presentation into misconduct. Operational limits are in
[../SKILL.md](../SKILL.md); microscopy-specific compliance is in
[microscopy.md](microscopy.md).

## Boundary With Evidence And Sourcing Skills

- `academic-visual-evidence` decides whether an image may appear at all: real
  evidence vs schematic vs decorative, and how AI-generated visuals are labelled.
- This file assumes the image is authentic and asks only whether the processing
  or assembly misrepresents it.
- A request that needs a different image, a cleaner specimen, or a missing panel
  is not a processing request. Route it to `academic-visual-evidence` (schematic
  or labelled illustration) or back to the experiment.

## The Three-Question Test

Apply to every operation, before it is applied:

1. **Global?** Does it act on the whole image with one rule?
2. **Equal?** Is the same operation applied to every compared panel?
3. **Disclosed?** Can the reader learn what was done, from methods or caption?

Any "no" stops the operation. An operation that is global and equal but
undisclosed is still a problem; an operation that is disclosed but selective is
still manipulation.

## Red Lines

| Action | Why it is misconduct | Common disguise |
|---|---|---|
| Reusing a band, field, or panel for another condition | fabricates an independent observation | "representative image", "similar result" |
| Splicing regions within one panel | invents a specimen that never existed | "cleaned background", "removed artefact" |
| Selective erasure, cloning, or healing | removes contradicting evidence | "removed debris", "cosmetic cleanup" |
| Moving or duplicating an object | changes the spatial claim | "repositioned for layout" |
| Per-region contrast or gamma | manufactures or hides signal | "enhanced the region of interest" |
| Asymmetric background subtraction | changes relative intensities | "corrected uneven illumination" |
| Replacing or intensifying a band | fabricates a measurement | "re-exposed the blot" |
| Cropping out a lane, field, or replicate | hides a failed or contradictory result | "cropped to the relevant part" |
| Relabelling one image as another condition | fabricates the comparison | "the labels got swapped" |
| Fabricated or uncalibrated scale bar | falsifies size and magnification | "the bar was already on the image" |
| Generative fill or AI object removal | invents pixels presented as observation | "AI cleanup", "restoration" |
| Selective denoising of a region | suppresses noise where it would be noticed | "noise reduction" |

Any of these becomes misconduct when it is not a labelling accident and it
supports a claim. Intent is decided by the investigating body, not by the author.

## Over-Adjustment

Over-adjustment is a legitimate global operation pushed far enough to change the
conclusion. It is judged by what the operation does to the evidence, not by
whether it was applied to one region:

- display levels clip a large fraction of pixels at the top or bottom of the
  range, so texture disappears where the claim lives;
- contrast is raised until a noise floor becomes "clean background", erasing the
  variability a reader needs to judge signal;
- faint bands, puncta, or edges are made visible by an extreme tone curve that is
  not reported, so the figure implies contrast the acquisition did not have;
- settings are tuned panel by panel until a difference appears that the raw data
  does not show;
- the same settings applied to the control produce features the control does not
  have, which means the settings, not the biology, are generating structure.

Test: apply the identical settings to the comparator and to a negative control.
If either develops new structure, the adjustment is too strong. Show the raw
image alongside, or reduce the adjustment until the control stays flat.

## Grey-Zone Verdicts

| Operation | Verdict | Required condition |
|---|---|---|
| Crop an empty border | allowed | no data, label, or scale bar is removed |
| Crop to a representative field | allowed | selection rule stated; full field available on request |
| Rotate 180° | allowed | orientation is not part of the claim; disclose |
| Global brightness/contrast on every panel | allowed | same parameters; disclosed |
| Gamma correction on every panel | conditional | value reported; no quantitative intensity claim |
| Deconvolution / denoising | conditional | algorithm and parameters reported; applied to all groups |
| Stitching adjacent fields | conditional | overlap and blending stated; boundaries visible |
| Maximum-intensity projection | conditional | z-range stated; not used for z-separation claims |
| Normalisation to a control | conditional | identical operation on every group; disclosed |
| Equalising panel brightness to hide exposure differences | prohibited | it erases an acquisition difference the reader needs |
| Removing "unrepresentative" debris or cells | prohibited | it removes evidence rather than presenting it |
| Changing LUT mid-figure | prohibited | it changes what colour means between panels |
| Upscaling to match another panel's size | conditional | labelled as computational; no resolution claim |

## Adjudication Procedure

For a suspected problem in your own or a colleague's figure:

1. Preserve the raw file and every intermediate; do not overwrite or "fix"
   anything before the record is secured.
2. Reconstruct the operation list from the processing register, or from file
   metadata and edit history if no register exists.
3. Compare raw and final at identical display settings, side by side, at 1:1
   pixels.
4. Measure rather than assert: intensity line profiles across a suspected seam,
   noise correlation between regions that should be independent, histogram
   clipping, and object-size distributions.
5. Ask whether the figure's conclusion survives when the suspect operation is
   undone. If it does not, the claim, not the image, is the problem.
6. Escalate through the institution's research-integrity process. Do not post a
   public accusation or contact the journal before the internal record exists.

## Signals That Prompt Inspection

These are reasons to look, not proof of misconduct:

- a straight, abrupt intensity boundary inside a panel;
- repeated noise or speckle patterns in regions described as different fields;
- background gradients that change direction between adjacent panels;
- halos, smudged areas, or texture mismatch around an object;
- clipped highlights or crushed shadows used to support a difference;
- an implausibly uniform background for the stated modality;
- a scale bar inconsistent with the stated magnification or pixel size;
- metadata dimensions that do not match the published crop.

## Disclosure Language

Global adjustment only:

> All images were processed with [software, version]. Brightness and contrast
> were adjusted globally with identical settings across all panels; no
> selective or local adjustments were made.

With conditional processing:

> Images were processed with [software, version]. [Operation] was applied to all
> panels using [algorithm and parameters]. Global brightness and contrast were
> then adjusted identically. Raw images are available on request.

Composite figure:

> Panels A–C are separate acquisitions; boundaries are indicated by
> [rule/whitespace]. Scale bars, [length] µm, calibrated from the acquisition
> pixel size.

## Reporting And Escalation

- Correction, expression of concern, and retraction are decisions for the editor
  and the institution, not for the person who spotted the problem.
- Preserve evidence and keep the communication factual: what was done, what the
  record shows, what remains unexplained.
- Do not ask an author to "just re-export" a figure that was manipulated; a
  re-export without the raw file does not resolve the integrity question.

## Audit Checklist

- [ ] Three-question test passed for every operation in the figure.
- [ ] No red-line action present, or a documented explanation exists.
- [ ] Processing register matches the disclosure text.
- [ ] Raw files intact and independently archived.
- [ ] No duplicated regions across panels or figures.
- [ ] Scale bars and magnifications verified against metadata.
- [ ] The conclusion survives when every cosmetic operation is removed.
