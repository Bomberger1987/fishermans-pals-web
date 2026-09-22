(() => {
  const D = window.APP_DATA;
  const content = document.getElementById('appContent');
  const nav = document.getElementById('navTabs');
  const title = document.getElementById('pageTitle');
  const subtitle = document.getElementById('pageSubtitle');
  const sidebar = document.getElementById('sidebar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const liveState = document.getElementById('liveState');

  let current = 'home';
  let statusCache = null;
  let deathFeedCache = null;

  const esc = (v='') => String(v)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function navButtons() {
    nav.innerHTML = D.nav.map(item => {
      const iconHtml = item.id === 'map'
        ? '<span class="nav-icon nav-icon-map" aria-hidden="true"></span>'
        : `<span class="nav-icon">${item.icon}</span>`;
      return `
      <button class="nav-button ${item.id === current ? 'active' : ''}" data-tab="${item.id}">
        ${iconHtml}
        <span>${esc(item.label)}</span>
      </button>`;
    }).join('');

    nav.querySelectorAll('[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });
  }

  function switchTab(id) {
    current = id;
    render();
    navButtons();
    sidebar.classList.remove('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function sectionHead(name, desc, badge='') {
    return `<div class="section-head"><div><h2>${name}</h2><p>${desc}</p></div>${badge ? `<span class="badge">${badge}</span>` : ''}</div>`;
  }

  function sentenceList(text='') {
    return String(text).match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map(s => s.trim()).filter(Boolean) || [];
  }

  function rulesNoticeHtml(text, kind) {
    const s = sentenceList(text);
    if (kind === 'outro') {
      const stabilityLine = 'der Server stabil bleibt und neue wie erfahrene Spieler die gleichen fairen Voraussetzungen haben.';
      return [
        s[0] ? `<p>${esc(s[0])}</p>` : '',
        `<p>Sie sollen dafür sorgen, dass unser Langzeit-PvE- und Progressionskonzept funktioniert,</p>`,
        `<p class="rules-outro-stability">${esc(stabilityLine)}</p>`,
        s.length > 2 ? `<p>${esc(s.slice(2, 5).join(' '))}</p>` : '',
        s.length > 5 ? `<p>${esc(s.slice(5).join(' '))}</p>` : ''
      ].join('');
    }
    const groups = [s.slice(0, 1), s.slice(1)];
    return groups
      .filter(group => group.length)
      .map(group => `<p>${esc(group.join(' '))}</p>`)
      .join('');
  }

  function renderHome() {
    title.textContent = 'Fisherman\'s Pals';
    subtitle.textContent = D.meta.subtitle;
    return `
      <section class="hero">
        <div class="hero-content">
          <div class="hero-kicker">PALWORLD · PVE HARDMODE · LANGZEITSERVER</div>
          <img class="hero-logo" src="assets/fishermans-pals-logo.png" alt="Fisherman's Pals" />
          <h2>Fisherman's Pals</h2>
          <img class="hero-slogan-board" src="assets/hero-slogan-board.png" alt="Sind sie zu stark, bist du zu schwach" />
          <p>Langzeit-PvE mit eigener Hardmode-Balance, Level-/Zonensystem und servereigenen Modifikationen.</p>
          <div class="quick-grid">
            ${[
              ['rules','Regeln','Serverregeln & Fairplay'],
              ['changes','Änderungen','Hardmode & Balance'],
              ['elements','Elemente','Stärken & Schwächen'],
              ['deaths','Todesliste','Des toten Mans Kist & Hall of Shame']
            ].map(([id,a,b]) => `<button class="quick-card" data-quick="${id}"><strong>${a}</strong><span>${b}</span></button>`).join('')}
          </div>
        </div>
      </section>`;
  }

  function renderRules() {
    title.textContent = 'Serverregeln';
    subtitle.textContent = 'Klare Regeln für Langzeit-PvE und faires Zusammenspiel';
    return `
      <div class="section-head rules-section-head"><div><h2 class="rules-brand-title">Regeln</h2><p>Fairplay, respektvolles Miteinander und der Schutz unseres Langzeit-PvE-Konzepts.</p></div></div>
      <div class="notice rules-intro">${rulesNoticeHtml(D.rulesIntro, 'intro')}</div>
      <div class="toolbar"><input id="ruleSearch" class="search" placeholder="Regeln durchsuchen …" /></div>
      <div class="rules-list" id="ruleGrid">
        ${D.rules.map(r => `<details class="card rule-card ${r.important ? 'critical' : ''}" data-rule="${esc((r.category+' '+r.title+' '+r.text).toLowerCase())}">
          <summary class="rule-summary">
            <span class="rule-heading"><span class="rule-category">${esc(r.category)}</span><strong>${esc(r.title)}</strong></span>
            <span class="rule-toggle" aria-hidden="true">+</span>
          </summary>
          <div class="rule-body"><p>${esc(r.text)}</p></div>
        </details>`).join('')}
      </div>
      <div class="notice rules-outro">${rulesNoticeHtml(D.rulesOutro, 'outro')}</div>`;
  }

  function renderChanges() {
    title.textContent = 'Serveränderungen';
    subtitle.textContent = 'Was auf Fisherman\'s Pals anders ist als Vanilla';
    return `
      ${sectionHead('Hardmode & Server-Balance', 'Dokumentierte Serverwerte für Bauen, Breeding, Fishing und Stasis.')}
      <div class="grid grid-3">
        ${D.changes.map(c => `<article class="card">
          <span class="badge">${esc(c.group)}</span>
          <h3 style="margin-top:12px">${esc(c.title)}</h3>
          <div class="value">${esc(c.value)}</div>
          <div class="meta">${esc(c.detail)}</div>
        </article>`).join('')}
      </div>`;
  }

  function renderLab() {
    title.textContent = 'Labor';
    subtitle.textContent = 'Fisherman\'s Pals Labor-Balance';
    const globals = D.lab.summary.filter(s => s.group === 'global');
    const specials = D.lab.summary.filter(s => s.group === 'special');
    return `
      ${sectionHead('Labor-Balance', 'Arbeitsaufwand, Materialien und die servereigene Base-Enhancement-Belohnungsmatrix.', '168 Forschungen')}
      <div class="lab-effort-layout">
        <div class="lab-effort-row lab-effort-row-global">
          ${globals.map(s => `<article class="card lab-effort-card">
            <h3>${esc(s.label)}</h3>
            <div class="lab-effort-value">${esc(s.value)}</div>
            <p>${esc(s.detail)}</p>
          </article>`).join('')}
        </div>
        <div class="lab-effort-row lab-effort-row-special">
          ${specials.map(s => `<article class="card lab-effort-card">
            <h3>${esc(s.label)}</h3>
            <div class="lab-effort-value">${esc(s.value)}</div>
            <p>${esc(s.detail)}</p>
          </article>`).join('')}
        </div>
      </div>
      <div class="lab-rewards-grid">
        ${D.lab.rewards.map(r => `<article class="card lab-reward-card">
          <div class="lab-category">
            <div class="lab-icon lab-icon-original">
              <img src="${esc(r.iconUrl)}" alt="${esc(r.category)}" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false" />
              <span class="lab-icon-fallback" hidden>${esc(r.fallback)}</span>
            </div>
            <div><h3>${esc(r.category)}</h3><p>Base-Enhancement Belohnungen</p></div>
          </div>
          <div class="reward-list">
            ${r.levels.map((x,i) => `<div class="reward-row"><strong>Lv ${i+1}</strong><span>${esc(x)}</span></div>`).join('')}
          </div>
        </article>`).join('')}
      </div>`;
  }

  function renderPalLocks() {
    title.textContent = 'Pal-Sperren';
    subtitle.textContent = 'Levelgebundene Nutzung ausgewählter Pals';
    const rows = [...D.palLocks.rows].sort((a,b) => a.level - b.level || a.pal.localeCompare(b.pal));
    return `
      ${sectionHead('Pal-Freischaltungen', 'Ein Pal darf ab dem angegebenen Spielerlevel in Party und Base eingesetzt werden. Darunter wird das Einsetzen blockiert.', `${D.palLocks.policySize} Policy-Einträge`)}
      <div class="toolbar pal-lock-toolbar">
        <input id="palSearch" class="search" placeholder="Pal, Pal-Nr. oder CharacterID suchen …" />
        <select id="palLevel" class="select pal-level-select" aria-label="Nach Spielerlevel filtern"><option value="all">Alle Level</option><option value="0-35">bis 35</option><option value="36-45">36–45</option><option value="46-55">46–55</option><option value="56+">56+</option></select>
      </div>
      <div class="table-wrap pal-lock-table"><table><thead><tr><th>Pal</th><th>Benutzbar ab Spielerlevel</th><th>Interne CharacterID</th></tr></thead><tbody id="palRows">
        ${rows.map(r => `<tr data-pal="${esc((r.no+' '+r.pal+' '+r.characterId).toLowerCase())}" data-level="${r.level}"><td class="pal-name-cell"><span class="pal-number">#${esc(r.no)}</span><span>${esc(r.pal)}</span></td><td class="level-cell">Level ${r.level}</td><td class="character-id-cell">${esc(r.characterId)}</td></tr>`).join('')}
      </tbody></table></div>`;
  }

  function renderMap() {
    title.textContent = 'Weltkarte';
    subtitle.textContent = 'Boss-, Cap- und Gebietsprogression';
    const steps = D.mapProgression || [];
    return `
      ${sectionHead('Weltkarte', 'Die farbigen Markierungen auf der Karte zeigen unsere Progressionsstufen. Nach jedem Boss oder Raid steigt euer Cap und die nächste Gebietsstufe wird freigeschaltet.', 'Boss / Cap Progression')}
      <div class="map-stage">
        <div class="map-hanger" aria-hidden="true">
          <span class="map-rope map-rope-left"></span>
          <span class="map-rope map-rope-right"></span>
          <span class="map-hook map-hook-left"></span>
          <span class="map-hook map-hook-right"></span>
        </div>
        <div class="map-board">
          <div class="map-board-inner">
            <img class="map-image" src="assets/palworld-map-progression.png" alt="Fisherman's Pals Boss- und Cap-Progression auf der Weltkarte" />
          </div>
        </div>
      </div>
      <article class="card map-explainer">
        <h3>So liest du unsere Progression</h3>
        <p>Jede Farbe auf der Karte steht für eine eigene Progressionsstufe. Ihr startet mit <strong>Cap 8</strong>. Danach besiegt ihr <strong>Zoe & Grizzbolt</strong>, euer Cap steigt auf <strong>18</strong> und damit werden die <strong>18er-Gebiete</strong> freigeschaltet. Genau so geht es Stufe für Stufe weiter.</p>
      </article>
      <div class="map-progress-grid">
        ${steps.map(step => `
          <article class="card progress-card">
            <div class="progress-head">
              <span class="progress-swatch" style="--swatch:${step.color}"></span>
              <div>
                <div class="progress-step">${esc(step.step)}</div>
                <h3>${esc(step.boss)}</h3>
              </div>
              <span class="progress-cap">${esc(step.cap)}</span>
            </div>
            <p class="progress-note">${esc(step.unlock)}</p>
          </article>`).join('')}
      </div>
      <div class="map-actions map-actions-centered">
        <a class="btn primary" href="https://paldb.cc/de/Map" target="_blank" rel="noreferrer">PalDB Karte ↗</a>
        <a class="btn" href="https://palworld.wiki.gg/wiki/Maps" target="_blank" rel="noreferrer">Wiki Maps ↗</a>
      </div>`;
  }

  function elementIconUrl(id) {
    return `https://palpedia.com/img/icons/elements/${encodeURIComponent(id)}.webp`;
  }

  function elementIconHtml(element, className='element-icon') {
    return `<span class="${className}"><img src="${elementIconUrl(element.id)}" alt="${esc(element.name)}" loading="lazy" /></span>`;
  }

  function elementMatchHtml(names) {
    if (!names.length) return '<span class="element-match-none">—</span>';
    return names.map(name => {
      const match = D.elements.find(x => x.name === name);
      return match
        ? `<span class="element-match-chip">${elementIconHtml(match, 'element-mini-icon')}<span>${esc(name)}</span></span>`
        : `<span class="element-match-chip"><span>${esc(name)}</span></span>`;
    }).join('');
  }

  function renderElements() {
    title.textContent = 'Elemente';
    subtitle.textContent = 'Stark gegen · schwach gegen';
    return `
      <div class="section-head elements-section-head"><div><h2>Element-Regeln</h2><p>Aktuelle Palworld-Elementbeziehungen: <strong>stark ×2</strong>, <strong>schwach ×0,5</strong>, <strong>neutral ×1</strong>. Fähigkeiten des eigenen Elements erhalten zusätzlich <strong>+20 % Schaden</strong>.</p></div></div>
      <div class="element-grid">
        ${D.elements.map(e => `<article class="card element-card">
          <div class="element-card-head">${elementIconHtml(e)}<h3>${esc(e.name)}</h3></div>
          <div class="matchups">
            <div class="match strong"><strong>Stark gegen</strong><div class="element-match-list">${elementMatchHtml(e.strong)}</div></div>
            <div class="match weak"><strong>Schwach gegen</strong><div class="element-match-list">${elementMatchHtml(e.weak)}</div></div>
          </div>
        </article>`).join('')}
      </div>`;
  }

  function renderKnowledge() {
    title.textContent = 'Spielwissen';
    subtitle.textContent = 'Kurz erklärt für den Serveralltag';
    return `
      ${sectionHead('Palworld Wissen', 'Kompakte Erklärungen zu Mechaniken, die auf dem Server häufig wichtig sind.')}
      <div class="grid grid-2">
        ${D.knowledge.map(k => `<article class="card"><h3>${esc(k.title)}</h3><p>${esc(k.text)}</p></article>`).join('')}
      </div>`;
  }

  function renderLinks() {
    title.textContent = 'Links';
    subtitle.textContent = 'Server, Datenbanken, Karte und offizielle News';
    return `
      ${sectionHead('Nützliche Links', 'Direkte Wege zu euren Serverdaten und aktuellen Palworld-Ressourcen.')}
      <div class="grid grid-3">
        ${D.links.map(l => `<a class="card link-card" href="${l.href}" target="_blank" rel="noreferrer"><h3>${esc(l.title)}</h3><p>${esc(l.desc)}</p><div class="link-domain">${esc(l.domain)} ↗</div></a>`).join('')}
      </div>`;
  }

  function statusValue(obj, keys, fallback='—') {
    for (const key of keys) if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
    return fallback;
  }

  function deathTimeText(value) {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).format(d);
  }

  function renderDeaths() {
    title.textContent = 'Todesfälle';
    subtitle.textContent = 'Des toten Mans Kist & Hall of Shame';
    const feed = deathFeedCache || {};
    const recent = Array.isArray(feed.recentDeaths) ? feed.recentDeaths : [];
    const players = Array.isArray(feed.players) ? feed.players : [];
    return `
      <div class="death-columns">
        <section class="death-column">
          ${sectionHead('☠ Des toten Mans Kist ☠', 'Die letzten vom Server erfassten Todesfälle – Spieler, Level und gemeldete Todesursache.')}
          <div class="death-feed-list">
            ${recent.length ? recent.map(d => `<article class="card death-event-card">
              <div class="death-event-skull">☠</div>
              <div class="death-event-main">
                <div class="death-event-title"><strong>${esc(d.name || 'Unbekannt')}</strong> ist gestorben.</div>
                <div class="death-event-meta"><span>Level <strong>${d.level ?? '?'}</strong></span><span>${esc(deathTimeText(d.at))}</span></div>
                <div class="death-event-cause">Ursache: <code>${esc(d.cause || 'Unbekannt')}</code></div>
              </div>
            </article>`).join('') : `<article class="card death-empty"><p>Noch keine Todesfälle im aktuellen Web-Feed erfasst.</p></article>`}
          </div>
        </section>

        <section class="death-column">
          ${sectionHead('☠ Hall of Shame ☠', "Fisherman's Pals – Todesliste")}
          <div class="table-wrap death-ranking-table"><table>
            <thead><tr><th>Rang</th><th>Spieler</th><th>Level</th><th>Tode</th></tr></thead>
            <tbody>
              ${players.length ? players.map(p => `<tr><td class="death-rank">${p.rank}.</td><td><strong>${esc(p.name)}</strong></td><td>Level ${p.level ?? '?'}</td><td class="death-count">${p.deaths} ${p.deaths === 1 ? 'Tod' : 'Tode'}</td></tr>`).join('') : `<tr><td colspan="4">Todesliste wird geladen …</td></tr>`}
            </tbody>
          </table></div>
        </section>
      </div>
      <div class="death-updated">Stand: ${esc(deathTimeText(feed.updatedAt))}</div>`;
  }

  function renderServer() {
    title.textContent = 'Server';
    subtitle.textContent = 'Live-Status & Serverprofil';
    const s = statusCache || {};
    const online = statusValue(s, ['online','isOnline'], null);
    return `
      ${sectionHead('Serverstatus', 'Die App versucht eure vorhandene Status-API zu lesen. Falls das Hosting CORS blockiert, bleibt die externe Statusseite als Fallback verfügbar.')}
      <div class="stats-grid">
        <article class="card stat-card"><span class="stat-label">Status</span><span class="stat-value">${online === true ? 'ONLINE' : online === false ? 'OFFLINE' : '—'}</span></article>
        <article class="card stat-card"><span class="stat-label">Spieler</span><span class="stat-value">${esc(statusValue(s,['players','playerCount']))}${statusValue(s,['maxPlayers'],null) !== null ? ' / ' + esc(statusValue(s,['maxPlayers'])) : ''}</span></article>
        <article class="card stat-card"><span class="stat-label">Server FPS</span><span class="stat-value">${esc(statusValue(s,['serverfps','fps','serverFps']))}</span></article>
        <article class="card stat-card"><span class="stat-label">Basen</span><span class="stat-value">${esc(statusValue(s,['basecampnum','baseCampNum','bases']))}</span></article>
      </div>
      <div class="grid grid-2" style="margin-top:14px">
        <article class="card"><h3>Serverprofil</h3><p>Langzeit-PvE mit eigener Hardmode-Balance, Level-/Zonensystem und servereigenen Modifikationen.</p><div class="map-actions"><a class="btn primary" href="https://fishermans-pals-status.onrender.com" target="_blank" rel="noreferrer">Statusseite öffnen ↗</a><a class="btn" href="https://www.battlemetrics.com/servers/palworld/41003080" target="_blank" rel="noreferrer">BattleMetrics ↗</a></div></article>
        <article class="card"><h3>Performance</h3><p>Die Website zeigt bewusst Server-FPS und nicht die lokalen Client-FPS.</p><div class="mini-stats"><span>Frametime <strong>${esc(statusValue(s,['serverframetime'],'—'))} ms</strong></span><span>Uptime <strong>${esc(statusValue(s,['uptime'],'—'))}</strong></span><span>Welt-Tage <strong>${esc(statusValue(s,['days'],'—'))}</strong></span></div></article>
      </div>`;
  }

  function render() {
    const renderers = { home: renderHome, rules: renderRules, changes: renderChanges, lab: renderLab, 'pal-locks': renderPalLocks, map: renderMap, elements: renderElements, knowledge: renderKnowledge, links: renderLinks, server: renderServer, deaths: renderDeaths };
    content.innerHTML = (renderers[current] || renderHome)();
    bindPageEvents();
  }

  function bindPageEvents() {
    content.querySelectorAll('[data-quick]').forEach(b => b.addEventListener('click', () => switchTab(b.dataset.quick)));

    const ruleSearch = document.getElementById('ruleSearch');
    if (ruleSearch) ruleSearch.addEventListener('input', e => {
      const q = e.target.value.toLowerCase().trim();
      document.querySelectorAll('[data-rule]').forEach(card => {
        const match = card.dataset.rule.includes(q);
        card.style.display = match ? '' : 'none';
        if (card.tagName === 'DETAILS') card.open = q.length > 0 && match;
      });
    });

    const palSearch = document.getElementById('palSearch');
    const palLevel = document.getElementById('palLevel');
    if (palSearch && palLevel) {
      const apply = () => {
        const q = palSearch.value.toLowerCase().trim();
        const band = palLevel.value;
        document.querySelectorAll('#palRows tr').forEach(row => {
          const nameOk = row.dataset.pal.includes(q);
          const lvl = Number(row.dataset.level);
          const bandOk = band === 'all' ||
            (band === '0-35' && lvl <= 35) ||
            (band === '36-45' && lvl >= 36 && lvl <= 45) ||
            (band === '46-55' && lvl >= 46 && lvl <= 55) ||
            (band === '56+' && lvl >= 56);
          row.style.display = nameOk && bandOk ? '' : 'none';
        });
      };
      palSearch.addEventListener('input', apply);
      palLevel.addEventListener('change', apply);
    }
  }

  async function loadStatus() {
    for (const endpoint of D.statusEndpoints) {
      try {
        const res = await fetch(endpoint, { cache: 'no-store' });
        if (!res.ok) continue;
        const type = res.headers.get('content-type') || '';
        if (!type.includes('application/json')) continue;
        const json = await res.json();
        statusCache = json;
        const isOnline = json.online ?? json.isOnline;
        liveState.classList.toggle('online', isOnline === true);
        liveState.classList.toggle('offline', isOnline === false);
        liveState.innerHTML = `<span class="dot"></span>${isOnline === true ? 'Server online' : isOnline === false ? 'Server offline' : 'Status verbunden'}`;
        if (current === 'server') render();
        return;
      } catch (_) {}
    }
    liveState.innerHTML = '<span class="dot"></span>Status extern';
  }

  async function loadDeaths() {
    try {
      const res = await fetch(D.deathFeedEndpoint, { cache: 'no-store' });
      if (!res.ok) return;
      deathFeedCache = await res.json();
      if (current === 'deaths') render();
    } catch (_) {}
  }

  mobileMenuBtn.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', e => {
    if (window.innerWidth <= 860 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== mobileMenuBtn) sidebar.classList.remove('open');
  });

  navButtons();
  render();
  loadStatus();
  loadDeaths();
  setInterval(loadDeaths, 60000);
})();
