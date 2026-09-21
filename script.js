/* ==========================================================================
   Another Litoral Classic — comportamiento (vanilla, sin dependencias)
   El contenido vive en data.js (objeto SITE).
   ========================================================================== */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

const money = n => '$ ' + Number(n).toLocaleString('es-AR');

const waLink = msg =>
  `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(msg)}`;

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

/* ---------- merch: el póster armado en código -------------------------------- */

// Cada ítem del póster es un <figure>: la etiqueta (1.a, 1.b...), sus piezas y
// el texto. En escritorio el figure no genera caja (display:contents) y cada
// parte se posiciona en porcentajes contra el póster; en mobile se apila.
// La pieza es un wrapper (posición + aparición) con el <img> adentro
// (animación en reposo + hover): así los transform de uno no pisan al otro.

const merchSection = $('#merch');
const collage      = $('#collage');

// Precio real desde products, o el texto fijo de lo que no se vende suelto.
function priceOf(it){
  if (it.price) return it.price;
  const p = SITE.products[it.product];
  return p ? money(p.price) : '';
}

function pieceHTML(pc){
  return `
    <div class="collage__piece" data-piece="${esc(pc.id)}">
      <img src="${esc(pc.img)}" alt="${esc(pc.alt || '')}" loading="lazy" decoding="async">
    </div>`;
}

function itemHTML(it){
  const name = it.name ? `<i>${esc(it.name)}</i> ` : '';
  return `
    <figure class="collage__item" data-item="${esc(it.id)}">
      <span class="collage__label" data-label="${esc(it.id)}" aria-hidden="true">${esc(it.label)}</span>
      ${it.pieces.map(pieceHTML).join('')}
      <figcaption class="collage__caption" data-caption="${esc(it.id)}">
        <p>${esc(it.label)} - ${name}${esc(it.title)}<br>${esc(it.desc)}</p>
        <p class="collage__meta">
          <b>Cat. No.<br>${esc(it.cat)}</b>
          <b>Precio<br>${esc(priceOf(it))}</b>
        </p>
      </figcaption>
    </figure>`;
}

if (SITE.merch){
  const m = SITE.merch;
  collage.style.backgroundImage = `url("${m.background}")`;
  collage.innerHTML = `
    <div class="collage__frame" aria-hidden="true"></div>
    ${m.watermark ? `<img class="collage__watermark" src="${esc(m.watermark)}" alt="" aria-hidden="true">` : ''}
    ${m.items.map(itemHTML).join('')}
    <img class="collage__logo" src="${esc(m.logo)}" alt="${esc(SITE.brand)}">
    <p class="collage__banner">${esc(m.banner)}</p>`;

} else if (SITE.merchImage){
  // Sin bloque merch en data.js: la imagen fija del póster, como antes.
  collage.remove();
  merchSection.innerHTML = `<img class="merch__img" src="${esc(SITE.merchImage)}"
    alt="${esc(SITE.merchAlt || '')}" loading="lazy" decoding="async">`;

} else {
  merchSection.hidden = true;
}

/* ---------- grilla de productos ---------------------------------------------- */

// Foto del producto, o el nombre sobre blanco si todavía no hay foto.
// La foto entra entera en el cuadrado (no se recorta); las franjas que quedan
// libres toman el color de bg, así el fondo de la foto se extiende sin costura.
function mediaHTML(p){
  if (!p.img) return `<div class="card__placeholder">${esc(p.name)}</div>`;
  const bg = p.bg ? ` style="background:${esc(p.bg)}"` : '';
  return `<img class="card__img" src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy"${bg} onload="matchEdge(this)">`;
}

// El bg cargado a mano nunca es exactamente el rojo de la foto y se notan las
// franjas. Cuando la foto termina de cargar, se lee el color promedio de su
// borde y se usa ese mismo de fondo: las franjas quedan invisibles.
function matchEdge(img){
  try {
    const c = document.createElement('canvas');
    const w = c.width = 64, h = c.height = Math.max(1, Math.round(64 * img.naturalHeight / img.naturalWidth));
    const g = c.getContext('2d');
    g.drawImage(img, 0, 0, w, h);
    const d = g.getImageData(0, 0, w, h).data;
    let r = 0, gr = 0, b = 0, n = 0;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++){
      if (x > 1 && x < w - 2 && y > 1 && y < h - 2) continue;   // sólo el marco de 2px
      const i = (y * w + x) * 4;
      r += d[i]; gr += d[i + 1]; b += d[i + 2]; n++;
    }
    img.style.background = `rgb(${Math.round(r / n)}, ${Math.round(gr / n)}, ${Math.round(b / n)})`;
  } catch (e) { /* file:// u origen distinto: queda el bg de data.js */ }
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

/* ---------- opciones de remera: color, talle, cantidad ------------------------ */

// Estado de lo elegido en el panel abierto. Se arma de cero en cada openDrawer.
//   multi:  { rows: { Roja: { qty, size }, Negra: { qty, size } } }
//   single: { color, size }
let pick = null;
let pickProduct = null;

const drawerOptions = $('#drawerOptions');
const drawerHint    = $('#drawerHint');
const drawerCta     = $('#drawerCta');

const pillsHTML = (list, chosen, data) => list.map(v =>
  `<button type="button" class="drawer__pill" data-${data}="${esc(v)}"
           aria-pressed="${v === chosen}">${esc(v)}</button>`).join('');

// Remera suelta: una fila por color con cantidad y talle.
function multiOptionsHTML(){
  return SITE.shirt.colors.map(c => {
    const r = pick.rows[c];
    return `
      <div class="drawer__row" data-color="${esc(c)}">
        <div class="drawer__rowhead">
          <span class="drawer__rowname">Remera ${esc(c)}</span>
          <span class="drawer__qty" aria-label="Cantidad de remeras ${esc(c)}">
            <button type="button" data-qty="-1" aria-label="Menos" ${r.qty <= 0 ? 'disabled' : ''}>&minus;</button>
            <output>${r.qty}</output>
            <button type="button" data-qty="1" aria-label="Más">+</button>
          </span>
        </div>
        <div class="drawer__pills" aria-label="Talle">${pillsHTML(SITE.shirt.sizes, r.size, 'size')}</div>
      </div>`;
  }).join('');
}

// Combo: una sola remera, color y talle.
function singleOptionsHTML(){
  return `
    <div class="drawer__row">
      <span class="drawer__rowname">Color de la remera</span>
      <div class="drawer__pills">${pillsHTML(SITE.shirt.colors, pick.color, 'color')}</div>
    </div>
    <div class="drawer__row">
      <span class="drawer__rowname">Talle</span>
      <div class="drawer__pills">${pillsHTML(SITE.shirt.sizes, pick.size, 'size')}</div>
    </div>`;
}

// Lo que falta elegir, o '' si ya se puede mandar.
function pickProblem(){
  const kind = pickProduct?.shirt;
  if (!kind) return '';
  if (kind === 'single'){
    if (!pick.color && !pick.size) return 'Elegí color y talle de la remera.';
    if (!pick.color) return 'Elegí el color de la remera.';
    return pick.size ? '' : 'Elegí el talle de la remera.';
  }
  const rows = Object.values(pick.rows);
  if (!rows.some(r => r.qty > 0)) return 'Elegí al menos una remera.';
  if (rows.some(r => r.qty > 0 && !r.size)) return 'Elegí el talle de cada remera.';
  return '';
}

// "roja" / "negras": el color en minúscula, en plural si hace falta.
const colorWord = (c, n) => c.toLowerCase() + (n === 1 ? '' : 's');

function buildMessage(p){
  const hola = 'Hola, como estas? ';
  if (p.shirt === 'multi'){
    const parts = SITE.shirt.colors
      .map(c => ({ c, ...pick.rows[c] }))
      .filter(r => r.qty > 0)
      .map(r => `${r.qty} ${r.qty === 1 ? 'remera' : 'remeras'} ${colorWord(r.c, r.qty)} talle ${r.size}`);
    return hola + 'Quiero comprar ' + parts.join(' y ');
  }
  if (p.shirt === 'single'){
    // "rojo"/"negro": el color sin la -a final del nombre.
    const color = pick.color.toLowerCase().replace(/a$/, 'o');
    return hola + `Quiero llevarme el ${p.name}, la remera debe ser ${pick.size} en ${color}`;
  }
  return hola + `Quiero comprar ${p.name}`;
}

function renderOptions(){
  const kind = pickProduct.shirt;
  drawerOptions.innerHTML = kind === 'multi' ? multiOptionsHTML()
                          : kind === 'single' ? singleOptionsHTML() : '';
  const problem = pickProblem();
  drawerCta.href = problem ? '#' : waLink(buildMessage(pickProduct));
  drawerCta.setAttribute('aria-disabled', problem ? 'true' : 'false');
  if (!problem) drawerHint.hidden = true;
}

// Clicks en pills y en el − / +: actualizan el estado y se re-pinta todo.
drawerOptions.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (!btn) return;
  if (pickProduct.shirt === 'multi'){
    const row = pick.rows[btn.closest('.drawer__row').dataset.color];
    if (btn.dataset.qty)  row.qty = Math.max(0, row.qty + Number(btn.dataset.qty));
    if (btn.dataset.size) row.size = btn.dataset.size;
  } else {
    if (btn.dataset.color) pick.color = btn.dataset.color;
    if (btn.dataset.size)  pick.size  = btn.dataset.size;
  }
  renderOptions();
});

// Si falta elegir algo, el botón no manda nada y avisa qué falta.
drawerCta.addEventListener('click', e => {
  const problem = pickProblem();
  if (!problem) return;
  e.preventDefault();
  drawerHint.textContent = problem;
  drawerHint.hidden = false;
});

function openDrawer(p){
  lastFocus = document.activeElement;

  $('#drawerMedia').innerHTML  = mediaHTML(p);
  $('#drawerTitle').textContent = p.name;
  $('#drawerPrice').textContent = money(p.price);
  $('#drawerDesc').textContent  = p.desc || '';
  $('#drawerIncludes').innerHTML = includesHTML(p.includes);
  $('#drawerTracklist').innerHTML = tracklistHTML(p.tracklist);

  pickProduct = p;
  pick = p.shirt === 'multi'
    ? { rows: Object.fromEntries(SITE.shirt.colors.map(c => [c, { qty: 0, size: '' }])) }
    : { color: '', size: '' };
  drawerHint.hidden = true;
  renderOptions();

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
// El crédito de desarrollo linkea a devLink si está cargado (ej. Instagram).
const footDev = $('#footDev');
footDev.innerHTML = SITE.credits.devLink
  ? `<a href="${esc(SITE.credits.devLink)}" target="_blank" rel="noopener">${esc(SITE.credits.dev || '')}</a>`
  : esc(SITE.credits.dev || '');
$('#footCopy').textContent = `© ${SITE.credits.year} ${SITE.brand}. Todos los derechos reservados.`;

/* ---------- aparición al scrollear ------------------------------------------- */

// Cada bloque arranca invisible y un poco más abajo; cuando entra en pantalla
// se le pone .is-visible y el CSS lo hace aparecer. Las tarjetas van en cascada.
// La clase la agrega el JS (no el HTML): si el script no corre, todo se ve igual.
const revealTargets = [
  ...$$('.video, .footer'),
  ...$$('.card'),
  ...$$('.collage__frame, .collage__label, .collage__piece, .collage__caption, .collage__logo, .collage__banner, .merch__img'),
];

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window){
  $$('.card').forEach((card, i) => card.style.setProperty('--delay', `${i * 110}ms`));
  // Las partes del póster caen en cascada sobre el fondo rojo.
  $$('.collage__frame, .collage__label, .collage__piece, .collage__caption, .collage__logo, .collage__banner')
    .forEach((el, i) => el.style.setProperty('--delay', `${i * 80}ms`));
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
