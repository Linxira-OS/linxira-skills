# Source Registry

## Current Local Research Sources

| Local path | Fork or project | Original upstream | License | Review role |
| --- | --- | --- | --- | --- |
| `sources/bioSkills` | `BOHUYESHAN-APB/bioSkills` | `GPTomics/bioSkills` | MIT | Enabled life-sciences source track; current revision `24f0694a125e53f04a7c66a54ba9b81461b7227f` |
| `sources/awesome-bio-agent-skills` | `BOHUYESHAN-APB/awesome-bio-agent-skills` | `BioTender-max/awesome-bio-agent-skills` | CC0 index; nested projects may differ | Indexed life-sciences source track; current revision `8cbdd18837aa6296c4e77616a03b323bd69b57b1`; resolve original sources before redistribution |
| `sources/html-anything` | `nexu-io/html-anything` | Same | Apache-2.0 root license; cited examples require review | Indexed optional template source track; current revision `aea749837d780f1da6261f2ed777d7e107231f5f`; discovery root `next/src/lib/templates/skills` |
| `.research-temp/open-science` | `ai4s-research/open-science` | Same | MIT; fetched external packs differ | Scientific integrity, provenance, remote-compute, and OpenCode reference |
| `.research-temp/BioClaw` | `Runchuan-BU/BioClaw` | NanoClaw architecture; STELLA biomedical concepts | MIT with retained notices | Bio agent architecture and 51 operational/domain skills |
| `.research-temp/amd-skills` | `amd/skills` | Same | MIT | Vendor catalog and GPU workflow reference; local revision `bc8f6542e6c4a1d9122662a9a895f527b5977917` |
| `.research-temp/intel-performance-skills` | `intel/intel-performance-skills` | Same | MIT | Linux CPU profiling and performance-pattern reference; local revision `e9d0b6410fb1ad7a50fb81e0868fd23ae886882c` |
| `.research-temp/azure-ai-infrastructure` | `Azure/ai-infrastructure-on-azure` | Same | MIT | Azure GPU/HPC operational-reference pattern; local revision `c2d57c6bbe3f9772f265e5229a6ea4dd0f646075` |
| `.research-temp/canonical-openstack-skills` | `canonical/openstack-agentic-skills` | Same | License requires per-file/repository confirmation | LXD, diagnostics, and cloud-operation reference; local revision `d261177fc895142fb115641d661bd582efac164d` |

Temporary sources are ignored by Git and are not distributed. The broad archive
contains duplicates, vendored repositories, generated indexes, and unrelated
skills. Trace each selected skill back to its original project.

The incomplete `.research-temp/nvidia-skills` directory is not a research
snapshot and must not be inspected or cited as one. Its shallow clone stalled
before checkout; fetch a complete snapshot through a working source before
local review.

## External Projects To Track

These projects were identified with GitHub CLI and are not vendored by default:

| Project | Useful coverage |
| --- | --- |
| `google-deepmind/science-skills` | Grounded scientific database and model workflows |
| `openai/plugins` (`life-science-research`) | Modular life-science research and evidence workflows |
| `anthropics/life-sciences` | First-party methods plus partner integrations |
| `Runchuan-BU/BioClaw` | Bio agent, browser/database, container, and cluster workflows |
| `zongtingwei/Bioclaw_Skills_Hub` | 66 workflow-oriented omics and protein-design skills |
| `ai4s-research/open-science` | OpenCode-based reproducibility and scientific integrity mechanisms |
| `ai4s-research/ai4s-skills` | Research exploration, literature, experiments, writing, and integrity |
| `jaechang-hits/SciAgent-Skills` | Broad scientific and biomedical analysis |
| `K-Dense-AI/scientific-agent-skills` | Cross-disciplinary scientific tooling |
| `mims-harvard/ToolUniverse` | Scientific APIs, models, and agent workflows |
| `GoekeLab/awesome-genomic-skills` | Maintained discovery list for genomics skills and MCPs |
| `variomeanalytics/bioinformatics-agent-skills` | Workflow knowledge graph and pipeline transitions |
| `NVIDIA/skills` | 241 verified GPU, medical AI, distributed training, Slurm, and NVIDIA workflows; CC-BY-4.0 skills and Apache-2.0 code |
| `amd/skills` | MIT official AMD catalog for Ryzen AI, ROCm, Instinct, EPYC and profiling |
| `intel/intel-performance-skills` | MIT Linux perf, CPU optimization and Phoronix workflows |
| `ROCm/rocprofiler-systems-skills` | AMD profiling and ROCm engineering skills requiring selective license review |
| `amd/Quark` | MIT model quantization and validation skills for PyTorch and ONNX |
| `Orchestra-Research/AI-Research-SKILLs` | AI research, training, optimization, and MLOps |
| `yale-som-hpc/claude-code-marketplace` | Practical HPC and Slurm skills |
| `Tencent/BrowserSkill` | Automation using an existing logged-in browser |
| `badlogic/pi-skills` | Browser and general coding-agent operational skills |
| `microsoft/playwright-mcp` | Apache-2.0 local browser automation MCP and testing reference |
| `Azure/ai-infrastructure-on-azure` | MIT Azure AI infrastructure skill |
| `Azure/agentops` | MIT agent evaluation and workflow skills |
| `Azure/azure-functions-skills` | MIT Azure Functions lifecycle skills |
| `browserbase/mcp-server-browserbase` | Apache-2.0 hosted/self-hosted cloud browser MCP |
| `browser-act/skills` | MIT browser automation skills with elevated anti-bot and account-operation risk |
| `VoltAgent/awesome-agent-skills` | Large cross-domain discovery index |
| `obra/superpowers` | Software engineering workflow and methodology |
| `multica-ai/andrej-karpathy-skills` | Compact coding-agent behavior guidelines |
| `Yuan1z0825/nature-skills` | Apache-2.0 manuscript, figure, and editorial extension candidate |
| `nexu-io/html-anything` | Apache-2.0 HTML deliverable and presentation-template candidate |
| `anthropics/skills` | Do-not-ingest document-skill reference; reviewed terms prohibit outside-service retention, copying, derivatives, and distribution |
| `openai/plugins` | Current Codex plugin examples; license and dependency review per plugin |

## Open Science Findings

The repository contains seven committed first-party core skills:

- `traceability-review`
- `stats-integrity`
- `domain-check`
- `large-file`
- `publication-figures`
- `remote-compute`
- `modal-run`

It fetches external packs at pinned commits rather than committing them:

- `ai4s-research/ai4s-skills`
- `anthropics/skills` document skills, whose current `docx`, `pdf`, `pptx`, and
  `xlsx` directories declare proprietary terms

This source is most valuable as a quality-system and packaging reference. Its
domain-check, run provenance, immutable remote results, source pinning, and
third-party separation should inform this project's design.

Open Science Desktop's upstream fetch behavior does not grant this project any
license to ingest Anthropic's document-skill material.

## Office And Document Findings

The document and presentation sources divide into three incompatible execution
models and must remain separate:

- `nexu-io/html-anything` at
  `aea749837d780f1da6261f2ed777d7e107231f5f` is an Apache-2.0 optional template
  source track. Its discovery root contains 81 unique skills, their examples,
  and three `assets/` subdirectories referenced by their owning skills. Twenty-two
  skills cite external examples or inspiration, so the track is
  `indexed-with-provenance-gate`, not an automatically routable full-source pack.
- `nexu-io/open-design` at
  `188ae72f8eed8c53634602635ec50ed5f85a71ac` is an Apache-2.0 candidate source,
  not a local source track. Its 492 `SKILL.md` paths include duplicated template
  and example surfaces, directory-local licenses, and account/API/deployment
  actions. `OPEN_DESIGN_SOURCE_REVIEW.md` requires per-skill review before any
  adaptation or indexing.
- `tw93/kami` at
  `f97bfc9ef83626edb863f6e42632067047a23601` is an MIT implementation reference.
  Its monolithic skill depends on sibling templates, scripts, references, fonts,
  and multiple rendering runtimes. `KAMI_SOURCE_REVIEW.md` approves selective
  first-party adaptation of workflow principles, not direct packaging.
- `anthropics/skills` at
  `9d2f1ae187231d8199c64b5b762e1bdf2244733d` exposes public source files, but
  each reviewed document directory (`docx`, `pdf`, `pptx`, `xlsx`) contains a
  local proprietary `LICENSE.txt` that prohibits outside-service retention,
  copying, derivatives, and distribution. Preserve only the link, revision, and
  license conclusion; do not clone, mirror, index bodies, or include these skills
  in package payloads or automatic installers.
- `C:\Users\BoHuYeShan\Desktop\$R79Z3I3.7z` contains WPS Comate's
  `builtin-skills` bundle. Its manifest marks the entries `wps365`, and its
  JSAPI skills assume WPS WebOffice-specific tools and an injected `app` object.
  The archive is a provider-integration reference, not a provenance-complete
  source track. Its adapted `xlsx` body also reinforces that vendor-local copies
  must not be treated as independent upstream sources.

The previous plugin's local `ThirdParty/` and `resources/academicSkills/` trees
are similarly reference-only until each original repository, revision, and
license is recorded. They are not fallback sources when an upstream track is
unavailable.

## BioClaw Findings

BioClaw is an agent application rather than only a skill library. Its README
attributes the container-agent architecture to `qwibitai/nanoclaw` and the
biomedical tool ecosystem and domain concepts to `zaixizhang/STELLA`. The MIT
license retains the NanoClaw attribution.

Its 51 skills include setup/integration skills and runtime skills for browser
use, sequence analysis, BLAST, structural biology, AlphaFold and database
queries, single-cell analysis, epigenomics, proteomics, reporting, and human
feedback. The repository is a strong execution-pattern reference, but its
application-specific paths and container assumptions require adaptation.

The related `zongtingwei/Bioclaw_Skills_Hub` has 66 skills under MIT and a
compact domain taxonomy. Its published source mapping names broad source types
but does not identify exact upstream repositories, paths, and revisions for
each skill. Treat it as a candidate taxonomy and require per-skill provenance
resolution before reuse.

## NVIDIA License Finding

GitHub labels the repository license as `NOASSERTION` because the root license
combines two licenses. The repository text is explicit:

- Documentation and skills: Creative Commons Attribution 4.0.
- Source code: Apache License 2.0.

This permits use and modification. Skill adaptations must identify NVIDIA,
link the source, include the CC-BY-4.0 notice, and state modifications. Code
adaptations must retain the Apache-2.0 license and applicable notices. NVIDIA's
catalog also mirrors skills from product repositories, so product-level source
metadata remains relevant.

## Vendor Package Model

Coherent official vendor catalogs should remain separate unmodified upstream
packages:

- `vendor-nvidia`: NVIDIA skills and governance artifacts under CC-BY-4.0 and
  Apache-2.0.
- `vendor-amd`: AMD's MIT catalog with its federated-source markers.

Intel and Microsoft/Azure currently fit selective capability packages rather
than full vendor inheritance because relevant skills are distributed across
product-development repositories.

## Linux Source Finding

Linux capability will combine official Debian, Ubuntu/Canonical, ArchWiki,
systemd and tool documentation with Intel's MIT performance skills and selected
Canonical cloud/HPC patterns. No official comprehensive Arch plus Debian
administration catalog was identified, so general Linux administration should
be authored and tested by this project.

The first-party Linux catalog now has task-focused skills for foundations,
package management, remote access, session persistence, file transfer, system
administration, storage/networking, GPU hosts, WSL, and troubleshooting. It is
newly written from public operating-system and tool behavior rather than copied
from any reviewed skill. The upstream materials below inform quality patterns,
not redistributed text or scripts:

- AMD's catalog demonstrates a useful staged pattern: detect hardware, validate
  prerequisites, estimate fit, require confirmation for a costly launch, then
  verify health. Its product-specific commands and `--auto-fix` behavior are not
  generic Linux defaults.
- Intel's focused MIT package provides strong perf workflows, explicit privilege
  gates, and cross-skill delegation. It remains a selective include candidate
  rather than a rewritten first-party performance skill.
- Azure's AI infrastructure skill keeps SKU-specific commands and thresholds in
  cited reference files and requires the exact host/orchestrator context. That
  evidence discipline is reusable; Azure hardware procedures are not.
- Canonical's LXD material demonstrates idempotent checks, secure defaults, and
  smoke-testable instructions. Its OpenStack diagnostics add a useful evidence
  hierarchy, but both are product-specific references.

## Coverage Model

Linxira Skills organizes work into reusable platform capabilities and reviewed
domain, reporting, and connector profiles. See `docs/PLAN.md` for the current
content model and review phases.

New curated skills must fill a demonstrated capability gap. A different tool is
not by itself a reason for a second skill when a decision table can route among
equivalent implementations.
