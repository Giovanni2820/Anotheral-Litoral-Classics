/* ==========================================================================
   Another Litoral Classic — comportamiento (vanilla, sin dependencias)
   El contenido vive en data.js (objeto SITE).
   ========================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const money = n => '$ ' + Number(n).toLocaleString('es-AR');

const coverVars = c => `--c1:${c[0]};--c2:${c[1]};--c3:${c[2]};--ct:${c[3]}`;

const waLink = name =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa "${name}"`)}`;

/* ---------- header: banderas desfilando detrás del logo ---------------------- */

const flagTrack = $('#flagTrack');

// La lista se duplica para que el loop empalme sin salto: la animación desplaza
// el track un 50%, o sea exactamente una copia completa.
const flagsHTML = SITE.flags.map(f =>
  `<img class="flag" src="${esc(f.img)}" alt="" title="${esc(f.name)}" loading="eager" decoding="async">`
).join('');
flagTrack.innerHTML = flagsHTML + flagsHTML;

// Cuanto más banderas, más largo el recorrido: mantiene la velocidad pareja.
flagTrack.style.animationDuration = `${SITE.flags.length * 7.5}s`;

const headerLogo = $('#headerLogo');
headerLogo.src = SITE.logo;
headerLogo.alt = SITE.brand;
$('#headerTag').textContent = SITE.tagline || '';

/* ---------- video de YouTube -------------------------------------------------- */

const videoFrame = $('#videoFrame');

// Acepta tanto el ID pelado como el link completo de YouTube en cualquiera de
// sus formas (watch?v=, youtu.be, /shorts/, /embed/, /live/).
function youtubeId(value){
  const raw = String(value || '').trim();
  if (!raw) return '';
  if (/^[\w-]{11}$/.test(raw)) return raw;            // ya es un ID
  const m = raw.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : '';
}

const videoId = youtubeId(SITE.youtubeId);

if (!videoId){
  videoFrame.classList.add('is-placeholder');
  $('#videoPlay').setAttribute('aria-disabled', 'true');
  $('#videoLabel').textContent = 'Video clip de YouTube';
} else if (location.protocol === 'file:'){
  // Abierto con doble clic sobre index.html: sin origen http, YouTube rechaza
  // el embed con "Error 153". Hay que servir la carpeta (ver README / serve.js).
  videoFrame.classList.add('is-placeholder');
  $('#videoPlay').setAttribute('aria-disabled', 'true');
  $('#videoLabel').innerHTML =
    'Abrí el sitio con un servidor (no con doble clic) para ver el video &middot; ' +
    `<a href="https://www.youtube.com/watch?v=${videoId}" target="_blank" rel="noopener">Ver en YouTube</a>`;
} else {
  // Arranca solo. Los navegadores sólo permiten autoplay sin sonido, así que
  // sale muteado; el visitante activa el audio con los controles de YouTube.
  //
  // `origin` es obligatorio para que YouTube valide el embed: sin él devuelve
  // "Error 153". Por el mismo motivo se usa youtube.com y no youtube-nocookie,
  // que es más estricto con el referrer.
  const params = new URLSearchParams({
    autoplay:'1', mute:'1', playsinline:'1', rel:'0',
    modestbranding:'1', enablejsapi:'1', origin: location.origin
  });
  videoFrame.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${videoId}?${params}"
            title="Video de ${esc(SITE.brand)}"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen></iframe>`;

  // Con enablejsapi el reproductor le habla a la página apenas arranca. Si en
  // unos segundos no dijo nada, es que YouTube sirvió su pantalla de error
  // (típicamente "Error 153", cuando rechaza el origen del sitio). En ese caso
  // mostramos la miniatura con un link al video en vez del cartel de error.
  let playerAlive = false;
  const hear = e => {
    if (String(e.origin).includes('youtube')) playerAlive = true;
  };
  window.addEventListener('message', hear);

  setTimeout(() => {
    window.removeEventListener('message', hear);
    if (playerAlive) return;
    videoFrame.classList.add('is-fallback');
    videoFrame.innerHTML = `
      <a class="video__fallback" href="https://www.youtube.com/watch?v=${videoId}"
         target="_blank" rel="noopener">
        <img class="video__thumb" src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" alt=""
             onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'">
        <span class="video__play">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5l11 7-11 7z"/></svg>
        </span>
        <span class="video__label">Ver en YouTube</span>
      </a>`;
  }, 6000);
}

/* ---------- grilla de productos ---------------------------------------------- */

function cardHTML(p){
  const media = p.img
    ? `<img class="card__img" src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`
    : `<div class="card__cover" style="${coverVars(p.colors)}">
         <span class="card__cover-t">${esc(p.name)}</span>
       </div>`;

  return `
    <article class="card">
      <div class="card__frame">${media}</div>
      <div class="card__body">
        <h3 class="card__title">${esc(p.name)}</h3>
        ${p.desc ? `<p class="card__desc">${esc(p.desc)}</p>` : ''}
        <p class="card__price">${money(p.price)}</p>
        <a class="btn btn--solid" href="${waLink(p.name)}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 19.1L4 20z"/><path d="M9.5 9.5c0 3 2 5 5 5l1-1.5-2-1-1 1a4 4 0 0 1-2-2l1-1-1-2z"/></svg>
          Consultar por WhatsApp
        </a>
      </div>
    </article>`;
}

$('#productGrid').innerHTML = SITE.products.map(cardHTML).join('');

/* ---------- footer ------------------------------------------------------------ */

$('#footBrand').textContent = SITE.brand;
$('#footLinks').innerHTML = (SITE.credits.links || []).map(l =>
  `<a href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join('');
$('#footDev').textContent  = SITE.credits.dev || '';
$('#footCopy').textContent = `© ${SITE.credits.year} ${SITE.brand}. Todos los derechos reservados.`;

/* ---------- indicador de scroll (margen derecho) ------------------------------- */

const navDots = $$('.scrollnav__dots a');
const sections = navDots.map(a => $('#' + a.dataset.section)).filter(Boolean);

const io = new IntersectionObserver(entries => {
  entries.forEach(en => {
    if (!en.isIntersecting) return;
    navDots.forEach(a => a.classList.toggle('is-active', a.dataset.section === en.target.id));
  });
}, { threshold:.4 });

sections.forEach(s => io.observe(s));
