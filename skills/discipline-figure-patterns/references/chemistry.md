# Chemistry Figure Patterns

Reference for chemistry paper figures: spectra, phase diagrams, titration and
kinetics, and reaction schematics. Follows the shared conventions in
[../SKILL.md](../SKILL.md).

## Figure Type Index (图型清单)

| Type | Use for |
|---|---|
| NMR/IR/MS spectra (谱图呈现) | structural identity, purity, composition |
| Phase diagram (相图) | stable phases as a function of T, P, composition |
| Titration curve (滴定曲线) | equivalence points, pKa determination |
| Kinetics curve (动力学曲线) | rate laws, activation parameters |
| Reaction schematic (反应示意) | transformation, mechanism, selectivity |

## Data Preparation

- Spectra: plot raw (not baseline-corrected) unless correction is the point;
  if corrected, state the algorithm. Keep the full chemical-shift or
  wavenumber window including solvent peaks.
- NMR: annotate every claimed assignment (δ in ppm, multiplicity, integration);
  keep the integral trace for quantitative claims.
- MS: state ionization mode, m/z range, and which species each labeled peak is
  ([M+H]⁺, fragments, adducts).
- Kinetics: plot the quantity the rate law predicts (ln concentration, 1/[A])
  for linearized fits, but keep a raw-concentration panel as evidence.
- Titration: record pH vs volume of titrant at constant temperature and ionic
  strength; state both.

## Visual Encoding

- Spectra orientation follows field convention: NMR and IR typically drawn with
  the x-axis decreasing (ppm left→right high-to-low; wavenumber right→left).
  Stacked/offset spectra get explicit "+offset" or "×N" annotations; the
  y-axis of an offset stack is arbitrary — say so.
- Phase diagrams: one axis per intensive variable; label single-phase regions
  by name, two-phase regions by tie lines; phase-boundary lines solid,
  extrapolated boundaries dashed.
- Titration/kinetics: markers for measured points, continuous line only for
  the model fit; the fit line never passes exactly through noise-free data
  claims without residuals.
- Reaction schematics: use a structure editor (ChemDraw-class), not freehand;
  conditions above the arrow, yields below; color-highlight only the bond or
  atom under discussion; label the figure "schematic" if not drawn to scale.

## Uncertainty & Statistical Annotation

- Kinetics: report rate constants with confidence intervals and R² (or better,
  residual plots) for linearized fits; n ≥ 3 replicates per condition.
- pKa/titration: give the fit-derived value ± CI, and the model used
  (Henderson–Hasselbalch, multi-site).
- Quantitative NMR: state internal standard, relaxation delay, and purity ±
  propagated uncertainty.
- Spectra used as identity proof: include the reference spectrum or literature
  values in the caption.

## Common Reviewer Objections

- "Where is the raw spectrum?" → supplementary raw data for every processed
  spectrum; state any smoothing.
- "Peaks overlap / assignment ambiguous" → include 2D (COSY/HSQC) or
  high-resolution MS evidence for key assignments.
- "Is the yield isolated or NMR-based?" → label yield type on the scheme.
- "Linearized fit hides curvature" → show residuals or a nonlinear global fit.
- "Phase boundaries measured or calculated?" → distinguish experimental points
  (markers) from computed phase diagrams (lines/shading) visually.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [biology.md](biology.md) · [physics.md](physics.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (chemistry reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/chemistry.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
