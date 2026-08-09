const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
});

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);

fetch('content/program.json')
  .then(response => response.ok ? response.json() : Promise.reject(response))
  .then(({ shows }) => {
    const container = document.querySelector('#weekly-program');
    if (!container || !Array.isArray(shows)) return;
    container.innerHTML = shows.map((show, index) => {
      const name = escapeHtml(show.artist).replace(/\s+/, '<br /><i>') + (show.artist.includes(' ') ? '</i>' : '');
      return `<article class="show${index === 0 ? ' featured' : ''}">
        <div class="date"><strong>${escapeHtml(show.short)}</strong><span>HER HAFTA<br />${escapeHtml(show.day).toUpperCase()}</span></div>
        <div class="show-info"><p>${escapeHtml(show.note || 'CANLI MÜZİK')}</p><h3>${name}</h3><span>PASSAGE SAHNESİNDE</span></div>
        <a href="#rezervasyon" aria-label="${escapeHtml(show.artist)} için rezervasyon">↗</a>
      </article>`;
    }).join('');
  })
  .catch(() => {});

fetch('content/special-events.json')
  .then(response => response.ok ? response.json() : Promise.reject(response))
  .then(({ events }) => {
    const container = document.querySelector('#special-events');
    if (!container || !Array.isArray(events)) return;
    const visibleEvents = events.filter(event => event.active !== false);
    if (!visibleEvents.length) {
      container.innerHTML = '<p class="eyebrow">Yakında yeni özel etkinlikler burada olacak.</p>';
      return;
    }
    container.innerHTML = visibleEvents.map(event => `<article class="special-event">
      <video controls playsinline preload="metadata" aria-label="${escapeHtml(event.artist || 'Özel etkinlik')} videosu">
        <source src="${escapeHtml(event.video || '')}" type="video/mp4" />
        Tarayıcınız video oynatmayı desteklemiyor.
      </video>
      <div class="special-event-copy">
        <p class="eyebrow"><span></span> ${escapeHtml(event.date || '')}</p>
        <h3>${escapeHtml(event.artist || '')}</h3>
        <p>${escapeHtml(event.description || '')}</p>
        <a class="reservation-button" href="${escapeHtml(event.reservationLink || '#rezervasyon')}">REZERVASYON <b>→</b></a>
      </div>
    </article>`).join('');
  })
  .catch(() => {});
