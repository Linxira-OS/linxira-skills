# Candidate Repository Registry

This registry records discovery results. Inclusion is not approved until a
repository and its individual skills pass provenance, license, duplication,
quality, and security review.

## Life Sciences And Scientific Research

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `GPTomics/bioSkills` | MIT | 562 current `SKILL.md` files | Enabled source track | Scientific correctness, currency, executable coverage |
| `BioTender-max/awesome-bio-agent-skills` | CC0 index; nested licenses vary | 1,705 current `SKILL.md` files | Indexed source track | Resolve every original source and duplicate before public redistribution |
| `Runchuan-BU/BioClaw` | MIT; based on NanoClaw and STELLA | 51 | Priority review | Bio tools, browser, AlphaFold, containers, remote execution |
| `zongtingwei/Bioclaw_Skills_Hub` | MIT repository; upstream derivation needs finer mapping | 66 | Priority review | Compact omics taxonomy and protein-design workflows |
| `ai4s-research/open-science` | MIT; external packs differ | 7 first-party | Priority reference | Integrity checks, provenance, remote compute, packaging |
| `ai4s-research/ai4s-skills` | Verify independently | 7 referenced | Priority review | Research loop, literature, experiments, writing |
| `K-Dense-AI/scientific-agent-skills` | MIT | 149 | Priority review | Chemistry, medicine, databases, GPU, broad science |
| `google-deepmind/science-skills` | Verify per repository | About 36 reported | Priority review | Grounded databases and model workflows |
| `openai/plugins` life-science plugin | Verify per plugin | About 50 reported | Priority review | Evidence-driven life-science research |
| `anthropics/life-sciences` | Mixed first/third party | Mixed | Priority review | Methods and integration boundaries |
| `mims-harvard/ToolUniverse` | Verify components | 68 reported skills | Priority reference | Scientific APIs, models, and tools |
| `jaechang-hits/SciAgent-Skills` | Verify repository | About 197 reported | Secondary review | Coverage gaps and benchmark claims |
| `HeshamFS/materials-simulation-skills` | Apache-2.0 | 24 | Optional physics reference | HPC, numerical stability, simulation failure triage |

## AI Training And GPU Compute

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `Orchestra-Research/AI-Research-SKILLs` | MIT | 98 | Priority review | PyTorch, distributed training, optimization, MLOps |
| `NVIDIA/skills` | Skills/docs CC-BY-4.0; code Apache-2.0 | 241 | Priority selective review | NVIDIA training, Slurm, medical AI, Kubernetes, GPU workflows |
| `amd/skills` | MIT | About 7 published plus staging | Priority upstream package | Ryzen AI, ROCm diagnosis, Instinct/EPYC inference, profiling |
| `ROCm/rocprofiler-systems-skills` | License requires repository review | 51 | Selective ROCm review | Profiling, AMD SMI, debugging and performance analysis |
| `ROCm/rocm-cli` | MIT | 1 | Priority AMD operations reference | ROCm CLI diagnosis and management |
| `ROCm/omnistat` | MIT | 3 | Priority HPC monitoring reference | AMD GPU job analysis and reporting |
| `amd/Quark` | MIT | 46 | Selective optimization review | PyTorch/ONNX quantization, validation and evaluation |
| `intel/intel-performance-skills` | MIT | 3 | Priority Linux performance package | Linux perf, performance patterns, Phoronix benchmarks |
| `intel/auto-round` | Apache-2.0 | 7 | Selective model optimization review | LLM/VLM quantization and backend adaptation |
| `intel/torch-xpu-ops` | Apache-2.0 | 26 | Selective XPU engineering review | Intel GPU, SYCL, Triton and PyTorch XPU performance |
| `TerminalSkills/skills` | Apache-2.0 | 1,017 | Discovery and selective review | MLflow, W&B, monitoring, operations; high duplication risk |

NVIDIA material can be adapted and redistributed under its dual-license model,
but CC-BY-4.0 skill text requires attribution, source links, license notice, and
modification indication. Apache-2.0 code requires its license and notices. The
catalog mirrors product repositories, so retain each skill's upstream product
source and signature/governance metadata where practical.

AMD's official catalog is MIT and can remain an unmodified upstream package.
It is currently marked Tech Preview, so pin revisions and preserve its
federated-source markers. Intel's generally reusable package is the focused
MIT `intel-performance-skills`; most XPU and quantization skills are tied to
product repository development and should be selected individually.

Initial local review of cloned snapshots:

- `amd/skills` currently exposes a compact, coherent set of six first-class
  skills around local AI routing, AMD Instinct/EPYC serving, and performance
  analysis. The skill quality is relatively high: strong trigger descriptions,
  explicit hardware scopes, concrete prerequisites, and stepwise execution.
  This makes AMD suitable as an unmodified upstream vendor package.
- `amd/skills/serving-llms-on-instinct` is especially strong for vendor-specific
  deployment logic. It includes GPU detection, ROCm validation, recipe caching,
  VRAM estimation, launch construction, and user confirmation before serving.
- `amd/skills/local-ai-use` is valuable for local multimodal routing and WSL/
  Windows/Linux crossover thinking, but it is product-specific to Lemonade and
  should not be treated as a generic local-AI pattern without adaptation.
- `intel/intel-performance-skills` is unusually clean and reusable. Its three
  skills form a small but complete Linux CPU performance package with
  cross-skill delegation, explicit `perf` permission handling, mitigation
  patterns, and benchmark integration.
- `intel-performance-skills/linux-perf` and `performance-patterns` should inform
  this project's Linux package design directly, especially for profiling,
  scaling, false-sharing, and SIMD diagnostics.
- AMD's `serving-llms-on-instinct` is an unusually complete product workflow:
  detect GPU, validate the environment, check model fit, present a launch
  summary, require confirmation, launch, and perform an application health
  check. It should remain vendor-specific. Its `validate.py --auto-fix` step
  would not meet this project's generic confirmation rule if adapted directly.
- Azure's `ai-infra` has a strong reference-first operating model: classify the
  request, read the named procedure, collect mandatory context, use only stated
  thresholds, then report an action decision. It is tightly bound to Azure
  GB300/H100 CycleCloud and AKS/Slurm operations, so use it as a design reference
  rather than a general GPU skill.
- Canonical's `lxd` skill provides sound generic patterns for idempotent checks,
  non-privileged defaults, non-interactive stdin handling, and smoke tests. Its
  `diagnose-sunbeam` skill gives an especially useful evidence hierarchy and
  confirmed/supported/speculative diagnosis model, but its commands and artifacts
  are specific to Sunbeam CI.
- The attempted local `NVIDIA/skills` snapshot is incomplete: the proxy stalled
  during object transfer and created only a `.git` directory. It is not reviewed
  locally and must be re-fetched successfully before selection decisions.

## HPC, Linux, And Operations

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `yale-som-hpc/claude-code-marketplace` | Unlicense | 23 | Priority HPC reference | Slurm, job management, cluster Python |
| `chaterm/terminal-skills` | Apache-2.0 | 63 | Priority terminal reference | Terminal, Docker, Kubernetes |
| `TerminalSkills/skills` | Apache-2.0 | 1,017 | Discovery and selective review | Monitoring and operational tools; provenance and duplicate review |
| `rifkyputra/postlab` | NOASSERTION | Includes `arch-sysadmin` | Reference only pending license | Arch administration and server management |
| `canonical/openstack-agentic-skills` | Verify repository | Multiple focused skills | Selective Ubuntu/cloud review | LXD, OpenStack diagnosis, networking and fio analysis |
| `canonical/debaid` | README says TBD; repository license appears GPL-3.0 | 5 | Reference only until clarified | Debian packaging, lintian and autopkgtest |
| `intel/intel-performance-skills` | MIT | 3 | Priority include candidate | Linux CPU profiling, SIMD, scaling and false sharing |

Current finding: no single reviewed repository provides a trustworthy,
comprehensive Debian/Ubuntu plus Arch/CachyOS skill set. The Linux package will
likely be authored as a curated package based on official distribution and tool
documentation, with selected third-party operational patterns attributed where
used.

Code search found isolated Arch-oriented candidates such as `arch-sysadmin`,
Arch package-building, Pacman, AUR, and ArchWiki-assisted skills, but many live
inside personal dotfiles, generated registries, or repositories without a clear
license. These are leads for comparison, not redistribution candidates.

Canonical publishes useful Debian/Ubuntu, OpenStack, LXD, Snap and HPC skills,
but they are spread across product repositories. `debaid` currently has a
license conflict, so it is reference-only. No Arch organization-level general
administration pack was identified; Arch coverage should be authored against
ArchWiki and official packaging documentation.

## Microsoft And Azure

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `microsoft/playwright-mcp` | Apache-2.0 | MCP | Priority browser MCP | Isolated browser automation and testing |
| `Azure/ai-infrastructure-on-azure` | MIT | 1 | Priority cloud reference | Azure AI compute infrastructure |
| `Azure/agentops` | MIT | 15 including generated copies | Selective review | Agent evaluation, reports and workflows |
| `Azure/azure-functions-skills` | MIT | 23 including templates | Selective cloud package | Setup, development, deployment and diagnostics |
| `microsoft/ai-agents-for-beginners` | MIT | Many translated duplicates | Reference only | Jupyter, Microsoft docs and Azure agent examples |
| `microsoft/vscode` | MIT | 60 internal/product skills | Engineering reference | Sessions, PR workflows, troubleshooting and skill tooling |

Microsoft does not currently expose one NVIDIA-style scientific-compute
catalog. Use focused repositories and do not count translated or generated
copies as separate capabilities.

## Browser And Research Web

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `Tencent/BrowserSkill` | MIT | 2 | Priority review | Existing logged-in browser, extension and CLI security |
| `badlogic/pi-skills` | MIT | 8 | Priority review | Browser tools and coding-agent operations |
| `browser-act/skills` | MIT | 80 | Quarantine/selective review | Anti-bot, CAPTCHA, proxy, account isolation, paid services |
| `microsoft/playwright-mcp` | Apache-2.0 | MCP, no skills | Priority MCP reference | Isolated automation, testing, extension, file/network boundaries |
| `browserbase/mcp-server-browserbase` | Apache-2.0 | MCP, no skills | Optional cloud MCP | Hosted browser, Stagehand, API keys, cost and data transfer |
| `executeautomation/mcp-playwright` | MIT | MCP, no skills | Secondary MCP review | Device emulation, tests, HTTP/stdio transport |
| `browser-use/browser-use` | MIT | Application/framework | Secondary reference | General agent browser framework and cloud options |
| `testdino-hq/playwright-skill` | Verify repository | At least 1 | Secondary review | Playwright testing and browser automation |
| `operasoftware/opera-browser-cli` | Verify repository | At least 1 | Secondary review | Browser CLI integration |

Browser review must cover session isolation, credential handling, confirmation
for account changes, upload disclosure, downloads, CAPTCHA boundaries, payment,
and public posting.

### Browser Roles

- **Logged-in local browser:** Tencent BrowserSkill is the strongest current
  candidate. It isolates an Agent Window, requires explicit tab borrowing,
  supports human takeover, and states red lines against credential extraction.
- **Local isolated automation and UI testing:** Microsoft Playwright MCP is the
  primary candidate. It supports isolated profiles, workspace file restrictions,
  browser extensions, and explicit capabilities, but states that it is not a
  security boundary.
- **Cloud browser:** Browserbase MCP is optional because page content and
  credentials may pass through a third-party service and paid account.
- **Lightweight CDP reference:** `pi-skills/browser-tools` is useful code, but its
  cookie-dump command and broad JavaScript evaluation lack adequate default
  safeguards. Do not adopt its skill unchanged.
- **Anti-bot and account automation:** BrowserAct must remain opt-in and high
  risk. Proxy rotation, stealth, CAPTCHA solving, profile import, and paid actions
  need policy and legal review before any inclusion.

## Research Engineering

| Repository | License signal | Skills | Status | Review focus |
| --- | --- | ---: | --- | --- |
| `obra/superpowers` | MIT | 14 | Method reference | Planning, testing, debugging, review, execution discipline |
| `multica-ai/andrej-karpathy-skills` | No detected license | 1 | Inspiration only pending license | Compact safeguards against coding-agent mistakes |
| `alirezarezvani/claude-skills` | MIT | 775 | Discovery and selective review | Engineering, DevOps, research, business; likely overlap |
| `VoltAgent/awesome-agent-skills` | MIT index | Links rather than committed skills | Discovery only | Locate original official and community projects |

The repository the user recalled as distilling an expert's working method is
most likely the Andrej Karpathy guidelines project. Its license is currently not
detected, so concepts may be studied but content must not be redistributed
without clarification.

## Paper Writing And Figures

| Repository | License signal | Status | Review focus |
| --- | --- | --- |
| `Yuan1z0825/nature-skills` | Apache-2.0 | 17 skills, priority extension | Nature-style writing, figure design, scientific visualization, citation and revision workflows; remote revision `74a322725ff2d36984762ca146f7e28cbb49e32d` |
| `Boom5426/Nature-Paper-Skills` | MIT | Secondary review | Manuscript drafting, reviewing, auditing, and resubmission |
| `hyl-ailab/scholar-forge` | MIT | Secondary review | Citation integrity, venue intelligence, bilingual academic writing |

`Yuan1z0825/nature-skills` is the direct match for the requested paper-writing
and scientific-figure search. It belongs to the future `research-engineering`
package, not the life-sciences source tree. It is a complete-directory extension:
skills may depend on `skills/_shared/`, manifests, references, static fragments,
scripts, and assets. `nature-figure` is the key figure-design workflow; it is
complementary to Open Science's `publication-figures` and `traceability-review`
rather than a replacement for them.

## Office And Documents

| Repository or source | License signal | Status | Review focus |
| --- | --- | --- | --- |
| `anthropics/skills` | Public repository; reviewed document skills prohibit outside-service retention, copying, derivatives, and distribution | Do not ingest | Claude official skill patterns and per-directory license handling |
| `openai/skills` | Per-skill licenses; repository deprecated | Legacy reference | Codex installer, curated skill packaging, Jupyter/PDF/Notion examples |
| `openai/plugins` | Current Codex plugin-example repository; mixed per-plugin assets | Priority reference | Google Docs/Slides, SharePoint Word/PowerPoint/Spreadsheets, reports-to-PDF/slides, Notion document flows |
| `nexu-io/html-anything` | Apache-2.0 | Priority template source | 81 current HTML deliverable skills across decks, docs, office surfaces, reports, social cards, and prototype pages |
| `lewislulu/html-ppt-skill` | MIT | Selective include candidate | HTML PPT/deck generation with presenter mode and theme/layout catalogs |
| `op7418/guizang-ppt-skill` | MIT | Selective include candidate | Magazine and Swiss-style HTML slide generation for talks and reports |
| Local `resources/academicSkills` from `extendai-lab-v1` | License must be resolved per file | Local reference | Chinese-first academic writing, DOCX, Office, and pipeline workflows |
| Local WPS `builtin-skills` archive | License/redistribution unclear; WPS Comate `wps365` bundle | Reference only | Built-in partitioning, Office JSAPI design, WPS 365 connector workflows |

Key findings:

- At revision `9d2f1ae187231d8199c64b5b762e1bdf2244733d`, each of Anthropic's
  `docx`, `pdf`, `pptx`, and `xlsx` directories has both proprietary frontmatter
  and a directory-local `LICENSE.txt`. The terms prohibit retaining copies
  outside Anthropic's services, copying, derivative works, and distribution.
  Record only the upstream link, revision, and license conclusion; do not clone,
  mirror, body-index, vendor, repackage, or auto-install these skills.
- OpenAI's current Codex direction lives in `openai/plugins`, not in the
  deprecated `openai/skills` catalog. Google Docs/Slides and SharePoint office
  skills are there as plugin-scoped bundles.
- `nexu-io/html-anything` is now an 81-skill Apache-2.0 template system. The
  previous local migration snapshot has 75 skills and is missing several newer
  upstream templates, so it should be treated as a stale cached subset, not the
  canonical source. The pinned source track revision is
  `aea749837d780f1da6261f2ed777d7e107231f5f`; retain its complete source tree
  with `next/src/lib/templates/skills` as the discovery root rather than copying
  selected directories into a first-party skill. Twenty-two skills include
  `example_source_url` metadata and require individual provenance classification
  before automatic routing or redistribution.
- The previous local plugin architecture already solved the direct-vs-tool-loaded
  split: `src/skills/` for directly exposed bundled skills, `ThirdParty/` and
  `resources/academicSkills/` for category-loaded packs. That pattern should be
  reused here, but category selection must return indexed descriptors and load
  one chosen skill at a time rather than injecting every body in the category.
- The WPS archive's manifest identifies it as a `wps365` built-in bundle assigned
  to provider-specific agents. Its `word-jsapi`, `excel-jsapi`, and
  `powerpoint-jsapi` skills require an injected WebOffice runtime, while its
  `xlsx` skill adds WPS-specific behavior around material closely matching
  Anthropic's proprietary spreadsheet workflow. It is not an independent
  redistributable source.

## Evaluation Notes

- Star count is a discovery signal, not a quality score.
- Large skill counts often include duplicated or generated material.
- Aggregators must point to original upstream repositories.
- Recent activity alone does not prove maintenance quality.
- Benchmark claims require checking task definitions, baselines, and leakage.
- Skills with scripts require script-level security and dependency review.

## BioClaw Findings

BioClaw explicitly attributes its base architecture to `qwibitai/nanoclaw` and
biomedical tool/skill concepts to `zaixizhang/STELLA`. It contains 51 skills in
two distinct groups:

- Setup and integration skills under `.claude/skills/`.
- Runtime biomedical and operational skills under `container/skills/`.

High-value review targets include browser operation, AlphaFold/PDB/database
queries, bio-analysis routing, human-feedback gates, container conversion,
remote SSH/cluster scripts, report generation, and its Docker/Apptainer tool
environment.

Initial local review of the cloned snapshot:

- `container/skills/structural-biology` is relatively strong. It uses explicit
  triggering, confidence thresholds, artifact paths, anti-patterns, and a clear
  distinction between AlphaFold DB retrieval and de novo prediction workflows.
- `container/skills/query-alphafold` is useful as a lightweight API example but
  is narrower and less quality-controlled than `structural-biology`.
- `container/skills/skills-hub` is valuable as evidence of runtime community-skill
  discovery and caching, but it installs from a moving GitHub branch and allows
  ad hoc dependency installation. Its behavior is a reference pattern, not a
  production default for this project.
- `container/skills/agent-browser` is broad and powerful but underspecified on
  account risk and secrets handling. It includes cookies, storage, and arbitrary
  JavaScript without strong guardrails, so it should be treated as an
  implementation reference only.
- `container/skills/bio-human-feedback` captures an important workflow rule:
  explicit human approval before continuing a sensitive research proposal.

The associated `Bioclaw_Skills_Hub` contains 66 skills and a useful compact
taxonomy, including 22 protein-design skills. Its `catalog/source-mapping.md`
describes only broad source types rather than exact repository/path/revision
mapping. Before adaptation, each selected skill therefore needs a more precise
original-source investigation.
