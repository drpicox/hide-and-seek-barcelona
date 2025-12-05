import type { Station } from './types'

// Stations identified on "Plànol del JOC.png"
// Image dimensions: 3306x2294 pixels
// Scale: 3400m width, so ~1.028 m/px
// Coordenades calibrades amb mode HACK i escalades a imatge original
// Factor d'escala aplicat: 3306/1335 = 2.476 (amplada finestra → amplada imatge)
export const STATIONS_PLANOLJOC: Station[] = [
  // Metro
  { name: 'Tetuan', x: 1344, y: 92 },
  { name: 'Liceu', x: 248, y: 955 },
  { name: 'Drassanes', x: 141, y: 1295 },
  { name: 'Universitat', x: 64, y: 129 },
  { name: 'Catalunya', x: 473, y: 356 },
  { name: 'Urquinaona', x: 753, y: 478 },
  { name: 'Jaume I', x: 782, y: 988 },
  { name: 'Barceloneta', x: 1240, y: 1508 },
  { name: 'Arc de Triomf', x: 1488, y: 559 },
  { name: 'Glòries (M)', x: 2706, y: 141 },
  { name: 'Marina (M)', x: 2149, y: 671 },
  { name: 'Llacuna', x: 3135, y: 933 },
  { name: 'Bogatell', x: 2350, y: 926 },
  { name: 'Ciutadella Vila Olímpica (M)', x: 1951, y: 1426 },
  { name: 'Wellington', x: 1830, y: 1094 },
  { name: 'Estació de França', x: 1240, y: 1317 },
  { name: 'Estació del Nord', x: 1745, y: 525 },

  // Tram
  { name: 'Ciutadella-Vila Olímpica (T)', x: 1827, y: 1302 },
  { name: 'Marina (T)', x: 2152, y: 619 },
  { name: 'Auditori Teatre Nacional (T)', x: 2300, y: 505 },
  { name: 'Glòries (T)', x: 2667, y: 134 },
  { name: "Ca l'Aranyó", x: 3147, y: 277 },
  { name: 'La Farinera', x: 3060, y: 72 },

  // Bus
  { name: 'Llúria - Urquinaona', x: 916, y: 240 },
  { name: 'Gran Via - Marina', x: 2028, y: 72 },
  { name: 'Trafalgar - Bruc', x: 1134, y: 515 },
  { name: 'Pg Picasso - Comerç', x: 1317, y: 886 },
  { name: 'Pg Colom - Via Laietana', x: 711, y: 1392 },
  { name: 'Pg Joan de Borbó - Pepe Rubianes', x: 847, y: 1963 },
  { name: 'Platja de la Barceloneta', x: 1285, y: 2035 },
  { name: 'Pg Marítim', x: 1867, y: 1842 },
  { name: 'Pallars - Pere IV', x: 2803, y: 817 },
  { name: 'Badajoz - Dr. Trueta', x: 2867, y: 1221 },
  { name: 'Av Icària - Joan Miró', x: 2273, y: 1439 },
  { name: 'Carmen Amaya - Taulat', x: 2949, y: 1557 },
  { name: 'Av Litoral - Arquitecte Sert', x: 2654, y: 1733 },
]

/**
 * Calculate Euclidean distance between two points
 */
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * Find the nearest station to a given point on the map
 * @param x X coordinate on the map
 * @param y Y coordinate on the map
 * @returns The nearest station with distance in pixels
 */
export function findNearestStation(x: number, y: number): { station: Station; distance: number } {
  let nearestStation = STATIONS_PLANOLJOC[0]
  let minDistance = calculateDistance(x, y, nearestStation.x, nearestStation.y)

  for (const station of STATIONS_PLANOLJOC) {
    const distance = calculateDistance(x, y, station.x, station.y)
    if (distance < minDistance) {
      minDistance = distance
      nearestStation = station
    }
  }

  return {
    station: nearestStation,
    distance: minDistance
  }
}
