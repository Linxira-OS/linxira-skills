# Physics Figure Patterns

Reference for physics, condensed-matter, and materials paper figures: band
structure, spectroscopy, transport, field maps, and critical behavior. Follows
the shared conventions in [../SKILL.md](../SKILL.md).

Guiding rule: fix the reference frame before plotting — energy zero (Fermi level
or vacuum), k-path, temperature, field direction, and normalization. A curve
whose axes are not fully defined is not evidence, however clean it looks.

## Figure Type Index (图型清单)

| Type | Use for | Axis driver |
|---|---|---|
| Band structure / dispersion (能带/色散) | electronic, phonon, or magnon eigenvalues along a path | E vs. high-symmetry k-path |
| Density of states (态密度) | spectral weight vs. energy | E, aligned to E_F |
| Fermi surface (费米面) | topology in the 2-D/3-D Brillouin zone | k-space slice |
| ARPES intensity map (角分辨光电子谱) | measured dispersion vs. calculation | E vs. k |
| XRD / neutron diffraction (衍射) | structure, lattice, phase fraction | 2θ or Q |
| XAS / XPS / Raman / PL (谱学) | valence, bonding, vibrational, optical response | photon energy or shift |
| Transport vs. temperature (输运: R(T), Hall, MR) | metal/insulator behavior, carrier type, magnetoresistance | T on log or linear |
| Magnetization (磁化: M–H, M–T, hysteresis) | ordering, coercivity, saturation | H or T |
| Field / wavefunction map (场分布: E/B, STM/AFM, ψ² maps) | spatial structure, topography, probability density | real or k space |
| Phase diagram (相图: P–T, H–T, T–x) | boundaries between ordered/unordered phases | two intensive variables |
| Phase transition / critical behavior (相变/临界行为) | order parameter, scaling collapse, exponents | reduced T or scaling variable |

## Figure Selection Quick Table (图型选择速查表)

| Data shape you have | Recommended | Forbidden / misleading |
|---|---|---|
| Eigenvalues along a k-path | band structure + DOS side panel | a band plot with no stated path or E_F |
| Measured vs. computed dispersion | ARPES map with calculation overlaid as lines | blurring the two into one image |
| Lattice/phase identification | indexed diffraction pattern | peak fitting without reported residuals |
| μ(E) or XPS counts | normalized spectrum with edge/level labels | overlaying spectra with different normalization |
| R(T), Hall, MR | log/linear T axis matched to the claim | switching T-axis scale between panels of one comparison |
| M–H loop | full loop with temperature and sweep direction | a single branch presented as the loop |
| STM/AFM or wavefunction map | diverging map for signed fields, sequential for magnitude | colorbar without units; no scale bar |
| P–T or H–T boundaries | markers = data, lines = fit/theory | drawing computed and measured boundaries identically |
| Order parameter vs. T | raw data panel + separate scaling-collapse panel | collapse alone, with floating exponents |
| Critical exponents from fits | value ± CI with fitting window shown | a single exponent from one window, no sensitivity |

## Data Preparation

- Band structure: plot along a stated high-symmetry path (e.g. Γ–X–M–Γ); mark
  path points with vertical dashed lines and k-path labels; state the method
  (DFT functional, SOC on/off, U value) in the caption.
- DOS: use the same energy zero and smearing as the band plot; say the smearing.
- Fermi surface: state the k_z slice and the experimental or computed origin.
- XRD/neutron: convert to a common scale (normalized or per-unit-area), subtract
  background only if stated, and index peaks with (hkl) labels.
- XAS: normalize to the edge jump; state whether μ(E) is raw or flattened; keep
  the pre-edge region when it carries the claim.
- XPS: give the binding-energy reference (C 1s, Fermi edge), the pass energy, and
  the fit components with residuals.
- PL/Raman: state excitation wavelength and power (and polarization for Raman);
  normalize only when comparing shapes, not intensities.
- Transport: state contact geometry, current direction, and whether T is on a
  log axis because of a power law; keep the same axis convention across panels.
- Magnetization: state field-sweep direction, temperature, and demagnetization or
  background correction.
- Critical behavior: keep raw data (order parameter vs. T) and the scaling
  collapse (log-log rescaled) as separate panels; the collapse is not evidence
  by itself.

## Visual Encoding

- Band structure: Fermi level as a horizontal line at E = 0, explicitly labeled;
  color bands by orbital character only with a legend mapping color → orbital;
  keep the energy window tight around the claim.
- Spectra: stacked traces offset vertically with an "offset for clarity" note;
  experimental points as lines/markers, calculated reference as a solid smooth
  line in a distinguishable (usually black) color; shade regions of interest once.
- Transport/magnetization: markers = data, line = model/fit; label the transition
  temperature on the axis, not only in the caption.
- Field maps: diverging colormap centered at zero for signed fields, sequential
  for magnitude; always draw the colorbar with units; add a scale bar for real
  space, or axis ticks for k-space.
- Phase diagrams: name single-phase regions, draw two-phase coexistence with tie
  lines or shading, and distinguish first-order (dashed boundary) from
  continuous transitions.
- Phase transitions: mark T_c with a vertical line and label; error bars on
  extracted exponents; show the fitting range as a shaded span.
- Reciprocal-space figures: label the BZ points and the projection plane.

## Uncertainty & Statistical Annotation

- Exponents and transition temperatures: report the fit value ± CI and the
  fitting window; a scaling collapse must state which exponents were used and
  their uncertainty.
- Spectra: quote instrumental resolution (eV, cm⁻¹, Å) in the caption and state
  the energy calibration reference.
- Field/position maps: state scan step, noise floor, or topographic setpoint
  where it affects interpretation.
- Averaged traces: show the mean with a spread band across repeated measurements,
  and one representative raw trace alongside.
- Transport: state the number of devices/contacts and the measurement
  temperature stability.
- Fits through data: show residuals or a chi-square/weighted residual panel when
  the extracted parameters carry the claim.

## Common Reviewer Objections

- "Is the gap real or a broadening artifact?" → state resolution, broadening,
  and k-path sampling density.
- "Peaks unindexed / background arbitrary" → index all claimed peaks and show
  raw plus background-subtracted versions.
- "Scaling collapse forced by floating exponents" → fix exponents from fits and
  show the collapse's sensitivity to them.
- "Intensity comparison across panels invalid" → compare intensities only with
  identical normalization and acquisition settings.
- "Simulation vs. experiment not distinguished" → visually separate calculated
  (lines) from measured (points/shading) in every panel.
- "T-axis switched to hide a feature" → keep one axis convention per comparison
  and annotate any log scale.
- "Phase diagram mixes sources" → label each dataset's origin and method in the
  legend.

## Navigation

Entry: [../SKILL.md](../SKILL.md). Sibling disciplines:
[cs-ml.md](cs-ml.md) · [biology.md](biology.md) · [chemistry.md](chemistry.md).

## Citation

```text
Linxira OS. Linxira Skills: discipline-figure-patterns (physics reference). Version 0.1.0.
Skill path: skills/discipline-figure-patterns/references/physics.md. GitHub.
https://github.com/Linxira-OS/linxira-skills
```
