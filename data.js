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
  youtubeId: 'https://youtu.be/H2oCP-Cs04s',

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

  // --- PRODUCTOS ----------------------------------------------------------
  // Para agregar uno, copiar una línea y cambiar los datos: la grilla lo toma sola.
  // price: en pesos, sin puntos.
  // desc:  se muestra en la ventana de detalle (quick view), no en la tarjeta.
  // img:   foto del producto (ej. 'media/remera.jpg'). Idealmente cuadrada y con
  //        fondo blanco, así se ve el recuadro blanco como en la referencia.
  //        Si queda vacío, la tarjeta muestra el nombre sobre fondo blanco.
  products: [
    { name: 'Producto 1', price: 25000, desc: 'Descripción breve del producto.', img: '' },
    { name: 'Producto 2', price: 18000, desc: 'Descripción breve del producto.', img: '' },
    { name: 'Producto 3', price: 32000, desc: 'Descripción breve del producto.', img: '' },
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
