$ErrorActionPreference = 'Stop'
$portableNode = Join-Path $PSScriptRoot '.tools\runtime\node-v22.14.0-win-x64'
if (Test-Path (Join-Path $portableNode 'npm.cmd')) {
    $env:Path = "$portableNode;$env:Path"
}
if (!(Get-Command npm.cmd -ErrorAction SilentlyContinue)) {
    throw 'Install Node.js 22.12 or newer, then run this script again.'
}
Push-Location (Join-Path $PSScriptRoot 'isec-website')
try {
    if (!(Test-Path 'node_modules')) {
        npm.cmd ci
        if ($LASTEXITCODE -ne 0) { throw 'Dependency installation failed.' }
    }
    npm.cmd run dev -- --host 127.0.0.1
} finally {
    Pop-Location
}
