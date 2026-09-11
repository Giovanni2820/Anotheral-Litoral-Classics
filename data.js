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
  youtubeId: 'https://www.youtube.com/watch?v=IG6xt2juJ8Y',

  // --- HEADER -------------------------------------------------------------
  // Logo que va centrado arriba de las banderas.
  logo: 'media/ALC 1.png',
  tagline: 'Banderas del Litoral',

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
  // price en pesos, sin puntos.
  // img: ruta a una imagen (ej. 'media/remera.jpg'). Si queda vacío se genera
  // un fondo con los colores de `colors`: [fondo, luz 1, luz 2, color del texto].
  products: [
    { name: 'Producto 1', price: 25000, desc: 'Descripción breve del producto.', img: '', colors: ['#2a1f18', '#c98f4a', '#5b2f22', '#f6ead2'] },
    { name: 'Producto 2', price: 18000, desc: 'Descripción breve del producto.', img: '', colors: ['#1a2420', '#6fae95', '#243b33', '#eaf5ee'] },
    { name: 'Producto 3', price: 32000, desc: 'Descripción breve del producto.', img: '', colors: ['#291a24', '#b06a92', '#150d13', '#ffe4f3'] },
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
