$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '../..')
node --env-file=.env.local tools/project-previews/prepare.mjs
if ($LASTEXITCODE -ne 0) { throw 'Could not prepare project previews' }
$previewProjects = Get-Content .debug/hyperframes-projects/projects.json | ConvertFrom-Json
foreach ($previewProject in $previewProjects) {
  npx --yes hyperframes@0.9.20 check $previewProject.dir --json
  if ($LASTEXITCODE -ne 0) { throw "Check failed: $($previewProject.id)" }
  npx --yes hyperframes@0.9.20 render $previewProject.dir --fps 24 --quality delivery --workers 2 --output "public/project-previews/$($previewProject.id).mp4"
  if ($LASTEXITCODE -ne 0) { throw "Render failed: $($previewProject.id)" }
}
node tools/project-previews/finalize.mjs
if ($LASTEXITCODE -ne 0) { throw 'Could not finalize project previews' }
