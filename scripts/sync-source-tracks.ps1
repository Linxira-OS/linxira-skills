[CmdletBinding()]
param(
    [switch]$Apply,
    [switch]$Push
)

if ($Push -and -not $Apply) {
    throw '-Push requires -Apply so the local source is updated first.'
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path

$tracks = @(
    @{
        Name = 'bioSkills'
        Path = Join-Path $repoRoot 'sources/bioSkills'
        Upstream = 'https://github.com/GPTomics/bioSkills.git'
        Branch = 'main'
        ForkRemote = 'origin'
    },
    @{
        Name = 'awesome-bio-agent-skills'
        Path = Join-Path $repoRoot 'sources/awesome-bio-agent-skills'
        Upstream = 'https://github.com/BioTender-max/awesome-bio-agent-skills.git'
        Branch = 'main'
        ForkRemote = 'origin'
    },
    @{
        Name = 'html-anything'
        Path = Join-Path $repoRoot 'sources/html-anything'
        Upstream = 'https://github.com/nexu-io/html-anything.git'
        Branch = 'main'
        ForkRemote = $null
    }
)

foreach ($track in $tracks) {
    if (-not (Test-Path -LiteralPath $track.Path)) {
        throw "Missing source track: $($track.Path)"
    }

    $status = & git -C $track.Path status --porcelain
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot inspect source track: $($track.Name)"
    }
    if ($status) {
        throw "Source track has local changes: $($track.Name)"
    }

    $before = (& git -C $track.Path rev-parse HEAD).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot resolve local revision: $($track.Name)"
    }

    & git -C $track.Path fetch --no-tags $track.Upstream $track.Branch
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot fetch upstream: $($track.Name)"
    }

    $upstream = (& git -C $track.Path rev-parse FETCH_HEAD).Trim()
    if ($LASTEXITCODE -ne 0) {
        throw "Cannot resolve upstream revision: $($track.Name)"
    }

    $behind = [int]((& git -C $track.Path rev-list --count "$before..$upstream").Trim())
    $ahead = [int]((& git -C $track.Path rev-list --count "$upstream..$before").Trim())

    [pscustomobject]@{
        Track = $track.Name
        Local = $before
        Upstream = $upstream
        Behind = $behind
        Ahead = $ahead
        Action = if ($Apply -and $behind -gt 0 -and $ahead -eq 0) { 'fast-forward' } else { 'report-only' }
        Push = if ($Push) { if ($track.ForkRemote) { 'pending' } else { 'not-configured' } } else { 'not-requested' }
    }

    if (-not $Apply -or $behind -eq 0) {
        continue
    }
    if ($ahead -gt 0) {
        throw "Local branch diverged from upstream: $($track.Name)"
    }

    & git -C $track.Path merge --ff-only $upstream
    if ($LASTEXITCODE -ne 0) {
        throw "Fast-forward failed: $($track.Name)"
    }

    if ($Push -and $track.ForkRemote) {
        & git -C $track.Path push $track.ForkRemote "HEAD:$($track.Branch)"
        if ($LASTEXITCODE -ne 0) {
            throw "Push failed: $($track.Name)"
        }
    }
}
