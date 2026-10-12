const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('nav');
toggle?.addEventListener('click', () => {
  const open = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!open));
  nav.style.display = open ? '' : 'flex';
});

const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]);
const posterDialog = document.querySelector('#poster-lightbox');
const posterDialogImage = posterDialog?.querySelector('img');
posterDialog?.querySelector('.poster-close')?.addEventListener('click', () => posterDialog.close());
posterDialog?.addEventListener('click', event => {
  if (event.target === posterDialog) posterDialog.close();
});

fetch('content/program.json?v=20261012-3')
  .then(response => response.ok ? response.json() : Promise.reject(response))
  .then(({ shows }) => {
    const container = document.querySelector('#weekly-program');
    if (!container || !Array.isArray(shows)) return;
    container.innerHTML = shows.map((show, index) => {
      const name = escapeHtml(show.artist).replace(/\s+/, '<br /><i>') + (show.artist.includes(' ') ? '</i>' : '');
      const poster = show.image ? `<button class="show-poster" type="button" data-poster="${escapeHtml(show.image)}" data-poster-alt="${escapeHtml(show.imageAlt || show.artist)}" aria-label="${escapeHtml(show.day)} afişini büyüt"><img src="${escapeHtml(show.thumbnail || show.image)}" alt="${escapeHtml(show.imageAlt || `${show.artist} afişi`)}" loading="eager" decoding="async" /></button>` : '';
      return `<article class="show${index === 0 ? ' featured' : ''}">
        <div class="date"><strong>${escapeHtml(show.short)}</strong><span>HER HAFTA<br />${escapeHtml(show.day).toUpperCase()}</span></div>
        <div class="show-info"><p>${escapeHtml(show.note || 'CANLI MÜZİK')}</p><h3>${name}</h3><span>PASSAGE SAHNESİNDE</span></div>
        ${poster}
        <a href="#rezervasyon" aria-label="${escapeHtml(show.artist)} için rezervasyon">↗</a>
      </article>`;
    }).join('');
    container.addEventListener('click', event => {
      const button = event.target.closest('.show-poster');
      if (!button || !posterDialog || !posterDialogImage) return;
      posterDialogImage.src = button.dataset.poster;
      posterDialogImage.alt = button.dataset.posterAlt || 'Konser afişi';
      posterDialog.showModal();
    });
  })
  .catch(() => {});

fetch('content/special-events.json?v=20261012-3')
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

fetch('content/menu.json')
  .then(response => response.ok ? response.json() : Promise.reject(response))
  .then(({ categories }) => {
    const container = document.querySelector('.menu-detail-grid');
    if (!container || !Array.isArray(categories) || !categories.length) return;
    container.innerHTML = categories.map(category => `<article id="${escapeHtml(category.id || '')}" class="menu-detail${category.id === 'nargile' ? ' menu-highlight' : ''}">
      <h3>${escapeHtml(category.title || '')}${category.subtitle ? `<small>${escapeHtml(category.subtitle)}</small>` : ''}</h3>
      <ul>${(category.items || []).map(item => `<li><span>${escapeHtml(item.name || '')}${item.description ? `<small style="display:block;color:#aaa69e;margin-top:3px">${escapeHtml(item.description)}</small>` : ''}</span><span>${escapeHtml(item.price || '')}</span></li>`).join('')}</ul>
    </article>`).join('');
  })
  .catch(() => {});

fetch('content/contact.yml')
  .then(response => response.ok ? response.text() : Promise.reject(response))
  .then(text => {
    const fields = Object.fromEntries([...text.matchAll(/^([a-zA-Z]+):\s*["']?([^\n"']*)/gm)].map(([, key, value]) => [key, value.trim()]));
    if (fields.whatsapp) document.querySelectorAll('a[href*="wa.me/"]').forEach(link => {
      const message = link.href.includes('?') ? link.href.slice(link.href.indexOf('?')) : '';
      link.href = `https://wa.me/${fields.whatsapp.replace(/\D/g, '')}${message}`;
    });
    if (fields.instagram) document.querySelectorAll('a[href*="instagram.com/"]').forEach(link => { link.href = fields.instagram; });
  })
  .catch(() => {});
