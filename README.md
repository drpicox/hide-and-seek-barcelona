# Hide and Seek - Aplicación de Seguimiento

Aplicación web para rastrear el progreso de las preguntas durante el juego Hide and Seek (Escondite).

## Características

- **Seguimiento de Preguntas**: Marca las preguntas como respondidas en 5 categorías
  - Matching (21 preguntas)
  - Measuring (21 preguntas)
  - Thermometer (2 preguntas)
  - Radar (10 preguntas)
  - Photos (6 preguntas)

- **Sistema de Ayuda Completo**: Cada pregunta individual tiene su propia ayuda específica con:
  - Pista destacada
  - Detalles completos
  - Consejos útiles
  - Contexto de categoría

- **Manual Integrado**: Manual completo del juego con:
  - Tabla de contenidos navegable
  - Todas las reglas y especificaciones
  - Formato markdown renderizado

- **Herramienta de Medición de Distancias**: (Próximamente)
  - Medir distancias sobre los mapas del juego
  - Escala: 113 metros = 100 píxeles
  - Modos: círculo (radio) y línea (distancia recta)

- **Persistencia de Datos**: Todos los datos se guardan en localStorage

## Tecnologías

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- GitHub Pages (static export)

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar servidor de desarrollo
npm run dev

# Abrir http://localhost:3000
```

## Build y Deploy

```bash
# Build para producción
npm run build

# El deploy se hace automáticamente con GitHub Actions al hacer push a main
```

## Estructura del Proyecto

```
/app                # Next.js App Router pages
/components         # Componentes React
/lib                # Utilidades, constantes, tipos
  /hooks            # Custom hooks
  types.ts          # TypeScript interfaces
  constants.ts      # HELP_CONTENT y datos iniciales
  markdown.ts       # Parser de markdown
/public             # Assets estáticos
  /images           # Mapas del juego
  manual-content.md # Manual completo
```

## Licencia

Este proyecto es para uso personal del juego Hide and Seek.
