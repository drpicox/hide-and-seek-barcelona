# Generar Icones PWA

Pots generar les icones necessàries a partir de l'SVG utilitzant eines online o ImageMagick:

## Opció 1: Online (més fàcil)
1. Obre https://realfavicongenerator.net/
2. Puja `public/icon.svg`
3. Descarrega totes les icones generades
4. Col·loca-les a la carpeta `public/`

## Opció 2: ImageMagick (línia de comandes)
```bash
# Instal·la ImageMagick si no el tens
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Genera les icones des de l'SVG
convert public/icon.svg -resize 192x192 public/icon-192.png
convert public/icon.svg -resize 512x512 public/icon-512.png
convert public/icon.svg -resize 180x180 public/apple-touch-icon.png
convert public/icon.svg -resize 32x32 public/favicon.ico
```

## Fitxers necessaris:
- `favicon.ico` (32x32) - Icona per navegadors
- `icon-192.png` (192x192) - Icona petita PWA
- `icon-512.png` (512x512) - Icona gran PWA
- `apple-touch-icon.png` (180x180) - Icona per iPhone/iPad

## Comprovar la instal·lació:
1. Obre l'app al mòbil
2. Android: Chrome > Menú (tres punts) > "Afegeix a la pantalla d'inici"
3. iPhone: Safari > Compartir > "Afegeix a l'inici"

