[CmdletBinding()]
param(
    [string]$OutputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
if (-not $OutputPath) {
    $OutputPath = Join-Path $repoRoot 'catalog/source-skills.json'
}

$tracks = @(
    [pscustomobject]@{
        Id = 'bioskills'
        Path = Join-Path $repoRoot 'sources/bioSkills'
        SkillPath = Join-Path $repoRoot 'sources/bioSkills'
        DefaultLicenseState = 'MIT'
    },
    [pscustomobject]@{
        Id = 'awesome-bio-agent-skills'
        Path = Join-Path $repoRoot 'sources/awesome-bio-agent-skills'
        SkillPath = Join-Path $repoRoot 'sources/awesome-bio-agent-skills/skills'
        DefaultLicenseState = 'mixed-provenance'
    },
    [pscustomobject]@{
        Id = 'html-anything'
        Path = Join-Path $repoRoot 'sources/html-anything'
        SkillPath = Join-Path $repoRoot 'sources/html-anything/next/src/lib/templates/skills'
        DefaultLicenseState = 'Apache-2.0'
    }
)

function Get-Frontmatter($content) {
    $values = [ordered]@{}
    if (-not $content.StartsWith("---`n") -and -not $content.StartsWith("---`r`n")) {
        return $values
    }

    foreach ($line in ($content -split "`r?`n" | Select-Object -Skip 1)) {
        if ($line -eq '---') {
            break
        }
        $match = [regex]::Match($line, '^(?<key>[A-Za-z0-9_-]+):\s*(?<value>.*)$')
        if ($match.Success) {
            $values[$match.Groups['key'].Value] = $match.Groups['value'].Value.Trim().Trim('"', "'")
        }
    }
    return $values
}

function Split-FrontmatterList($value) {
    if ([string]::IsNullOrWhiteSpace($value)) {
        return @()
    }
    $trimmed = $value.Trim().Trim('[', ']')
    return @($trimmed -split ',' | ForEach-Object { $_.Trim().Trim('"', "'") } | Where-Object { $_ })
}

function Get-LicenseState($licensePath) {
    $content = [IO.File]::ReadAllText($licensePath)
    if ($content -match '(?i)Apache License\s+Version 2\.0') {
        return 'Apache-2.0'
    }
    if ($content -match '(?i)MIT License') {
        return 'MIT'
    }
    if ($content -match '(?i)CC0 1\.0 Universal|Creative Commons Zero') {
        return 'CC0-1.0'
    }
    return 'license-file-unclassified'
}

$licenseCache = @{}
function Get-LicenseEvidence($directory, $track) {
    $key = $directory.FullName
    if ($licenseCache.ContainsKey($key)) {
        return $licenseCache[$key]
    }

    $license = @(Get-ChildItem -LiteralPath $directory.FullName -File -Filter 'LICENSE*' | Sort-Object Name | Select-Object -First 1)
    if ($license.Count -eq 1) {
        $evidence = [pscustomobject]@{
            State = Get-LicenseState $license[0].FullName
            Evidence = $license[0].FullName.Substring($repoRoot.Length).TrimStart('\', '/') -replace '\\', '/'
        }
    } elseif ($directory.FullName -eq $track.Path) {
        $evidence = [pscustomobject]@{
            State = $track.DefaultLicenseState
            Evidence = $null
        }
    } else {
        $evidence = Get-LicenseEvidence $directory.Parent $track
    }

    $licenseCache[$key] = $evidence
    return $evidence
}

function Get-RiskTags($frontmatter, $content, $trackId) {
    $tags = [Collections.Generic.HashSet[string]]::new([StringComparer]::OrdinalIgnoreCase)
    foreach ($tag in (Split-FrontmatterList $frontmatter['risk_tags'])) {
        [void]$tags.Add($tag)
    }
    if ($content -match '(?i)\b(api[_ -]?key|access token|password|secret|credential)\b') {
        [void]$tags.Add('credential-handling')
    }
    if ($content -match '(?i)\b(delete|drop database|overwrite|rm -rf|terminate)\b') {
        [void]$tags.Add('destructive-operations')
    }
    if ($content -match '(?i)\b(upload|publish|submit|send|post request)\b') {
        [void]$tags.Add('external-write')
    }
    if ($content -match 'https?://') {
        [void]$tags.Add('external-reference')
    }
    if ($trackId -eq 'awesome-bio-agent-skills') {
        [void]$tags.Add('mixed-provenance')
    }
    return ,([string[]]@($tags | Sort-Object))
}

$trackDescriptors = @()
$skills = @()
foreach ($track in $tracks) {
    if (-not (Test-Path -LiteralPath $track.Path) -or -not (Test-Path -LiteralPath $track.SkillPath)) {
        throw "Missing source track path: $($track.Id)"
    }

    $revision = (& git -C $track.Path rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot resolve source revision: $($track.Id)"
    }

    $files = @(Get-ChildItem -LiteralPath $track.SkillPath -Filter SKILL.md -Recurse -File | Sort-Object FullName)
    $trackDescriptors += [ordered]@{
        Id = $track.Id
        RelativePath = $track.Path.Substring($repoRoot.Length).TrimStart('\', '/') -replace '\\', '/'
        SkillRoot = $track.SkillPath.Substring($repoRoot.Length).TrimStart('\', '/') -replace '\\', '/'
        SourceRevision = $revision
        DefaultLicenseState = $track.DefaultLicenseState
        SkillCount = $files.Count
    }

    foreach ($file in $files) {
        $content = [IO.File]::ReadAllText($file.FullName)
        $frontmatter = Get-Frontmatter $content
        $relativePath = $file.DirectoryName.Substring($track.SkillPath.Length).TrimStart('\', '/') -replace '\\', '/'
        $license = Get-LicenseEvidence $file.Directory $track
        $name = if ($frontmatter.Contains('name')) { $frontmatter['name'] } else { $file.Directory.Name }
        $description = if ($frontmatter.Contains('description')) { $frontmatter['description'] } else { $null }

        $skills += [ordered]@{
            Id = "$($track.Id):$relativePath"
            Track = $track.Id
            SourceRevision = $revision
            RelativePath = $relativePath
            Name = $name
            Description = $description
            Category = $frontmatter['category']
            SkillClass = $frontmatter['skill_class']
            LoadPolicy = $frontmatter['load_policy']
            RiskTags = Get-RiskTags $frontmatter $content $track.Id
            LicenseState = $license.State
            LicenseEvidence = $license.Evidence
            HasFrontmatter = ($frontmatter.Count -gt 0)
            BodySha256 = (Get-FileHash -LiteralPath $file.FullName -Algorithm SHA256).Hash.ToLowerInvariant()
        }
    }
}

$catalog = [ordered]@{
    SchemaVersion = 1
    Tracks = $trackDescriptors
    Skills = @($skills | Sort-Object Track, RelativePath)
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory)) {
    New-Item -ItemType Directory -Path $outputDirectory | Out-Null
}

$json = $catalog | ConvertTo-Json -Depth 6
[IO.File]::WriteAllText((Resolve-Path $outputDirectory | Join-Path -ChildPath (Split-Path -Leaf $OutputPath)), "$json`n", [Text.UTF8Encoding]::new($false))

[pscustomobject]@{
    OutputPath = (Resolve-Path $OutputPath).Path
    SkillCount = $skills.Count
    TrackCounts = @($trackDescriptors | ForEach-Object { [pscustomobject]@{ Track = $_.Id; Skills = $_.SkillCount } })
} | ConvertTo-Json -Depth 4
