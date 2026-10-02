# Physics Figure Patterns

Reference for physics/condensed-matter/materials paper figures: band
structures, spectroscopy, field maps, and critical behavior. Follows the
shared conventions in [../SKILL.md](../SKILL.md).

## Figure Type Index (图型清单)

| Type | Use for |
|---|---|
| Band structure / dispersion (能带/色散关系) | electronic or phonon eigenvalues along high-symmetry paths |
| XRD/XAS/PL spectra (谱学数据) | crystal structure, local bonding, optical emission |
| Field distribution (场分布) | spatial maps: E/B fields, STM/AFM topography, wavefunctions |
| Phase-transition / critical behavior (相变/临界行为) | order parameter, scaling collapse, critical exponents |

## Data Preparation

- Band structure: plot along a stated high-symmetry path (e.g. Γ–X–M–Γ); mark
  path points as vertical dashed lines with k-path labels; state the method
  (DFT functional, SOC on/off) in the caption.
- XRD: convert to a common scale (normalized intensity or per-unit-area),
  subtract background only if stated; index peaks with (hkl) labels.
- XAS: normalize to edge jump; state whether μ(E) is raw or flattened; show
  the pre-edge region if it carries the claim.
- PL: state excitation wavelength and power; normalize only when comparing
  shapes, not intensities.
- Critical behavior: raw data (order parameter vs T) plus the scaling collapse
  (log-log rescaled) as separate panels; the collapse alone is not evidence.

## Visual Encoding

- Band structure: Fermi level as a horizontal line at E = 0 with explicit
  label; color bands by orbital character only with a legend mapping color →
  orbital; keep the energy window tight around the claim.
- Spectra: stacked traces offset vertically with "offset for clarity"
  annotation; experimental points as lines/markers, calculated reference as
  solid smooth line in a distinguishable (usually black) color; shade regions
  of interest once, not everywhere.
- Field maps: diverging colormap centered at zero for signed fields; sequential
  for magnitude; always draw the colorbar with units; add a scale bar for real
  space or reciprocal-space axis ticks for k-space.
- Phase transitions: markers = data, line = model/fit; mark T_c (or the
  transition temperature) with a vertical line and label; error bars on
  extracted exponents.

## Uncertainty & Statistical Annotation

- Exponents and transition temperatures: report fit value ± CI and the fitting
  window; a scaling collapse must state which exponents were used and their
  uncertainty.
- Spectra: quote instrumental resolution (eV, cm⁻¹, Å) in the caption; energy
  calibration reference stated.
- Field/position maps: state scan step, noise floor, or topographic setpoint
  where it affects interpretation.
- Averaged traces: show the mean with a spread band across repeated
  measurements, and one representative raw trace alongside.

## Common Reviewer Objections

- "Is the gap real or a broadening artifact?" → state resolution, broadening,
  and k-path sampling density.
- "Peaks unindexed / background arbitrary" → index all claimed peaks; show
  raw + background-subtracted versions.
- "Scaling collapse forced by floating exponents" → fix exponents from fits,
  show sensitivity of the collapse to them.
- "Intensity comparison across panels invalid" → only compare intensities
  with identical normalization and acquisition settings.
- "Simulation vs experiment not distinguished" → visually separate
  calculated (lines) from measured (points/shading) in every panel.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [biology.md](biology.md) · [chemistry.md](chemistry.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (physics reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/physics.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
