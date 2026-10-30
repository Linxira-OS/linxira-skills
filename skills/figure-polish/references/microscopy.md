# Microscopy Processing Compliance

Checklist for micrographs used as evidence in a paper, thesis, or report. It
operationalises the rules in [../SKILL.md](../SKILL.md): global operations only,
identical across the compared set, recorded, disclosed. Integrity judgements are
in [ethics.md](ethics.md).

## 1. Archive And Metadata

- Treat the acquisition file as the primary record: read-only, checksummed, and
  backed up off the analysis machine before any processing.
- Record per image: modality, instrument, objective and NA, nominal
  magnification, pixel size (µm/px), binning, exposure, gain, illumination and
  filter settings, z-step and z-range, frame count, detector mode, date,
  operator, sample and field identifier.
- Pixel size is mandatory for scale bars and any spatial measurement. Without
  it, the image can be illustrative but not quantitative.
- Keep the acquisition settings for every group; a group acquired differently is
  a design fact, not a post-processing problem.

## 2. Classify The Use Before Processing

Decide, and write down, whether the image is:

- **Qualitative illustration** — shows morphology, localisation, or a
  representative phenotype.
- **Quantitative evidence** — supports a measured intensity, count, area,
  colocalisation, or spatial statistic.

Quantitative use requires a pipeline fixed before group labels are visible:
threshold method, ROI rule, object-size limits, and the unit of replication. A
pipeline chosen after seeing the result is a result-shaped pipeline.

## 3. Processing Register

One append-only table per figure. One row per transformation, in execution order.

| # | Operation | Software + version | Parameters | Scope | Rationale | Output file |
|---|---|---|---|---|---|---|
| 1 | Flat-field correction | name, version | reference image, method | all panels | remove uneven illumination | `panelA_ff.tif` |
| 2 | Gaussian denoise | name, version | σ = 1 px | all panels | camera noise | `panelA_dn.tif` |
| 3 | Global brightness/contrast | name, version | min/max display levels | all panels | visibility only | `panelA_final.tif` |
| 4 | Crop | name, version | x0, y0, w, h | panel A | remove empty border | `panelA_crop.tif` |

Rules:

- Record parameter values, not "default" or "auto".
- Record the scope as whole image, group, panel, or ROI; anything narrower than
  whole image needs a justification strong enough to survive review.
- Keep intermediates for steps that affect quantitation.
- The register is the source for the methods paragraph; if they disagree, the
  figure is not ready.

## 4. Group-Consistent Processing

- Batch every group through one macro or script, in one session, with one
  parameter set.
- Keep the same order for every panel: calibration, flat field, denoise, global
  tone, crop, assembly, export.
- Keep the same LUT and display window across the compared set; re-windowing one
  panel changes its apparent intensity.
- If one group is invisible without a different treatment, that is a signal to
  re-acquire, to show raw and processed side by side, or to report acquisition
  differences — not to treat that panel differently in silence.
- Normalisation to a control is allowed only when the identical operation is
  applied to every group and stated.

## 5. Prohibited Operations

These change the evidence rather than its visibility:

- erasing debris, cells, processes, or background objects;
- cloning, healing, painting, or patching any region;
- moving or duplicating an object;
- selective brightness, contrast, or gamma on part of an image;
- merging adjacent fields into one panel without drawing the boundary;
- reusing one representative field for several conditions or time points;
- adding, removing, or rescaling a scale bar without recalibrating it;
- cropping out a field, lane, or replicate that weakens the claim;
- flipping one panel but not its comparator when orientation is part of the
  claim;
- generative inpainting, object removal, or AI restoration.

## 6. Conditional Operations

Allowed when applied to the whole set and disclosed with parameters.

| Operation | Must report | Main risk |
|---|---|---|
| Deconvolution | algorithm, PSF model, iterations | creates punctate structure that was not resolved |
| Denoising | method, strength, channel | removes small real objects along with noise |
| Background subtraction | method and radius/window | changes relative intensities and ratios |
| Stitching | overlap, blending mode, grid | duplicated or missing regions at seams |
| Projection (max/min) | z-range and mode | max projection hides z-separation |
| Gamma / tone curve | gamma value, global | nonlinearity makes intensity comparisons invalid |
| Spectral unmixing | method, reference spectra | residual bleed-through between channels |
| Resampling | factor and kernel | invents pixels; never present as resolution |

## 7. Quantitative Image Analysis

- Fix the threshold method and report it; apply the same method to every image.
  Manual per-image thresholding is a researcher-degree-of-freedom problem.
- Define ROIs before seeing the groups, or select them blinded; report the
  selection rule and any exclusion.
- Quantify at the acquired bit depth; check histograms for clipping at the top
  or bottom of the range before measuring.
- Define background sampling identically for every image.
- Object counting: state minimum size, splitting rule, and edge exclusion.
- State the unit of replication — cell, field, organoid, animal, or donor — and
  do not let fields from one animal masquerade as independent replicates.
- Keep the measurement table, ROIs, and analysis script with the figure.

## 8. Scale Bars And Assembly

Scale bar length in pixels:

```text
length_px = physical_length_µm / pixel_size_µm_per_px
```

Cropping changes the field of view but not the pixel size, so the bar length in
pixels is unchanged; redraw it on the new canvas. Resizing does change the pixel
size:

```text
pixel_size_new = pixel_size_old × (original_width_px / final_width_px)
```

Recalculate the bar after every resize; a bar copied along with the image is
decoration, not calibration.

- Panels compared at the same magnification share one bar; a panel shown at a
  different magnification needs its own.
- Composite panels: label each field, draw the joins, and state that they are
  separate acquisitions.
- Keep channel-to-colour assignment and LUT identical across panels.
- Keep panel labels, fonts, and gutters constant; alignment is part of the
  evidence, not typesetting preference.

## 9. Disclosure Template

> Images were acquired on [modality] with a [objective]/[NA] objective at
> [pixel size] µm/pixel. Processing used [software and version]; [operations]
> were applied identically to all panels. [Deconvolution/denoising] used
> [algorithm and parameters]. No selective adjustments were made. Scale bars,
> [length] µm. Panels [X] and [Y] are separate fields and are separated by
> [boundary style].

## 10. Pre-Submission Checklist

- [ ] Raw files archived, read-only, and checksummed.
- [ ] Register complete and consistent with the methods text.
- [ ] Every compared panel processed with the same operations and parameters.
- [ ] No selective edit, clone, erase, or relocation anywhere in the figure.
- [ ] Scale bars recalculated after the final crop and resize.
- [ ] LUT, window, and channel assignment consistent across the figure.
- [ ] Quantitative pipeline fixed before unblinding and applied to all images.
- [ ] Saturation checked in every channel used for measurement.
- [ ] Composite fields labelled and boundaries visible.
- [ ] Resolution and format meet the venue requirement.

## 11. Failure Modes

| Symptom | Likely cause | Action |
|---|---|---|
| Identical noise pattern in two "different" fields | duplicated or copied region | compare raw files; replace the panel |
| Perfectly straight intensity discontinuity | splice or composite without boundary | mark the boundary or remove the composite claim |
| Uniformly flat background with unnaturally sharp object edges | selective erasure or paint | restore from raw |
| One panel much brighter with different noise texture | per-panel adjustment | reprocess the whole set |
| Scale bar inconsistent with stated magnification | bar not recalibrated after resize | recompute from pixel size |
| Clipped highlights in the measured channel | over-exposure or display clipping | re-measure unsaturated images |
| Puncta visible only after deconvolution | algorithm-created structure | show raw alongside, report parameters |
| Denoised panel loses small objects | filter strength too high | reduce strength, reapply to all groups |
