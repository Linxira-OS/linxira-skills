[CmdletBinding()]
param()

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$skillsRoot = Join-Path $repoRoot 'skills'
$allowedClasses = @('reference', 'workflow', 'guard', 'contract')
$allowedPolicies = @('on-demand', 'conditional', 'required')
$allowedRiskTags = @(
    'account-bound',
    'clinical',
    'controlled-data',
    'destructive',
    'expensive',
    'paid',
    'privileged',
    'remote-compute'
)

function Get-FrontmatterValue([string]$Frontmatter, [string]$Field) {
    $pattern = '(?m)^' + [regex]::Escape($Field) + ':\s*(?<value>[^\r\n]*)\r?$'
    $match = [regex]::Match($Frontmatter, $pattern)
    if (-not $match.Success) {
        return $null
    }
    return $match.Groups['value'].Value.Trim()
}

function Get-RiskTags([string]$RawValue, [string]$SkillPath) {
    $match = [regex]::Match($RawValue, '^\[(?<items>.*)\]$')
    if (-not $match.Success) {
        throw "${SkillPath}: risk_tags must be an inline YAML list."
    }

    $items = $match.Groups['items'].Value.Trim()
    if (-not $items) {
        return @()
    }

    return @($items.Split(',') | ForEach-Object {
        $_.Trim().Trim("'").Trim('"')
    } | Where-Object { $_ })
}

$issues = @()
$descriptors = @()
$skillDirectories = Get-ChildItem -LiteralPath $skillsRoot -Directory |
    Where-Object { Test-Path -LiteralPath (Join-Path $_.FullName 'SKILL.md') } |
    Sort-Object Name

foreach ($directory in $skillDirectories) {
    $skillPath = Join-Path $directory.FullName 'SKILL.md'
    $content = [IO.File]::ReadAllText($skillPath)
    $frontmatterMatch = [regex]::Match($content, '\A---\r?\n(?<frontmatter>[\s\S]*?)\r?\n---')
    if (-not $frontmatterMatch.Success) {
        $issues += "$($directory.Name): missing YAML frontmatter"
        continue
    }

    $frontmatter = $frontmatterMatch.Groups['frontmatter'].Value
    $name = Get-FrontmatterValue $frontmatter 'name'
    $description = Get-FrontmatterValue $frontmatter 'description'
    $skillClass = Get-FrontmatterValue $frontmatter 'skill_class'
    $loadPolicy = Get-FrontmatterValue $frontmatter 'load_policy'
    $riskTagsRaw = Get-FrontmatterValue $frontmatter 'risk_tags'

    foreach ($field in @{
        name = $name
        description = $description
        skill_class = $skillClass
        load_policy = $loadPolicy
        risk_tags = $riskTagsRaw
    }.GetEnumerator()) {
        if (-not $field.Value) {
            $issues += "$($directory.Name): missing $($field.Key)"
        }
    }

    if ($name -and $name -ne $directory.Name) {
        $issues += "$($directory.Name): frontmatter name does not match directory"
    }
    if ($skillClass -and $skillClass -notin $allowedClasses) {
        $issues += "$($directory.Name): invalid skill_class '$skillClass'"
    }
    if ($loadPolicy -and $loadPolicy -notin $allowedPolicies) {
        $issues += "$($directory.Name): invalid load_policy '$loadPolicy'"
    }

    $riskTags = @()
    if ($riskTagsRaw) {
        try {
            $riskTags = Get-RiskTags $riskTagsRaw $directory.Name
            foreach ($tag in $riskTags) {
                if ($tag -notin $allowedRiskTags) {
                    $issues += "$($directory.Name): invalid risk tag '$tag'"
                }
            }
        } catch {
            $issues += $_.Exception.Message
        }
    }

    if ($content -match '(?m)^## Provenance$' -and $content -notmatch '(?m)^## Citation$') {
        $issues += "$($directory.Name): skills with a Provenance section must also define a Citation section"
    }

    $descriptors += [pscustomobject]@{
        Id = "project:$($directory.Name)"
        SkillClass = $skillClass
        LoadPolicy = $loadPolicy
        RiskTags = $riskTags
    }
}

if ($issues.Count) {
    throw ($issues -join [Environment]::NewLine)
}

[pscustomobject]@{
    SkillCount = $descriptors.Count
    ClassCounts = @($descriptors | Group-Object SkillClass | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ SkillClass = $_.Name; Skills = $_.Count }
    })
    LoadPolicyCounts = @($descriptors | Group-Object LoadPolicy | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ LoadPolicy = $_.Name; Skills = $_.Count }
    })
    RiskTagCounts = @($descriptors | ForEach-Object RiskTags | Group-Object | Sort-Object Name | ForEach-Object {
        [pscustomobject]@{ RiskTag = $_.Name; Skills = $_.Count }
    })
} | ConvertTo-Json -Depth 5
