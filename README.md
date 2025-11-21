# Sitio web — Mi Generación de Poder (MIGP)

Pequeña página estática construida para la iglesia en Tamacá, Zona Norte — Barquisimeto, Lara, Venezuela.

Qué incluye:
- Página principal con `hero`, `sobre nosotros`, galería de fotos, videos, servidores, ubicación y contacto.
- Galería responsive y lightbox (modal) para ver imágenes.
- Reproducción de videos mediante modal con YouTube.
- Mapa embebido usando Google Maps (búsqueda). Reemplaza la dirección por la exacta.

Cómo personalizar el contenido rápidamente:

1. Reemplazar imágenes de la galería
   - Las imágenes actuales provienen de Unsplash como ejemplos.
   - Para usar tus propias fotos, sube los archivos a la carpeta `assets/` y cambia los `src` de las etiquetas `<img>` en `index.html`.

2. Videos
   - Actualmente se usan IDs de YouTube en los atributos `data-video-id`.
   - Sustituye `data-video-id` por el ID del video de YouTube que quieras mostrar.

3. Ubicación exacta
   - Edita el `iframe` en la sección `#location` en `index.html`.
   - Puedes usar una URL de Google Maps con coordenadas o con la dirección exacta.

4. Integrar Instagram
   - Para mostrar automáticamente el feed de Instagram puedes utilizar un servicio de terceros (embed) o la API de Instagram (requiere token).
   - De forma rápida puedes agregar un enlace a `https://www.instagram.com/migeneraciondepoder/` (ya incluido en la cabecera).

5. Desplegar el sitio
   - Es un sitio estático: puedes subir los archivos a cualquier hosting estático (Netlify, Vercel, GitHub Pages) o servir desde un servidor simple.

Notas técnicas y siguientes pasos sugeridos:
- Si deseas que el formulario de contacto sea funcional, indica el método preferido (correo, Google Forms, servicio SMTP) y lo integro.
- Puedo añadir un slider de imágenes, páginas internas para eventos o sección de sermones si quieres.

Logo:
- Coloca las imágenes de logo que adjuntaste en la carpeta `assets/` con los nombres `logo-white.png` y `logo-color.png`.
- Hay un archivo `assets/README.txt` con instrucciones y tamaños sugeridos.
- Coloca las imágenes de logo que adjuntaste en la carpeta `assets/` con los nombres `logo-white.png` y `logo-color.png`, o usa las versiones SVG ya creadas: `assets/logo-white.svg` y `assets/logo-color.svg`.
- Hay un archivo `assets/README.txt` con instrucciones y tamaños sugeridos.
- Hay un archivo `assets/README.txt` con instrucciones y tamaños sugeridos.

Si quieres, continúo: subir imágenes reales, conectar el Instagram embebido o crear una versión en dos idiomas.

---

Publicar en Netlify (guía rápida)

Opción A — GitHub → Netlify (recomendado)

1. Crea un repo en GitHub y sube los archivos del sitio desde la carpeta del proyecto:

```powershell
git init
git add .
git commit -m "Initial site for Mi Generación de Poder"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/<tu-repo>.git
git push -u origin main
```

2. En Netlify: "Add new site" → "Import from Git" → conecta GitHub → selecciona el repo → Deploy. Deja `Build command` vacío y `Publish directory` como `.`.

Opción B — Drag & Drop (rápido)

1. Crea un ZIP del sitio (tienes `create_zip.ps1` incluido):

```powershell
.\create_zip.ps1
```

2. En Netlify: "Add new site" → "Deploy manually" → arrastra `migp-site-deploy.zip`.

Despliegue con Netlify CLI (opcional)

1. Instala netlify-cli y ejecuta el script incluido:

```powershell
npm i -g netlify-cli
netlify login
.\deploy_with_netlify_cli.ps1
```

Verificar dominio y enviar sitemap a Google Search Console

1. Publica el sitio en `https://migeneraciondepoder.com/` (configura DNS en tu registrador apuntando al sitio Netlify).
2. Ve a https://search.google.com/search-console/ y añade la propiedad `https://migeneraciondepoder.com/` (URL prefix).
3. Verifica la propiedad (puedes usar la meta tag ya presente en `index.html` o el método DNS TXT).
4. En Search Console → Sitemaps, añade `https://migeneraciondepoder.com/sitemap.xml` y pulsa "Enviar".
5. Usa "URL Inspection" para pedir indexación de la URL principal si quieres acelerar la aparición.

Si quieres que yo haga el despliegue directamente, puedo hacerlo si me das:
- Acceso al repositorio GitHub (nombre del repo y permiso para push), o
- El archivo ZIP del sitio para subir al panel de Netlify por ti.

Dime cómo prefieres proceder y continúo.
