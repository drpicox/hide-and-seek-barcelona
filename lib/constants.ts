import type { HelpContent } from './types'

export const HELP_CONTENT: Record<string, HelpContent> = {
  matching: {
    category: {
      title: 'Preguntas de Matching',
      format: 'Is your nearest _______ the same as my nearest _______?',
      timeLimit: '5 minutos',
      cardCost: 'Roba 3, Quédate 1',
      tips: [
        'Útiles en cualquier punto del juego',
        'Requieren que los buscadores se muevan para optimizar eficacia',
        'Si las ubicaciones están fuera del mapa, se consideran inexistentes'
      ],
      examples: [
        'Aeropuertos comerciales, estaciones de tren',
        'Divisiones administrativas',
        'Elementos naturales (montañas, parques)',
        'Lugares de interés (museos, hospitales)'
      ],
      important: 'Las respuestas válidas son SÍ o NO'
    },
    questions: {
      'Commercial Airport': {
        hint: 'Un aeropuerto se considera comercial si puedes ver vuelos desde/hacia él en Google Flights',
        details: 'Si hay alguna ambigüedad, un aeropuerto se considera comercial si puedes ver vuelos desde/hacia él a través de Google Flights (flights.google.com).',
        tips: ['Verifica en Google Flights (flights.google.com)', 'Los aeropuertos privados NO cuentan', 'Debe tener vuelos comerciales programados']
      },
      'Transit Line': {
        hint: 'Debes estar EN el transporte y DEBE ESTAR EN MOVIMIENTO',
        details: 'Importante: Para hacer esta pregunta, los buscadores deben estar en la forma de transporte, y debe estar en movimiento. La respuesta es sí si el transporte que los buscadores están usando actualmente se detendría en la estación del escondido.',
        tips: ['Haz captura de pantalla de todas las paradas de tu línea', 'Solo cuenta si tu tren SE DETIENE en esa estación', 'Trenes express que pasan pero no paran = NO']
      },
      "Station's Name Length": {
        hint: 'Número de caracteres - guiones y espacios cuentan',
        details: 'Número de caracteres (guiones y espacios cuentan) en la estación, según lo definido por tu aplicación de mapas. Si la aplicación incluye la palabra "estación", eso cuenta.',
        tips: ['Cuenta TODOS los caracteres incluyendo espacios', 'Los guiones también cuentan', 'Si aparece "Estación" en el nombre del mapa, cuenta']
      },
      'Street or Path': {
        hint: 'Una calle termina cuando cambia de nombre',
        details: 'Se considera que una calle o camino ha terminado cuando adquiere un nombre diferente. Esto incluye cambiar de "Jet Lag St. Este" a "Jet Lag St. Oeste". Si la calle no tiene nombre, se considera que comienza o termina donde tiene una intersección.',
        tips: ['Cambios de Este/Oeste/Norte/Sur cuentan como nombres diferentes', 'Calles sin nombre terminan en intersecciones']
      },
      '1st Admin. Division': {
        hint: 'La categoría formal más grande de división administrativa',
        details: 'Esta es la categoría formal más grande de división. Para España, serían comunidades autónomas. En EE.UU., estados. En Suiza, cantones. En Japón, prefecturas.',
        tips: ['España: Comunidades autónomas', 'EE.UU.: Estados', 'Suiza: Cantones', 'Japón: Prefecturas']
      },
      '2nd Admin. Division': {
        hint: 'Un nivel más detallado que la primera división',
        details: 'Un nivel de división más detallado. En España, esto es provincias. En EE.UU., condados. En Suiza, distritos. En Japón, subprefecturas.',
        tips: ['España: Provincias', 'EE.UU.: Condados', 'Suiza: Distritos']
      },
      '3rd Admin. Division': {
        hint: 'Nivel de municipalidad en la mayoría de países',
        details: 'Un nivel más abajo. En España, EE.UU., Suiza y Japón, esto sería municipalidad. Los límites pueden ser ambiguos, los buscadores deben aclarar al preguntar.',
        tips: ['Típicamente es la municipalidad', 'Los límites pueden ser ambiguos']
      },
      '4th Admin. Division': {
        hint: 'Distritos dentro de ciudades grandes',
        details: 'Algunos lugares no tienen una cuarta división administrativa, pero muchas ciudades más grandes sí. Nueva York tiene distritos, Madrid tiene distritos, Tokio tiene distritos especiales.',
        tips: ['No todos los lugares tienen 4ta división', 'Ciudades grandes típicamente tienen distritos']
      },
      'Mountain': {
        hint: 'Cualquier cosa clasificada como montaña por tu app de mapas',
        details: 'Cualquier cosa clasificada correctamente como una montaña por tu aplicación de mapas. Mide la distancia desde el icono del mapa.',
        tips: ['Verifica la clasificación en la app de mapas', 'Mide desde el icono, no desde la base', 'Las colinas generalmente NO cuentan']
      },
      'Landmass': {
        hint: 'Área de tierra no dividida por vías fluviales',
        details: 'Un área de tierra en una pieza, no dividida por una vía fluvial. Si el escondido está en una masa de tierra completamente rodeada por la masa donde están los buscadores, cuenta como coincidencia.',
        tips: ['Tierra no dividida por ríos', 'Islas completamente rodeadas cuentan como parte de la masa continental', 'Sé razonable con interpretaciones']
      },
      'Park': {
        hint: 'Cualquier cosa clasificada como parque por tu app',
        details: 'Cualquier cosa clasificada correctamente como un parque por tu aplicación de mapas. Mide desde el icono del mapa. Esto puede producir resultados contraintuitivos en parques grandes.',
        tips: ['Siempre mide al icono del mapa', 'Puede producir resultados extraños en parques grandes', 'Este sistema es el más objetivo']
      },
      'Amusement Park': {
        hint: 'Categorizado como parque de atracciones',
        details: 'Cualquier cosa categorizada correctamente como un parque de atracciones por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Parque de Atracciones"', 'Mide desde el icono']
      },
      'Zoo': {
        hint: 'Categorizado como zoológico',
        details: 'Cualquier cosa categorizada correctamente como un zoológico por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Zoológico"', 'Mide desde el icono']
      },
      'Aquarium': {
        hint: 'Categorizado como acuario',
        details: 'Cualquier cosa categorizada correctamente como un acuario por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Acuario"', 'Mide desde el icono']
      },
      'Golf Course': {
        hint: 'Campo de golf al aire libre - minigolf NO cuenta',
        details: 'Un campo de golf al aire libre. El minigolf no cuenta. Los campos de práctica no cuentan. Mide desde el icono del mapa.',
        tips: ['Solo campos de golf de tamaño completo', 'Minigolf NO cuenta', 'Campos de práctica NO cuentan']
      },
      'Museum': {
        hint: 'Categorizado como museo',
        details: 'Cualquier cosa categorizada correctamente como un museo por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Museo"', 'Mide desde el icono']
      },
      'Movie Theater': {
        hint: 'Categorizado como cine',
        details: 'Cualquier cosa categorizada correctamente como un cine por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Cine"', 'Mide desde el icono']
      },
      'Hospital': {
        hint: 'Categorizado como hospital',
        details: 'Cualquier cosa categorizada correctamente como un hospital por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizado como "Hospital"', 'Mide desde el icono']
      },
      'Library': {
        hint: 'Categorizada como biblioteca',
        details: 'Cualquier cosa categorizada correctamente como una biblioteca por tu aplicación de mapas. Mide desde el icono del mapa.',
        tips: ['Debe estar categorizada como "Biblioteca"', 'Mide desde el icono']
      },
      'Foreign Consulate': {
        hint: 'Consulado extranjero - NO honorarios',
        details: 'Cualquier cosa categorizada correctamente como un consulado extranjero por tu aplicación de mapas. Excluye consulados honorarios. Mide desde el icono del mapa.',
        tips: ['Consulados honorarios NO cuentan', 'Solo consulados oficiales', 'Mide desde el icono']
      }
    }
  },
  measuring: {
    category: {
      title: 'Preguntas de Medición',
      format: 'Compared to me, are you closer to or further from _______?',
      timeLimit: '5 minutos',
      cardCost: 'Roba 3, Quédate 1',
      tips: [
        'Buenas para cortar el mapa de formas únicas',
        'Funcionan con fronteras, transporte, elementos naturales'
      ],
      important: 'Las respuestas válidas son MÁS CERCA o MÁS LEJOS'
    },
    questions: {
      'A Commercial Airport': {
        hint: 'Aeropuerto comercial - verifica en Google Flights',
        details: 'Si hay alguna ambigüedad, un aeropuerto se considera comercial si puedes ver vuelos desde/hacia él en Google Flights (flights.google.com). Mide al icono.',
        tips: ['Verifica en Google Flights', 'Los aeropuertos privados NO cuentan', 'Compara distancias al icono']
      },
      'A High Speed Train Line': {
        hint: 'Línea de tren de alta velocidad más cercana',
        details: 'La línea de tren de alta velocidad más cercana según tu app. Mide en línea recta a la línea ferroviaria, no a la estación.',
        tips: ['Solo trenes de alta velocidad (AVE, TGV, etc.)', 'Mide a la línea, no a la estación', 'Trenes regionales NO cuentan']
      },
      'A Rail Station': {
        hint: 'Cualquier estación de tren o metro',
        details: 'Cualquier estación de transporte ferroviario según tu app. Incluye metro, tren ligero, tren suburbano. Mide desde el icono.',
        tips: ['Metro, tren ligero cuentan', 'Mide desde el icono', 'Paradas de autobús NO cuentan']
      },
      'An International Border': {
        hint: 'Frontera entre dos países',
        details: 'La frontera internacional más cercana. Mide la distancia perpendicular más corta a la línea fronteriza.',
        tips: ['Frontera entre dos países soberanos', 'Mide perpendicular a la línea']
      },
      'A 1st Admin. Div. Border': {
        hint: 'Frontera de la división administrativa más grande',
        details: 'Frontera de la primera división administrativa (comunidad autónoma, estado, cantón). Mide perpendicular a la línea fronteriza.',
        tips: ['España: Frontera entre comunidades', 'EE.UU.: Frontera entre estados']
      },
      'A 2nd Admin. Div. Border': {
        hint: 'Frontera de la segunda división administrativa',
        details: 'Frontera de la segunda división (provincia, condado, distrito). Mide perpendicular a la línea fronteriza.',
        tips: ['España: Frontera entre provincias', 'EE.UU.: Frontera entre condados']
      },
      'Sea Level': {
        hint: 'Nivel del mar (elevación cero)',
        details: 'Nivel del mar - elevación de 0 metros. Mide tu distancia vertical (elevación) respecto al nivel del mar.',
        tips: ['Usa la elevación en tu app', 'Distancia vertical, no horizontal', 'Puede ser negativa']
      },
      'A Body of Water': {
        hint: 'Cualquier masa de agua en el mapa',
        details: 'Cualquier cuerpo de agua clasificado como tal en tu app (lago, río, océano, mar). Mide desde el punto más cercano del agua.',
        tips: ['Lagos, ríos, océanos cuentan', 'Mide al punto más cercano']
      },
      'A Coastline': {
        hint: 'Línea donde la tierra se encuentra con el mar',
        details: 'La costa más cercana - donde la tierra se encuentra con el mar u océano. Mide desde el punto más cercano de la costa.',
        tips: ['Solo costa marítima (océano/mar)', 'Lagos NO cuentan']
      },
      'A Mountain': {
        hint: 'Cualquier cosa clasificada como montaña',
        details: 'Cualquier cosa clasificada correctamente como una montaña por tu app. Mide desde el icono del mapa.',
        tips: ['Verifica la clasificación', 'Mide desde el icono', 'Colinas generalmente NO cuentan']
      },
      'A Park': {
        hint: 'Cualquier cosa clasificada como parque',
        details: 'Cualquier cosa clasificada correctamente como un parque por tu app. Mide desde el icono del mapa.',
        tips: ['Siempre mide al icono', 'Puede producir resultados contraintuitivos']
      },
      'An Amusement Park': {
        hint: 'Categorizado como parque de atracciones',
        details: 'Cualquier cosa categorizada correctamente como parque de atracciones por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'A Zoo': {
        hint: 'Categorizado como zoológico',
        details: 'Cualquier cosa categorizada correctamente como zoológico por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'An Aquarium': {
        hint: 'Categorizado como acuario',
        details: 'Cualquier cosa categorizada correctamente como acuario por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'A Golf Course': {
        hint: 'Campo de golf al aire libre - minigolf NO',
        details: 'Un campo de golf al aire libre. El minigolf no cuenta. Los campos de práctica no cuentan. Mide desde el icono.',
        tips: ['Solo campos de golf completos', 'Minigolf NO cuenta']
      },
      'A Museum': {
        hint: 'Categorizado como museo',
        details: 'Cualquier cosa categorizada correctamente como museo por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'A Movie Theater': {
        hint: 'Categorizado como cine',
        details: 'Cualquier cosa categorizada correctamente como cine por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'A Hospital': {
        hint: 'Categorizado como hospital',
        details: 'Cualquier cosa categorizada correctamente como hospital por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizado correctamente', 'Mide desde el icono']
      },
      'A Library': {
        hint: 'Categorizada como biblioteca',
        details: 'Cualquier cosa categorizada correctamente como biblioteca por tu app. Mide desde el icono.',
        tips: ['Debe estar categorizada correctamente', 'Mide desde el icono']
      },
      'A Foreign Consulate': {
        hint: 'Consulado extranjero - NO honorarios',
        details: 'Cualquier cosa categorizada correctamente como consulado extranjero por tu app. Excluye consulados honorarios. Mide desde el icono.',
        tips: ['Consulados honorarios NO cuentan', 'Solo consulados oficiales']
      }
    }
  },
  thermometer: {
    category: {
      title: 'Preguntas de Termómetro',
      format: "I've just traveled [Distance]. Am I hotter or colder?",
      timeLimit: '5 minutos',
      cardCost: 'Roba 2, Quédate 1',
      tips: [
        'Envía tu ubicación inicial antes de moverte',
        'Si la nueva ubicación está más cerca: MÁS CALIENTE',
        'Si está más lejos: MÁS FRÍO'
      ],
      important: 'La distancia se mide en línea recta'
    },
    questions: {
      '1 km': {
        hint: 'Viaja 1 km en línea recta desde tu ubicación inicial',
        details: 'Debes informar al escondido que estás comenzando un termómetro y enviarle tu ubicación actual. Luego, después de viajar al menos 1 km medido en línea recta, envías tu nueva ubicación. Si estás más cerca del escondido, MÁS CALIENTE. De lo contrario, MÁS FRÍO.',
        tips: ['Envía ubicación inicial ANTES de moverte', 'Mínimo 1 km en línea recta', 'Más cerca = MÁS CALIENTE', 'Más lejos = MÁS FRÍO']
      },
      '5 km': {
        hint: 'Viaja 5 km en línea recta desde tu ubicación inicial',
        details: 'Debes informar al escondido que estás comenzando un termómetro y enviarle tu ubicación actual. Luego, después de viajar al menos 5 km medido en línea recta, envías tu nueva ubicación. Si estás más cerca del escondido, MÁS CALIENTE. De lo contrario, MÁS FRÍO.',
        tips: ['Envía ubicación inicial ANTES de moverte', 'Mínimo 5 km en línea recta', 'Más cerca = MÁS CALIENTE', 'Más lejos = MÁS FRÍO']
      }
    }
  },
  radar: {
    category: {
      title: 'Preguntas de Radar',
      format: 'Are you within [Distance] of me?',
      timeLimit: '5 minutos',
      cardCost: 'Roba 2, Quédate 1',
      tips: [
        'Verifican si estás en el área general correcta',
        'Útiles para tachar partes densas del mapa',
        'Se refieren a tu UBICACIÓN, no a tu zona'
      ],
      important: 'Las respuestas válidas son SÍ o NO'
    },
    questions: {
      '500 m': {
        hint: '¿Estás dentro de 500 metros de mí?',
        details: '¿Estás dentro de 500 metros de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 500 metros']
      },
      '1 km': {
        hint: '¿Estás dentro de 1 km de mí?',
        details: '¿Estás dentro de 1 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 1 kilómetro']
      },
      '2 km': {
        hint: '¿Estás dentro de 2 km de mí?',
        details: '¿Estás dentro de 2 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 2 kilómetros']
      },
      '5 km': {
        hint: '¿Estás dentro de 5 km de mí?',
        details: '¿Estás dentro de 5 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 5 kilómetros']
      },
      '10 km': {
        hint: '¿Estás dentro de 10 km de mí?',
        details: '¿Estás dentro de 10 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 10 kilómetros']
      },
      '15 km': {
        hint: '¿Estás dentro de 15 km de mí?',
        details: '¿Estás dentro de 15 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 15 kilómetros']
      },
      '40 km': {
        hint: '¿Estás dentro de 40 km de mí?',
        details: '¿Estás dentro de 40 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 40 kilómetros']
      },
      '80 km': {
        hint: '¿Estás dentro de 80 km de mí?',
        details: '¿Estás dentro de 80 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 80 kilómetros']
      },
      '160 km': {
        hint: '¿Estás dentro de 160 km de mí?',
        details: '¿Estás dentro de 160 km de mí? Mide desde tu ubicación ACTUAL, no tu zona de escondite. La distancia se mide en línea recta.',
        tips: ['Mide desde ubicación ACTUAL', 'No desde zona de escondite', 'Radio de 160 kilómetros']
      },
      'CHOOSE (cualquier distancia)': {
        hint: 'Puedes elegir cualquier distancia que desees',
        details: 'Puedes elegir cualquier distancia. Especifica la distancia al hacer la pregunta. El escondido responde si estás dentro de esa distancia de su ubicación ACTUAL en línea recta.',
        tips: ['Especifica la distancia al preguntar', 'Puede ser cualquier distancia', 'Útil para distancias no estándar']
      }
    }
  },
  photos: {
    category: {
      title: 'Preguntas de Fotos',
      format: 'Send a photo of [Subject].',
      timeLimit: '10 minutos (¡más tiempo!)',
      cardCost: 'Roba 1, Quédate 1',
      tips: [
        'Cada foto tiene requisitos específicos',
        'NO uses Google Street View'
      ],
      important: '"No puedo responder" es válido si no es posible'
    },
    questions: {
      'A Tree': {
        hint: 'Debe incluir el árbol completo',
        details: 'Debe incluir el árbol completo. La foto debe mostrar desde la base hasta la copa del árbol. Usa la lente predeterminada de tu teléfono sin zoom.',
        tips: ['Árbol completo de base a copa', 'No uses zoom', 'Lente predeterminada del teléfono']
      },
      'The Sky': {
        hint: 'Coloca el teléfono en el suelo, dispara directamente hacia arriba',
        details: 'Coloca el teléfono en el suelo, dispara directamente hacia arriba usando la lente predeterminada sin zoom. El teléfono debe estar completamente plano en el suelo.',
        tips: ['Teléfono plano en el suelo', 'Dispara directamente hacia arriba (90 grados)', 'No uses zoom']
      },
      'You': {
        hint: 'Modo selfie, brazo completamente extendido',
        details: 'Modo selfie. Teléfono perpendicular al suelo, brazo completamente extendido, usando la lente predeterminada sin zoom. El brazo debe estar paralelo al suelo.',
        tips: ['Modo selfie con cámara frontal', 'Brazo completamente extendido', 'Brazo paralelo al suelo', 'No uses zoom']
      },
      'Widest Street': {
        hint: 'Debe incluir ambos lados de la calle',
        details: 'Debe incluir ambos lados de la calle; no tiene que incluir el fondo. La calle más ancha desde tu perspectiva. Toma la foto desde un lado capturando ambos bordes.',
        tips: ['Ambos lados de la calle visibles', 'No necesita incluir el horizonte', 'La calle más ancha desde tu ubicación']
      },
      'Tallest Structure in Sightline': {
        hint: 'Más alta desde tu perspectiva - debe incluir parte superior y ambos lados',
        details: 'El edificio más alto desde tu perspectiva, no el objetivamente más alto. Debe incluir la parte superior y ambos lados. La parte superior debe estar en el tercio superior del marco.',
        tips: ['Más alta desde TU perspectiva', 'Debe incluir parte superior y ambos lados', 'Parte superior en tercio superior del marco']
      },
      'Any Building from Station': {
        hint: 'Debe estar directamente afuera de una entrada de la estación',
        details: 'Debe estar directamente afuera de una entrada de la estación. Si hay múltiples entradas, puedes elegir. Debe incluir techo y ambos lados, con la parte superior en el tercio superior del marco.',
        tips: ['Párate directamente afuera de la entrada', 'Si hay varias entradas, elige una', 'Debe incluir techo y ambos lados']
      }
    }
  }
}

export const INITIAL_QUESTIONS: Record<string, any> = {
  matching: [
    { name: 'Commercial Airport', checked: false },
    { name: 'Transit Line', checked: false },
    { name: "Station's Name Length", checked: false },
    { name: 'Street or Path', checked: false },
    { name: '1st Admin. Division', checked: false },
    { name: '2nd Admin. Division', checked: false },
    { name: '3rd Admin. Division', checked: false },
    { name: '4th Admin. Division', checked: false },
    { name: 'Mountain', checked: false },
    { name: 'Landmass', checked: false },
    { name: 'Park', checked: false },
    { name: 'Amusement Park', checked: false },
    { name: 'Zoo', checked: false },
    { name: 'Aquarium', checked: false },
    { name: 'Golf Course', checked: false },
    { name: 'Museum', checked: false },
    { name: 'Movie Theater', checked: false },
    { name: 'Hospital', checked: false },
    { name: 'Library', checked: false },
    { name: 'Foreign Consulate', checked: false }
  ],
  measuring: [
    { name: 'A Commercial Airport', checked: false },
    { name: 'A High Speed Train Line', checked: false },
    { name: 'A Rail Station', checked: false },
    { name: 'An International Border', checked: false },
    { name: 'A 1st Admin. Div. Border', checked: false },
    { name: 'A 2nd Admin. Div. Border', checked: false },
    { name: 'Sea Level', checked: false },
    { name: 'A Body of Water', checked: false },
    { name: 'A Coastline', checked: false },
    { name: 'A Mountain', checked: false },
    { name: 'A Park', checked: false },
    { name: 'An Amusement Park', checked: false },
    { name: 'A Zoo', checked: false },
    { name: 'An Aquarium', checked: false },
    { name: 'A Golf Course', checked: false },
    { name: 'A Museum', checked: false },
    { name: 'A Movie Theater', checked: false },
    { name: 'A Hospital', checked: false },
    { name: 'A Library', checked: false },
    { name: 'A Foreign Consulate', checked: false }
  ],
  thermometer: [
    { name: '1 km', checked: false },
    { name: '5 km', checked: false }
  ],
  radar: [
    { name: '500 m', checked: false },
    { name: '1 km', checked: false },
    { name: '2 km', checked: false },
    { name: '5 km', checked: false },
    { name: '10 km', checked: false },
    { name: '15 km', checked: false },
    { name: '40 km', checked: false },
    { name: '80 km', checked: false },
    { name: '160 km', checked: false },
    { name: 'CHOOSE (cualquier distancia)', checked: false }
  ],
  photos: [
    { name: 'A Tree', description: 'Debe incluir el árbol completo', taken: false },
    { name: 'The Sky', description: 'Teléfono en el suelo, dispara hacia arriba', taken: false },
    { name: 'You', description: 'Selfie con brazo extendido', taken: false },
    { name: 'Widest Street', description: 'Debe incluir ambos lados', taken: false },
    { name: 'Tallest Structure in Sightline', description: 'La más alta desde tu perspectiva', taken: false },
    { name: 'Any Building from Station', description: 'Directamente afuera de la entrada', taken: false }
  ]
}

export const MEASUREMENT_SCALE = {
  metersPerPixel: 113 / 100, // 113 meters = 100 pixels
  pixelsPerMeter: 100 / 113
}
