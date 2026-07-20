---
name: chemistry-experimental-design
description: Use to design chemistry experiments around identity, purity, units, controls, calibration, mass balance, analytical validation, uncertainty, and approved safety boundaries; not for executable protocols or hazardous operational optimization.
skill_class: guard
load_policy: conditional
risk_tags: [biosafety, controlled-data, privileged]
---

# Chemistry Experimental Design

Design a chemical reaction or measurement study so material identity, comparison,
independent unit, analytical evidence, uncertainty, and safety boundaries are explicit
before work begins. This skill produces a design plan, not an executable protocol.

## Intake

Establish:

- The chemical question, competing hypotheses, intended decision, and claim scope.
- Whether the study concerns synthesis, transformation, equilibrium, stability,
  separation, formulation, characterization, or quantitative measurement.
- Target analyte, product, reactants, matrix, expected species, and relevant impurities.
- Available material amounts, instruments, reference materials, batches, operators,
  facilities, approved SOPs, and scheduling constraints.
- Data classification, intellectual-property restrictions, and authorized recipients.
- Applicable chemical, biological, radiation, environmental, and waste approvals.

If biological organisms, tissues, cells, or biological responses define the study
units or endpoints, route the design to `biological-experimental-design` and the
analysis plan to `biological-study-statistics`. Route authorized bench logistics and
SOP verification to `wet-lab-experiment-planning`.

## Define Identity And Quality

Define the identity required for every input, intermediate class, product, standard,
and critical impurity. Record the evidence that will establish or challenge identity,
such as orthogonal spectral, chromatographic, elemental, physical, or reference
comparisons, without prescribing operational steps.

For each material specify:

- Unambiguous name or structure, identifier, source, lot, and storage status.
- Purity basis, assay basis, water or solvent content, stabilization, and uncertainty.
- Acceptance criteria and the evidence needed before inclusion in the study.
- Known or plausible impurities, interferents, degradation products, and matrix effects.
- Chain of custody and disposition rules for controlled or proprietary material.

Do not treat supplier labels, nominal concentration, or a single non-specific signal
as sufficient identity or purity evidence when the intended claim requires more.

## Define Units And Replication

Name the independent unit appropriate to the question:

- **Reaction unit**: an independently prepared reaction instance assigned to conditions.
- **Preparation unit**: an independently prepared solution, mixture, or specimen.
- **Measurement unit**: the material portion or physical item presented for measurement.
- **Injection or readout**: a repeated instrumental observation from one measurement unit.
- **Analysis unit**: the unit represented as independent in the statistical model.

State replication at every level. Repeated injections, scans, or aliquot readings
estimate measurement repeatability but do not replace independent reaction or
preparation units. Document pooling, splitting, subsampling, and nested dependence.

## Comparisons, Controls, And Standards

Construct a condition matrix linking each comparison to its diagnostic controls:

- Reagent, solvent, matrix, vessel, process, and instrument blanks as applicable.
- Negative or omission controls that test whether the claimed change requires a factor.
- Positive or system-suitability controls that demonstrate detectable performance.
- Matrix-matched, spike, recovery, dilution, or interference controls where relevant.
- Certified or otherwise qualified reference materials and independent check standards.
- Stability and carryover controls when time or measurement order could affect results.

State what each control diagnoses, its acceptance rule, and how failure changes the
claim. Do not use one shared control as though it were independently replicated.

## Calibration And Measurement Model

Define the measurand, response, units, reportable range, and relationship between the
instrument response and the chemical quantity. Plan calibration with traceable
standards appropriate to the matrix and claim.

Specify:

- Calibration model, range, spacing, replication, weighting rationale, and blank use.
- Independent verification or check-standard placement across runs.
- Rules for extrapolation, saturation, censoring, carryover, and below-range values.
- Instrument qualification, system suitability, drift checks, and recalibration triggers.
- How standard preparation, purity assignment, volumetric operations, and response
  variability enter the uncertainty estimate.

Do not select a calibration model from fit statistics alone. Assess residual structure,
range adequacy, influential standards, matrix mismatch, and prediction performance.

## Stoichiometry And Mass Balance

Express planned composition on a declared basis, including purity-corrected amount,
concentration, equivalents, limiting component, charge balance, and material source.
Keep theoretical, charged, recovered, measured, and inferred quantities distinct.

Create a mass-balance or elemental-balance framework that accounts for target product,
unreacted material, identified byproducts, sampled material, transfers, retained
material, and unresolved loss. Define acceptable closure and investigation rules.
Never infer selectivity, conversion, or yield from a single signal without validating
response factors and accounting for relevant material paths.

## Design Factors And Allocation

Treat temperature, time, atmosphere class, composition, concentration, mixing regime,
light exposure, and other scientifically justified conditions as design factors, not
as instructions for operation. Define factor levels only within approved SOP, equipment,
and hazard-review boundaries.

- Identify primary factors, nuisance factors, interactions, and scientifically useful
  contrasts before data collection.
- Randomize or balance condition order where feasible and preserve the allocation record.
- Block on batch, lot, day, operator, instrument, column, detector, or calibration event.
- Avoid confounding a condition with a single material lot, run, instrument, or position.
- Define stopping or review points for unexpected pressure, heat, gas, instability,
  incompatibility, decomposition, exposure, or control failure without improvising a fix.

Do not optimize hazardous temperature, pressure, atmosphere, scale, concentration,
energy input, reactivity, toxicity, or concealment. Escalate such questions to the
responsible chemical safety authority and current institutional procedures.

## Analytical Validation

Match validation depth to whether the method is exploratory, comparative, release,
regulated, or intended for transfer. Predefine applicable characteristics:

- Specificity or selectivity, identity discrimination, and interference testing.
- Accuracy or recovery, precision, repeatability, intermediate precision, and robustness.
- Calibration range, sensitivity, detection and quantitation capability, and carryover.
- Sample, standard, and processed-material stability over the intended observation window.
- Cross-instrument, cross-operator, cross-lot, or cross-site comparability where claimed.

Separate method development data from confirmatory validation when practical. Define
acceptance criteria before evaluating the confirmatory data and document deviations.

## Uncertainty And Analysis Plan

Create an uncertainty budget covering sampling, identity and purity assignment, mass
or volume, standard preparation, calibration, recovery, repeatability, intermediate
precision, drift, environmental effects, and model choice as relevant. Distinguish
systematic effects from random variation and state how covariance is handled.

Predefine primary quantities, contrasts, exclusions, transformations, outlier handling,
missing or censored values, model checks, sensitivity analyses, and reporting precision.
Report estimates with uncertainty and units, not only pass/fail labels or p-values.
For biological matrices, biological replication, or biological outcomes, route the
inferential analysis to `biological-study-statistics`.

## Artifacts

Deliver:

- A design synopsis linking question, hypothesis, chemical claim, and decision.
- Material identity, purity, lot, provenance, and acceptance table.
- Reaction, preparation, measurement, and analysis-unit hierarchy.
- Condition, factor, control, blank, standard, and allocation matrix.
- Calibration and system-suitability plan with failure consequences.
- Stoichiometry, material-accounting, and mass-balance framework.
- Analytical validation matrix and prespecified acceptance criteria.
- Uncertainty budget, analysis specification, and reporting shell.
- Approval, hazard-boundary, waste-stream, deviation, and escalation register.

## Non-Goals And Safety

- Do not provide an executable synthesis, assay, sample-preparation, or instrument protocol.
- Do not optimize hazardous reactions, energetic conditions, toxic products, scale-up,
  pressure, atmosphere, purification, concealment, or defeat of safety controls.
- Do not invent operating parameters when an approved SOP or qualified method is required.
- Do not claim that statistical evidence substitutes for identity, purity, calibration,
  analytical validity, chemical safety review, or regulatory authorization.
- Do not expose controlled formulations, proprietary structures, facility details, or
  restricted analytical data beyond approved systems and recipients.
- Do not improvise disposal, neutralization, deactivation, spill response, or waste mixing.

## Completion Criteria

Complete only when chemical identity and purity evidence are defined; independent units
and replication are explicit; controls, blanks, standards, calibration, and validation
address the intended claim; stoichiometry and mass balance are auditable; temperature,
time, atmosphere, batch, lot, instrument, and order effects are handled as design factors;
uncertainty and analysis are prespecified; and chemical safety approvals, SOP boundaries,
waste routes, stopping rules, and escalation owners are documented.
