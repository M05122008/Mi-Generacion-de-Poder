# Crea un archivo ZIP con el contenido del sitio listo para subir a Netlify (drag & drop)
# Uso: abrir PowerShell en la carpeta del proyecto y ejecutar: .\create_zip.ps1

$zipName = "migp-site-deploy.zip"
$source = Get-Location
$exclude = @("*.git*", "node_modules", "$zipName")

Write-Host "Creando $zipName desde $source ..."

# Compresión simple: incluye todo excepto node_modules y .git
Compress-Archive -Path * -DestinationPath $zipName -Force

Write-Host "Hecho. Encontrarás $zipName en la carpeta actual."