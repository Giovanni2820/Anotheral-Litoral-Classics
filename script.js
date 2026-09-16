/* ==========================================================================
   Another Litoral Classic — comportamiento (vanilla, sin dependencias)
   El contenido vive en data.js (objeto SITE).
   ========================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const money = n => '$ ' + Number(n).toLocaleString('es-AR');

const waLink = name =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(`Hola! Me interesa: ${name}`)}`;

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

/* ---------- video: hero con título encima, autoplay muteado ------------------ */

const videoFrame   = $("#videoFrame");
const videoMedia   = $("#videoMedia");
const videoOverlay = $("#videoOverlay");
const videoPlay    = $("#videoPlay");
const videoLabel   = $("#videoLabel");

$("#videoTitle").textContent = SITE.videoTitle || "";
$("#videoSub").textContent   = SITE.videoSubtitle || "";

// Acepta tanto el ID pelado como el link completo de YouTube en cualquiera de
// sus formas (watch?v=, youtu.be, /shorts/, /embed/, /live/).
function youtubeId(value){
  const raw = String(value || "").trim();
  if (!raw) return "";
  if (/^[\w-]{11}$/.test(raw)) return raw;            // ya es un ID
  const m = raw.match(/(?:v=|youtu\.be\/|\/shorts\/|\/embed\/|\/live\/)([\w-]{11})/);
  return m ? m[1] : "";
}

// Segundo de inicio a partir del &t= del link (acepta 499, 499s o 8m19s).
function youtubeStart(value){
  const m = String(value || "").match(/[?&#]t=(?:(\d+)h)?(?:(\d+)m)?(\d+)s?/);
  if (!m) return 0;
  return (Number(m[1] || 0) * 3600) + (Number(m[2] || 0) * 60) + Number(m[3]);
}

const videoId    = youtubeId(SITE.youtubeId);
const videoStart = youtubeStart(SITE.youtubeId);
const watchUrl   = `https://www.youtube.com/watch?v=${videoId}` + (videoStart ? `&t=${videoStart}s` : "");

// `origin` es obligatorio para que YouTube valide el embed: sin él devuelve
// "Error 153". Por el mismo motivo se usa youtube.com y no youtube-nocookie,
// que es más estricto con el referrer.
function embed(extra){
  const params = new URLSearchParams({
    autoplay:"1", playsinline:"1", rel:"0", modestbranding:"1",
    enablejsapi:"1", origin: location.origin,
    ...(videoStart ? { start: String(videoStart) } : {}),
    ...extra
  });
  return `
    <iframe src="https://www.youtube.com/embed/${videoId}?${params}"
            title="Video de ${esc(SITE.brand)}"
            referrerpolicy="strict-origin-when-cross-origin"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowfullscreen></iframe>`;
}

// Inserta el iframe y le inicia el "handshake" de la API de YouTube. Sin este
// mensaje el reproductor nunca le habla a la página, aunque esté funcionando,
// y la detección de fallo de más abajo daría un falso negativo.
function mount(extra){
  videoMedia.innerHTML = embed(extra);
  const frame = videoMedia.querySelector("iframe");
  frame.addEventListener("load", () => {
    const hello = () => frame.contentWindow?.postMessage(
      JSON.stringify({ event:"listening", id:1, channel:"widget" }), "https://www.youtube.com");
    hello(); setTimeout(hello, 600); setTimeout(hello, 1800);
  });
}

function showLabel(html){
  videoLabel.innerHTML = html;
  videoLabel.hidden = false;
}

if (!videoId){
  videoFrame.classList.add("is-placeholder");
  videoPlay.disabled = true;
  showLabel("Video clip de YouTube");

} else if (location.protocol === "file:"){
  // Abierto con doble clic sobre index.html: sin origen http, YouTube rechaza
  // el embed con "Error 153". Hay que servir la carpeta (ver serve.js).
  videoFrame.classList.add("is-placeholder");
  videoPlay.addEventListener("click", () => window.open(watchUrl, "_blank", "noopener"));
  showLabel("Abrí el sitio con un servidor (no con doble clic) para ver el video");

} else {
  // De fondo: arranca solo, sin sonido (los navegadores no permiten autoplay
  // con audio), sin controles y en loop, con el título encima.
  mount({ mute:"1", controls:"0", loop:"1", playlist:videoId });

  // El play del overlay lo reproduce con sonido y controles. Como lo dispara
  // un clic del visitante, el navegador sí permite el audio.
  videoPlay.addEventListener("click", () => {
    if (videoFrame.classList.contains("is-fallback")){
      window.open(watchUrl, "_blank", "noopener");
      return;
    }
    if (videoFrame.classList.contains("is-playing")) return;
    mount({ mute:"0", controls:"1" });
    videoFrame.classList.add("is-playing");
  });

  // Con enablejsapi el reproductor le habla a la página apenas arranca. Si en
  // unos segundos no dijo nada, es que YouTube sirvió su pantalla de error
  // (típicamente "Error 153"). En ese caso tapamos el iframe con la miniatura
  // —sin destruirlo— y el play abre el video en YouTube. Si el reproductor
  // termina respondiendo más tarde (conexión lenta), la miniatura se quita sola.
  let playerAlive = false;
  const hear = e => {
    if (!String(e.origin).includes("youtube")) return;
    playerAlive = true;
    window.removeEventListener("message", hear);
    const thumb = videoMedia.querySelector(".video__thumb");
    if (thumb){ thumb.remove(); videoFrame.classList.remove("is-fallback"); videoLabel.hidden = true; }
  };
  window.addEventListener("message", hear);

  setTimeout(() => {
    if (playerAlive) return;
    videoFrame.classList.add("is-fallback");
    videoMedia.insertAdjacentHTML("beforeend", `
      <img class="video__thumb" src="https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg" alt=""
           onerror="this.src='https://i.ytimg.com/vi/${videoId}/hqdefault.jpg'">`);
    showLabel("Ver en YouTube");
  }, 6000);
}

/* ---------- merch: imagen a ancho completo ----------------------------------- */

const merchImg = $('#merchImg');
if (SITE.merchImage){
  merchImg.src = SITE.merchImage;
  merchImg.alt = SITE.merchAlt || '';
} else {
  $('#merch').hidden = true;
}

/* ---------- grilla de productos ---------------------------------------------- */

// Foto del producto, o el nombre sobre blanco si todavía no hay foto.
function mediaHTML(p){
  return p.img
    ? `<img class="card__img" src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`
    : `<div class="card__placeholder">${esc(p.name)}</div>`;
}

function cardHTML(p, i){
  return `
    <article class="card" data-index="${i}" tabindex="0" role="button"
             aria-label="${esc(p.name)} — ver detalle">
      <div class="card__frame">
        ${mediaHTML(p)}
        <span class="card__quick" aria-hidden="true">Quick view</span>
      </div>
      <h3 class="card__title">${esc(p.name)}</h3>
      <p class="card__price">${money(p.price)}</p>
    </article>`;
}

const grid = $('#productGrid');
grid.innerHTML = SITE.products.map(cardHTML).join('');

/* ---------- quick view: panel lateral ----------------------------------------- */

const drawer = $('#drawer');
const scrim  = $('#scrim');
let lastFocus = null;

// Lista "Incluye": cada ítem es un texto, o { item, sub:[...] } si tiene sub-ítems.
function includesHTML(list){
  if (!list || !list.length) return '';
  const li = x => typeof x === 'string'
    ? `<li>${esc(x)}</li>`
    : `<li>${esc(x.item)}<ul>${(x.sub || []).map(s => `<li>${esc(s)}</li>`).join('')}</ul></li>`;
  return `<p class="drawer__label">Incluye:</p><ul>${list.map(li).join('')}</ul>`;
}

// Tracklist numerado (el <ol> pone los números solo).
function tracklistHTML(list){
  if (!list || !list.length) return '';
  return `<p class="drawer__label">Tracklist:</p><ol>${list.map(t => `<li>${esc(t)}</li>`).join('')}</ol>`;
}

function openDrawer(p){
  lastFocus = document.activeElement;

  $('#drawerMedia').innerHTML  = mediaHTML(p);
  $('#drawerTitle').textContent = p.name;
  $('#drawerPrice').textContent = money(p.price);
  $('#drawerDesc').textContent  = p.desc || '';
  $('#drawerIncludes').innerHTML = includesHTML(p.includes);
  $('#drawerTracklist').innerHTML = tracklistHTML(p.tracklist);
  $('#drawerCta').href = waLink(p.name);

  drawer.hidden = false; scrim.hidden = false;
  requestAnimationFrame(() => { drawer.classList.add('is-on'); scrim.classList.add('is-on'); });
  document.body.classList.add('is-locked');
  $('#drawerClose').focus();
}

function closeDrawer(){
  if (drawer.hidden) return;
  drawer.classList.remove('is-on'); scrim.classList.remove('is-on');
  document.body.classList.remove('is-locked');
  setTimeout(() => { drawer.hidden = true; scrim.hidden = true; }, 350);
  if (lastFocus) lastFocus.focus();
}

// abrir: click o Enter/Espacio sobre cualquier tarjeta
grid.addEventListener('click', e => {
  const card = e.target.closest('.card');
  if (card) openDrawer(SITE.products[Number(card.dataset.index)]);
});
grid.addEventListener('keydown', e => {
  if (e.key !== 'Enter' && e.key !== ' ') return;
  const card = e.target.closest('.card');
  if (!card) return;
  e.preventDefault();
  openDrawer(SITE.products[Number(card.dataset.index)]);
});

// cerrar: botón, fondo oscuro o Escape
$('#drawerClose').addEventListener('click', closeDrawer);
scrim.addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });

// el foco con Tab no se escapa del panel mientras está abierto
drawer.addEventListener('keydown', e => {
  if (e.key !== 'Tab') return;
  const f = $$('button, a[href]', drawer).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1];
  if (e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
});

/* ---------- footer ------------------------------------------------------------ */

$('#footBrand').textContent = SITE.brand;
$('#footTagline').textContent = SITE.credits.tagline || '';
// Íconos monocromos por red. Se elige por el nombre del link (sin importar mayúsculas).
const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>',
  youtube:   '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M22 8.2a2.6 2.6 0 0 0-1.8-1.8C18.6 6 12 6 12 6s-6.6 0-8.2.4A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.6 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.8C5.4 18 12 18 12 18s6.6 0 8.2-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22.4 12 27 27 0 0 0 22 8.2z" fill="currentColor" stroke="none"/><path d="M10 9.2v5.6l4.8-2.8z" fill="#0f0f0f" stroke="none"/></svg>',
  spotify:   '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9.5"/><path d="M7 9.4c3.6-1 7.2-.7 10.2 1M7.6 12.4c3-.8 5.9-.5 8.4.9M8.2 15.2c2.3-.6 4.6-.4 6.5.7"/></svg>',
};

$('#footLinks').innerHTML = (SITE.credits.links || []).map(l => {
  const icon = SOCIAL_ICONS[String(l.label).toLowerCase()] || '';
  return `<a href="${esc(l.href)}" target="_blank" rel="noopener">${icon}<span>${esc(l.label)}</span></a>`;
}).join('');
$('#footDev').textContent  = SITE.credits.dev || '';
$('#footCopy').textContent = `© ${SITE.credits.year} ${SITE.brand}. Todos los derechos reservados.`;

/* ---------- aparición al scrollear ------------------------------------------- */

// Cada bloque arranca invisible y un poco más abajo; cuando entra en pantalla
// se le pone .is-visible y el CSS lo hace aparecer. Las tarjetas van en cascada.
// La clase la agrega el JS (no el HTML): si el script no corre, todo se ve igual.
const revealTargets = [
  ...$$('.video, .merch, .footer'),
  ...$$('.card'),
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window){
  $$('.card').forEach((card, i) => card.style.setProperty('--delay', `${i * 110}ms`));
  revealTargets.forEach(el => el.classList.add('reveal'));

  const revealer = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-visible');
      obs.unobserve(en.target);            // aparece una vez y queda
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealTargets.forEach(el => {
    // Lo que ya está a la vista al cargar aparece enseguida, sin esperar al observer.
    if (el.getBoundingClientRect().top < innerHeight * 0.92) el.classList.add('is-visible');
    else revealer.observe(el);
  });
}
