# Пересоздать data/combinations.json из папки Images
$projectRoot = Split-Path $PSScriptRoot -Parent
$imagesPath = Join-Path $projectRoot "Images"

if (-not (Test-Path $imagesPath)) {
    Write-Error "Папка Images не найдена: $imagesPath"
    exit 1
}

$dirs = Get-ChildItem $imagesPath -Directory | Sort-Object Name
$combinations = @()
$id = 1

foreach ($dir in $dirs) {
    $files = Get-ChildItem $dir.FullName -File | Sort-Object Name | Select-Object -First 9
    if ($files.Count -eq 0) { continue }

    $imagePaths = $files | ForEach-Object { "../images/" + $dir.Name + "/" + $_.Name }
    $nameParts = $dir.Name -split '\s*,\s*|\s+и\s+'

    $combinations += [ordered]@{
        id     = $id
        name   = $dir.Name
        colors = @($nameParts | ForEach-Object { $_.Trim() } | Where-Object { $_ })
        images = @($imagePaths)
    }
    $id++
}

$json = @{ combinations = $combinations } | ConvertTo-Json -Depth 6
[System.IO.File]::WriteAllText(
    (Join-Path $projectRoot "data\combinations.json"),
    $json,
    [System.Text.UTF8Encoding]::new($false)
)

Write-Host "Создано сочетаний:" $combinations.Count
