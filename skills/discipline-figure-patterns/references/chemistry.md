# Chemistry Figure Patterns

Reference for chemistry paper figures: spectroscopy series, phase behavior,
titration and kinetics, electrochemistry, and reaction schematics. Follows the
shared conventions in [../SKILL.md](../SKILL.md).

Guiding rule: state the sample state (gas/solution/solid), the temperature, and
the reference standard before plotting. A spectrum is evidence only when the
acquisition conditions are on the figure; a phase boundary is evidence only when
you say whether it was measured or computed.

## Figure Type Index (图型清单)

| Type | Use for | Axis driver |
|---|---|---|
| 1D NMR spectrum (一维核磁谱) | identity, purity, integration | δ ppm, convention high→low |
| 2D NMR map (二维核磁：COSY/HSQC/HMBC) | connectivity and assignment | two ppm axes |
| IR / Raman spectrum (红外/拉曼谱) | functional groups, lattice vibrations | wavenumber, high→low |
| UV-Vis absorption/emission (紫外可见吸收/发射) | electronic transitions, band gap, kinetics via absorbance | wavelength or energy |
| Mass spectrum (质谱) | molecular mass, fragments, isotope pattern | m/z |
| Powder XRD (粉末 XRD) | phase identity, crystallinity, lattice parameters | 2θ |
| CD spectrum (圆二色谱) | secondary structure, chirality | wavelength |
| Cyclic voltammogram (循环伏安) | redox potentials, reversibility | potential, with current sign noted |
| Reaction coordinate / energy profile (反应坐标/能量图) | barriers, intermediates, selectivity origin | reaction coordinate, not a physical axis |
| Phase diagram (相图: T–x, ternary) | stable phases vs. T, P, composition | intensive variables |
| Titration curve (滴定曲线) | equivalence points, pKa | titrant volume at fixed T, ionic strength |
| Kinetics curve (动力学曲线) | rate law, activation parameters | time |
| Reaction schematic / mechanism (反应示意/机理) | transformation, selectivity | none — layout only |

## Figure Selection Quick Table (图型选择速查表)

| Data shape you have | Recommended | Forbidden / misleading |
|---|---|---|
| Chemical shifts + integrals for one compound | 1D NMR with assignment labels | peak-picking in place of assignment |
| Two coupled frequencies | 2D NMR contour map | a 1D stack pretending to be 2D |
| Absorbance vs. wavelength for several samples | overlaid spectra, stated path length | normalizing a concentration claim to peak height without units |
| m/z + intensities, monoisotopic known | annotated MS with species labels | unlabeled base peak |
| Diffraction angles + intensities | index peaks with (hkl) | smoothing that erases peak shape |
| ΔG/ΔG‡ along a path | energy profile with computed/measured distinction | profile presented as measured data |
| T–x experiment or calculation | markers = data, lines = model | computed and measured boundaries drawn identically |
| pH vs. titrant volume | fit with model stated + raw points | curve drawn through noise-free "data" |
| Concentration vs. time | raw concentration panel; linearized fit separately | showing only the linearized transform |
| Conversion + selectivity per catalyst | paired axes or two aligned panels | volcano plot built from fewer than a systematic series |

## Data Preparation

- Spectra: plot raw (not baseline-corrected) unless the correction is the point;
  if corrected, state the algorithm and window. Keep the full chemical-shift or
  wavenumber range including solvent and reference peaks.
- NMR: annotate every claimed assignment (δ in ppm, multiplicity, J in Hz,
  integration); keep the integral trace for quantitative claims, and state the
  relaxation delay and internal standard when integrals carry the claim.
- 2D NMR: crop the region you discuss but show the full map in the supplement.
- IR/Raman: state sampling mode (ATR, KBr, transmission) and baseline handling.
- MS: state ionization mode, m/z range, and which species each labeled peak is
  ([M+H]⁺, fragment, adduct); report resolution.
- UV-Vis/CD: state solvent, concentration, path length, and temperature; the
  solvent cutoff limits the usable range.
- Electrochemistry: state reference electrode, scan rate, electrolyte, and
  whether potentials were iR-corrected.
- Kinetics: keep the raw concentration-time panel; only then show the linearized
  transform (ln c, 1/[A]) the rate law predicts.
- Titration: record pH vs. titrant volume at constant temperature and ionic
  strength and state both.
- Phase diagrams: label measured boundary points separately from interpolated
  or computed boundaries.

## Visual Encoding

- Spectra orientation follows convention: NMR and IR drawn with the x-axis
  decreasing (ppm high→low; wavenumber high→low). Offset stacks get explicit
  "+offset" or "×N" annotations and a note that the offset y-scale is arbitrary.
- Emission/absorption pairs: same wavelength window, absorption below emission,
  and a stated excitation wavelength.
- MS: stick/centroid representation, isotope clusters labeled; zoom insets quoted
  against the parent mass.
- XRD: normalized intensity, indexed peaks, and a reference stick pattern aligned
  below rather than overlaid in the same color.
- Cyclic voltammogram: IUPAC convention (oxidation up or down) stated once;
  multiple scan rates as stacked traces with the rate labeled, not a rainbow.
- Phase diagrams: one axis per intensive variable; single-phase regions named,
  two-phase regions with tie lines; measured boundaries solid, extrapolated
  dashed.
- Energy profiles: zero-energy baseline defined, transition states marked with ‡,
  computed levels in one style, measured barriers called out separately.
- Titration/kinetics: markers for measured points, continuous line only for the
  model fit; show residuals when the fit carries the claim.
- Reaction schematics: use a structure editor (ChemDraw-class), not freehand;
  conditions above the arrow, yields below; highlight only the bond or atom under
  discussion; label "schematic" when not to scale.

## Uncertainty & Statistical Annotation

- Kinetics: report rate constants with confidence intervals and R² (better,
  residual plots) for linearized fits; n ≥ 3 replicates per condition.
- pKa/titration: give the fit-derived value ± CI and the model used
  (Henderson–Hasselbalch, multi-site).
- Quantitative NMR: state internal standard, relaxation delay, and purity ±
  propagated uncertainty.
- Catalysis: report conversions/yields with the analysis method (GC, HPLC, NMR)
  and the number of runs; selectivity denominators stated.
- Phase boundaries: give the uncertainty of transition temperature/composition
  per point, not only for the fit.
- Spectra used as identity proof: include the reference spectrum or literature
  values in the caption or supplement.

## Common Reviewer Objections

- "Where is the raw spectrum?" → provide the raw data for every processed
  spectrum; state any smoothing window.
- "Peaks overlap / assignment ambiguous" → add 2D NMR or high-resolution MS
  evidence for key assignments.
- "Is the yield isolated or NMR-based?" → label the yield type on the scheme and
  in the table.
- "Linearized fit hides curvature" → show residuals or a nonlinear global fit.
- "Phase boundaries measured or calculated?" → markers vs. lines, per the legend.
- "Volcano/energy diagram over-claims" → state the level of theory, functional,
  and basis; keep the axis physical where possible.
- "Electrochemistry irreproducible" → state reference electrode, scan rate, and
  whether the trace is representative or averaged.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [biology.md](biology.md) · [physics.md](physics.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (chemistry reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/chemistry.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
