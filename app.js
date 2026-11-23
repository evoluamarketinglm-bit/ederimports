(() => {
  "use strict";
  const config = window.EDER_CONFIG;
  if (!config) return;

  const $ = (selector) => document.querySelector(selector);
  const make = (tag, cls = "") => {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    return node;
  };
  const prevSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m14 5-7 7 7 7"/></svg>';
  const nextSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m10 5 7 7-7 7"/></svg>';
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let toastTimeout;
  let lastSwipeAt = 0;

  function notice(text) {
    const toast = $('#toast');
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2900);
  }
  function visit(item) {
    if (!item.url) return notice(`Catálogo ${item.nome} ainda não disponível.`);
    window.open(item.url, '_blank', 'noopener,noreferrer');
  }
  function imageNode(url, alt, eager = false) {
    const img = new Image();
    img.src = url;
    img.alt = alt;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    return img;
  }
  function wrap(index, count) { return (index + count) % count; }
  function addSwipe(target, left, right) {
    let startX = null;
    target.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse') return;
      startX = event.clientX;
    });
    target.addEventListener('pointerup', event => {
      if (startX === null) return;
      const dx = event.clientX - startX;
      startX = null;
      if (Math.abs(dx) < 35) return;
      lastSwipeAt = Date.now();
      if (dx < 0) left(); else right();
    });
    target.addEventListener('pointercancel', () => { startX = null; });
  }

  function initHeader() {
    $('#brand-logo').src = config.loja.logo;
    $('#footer-logo').src = config.loja.logo;
    $('#hero-image').src = config.bannerPrincipal;
    $('#header-whatsapp').href = config.loja.whatsapp;
    $('#floating-whatsapp').href = config.loja.whatsapp;
    const menu = $('#site-menu');
    const toggle = $('.menu-toggle');
    const scrim = $('#menu-scrim');
    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      scrim.hidden = true;
    }
    function open() {
      menu.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      scrim.hidden = false;
    }
    toggle.addEventListener('click', () => menu.classList.contains('is-open') ? close() : open());
    scrim.addEventListener('click', close);
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') close(); });
  }

  function createOrbit(section) {
    const wrapper = make('div', 'orbit-wrap');
    const stage = make('div', 'orbit-stage');
    stage.setAttribute('tabindex', '0');
    stage.setAttribute('aria-label', `Coleções ${section.nome} — use as setas para navegar`);
    const cards = section.colecoes.map(item => {
      const button = make('button', 'orbit-card');
      button.type = 'button';
      button.title = item.nome;
      button.setAttribute('aria-label', item.nome);
      const label = make('span', 'orbit-label');
      label.textContent = item.nome;
      button.append(imageNode(item.imagem, item.nome), label);
      stage.append(button);
      return button;
    });
    let active = 0;
    function draw() {
      const n = cards.length;
      cards.forEach((button, index) => {
        const relative = wrap(index - active, n);
        button.className = `orbit-card ${relative === 0 ? 'is-center' : relative === 1 ? 'is-next' : 'is-prev'}`;
        button.tabIndex = relative === 0 ? 0 : -1;
        button.setAttribute('aria-label', `${section.colecoes[index].nome}${!section.colecoes[index].url ? ' — catálogo ainda não cadastrado' : ''}`);
      });
    }
    const move = step => { active = wrap(active + step, cards.length); draw(); };
    cards.forEach((button, index) => button.addEventListener('click', () => {
      if (Date.now() - lastSwipeAt < 350) return;
      if (index === active) visit(section.colecoes[index]);
      else { active = index; draw(); }
    }));
    const arrow = (cls, label, symbol, step) => {
      const button = make('button', `orbit-arrow ${cls}`);
      button.type = 'button';
      button.setAttribute('aria-label', label);
      button.innerHTML = symbol;
      button.addEventListener('click', () => move(step));
      wrapper.append(button);
    };
    wrapper.append(stage);
    arrow('prev', `Coleção anterior de ${section.nome}`, prevSvg, -1);
    arrow('next', `Próxima coleção de ${section.nome}`, nextSvg, 1);
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
      if (event.key === 'Enter') { event.preventDefault(); visit(section.colecoes[active]); }
    });
    addSwipe(stage, () => move(1), () => move(-1));
    draw();
    return wrapper;
  }

  function initSections() {
    const root = $('#sections-root');
    for (const section of config.secoes) {
      const container = make('section', 'catalog-section');
      container.id = section.id;
      container.setAttribute('aria-label', section.nome);
      const banner = make('div', 'section-banner');
      banner.append(imageNode(section.banner, `Banner ${section.nome}`));
      container.append(banner, createOrbit(section));
      root.append(container);
    }
  }

  function initTenis() {
    const stage = $('#tennis-stage');
    const dots = $('#tennis-dots');
    let active = 0;
    let interval = null;
    const n = config.tenis.length;
    const slides = config.tenis.map((item, index) => {
      const button = make('button', 'tennis-card is-hidden');
      button.type = 'button';
      button.title = item.nome;
      button.setAttribute('aria-label', `Abrir ${item.nome}`);
      button.append(imageNode(item.imagem, item.nome, true));
      button.addEventListener('click', () => {
        if (Date.now() - lastSwipeAt < 350) return;
        if (index === active) visit(item);
        else { active = index; render(); restart(); }
      });
      stage.append(button);
      return button;
    });
    const bullets = config.tenis.map((item, index) => {
      const b = make('button', 'tennis-dot');
      b.type = 'button';
      b.setAttribute('aria-label', `Mostrar ${item.nome}`);
      b.addEventListener('click', () => { active = index; render(); restart(); });
      dots.append(b);
      return b;
    });
    function render() {
      slides.forEach((button, index) => {
        button.className = 'tennis-card ' +
          (index === active ? 'is-center' :
            index === wrap(active - 1, n) ? 'is-prev' :
            index === wrap(active + 1, n) ? 'is-next' : 'is-hidden');
        button.tabIndex = index === active ? 0 : -1;
        button.setAttribute('aria-label', `${config.tenis[index].nome}${config.tenis[index].url ? ' — abrir catálogo' : ' — catálogo ainda não disponível'}`);
      });
      bullets.forEach((bullet, index) => {
        bullet.classList.toggle('active', index === active);
        bullet.setAttribute('aria-current', index === active ? 'true' : 'false');
      });
    }
    function move(step) { active = wrap(active + step, n); render(); }
    function stop() { clearInterval(interval); interval = null; }
    function start() {
      if (reduceMotion || document.hidden || interval) return;
      interval = setInterval(() => move(1), 4700);
    }
    function restart() { stop(); start(); }
    stage.addEventListener('pointerenter', stop);
    stage.addEventListener('pointerleave', start);
    stage.addEventListener('focusin', stop);
    stage.addEventListener('focusout', event => { if (!stage.contains(event.relatedTarget)) start(); });
    stage.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); restart(); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); restart(); }
      if (event.key === 'Enter' && event.target === stage) visit(config.tenis[active]);
    });
    addSwipe(stage, () => { move(1); restart(); }, () => { move(-1); restart(); });
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
    render(); start();
  }

  initHeader();
  initSections();
  initTenis();
})();
