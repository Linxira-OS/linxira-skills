[CmdletBinding()]
param(
    [switch]$IncludeNature
)

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$tracks = @(
    @{ Id = 'project'; Path = Join-Path $repoRoot 'skills' },
    @{ Id = 'bioskills'; Path = Join-Path $repoRoot 'sources/bioSkills' },
    @{ Id = 'aggregate-bioskills'; Path = Join-Path $repoRoot 'sources/awesome-bio-agent-skills/skills/bioskills' },
    @{ Id = 'aggregate-other'; Path = Join-Path $repoRoot 'sources/awesome-bio-agent-skills/skills'; ExcludePrefix = 'bioskills' },
    @{ Id = 'html-anything'; Path = Join-Path $repoRoot 'sources/html-anything/next/src/lib/templates/skills' },
    @{ Id = 'open-science-core'; Path = Join-Path $repoRoot '.research-temp/open-science/runtime/skills/core' }
)

if ($IncludeNature) {
    $tracks += @{ Id = 'nature-skills'; Path = Join-Path $repoRoot '.research-temp/nature-skills/skills' }
}

function Get-SkillDescriptors($track) {
    if (-not (Test-Path -LiteralPath $track.Path)) {
        throw "Missing source track: $($track.Id)"
    }

    $files = Get-ChildItem -LiteralPath $track.Path -Filter SKILL.md -Recurse -File
    if ($track.ExcludePrefix) {
        $excludedPath = Join-Path $track.Path $track.ExcludePrefix
        $files = $files | Where-Object { -not $_.FullName.StartsWith($excludedPath, [StringComparison]::OrdinalIgnoreCase) }
    }

    $files |
        ForEach-Object {
            $content = [IO.File]::ReadAllText($_.FullName)
            $match = [regex]::Match($content, '(?m)^name:\s*["'']?([^"''\r\n]+)')
            $relativePath = $_.DirectoryName.Substring($track.Path.Length).TrimStart('\', '/')
            [pscustomobject]@{
                Id = if ($relativePath) { "$($track.Id):$relativePath" } else { $track.Id }
                Track = $track.Id
                Name = if ($match.Success) { $match.Groups[1].Value.Trim() } else { $_.Directory.Name }
                RelativePath = $relativePath
                Hash = (Get-FileHash -LiteralPath $_.FullName -Algorithm SHA256).Hash
            }
        }
}

$skills = @($tracks | ForEach-Object { Get-SkillDescriptors $_ })
$nameGroups = @($skills | Group-Object Name | Where-Object Count -gt 1)
$hashGroups = @($skills | Group-Object Hash | Where-Object Count -gt 1)
$canonicalSkills = @($skills | Where-Object Track -eq 'bioskills')
$aggregateBioskills = @($skills | Where-Object Track -eq 'aggregate-bioskills')
$canonicalByName = @{}
$aggregateByName = @{}

foreach ($skill in $canonicalSkills) {
    if (-not $canonicalByName.ContainsKey($skill.Name)) {
        $canonicalByName[$skill.Name] = @()
    }
    $canonicalByName[$skill.Name] += $skill
}

foreach ($skill in $aggregateBioskills) {
    if (-not $aggregateByName.ContainsKey($skill.Name)) {
        $aggregateByName[$skill.Name] = @()
    }
    $aggregateByName[$skill.Name] += $skill
}

$sharedDeclaredNames = @($canonicalByName.Keys | Where-Object { $aggregateByName.ContainsKey($_) })
$exactBodyPairs = 0
$differentBodyPairs = 0
foreach ($name in $sharedDeclaredNames) {
    foreach ($canonical in $canonicalByName[$name]) {
        foreach ($aggregate in $aggregateByName[$name]) {
            if ($canonical.Hash -eq $aggregate.Hash) {
                $exactBodyPairs++
            } else {
                $differentBodyPairs++
            }
        }
    }
}

[pscustomobject]@{
    SkillCount = $skills.Count
    TrackCounts = @($skills | Group-Object Track | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ Track = $_.Name; Skills = $_.Count }
    })
    ExactDuplicateGroups = @($hashGroups | ForEach-Object {
        [pscustomobject]@{ Hash = $_.Name; Skills = $_.Group.Id }
    })
    SameNameDifferentContent = @($nameGroups | Where-Object {
        ($_.Group.Hash | Select-Object -Unique).Count -gt 1
    } | ForEach-Object {
        [pscustomobject]@{ Name = $_.Name; Skills = $_.Group.Id }
    })
    CanonicalAggregateBioskillsOverlap = [pscustomobject]@{
        SharedDeclaredNames = $sharedDeclaredNames.Count
        ExactBodyPairs = $exactBodyPairs
        DifferentBodyPairs = $differentBodyPairs
    }
} | ConvertTo-Json -Depth 6
