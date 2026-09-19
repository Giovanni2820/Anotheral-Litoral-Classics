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
  // Si el link trae &t= (minuto de inicio), el video arranca desde ahí.
  youtubeId: 'https://www.youtube.com/watch?v=H2oCP-Cs04s&t=499s',

  // Texto que va encima del video, como en la referencia.
  videoTitle: 'COCINA POR PESO$',
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
  // El póster del merch, armado en código: fondo rojo + cada producto como
  // PNG recortado encima, con animaciones. Si se borra el bloque merch entero,
  // el sitio vuelve a mostrar la imagen fija de merchImage.
  merchImage: 'media/MERCHFINAL.png',
  merchAlt: 'Catálogo de merch de Cocina por Peso$: CD, libro QR, remera y stickers',

  merch: {
    background: 'media/FONDO ROJO.png',
    watermark:  'media/ALC 1.png',      // marca de agua tenue de fondo, como en el póster
    logo:       'media/ALC 2.png',      // logo amarillo, abajo a la izquierda
    banner:     'UNA PRODUCCION DE ANOTHER LITORAL CLASSIC',

    // Un ítem por número del póster. Cada uno tiene su etiqueta, sus piezas
    // (los PNG recortados; el id fija la posición en styles.css) y el texto.
    // name:    va en cursiva, como en el póster.
    // product: índice en products, de ahí sale el precio real.
    // price:   texto fijo para lo que no se vende suelto.
    items: [
      {
        id: '1a', label: '1.a',
        pieces: [{ id: 'cd', img: 'media/CD CAJA PNG.png', alt: 'CD "Cocina por Peso$"' }],
        name: '"COCINA POR PESO$"', title: 'edición física:',
        desc: 'Disco + Libro QR (contenido extra)',
        cat: '420/6006', product: 0,
      },
      {
        id: '1b', label: '1.b',
        pieces: [{ id: 'disco', img: 'media/DISCO PNG.png', alt: 'CD "Plato del día"' }],
        name: '"PLATO DEL DIA"', title: ':',
        desc: 'CD incluido en la edición física.',
        cat: '420/6006.b', price: 'Incluido en 1.a',
      },
      {
        id: '1c', label: '1.c',
        pieces: [{ id: 'librito', img: 'media/LIBRITO PNG.png', alt: 'Libro "Menú"' }],
        name: '"MENÚ"', title: 'libro con QR + contenido extra:',
        desc: '("CONSUMO DELIBERADO - un mensaje de Aq y Otta" + "Adenosina Trifosfato version alternativa (Dirty mix)" + ALBUM + INSTRUMENTALES + ACAPELLAS EN .WAV)',
        cat: '420/6006.c', price: 'Incluido en 1.a',
      },
      {
        id: '2', label: '2',
        pieces: [
          { id: 'sticker-dedo', img: 'media/STICKERDedo PNG.png', alt: 'Sticker "Dedo"' },
          { id: 'sticker-cxs',  img: 'media/STICKERCx$ PNG.png',  alt: 'Sticker "CX$"'  },
        ],
        title: 'Stickers "DEDO" y "CX$":',
        desc: 'Incluidos en todas las compras.',
        cat: '420/6007', price: 'Incluido en 1.a',
      },
      {
        id: '3', label: '3',
        pieces: [
          { id: 'remera-blanca', img: 'media/REMERA BLANCA PNG.png', alt: 'Remera blanca' },
          { id: 'remera-negra',  img: 'media/REMERA NEGRA PNG.png',  alt: 'Remera negra'  },
        ],
        name: '"TRACKLIST // EL BIFE ORIGINAL"', title: 'remera:',
        desc: '100% algodón peinado, estampado en serigrafía.',
        cat: '420/6008', product: 1,
      },
    ],
  },

  // --- PRODUCTOS ----------------------------------------------------------
  // Para agregar uno, copiar un bloque y cambiar los datos: la grilla lo toma sola.
  // name:     título (va en la tarjeta y en la ventana de detalle).
  // price:    en pesos, sin puntos.
  // desc:     bajada corta, sólo en la ventana de detalle.
  // includes: lista "Incluye". Cada ítem es un texto; si necesita sub-ítems,
  //           va como { item: '...', sub: ['...', '...'] }.
  // tracklist: opcional, lista de temas en orden (se numera sola).
  // img:      foto del producto (ej. 'media/cd.jpg'). Se muestra entera, sin
  //           recortar. Si queda vacío, la tarjeta muestra el nombre sobre blanco.
  // bg:       opcional, color de fondo de la foto (ej. '#5a1213'). Si la foto no
  //           es cuadrada, rellena las franjas que quedan libres para que el fondo
  //           siga parejo. Sin bg, las franjas quedan blancas.
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
      img: 'media/Producto1.png',
      bg: '#5a1213',
    },
    {
      name: '"TRACKLIST // EL BIFE ORIGINAL" remera',
      price: 35000,
      desc: '100% algodón peinado, estampado en serigrafía',
      includes: [
        '"DEDO" y "CX$" - Pack de 2 stickers',
      ],
      img: 'media/Producto2.png',
      bg: '#781918',
    },
    {
      name: '"COMBO COMPLETO" CD + REMERA "COCINA POR PESO$"',
      price: 50000,
      desc: '',
      includes: [
        '"COCINA POR PESO$" edición física: Disco + Libro QR (contenido extra)',
        '"TRACKLIST // EL BIFE ORIGINAL" remera: 100% algodón peinado, estampado en serigrafía',
      ],
      img: 'media/Producto3.png',
      bg: '#6e0707',
    },
  ],

  // --- CRÉDITOS -----------------------------------------------------------
  credits: {
    tagline: 'Ecosistema divulgador de cultura',
    year: 2026,
    dev: 'Diseño y desarrollo: —',
    links: [
      { label: 'Instagram', href: 'https://www.instagram.com/anotherlitoralclassic' },
      { label: 'YouTube',   href: 'https://youtube.com/@anotherlitoralclassic' },
      { label: 'Spotify',   href: 'https://open.spotify.com/intl-es/artist/5vVILR2nmj5hBNCIpZRxVQ' },
    ],
  },
};
