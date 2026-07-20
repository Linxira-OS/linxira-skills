---
name: medical-translational-study-design
description: Use to plan human, clinical, and translational studies with estimands, eligibility, endpoints, assignment, blinding, sites, missingness, safety, registration, and reporting; not clinical advice or patient decisions.
skill_class: guard
load_policy: required
risk_tags: [clinical, controlled-data]
---

# Medical Translational Study Design

This skill is for study planning and documentation. It organizes a defensible
question, design, governance plan, and statistical handoff. It does not provide
treatment recommendations, patient-specific decisions, clinical management, or
executable clinical procedures. Study teams, qualified clinicians, ethics bodies,
and applicable regulators retain authority.

## Mandatory Planning Gate

Before turning a concept into a design, require:

- A named study owner, responsible investigator, qualified clinical or domain
  leads, and the intended decision context.
- The study type, target jurisdiction, participating institutions, and applicable
  ethics, regulatory, privacy, and data-governance requirements.
- A feasibility statement covering recruitment, follow-up, outcome ascertainment,
  site capability, data access, and anticipated attrition.
- A distinction between planning assumptions, approved protocol content, and facts
  already supported by evidence.
- A plan for participant protection, consent, privacy, safety oversight, and secure
  handling of controlled or identifiable data.

Stop and escalate when the intended use is a patient decision, treatment choice,
diagnostic interpretation, emergency response, or operational clinical procedure;
when oversight or consent requirements are unclear; or when the proposed design
would expose identifiable or controlled data without an approved path.

## Intake

Capture the following before drafting a protocol shell:

- Medical question, rationale, knowledge gap, hypothesis, and decision that the
  study is intended to inform.
- Target population, setting, care pathway or biological context, and intended
  population of inference.
- Intervention, treatment strategy, exposure, or prognostic factor, described at
  planning level only; comparator or usual-care strategy; and permitted or
  expected co-interventions.
- Study design, recruitment source, observation window, follow-up schedule at a
  high level, and feasibility constraints.
- Candidate outcomes, measurement instruments, timing, ascertainment source,
  clinically or scientifically meaningful differences, and known competing events.
- Unit of assignment, unit of observation, experimental or analysis unit, and any
  participant, household, clinician, site, center, or cluster structure.
- Existing protocol, registry, data dictionary, approvals, amendments, and
  version identifiers.

## Question And Estimand

State the question in a form that can be answered by the proposed design. For each
primary question, define the estimand separately from the estimator, model, and
observed result:

- Population: who or what is included, and the population to which inference is
  intended to apply.
- Treatment or exposure conditions: intervention, exposure, comparator, strategy,
  adherence or treatment-policy interpretation, and relevant co-interventions.
- Variable: the endpoint construct, measurement scale, and time point or summary
  window.
- Intercurrent events: specify how death, discontinuation, rescue, switching,
  nonadherence, competing events, or loss to follow-up are handled.
- Population summary and contrast: define the effect measure, direction, and
  scientifically meaningful threshold, with uncertainty rather than a p-value
  alone.

Do not let a convenient database field, available test, or default model silently
replace the medical question. Label causal, prognostic, predictive, diagnostic,
implementation, and descriptive aims distinctly.

## Eligibility And Sampling

Translate the target population into inclusion and exclusion criteria that are
observable, reproducible, and justified by the question. Check:

- Recruitment source, screening frame, referral or self-selection, and expected
  selection effects.
- Eligibility timing, baseline definition, prior exposure or treatment, disease or
  risk definition, and handling of borderline cases.
- Representation of relevant age, sex, demographic, geographic, socioeconomic,
  comorbidity, and care-context groups without using subgroup labels as a proxy for
  biology or making unsupported exclusion claims.
- Screening logs, non-enrollment reasons, denominator definitions, and consent
  status.
- Generalizability limits created by restrictive eligibility or single-site access.

Do not invent eligibility thresholds or imply that exclusion protects participants
without an ethics and scientific rationale. Keep screening information separate
from enrolled participant data where feasible.

## Endpoints And Measurements

Pre-specify and define:

- Primary endpoint: one clearly operationalized outcome, timing, ascertainment,
  analysis population, effect measure, and meaningful difference.
- Secondary endpoints: ranked or grouped outcomes with their role, timing, and
  interpretation limits.
- Safety endpoints: adverse events, serious adverse events, adverse events of
  special interest, laboratory or physiological signals, withdrawals, and other
  harms relevant to the design.
- Exploratory or translational endpoints: biomarker, mechanistic, implementation,
  imaging, or omics measures, explicitly separated from confirmatory claims.

For each endpoint record unit, scale, source, instrument or coding standard,
assessor, collection window, missing-value code, derivation, and whether it is
participant-level, cluster-level, or repeated. Avoid surrogate substitution unless
the surrogate's role and limitations are explicit. Distinguish efficacy,
effectiveness, feasibility, and safety claims.

## Units And Design Dependence

Name the unit of randomization or exposure assignment, the unit of measurement,
and the unit of analysis. Do not treat repeated observations, specimens, visits,
clinicians, or sites as independent participants.

For cluster or site designs, specify cluster definition, allocation level, expected
cluster size, intracluster dependence, recruitment imbalance, contamination,
correlation over time, and the effect of unequal cluster sizes. Identify participant
nests, repeated measures, families, providers, centers, batches, and other sources
of dependence for the statistical handoff.

## Assignment, Concealment, And Blinding

For randomized studies document the assignment unit, allocation ratio, sequence
generation authority, blocking or stratification rationale, and who can access the
sequence. Distinguish sequence generation from allocation concealment and record
the release point and audit trail.

For any study state whether participants, treating or delivering personnel, outcome
assessors, adjudicators, data managers, and analysts are blinded. Explain what is
feasible, what could reveal assignment, how unblinding is governed and recorded,
and how unavoidable lack of blinding may affect measurement or behavior.

For observational studies define exposure ascertainment, confounder control,
temporal ordering, comparator construction, and risks of immortal-time,
measurement, selection, and time-varying bias. Do not describe an observational
association as a treatment effect without an appropriate causal design and
assumptions.

## Sites And Center Effects

Record site or center eligibility, capability, recruitment role, local standard of
care, training, oversight, data systems, and expected enrollment. Plan how site
initiation, changes in practice, calendar time, operator effects, referral mix,
protocol deviations, and center-by-treatment interactions will be represented.

Do not pool sites by default or conceal material site heterogeneity. Pre-specify
which center effects support adjustment, stratification, blocking, random effects,
or sensitivity analysis, and identify when a site-specific result is only
descriptive because information is sparse.

## Subgroups And Multiplicity

List the subgroup variables, rationale, baseline or pre-treatment status, cutpoints
or categories, interaction or contrast, and minimum information needed. Mark each
subgroup as confirmatory, supportive, or exploratory. Do not infer treatment
recommendations from an isolated subgroup p-value.

Inventory primary and secondary endpoints, time points, contrasts, subgroup tests,
interim looks, safety signals, repeated measures, and model alternatives. Define
the claim family and control the appropriate type I error or false discovery rate
when confirmatory inference requires it. Label unadjusted, post hoc, and data-
driven findings clearly.

## Missingness And Dropout

Define prevention, collection, coding, review, and analysis of missing outcomes,
covariates, visits, specimens, and follow-up. Distinguish administrative censoring,
withdrawal of consent, death, loss to follow-up, treatment discontinuation, and
unavailable measurements.

Prespecify analysis populations, estimand implications, missingness assumptions,
reasons and patterns to summarize, imputation or weighting methods if used,
auxiliary variables, hierarchical structure, diagnostics, and sensitivity analyses
for departures from assumptions. Never encode missing as zero or silently discard
incomplete participants. Do not use observed dropout patterns to rewrite the
primary estimand after unblinding.

## Safety And Stopping Rules

Define safety oversight roles, event definitions and grading conventions, reporting
windows, attribution process, expedited-reporting dependencies, data review cadence,
and escalation contacts at a governance level. Keep operational medical response
instructions in approved institutional materials rather than this skill.

Specify who may recommend pausing, stopping, modifying, or continuing the study;
the evidence and thresholds considered; interim-access controls; multiplicity or
alpha-spending implications where applicable; and documentation of decisions.
Include rules for recruitment pauses, site pauses, data-quality holds, unexpected
harms, protocol deviations, and loss of equipoise. A stopping rule is not a
treatment recommendation and does not replace independent oversight.

## Consent, Privacy, And Data Governance

Map each data flow from collection to analysis, sharing, retention, and destruction.
Record data classification, identifiers and key separation, access roles, approved
systems, encryption or equivalent controls, auditability, transfer restrictions,
backup, retention, breach response, and secondary-use boundaries.

Ensure consent or waiver scope matches recruitment, specimens, linkage, genomic or
biomarker work, recontact, data sharing, and future use. Address participant
withdrawal, re-identification risk, data minimization, vulnerable populations,
language or accessibility needs, and return-of-results governance with the
responsible ethics and privacy authorities. Never include identifiable participant
data in examples, drafts, logs, or generated artifacts.

## Registration, Protocol, And Reporting

Before enrollment or analysis as applicable, identify the responsible registry,
registration status, public identifier, protocol version, statistical analysis plan
version, consent and approval identifiers, and amendment history. Bind every draft
and output to a dated version; preserve changes, rationale, approval state, and
effective date.

Select reporting guidance by design and scope:

- CONSORT for randomized trials, including relevant extensions.
- SPIRIT for trial protocols, including relevant extensions.
- STROBE for observational cohort, case-control, or cross-sectional studies.
- RECORD when routinely collected health data are used, alongside the applicable
  core design guidance.

State applicability and gaps rather than treating a checklist as proof of validity.
Plan transparent reporting of flow, denominators, deviations, missingness, harms,
estimands, uncertainty, protocol amendments, funding, conflicts, data access, and
code or materials availability subject to governance restrictions.

## Statistical Handoff

Deliver a structured handoff to a qualified statistician or analysis lead containing:

- Question, estimand table, design, units, assignment, and dependency structure.
- Eligibility, recruitment, sample-size or precision assumptions, and attrition
  scenarios.
- Endpoint and derived-variable dictionary with timing, units, coding, and source.
- Primary, secondary, safety, subgroup, multiplicity, missingness, censoring, and
  sensitivity requirements.
- Site, center, batch, repeated-measure, and protocol-deviation considerations.
- Analysis-population definitions, unblinding controls, interim governance, and
  reproducibility requirements.

The statistician owns the final analysis methods and should return assumptions,
identifiability limits, feasibility concerns, and requested clarifications before
the protocol or analysis plan is finalized.

## Artifacts

Produce, as appropriate:

- Medical question and decision-context brief.
- Population, intervention or exposure, comparator, and eligibility table.
- Estimand and endpoint matrix with measurement and timing definitions.
- Design-dependence map covering participants, clusters, sites, centers, and visits.
- Assignment, concealment, blinding, site, subgroup, and multiplicity plan.
- Missingness, dropout, safety oversight, and stopping-rule register.
- Consent, privacy, data-flow, access, retention, and governance matrix.
- Registry, protocol, analysis-plan, amendment, and reporting-guidance register.
- Statistical handoff packet, assumptions log, decision log, and versioned protocol
  shell.

## Non-Goals And Safety

- Do not give treatment recommendations, patient-specific advice, diagnostic
  interpretations, or decisions about individual care.
- Do not provide executable clinical procedures, dosing instructions, intervention
  delivery steps, specimen collection protocols, or emergency response scripts.
- Do not claim ethics, regulatory, privacy, statistical, or clinical approval from
  a planning artifact.
- Do not invent eligibility thresholds, endpoints, safety limits, registry records,
  approvals, results, or missing data.
- Do not conceal amendments, unblinding, protocol deviations, adverse events,
  dropout, site effects, multiplicity, or uncertainty.
- Do not expose identifiable, protected, genomic, or otherwise controlled data.
- Do not convert an association, surrogate, subgroup pattern, or statistically
  significant result into a clinical recommendation.

## Completion Criteria

Complete only when the medical question and target population are explicit;
intervention or exposure and comparator are bounded; estimands, units, endpoints,
assignment, concealment, blinding, sites, subgroups, multiplicity, missingness,
safety, consent, privacy, registration, versioning, reporting applicability, and
statistical handoff are documented; artifacts are access-controlled; and no content
crosses into clinical advice or executable procedures.
