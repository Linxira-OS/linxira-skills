# Source Catalog

`source-skills.json` is generated, versioned metadata for the three pinned
source tracks. It contains descriptors and SHA-256 body hashes, not skill
bodies. Regenerate it after an approved source-track revision change:

```powershell
pwsh -File scripts/build-source-catalog.ps1
```

The catalog is an audit and selection input. It does not authorize a source
skill for a public profile; profile review still requires provenance, license,
execution, and quality approval.
