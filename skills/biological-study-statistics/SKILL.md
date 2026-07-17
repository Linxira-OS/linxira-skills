---
name: biological-study-statistics
description: Use to specify biological-study estimands, endpoints, power, missingness, multiplicity, models, diagnostics, and sensitivity analyses; not to auto-select tests from data type.
skill_class: guard
load_policy: conditional
risk_tags: [clinical, controlled-data]
---

# Biological Study Statistics

Write the statistical plan from the scientific question and design. Never select a
test automatically from an outcome label, normality test, or software default.

## Intake

Require:

- Scientific question, hypotheses, and intended decision.
- Target population or biological system, sampling process, and intended inference.
- Experimental, observational, and analysis units.
- Assignment, blocking, nesting, clustering, repeated measures, and batches.
- Outcome definitions, measurement properties, timing, and expected censoring.
- Planned exclusions, protocol deviations, and feasibility constraints.
- Prior information supporting transparent design assumptions.

## Define The Estimand

For each primary question state:

- Population or biological units targeted by inference.
- Conditions, interventions, exposures, or strategies compared.
- Endpoint variable and measurement time or summary window.
- Population-level summary and contrast.
- Handling of death, dropout, rescue, nonadherence, or other intercurrent events.
- Effect measure and direction considered beneficial or biologically meaningful.

Distinguish the estimand from the estimator, model coefficient, hypothesis test,
and observed dataset.

## Endpoints And Effect Measures

Designate primary, secondary, exploratory, safety, and process endpoints before
analysis. Define derivation, units, transformation, timing, and meaningful effect.

Choose an effect measure that answers the estimand and report its uncertainty, not
only a p-value. Justify differences, ratios, rates, slopes, or other quantities used.

Do not change endpoints or effect measures after seeing results without labeling
the change as exploratory.

## Model Strategy

Specify a model whose assumptions and design representation fit the question.
Address fixed or random effects, covariance, offsets, nonlinear terms, interactions,
blocking, clustering, nesting, repeated measures, batches, and corrections as relevant.

- State the estimator and uncertainty method.
- Predefine contrasts and reference levels.
- Preserve experimental-unit degrees of freedom.
- Separate confirmatory from exploratory modeling.
- Identify convergence failures and fallback rules in advance.

Do not use preliminary significance tests to choose paired versus unpaired,
parametric versus nonparametric, or adjusted versus unadjusted analyses.

## Power And Sample Size

Document:

- Meaningful effect size and scientific basis.
- Variance, event rate, prevalence, correlation, or dispersion.
- Allocation ratio, clustering, repeated-measure correlation, and attrition.
- Type I error, target power, sidedness, and multiplicity adjustment.
- Number of units at each design level and any finite-resource constraint.
- Method, software, version, seed, and simulation code when used.

Present sensitivity across plausible assumptions. Avoid effect sizes derived only
from small, selected pilot studies; account for uncertainty or shrinkage.

## Missing Data And Deviations

Define prevention, coding, and analysis of missing outcomes and covariates. State
the missingness mechanisms assumed and why they are plausible.

- Never encode missing as zero or silently discard incomplete units.
- Define analysis populations and treatment of exclusions before unblinding.
- If imputing, define predictors, hierarchy, outcome use, pooling, diagnostics,
  and compatibility with the analysis model.
- Plan sensitivity analyses for departures from the primary missingness assumption.

## Multiplicity

Inventory primary endpoints, time points, contrasts, interim looks, subgroups,
models, and repeated experiments. Identify the claim family and control the
appropriate error rate or false discovery rate when confirmatory inference needs it.

Label unadjusted secondary and exploratory findings clearly. Do not treat a
post hoc subgroup or selected time point as confirmatory.

## Diagnostics And Sensitivity

Predefine relevant diagnostics for residual structure, dispersion, influential
units, functional form, variance, covariance, calibration, convergence, and fit.

Diagnostics inform model adequacy; they do not license searching until significance
appears. Plan sensitivity analyses for influential assumptions, exclusions,
transformations, missingness, outliers, batch handling, dependence, and alternative
reasonable estimands. Explain discrepancies rather than selecting the preferred result.

## Artifacts

Deliver an estimand and endpoint table, model and contrast specification, power
assumptions, missing-data and multiplicity plans, diagnostics, sensitivities,
software provenance, and a reporting shell with estimates and uncertainty.

## Non-Goals And Safety

- Do not auto-select tests, guarantee power from speculative inputs, or equate
  nonsignificance with equivalence or no effect.
- Do not remove observations solely to improve model fit or significance.
- Do not provide clinical decisions beyond the approved study context.
- Do not expose controlled or identifiable data in diagnostics or examples.

## Completion Criteria

Complete only when estimands, endpoints, and effect measures are explicit; power
assumptions are traceable and stress-tested; missingness and multiplicity have
prespecified handling; the model respects design dependence; diagnostics and
sensitivity analyses are planned; and confirmatory versus exploratory claims are clear.

## Design Influence

This is a clean-room first-party implementation informed by the planning review
of `Light0305/Light-skills` at revision
`6b44f57d1274eb38a6c79dc29c2d21e5e0a225a9`. No upstream body, script,
template, automatic-test rule, or evidence-grade threshold is copied. The
implementation uses Linxira-native estimand, design-dependence, missingness,
multiplicity, diagnostic, and sensitivity contracts.
