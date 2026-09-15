/* ==========================================================================
   Another Litoral Classic — CONTENIDO DEL SITIO
   Este es el único archivo que hay que editar para cargar contenido real.
   ========================================================================== */

const SITE = {
  brand: 'Another Litoral Classic',

  // Número de WhatsApp: código de país + área + número, sin "+" ni espacios.
  // Ej. Argentina, Rosario: 549341XXXXXXX
  whatsapp: '5493410000000',

  // Video de YouTube: se puede pegar el link completo o sólo el ID.
  // Vacío = se muestra el placeholder "VIDEO CLIP DE YOUTUBE".
  // Arranca solo y sin sonido (los navegadores no permiten autoplay con audio);
  // el visitante activa el sonido con los controles del reproductor.
  youtubeId: 'https://www.youtube.com/watch?v=AIpyLlPd7Yo',

  // Texto que va encima del video, como en la referencia.
  videoTitle: 'Adenosina Trifosfato',
  videoSubtitle: 'Aq & Otta',

  // --- HEADER -------------------------------------------------------------
  // Logo que va centrado arriba de las banderas.
  logo: 'media/ALC 1.png',

  // Banderas que desfilan por detrás del logo, en loop infinito.
  // El orden es el del desfile. Para sumar o sacar una, editar esta lista.
  flags: [
    { name: 'Misiones',   img: 'media/bandera-misiones.png'   },
    { name: 'Corrientes', img: 'media/bandera-corrientes.jpg' },
    { name: 'Chaco',      img: 'media/bandera-chaco.png'      },
    { name: 'Formosa',    img: 'media/bandera-formosa.jpg'    },
    { name: 'Entre Ríos', img: 'media/bandera-entre-rios.jpg' },
    { name: 'Santa Fe',   img: 'media/bandera-santa-fe.jpg'   },
  ],

  // --- MERCH --------------------------------------------------------------
  // Imagen a ancho completo entre el video y los productos.
  merchImage: 'media/MERCHFINAL.png',
  merchAlt: 'Catálogo de merch de Cocina por Peso$: CD, libro QR, remera y stickers',

  // --- PRODUCTOS ----------------------------------------------------------
  // Para agregar uno, copiar un bloque y cambiar los datos: la grilla lo toma sola.
  // name:     título (va en la tarjeta y en la ventana de detalle).
  // price:    en pesos, sin puntos.
  // desc:     bajada corta, sólo en la ventana de detalle.
  // includes: lista "Incluye". Cada ítem es un texto; si necesita sub-ítems,
  //           va como { item: '...', sub: ['...', '...'] }.
  // tracklist: opcional, lista de temas en orden (se numera sola).
  // img:      foto del producto (ej. 'media/cd.jpg'). Idealmente cuadrada y con
  //           fondo blanco. Si queda vacío, la tarjeta muestra el nombre sobre blanco.
  products: [
    {
      name: '"COCINA POR PESO$" edición física',
      price: 20000,
      desc: 'Disco + Libro QR (contenido extra)',
      includes: [
        '"PLATO DEL DIA" - CD con el tracklist completo de "COCINA POR PESO$"',
        { item: '"MENÚ" - libro con QR que desbloquea el contenido extra:', sub: [
          '"CONSUMO DELIBERADO - un mensaje de Aq y Otta"',
          '"Adenosina Trifosfato version alternativa (Dirty mix)"',
          'ALBUM + INSTRUMENTALES + ACAPELLAS EN .WAV',
        ]},
        '"DEDO" y "CX$" - Pack de 2 stickers',
      ],
      tracklist: [
        'MENÚ DE PASOS',
        'T.L.I.D.',
        'ESPEJOS DE COLORES',
        'GRAN BAZAR DE ESTAMBUL',
        'ADENOSINA TRIFOSFATO',
        'MADVILANESCO',
        'MISE EN PLACE',
        'SABORES Y TEXTURAS',
      ],
      img: '',
    },
    {
      name: '"TRACKLIST // EL BIFE ORIGINAL" remera',
      price: 35000,
      desc: '100% algodón peinado, estampado en serigrafía',
      includes: [
        '"DEDO" y "CX$" - Pack de 2 stickers',
      ],
      img: '',
    },
    {
      name: '"COMBO COMPLETO" CD + REMERA "COCINA POR PESO$"',
      price: 50000,
      desc: '',
      includes: [
        '"COCINA POR PESO$" edición física: Disco + Libro QR (contenido extra)',
        '"TRACKLIST // EL BIFE ORIGINAL" remera: 100% algodón peinado, estampado en serigrafía',
      ],
      img: '',
    },
  ],

  // --- CRÉDITOS -----------------------------------------------------------
  credits: {
    year: 2026,
    dev: 'Diseño y desarrollo: —',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'YouTube',   href: '#' },
    ],
  },
};
