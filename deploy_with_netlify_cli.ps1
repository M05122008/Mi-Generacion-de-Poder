# Script PowerShell para desplegar usando Netlify CLI
# Requisitos: Node.js + npm, netlify-cli instalado globalmente (`npm i -g netlify-cli`)
# Uso: abrir PowerShell en la carpeta del sitio y ejecutar: .\deploy_with_netlify_cli.ps1

param(
  [string]$SiteId = "",
  [switch]$Prod
)

Write-Host "Deploy script para Netlify"
Write-Host "1) Si no has iniciado sesión en Netlify, este script te indicará que lo hagas."

# Check netlify-cli
if(!(Get-Command netlify -ErrorAction SilentlyContinue)){
  Write-Host "netlify-cli no encontrado. Instala con: npm i -g netlify-cli" -ForegroundColor Yellow
  Exit 1
}

# Login (interactive) if needed
Write-Host "Abriendo login de Netlify (si es necesario)..."
netlify login

if($SiteId -eq ""){
  Write-Host "No se proporcionó Site ID. Puedes inicializar un nuevo sitio con: netlify init" -ForegroundColor Yellow
  Write-Host "Ejecutando 'netlify init' (elige 'Create & configure a new site' o 'Link to existing site' según prefieras)..."
  netlify init
} else {
  if($Prod){
    Write-Host "Desplegando a producción (site id: $SiteId)..."
    netlify deploy --dir=. --prod --site $SiteId
  } else {
    Write-Host "Desplegando preview (site id: $SiteId)..."
    netlify deploy --dir=. --site $SiteId
  }
}

Write-Host "Proceso terminado. Revisa la URL que netlify imprime en consola."