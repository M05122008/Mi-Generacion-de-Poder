document.addEventListener('DOMContentLoaded', ()=>{
  // Preloader: ocultar al cargar o tras un breve tiempo
  const preloader = document.getElementById('preloader');
  let preloaderDone = false;
  function hidePreloader(){
    if(preloader && !preloaderDone){
      preloaderDone = true;
      preloader.classList.add('hidden');
      setTimeout(()=>{ try{ preloader.remove(); }catch(e){} }, 2000);
    }
  }
  window.addEventListener('load', hidePreloader, { once: true });
  setTimeout(hidePreloader, 4200);
  const liveRegion = document.getElementById('statusLive');
  const announce = (msg)=>{
    if(!liveRegion) return;
    liveRegion.textContent = '';
    setTimeout(()=>{ liveRegion.textContent = msg; }, 10);
  };
  const notify = (msg)=>{ announce(msg); try{ alert(msg); }catch(e){} };
  // Lightweight i18n (ES/EN)
  const i18nStrings = {
    es:{
      'nav.home':'Inicio','nav.about':'Sobre','nav.gallery':'Galería','nav.videos':'Videos','nav.events':'Eventos','nav.location':'Ubicación','nav.contact':'Contacto',
      'hero.title':'Bienvenidos a Ministerio Internacional Generación de Poder','hero.subtitle':'Iglesia en Tamacá, Zona Norte — Barquisimeto, Lara, Venezuela','hero.ctaPhotos':'Ver Fotos','hero.ctaLocation':'Cómo llegar',
      'gallery.title':'Galería de Fotos','gallery.subtitle':'Haz click en una imagen para verla en grande.',
      'videos.title':'Videos','videos.subtitle':'Revisa algunos de nuestros mensajes y momentos especiales.',
      'events.title':'Eventos','events.subtitle':'Consulta los próximos eventos y el calendario de actividades.',
      'events.next.loading':'Cargando próximo evento...','events.next.empty':'Sin eventos futuros.','events.next.label':'Próximo evento',
      'contact.title':'Contacto','contact.subtitle':'¿Tienes preguntas o quieres unirte? Escríbenos.',
      'about.p1':'El Ministerio Internacional Generación de Poder es un Ministerio Bajo la Cobertura de la Pastora Gisela Bracho El Rey Jesus Punto Fijo.',
      'about.p2':'La Mision de MIGP es una Iglesia  Apostólica y Profetica que Creemos en el Poder y la Manifestacion del Espíritu Santo.',
      'about.p3':'La Vision de MIGP es Evangelizar, Afirmar, Discipular y Enviar.',
      'pastors.title':'Pastores Principales','pastors.subtitle':'Conoce a nuestros pastores principales.',
      'pastors.edgar':'Pastor Edgar Jimenez, Pastor Principal del Ministerio Internacional Generación de Poder, con una trayectoria de servicio, predicación y formación de líderes. Su visión es ver transformada la comunidad a través de la palabra y el discipulado.',
      'pastors.sarahi':'Pastora Sarahi de Jimenez, Pastora del Ministerio Internacional Generación de Poder, guía a las mujeres y ministración. Es parte activa en la enseñanza y coordinación de actividades comunitarias.'
    },
    en:{
      'events.title':'Eventos','events.subtitle':'Consulta los próximos eventos y el calendario de actividades.',
      'hero.title':'Welcome to Ministerio Internacional Generación de Poder','hero.subtitle':'Church in Tamacá, Zona Norte — Barquisimeto, Lara, Venezuela','hero.ctaPhotos':'View Photos','hero.ctaLocation':'Get directions',
      'gallery.title':'Photo Gallery','gallery.subtitle':'Tap any image to view it large.',
      'videos.title':'Videos','videos.subtitle':'Check out our messages and special moments.',
      'events.title':'Events','events.subtitle':'See upcoming events and the activity calendar.',
        'events.next.loading':'Loading next event...','events.next.empty':'No upcoming events.','events.next.label':'Next event',
      'events.next.loading':'Loading next event...','events.next.empty':'No upcoming events.','events.next.label':'Next event',
      'contact.title':'Contact','contact.subtitle':'Questions or want to join? Write to us.',
      'about.p1':'Ministerio Internacional Generación de Poder is under the covering of Pastor Gisela Bracho (El Rey Jesús Punto Fijo).',
      'about.p2':'Our mission is apostolic and prophetic; we believe in the Power and manifestation of the Holy Spirit.',
      'about.p3':'Our vision is to Evangelize, Affirm, Disciple, and Send.',
      'pastors.title':'Lead Pastors','pastors.subtitle':'Meet our lead pastors.',
      'pastors.edgar':'Pastor Edgar Jimenez leads MIGP with a heart for teaching, discipleship, and community transformation.',
      'pastors.sarahi':'Pastor Sarahi de Jimenez focuses on women, families, and ministry, actively teaching and coordinating community activities.'
    }
  };
  function applyI18n(lang){
    const dict = i18nStrings[lang] || i18nStrings.es;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      if(dict[key]) el.textContent = dict[key];
    });
    const toggle = document.getElementById('langToggle');
    if(toggle) toggle.textContent = lang === 'en' ? 'ES' : 'EN';
    document.documentElement.lang = lang === 'en' ? 'en' : 'es';
    localStorage.setItem('siteLang', lang);
  }
  const savedLang = localStorage.getItem('siteLang') || 'es';
  applyI18n(savedLang);
  document.getElementById('langToggle')?.addEventListener('click', ()=>{
    const next = (localStorage.getItem('siteLang') || 'es') === 'es' ? 'en' : 'es';
    applyI18n(next);
  });

  // Año en footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if(navToggle){
    navToggle.setAttribute('aria-expanded','false');
    navToggle.setAttribute('aria-controls','primaryNav');
  }
  // fallback: if nav is not found, try alternate container
  const navEl = nav || document.querySelector('.header-center .site-nav') || document.querySelector('.header--elrey .site-nav');
  // Replace the textual burger with a 3-bar burger element for animation
  if(navToggle){
    navToggle.innerHTML = '';
    const burger = document.createElement('span'); burger.className = 'burger';
    for(let i=0;i<3;i++){ const b = document.createElement('i'); burger.appendChild(b); }
    navToggle.appendChild(burger);
  }

  let navToggleLock = false;
  function runNavToggle(ev){
    ev?.preventDefault?.();
    ev?.stopPropagation?.();
    const isMobile = window.matchMedia('(max-width: 900px)').matches;
    const isOpen = mobileOverlay.classList.contains('open');
    // lock to avoid double toggles on fast repeated taps
    if(navToggleLock){ return; }
    navToggleLock = true; setTimeout(()=> navToggleLock = false, 380);

    if(isMobile){
      if(isOpen){
        closeMobileOverlay();
      } else {
        openMobileOverlay();
      }
    } else {
      const newVal = navEl?.classList.toggle('open');
      if(navToggle) navToggle.setAttribute('aria-expanded', newVal ? 'true' : 'false');
    }
  }
  // Use click only; rely on mobile synthesized click to avoid double toggles
  navToggle?.addEventListener('click', (ev)=>{
    ev.stopImmediatePropagation?.();
    runNavToggle(ev);
  });

  // header shrink + hide/show on scroll
  const headerEl = document.querySelector('.site-header');
  const heroContent = document.querySelector('.hero-content');
  let __lastScrollY = window.scrollY || window.pageYOffset || 0;
  function onScrollHeader(){
    const y = window.scrollY || window.pageYOffset || 0;
    // shrink behavior (small visual change when scrolled a bit)
    if(y > 40){ headerEl && headerEl.classList.add('shrink'); if(heroContent) heroContent.classList.remove('in-view'); }
    else { headerEl && headerEl.classList.remove('shrink'); if(heroContent) heroContent.classList.add('in-view'); }

    // hide on scroll down, show on scroll up
    const delta = y - __lastScrollY;
    if(Math.abs(delta) > 8){
      if(y > 60 && delta > 0){ // scrolling down
        headerEl && headerEl.classList.add('hidden');
      } else { // scrolling up or near top
        headerEl && headerEl.classList.remove('hidden');
      }
    }
    __lastScrollY = y;
  }
  window.addEventListener('scroll', onScrollHeader, {passive:true});
  // initial check and ensure hero text appears with a small delay for transition
  onScrollHeader();
  setTimeout(()=>{ if(heroContent) heroContent.classList.add('in-view'); }, 90);

  

  // MOBILE OVERLAY FALLBACK: build a guaranteed mobile menu overlay from existing nav links
  const mobileOverlay = document.createElement('div');
  mobileOverlay.className = 'mobile-nav-overlay';
  mobileOverlay.setAttribute('aria-hidden','true');
  const inner = document.createElement('div'); inner.className = 'mobile-nav-inner';
  // ensure overlay sits above the header so overlay captures interaction
  try{
    const hz = headerEl ? parseInt(getComputedStyle(headerEl).zIndex || '2200', 10) : 2200;
    mobileOverlay.style.zIndex = (hz + 10).toString();
  }catch(e){}

  // copy links from existing .site-nav
  const srcLinks = Array.from(document.querySelectorAll('.site-nav a'));
  if(srcLinks.length){
    srcLinks.forEach(a=>{
      const copy = document.createElement('a');
      copy.href = a.getAttribute('href') || '#';
      copy.textContent = a.textContent || a.href;
      copy.classList.add('overlay-animate');
      copy.addEventListener('click', (e)=>{
        // smooth scroll if anchor
        const href = copy.getAttribute('href')||'';
        if(href.startsWith('#')){
          e.preventDefault();
          const t = document.getElementById(href.slice(1));
          if(t) t.scrollIntoView({behavior:'smooth', block:'start'});
        }
        // ensure the toggle animation is synced with overlay state
        closeMobileOverlay();
      });
      inner.appendChild(copy);
    });
  }
  // append inner first and then put the close button inside inner so it remains clickable
  mobileOverlay.appendChild(inner);
  document.body.appendChild(mobileOverlay);

  // position inner panel so it doesn't cover header: compute available height
  function layoutMobileOverlay(){
    const hh = headerEl ? headerEl.offsetHeight : 72;
    inner.style.position = 'fixed';
    inner.style.left = '0';
    inner.style.right = '0';
    inner.style.top = hh + 'px';
    inner.style.bottom = '0';
    inner.style.maxHeight = `calc(100vh - ${hh}px)`;
    inner.style.overflowY = 'auto';
  }

  let lastFocus = null;
  let overlayHistoryActive = false;
  function trapFocus(e){
    if(e.key !== 'Tab') return;
    const focusables = inner.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
    if(!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
  }

  function onOverlayKeydown(e){
    if(e.key === 'Escape'){
      e.preventDefault();
      closeMobileOverlay();
    }
    trapFocus(e);
  }

  function openMobileOverlay(){
    if(headerEl) headerEl.classList.remove('hidden');
    layoutMobileOverlay();
    mobileOverlay.classList.add('open');
    mobileOverlay.setAttribute('aria-hidden','false');
    document.body.classList.add('nav-open');
    document.documentElement.classList.add('nav-open');
    if(!overlayHistoryActive){
      try{ history.pushState({ mobileOverlay:true }, '', location.href); overlayHistoryActive = true; }catch(e){}
    }
    if(navToggle){ navToggle.classList.add('open'); navToggle.setAttribute('aria-expanded','true'); }
    const links = mobileOverlay.querySelectorAll('.mobile-nav-inner a');
    const total = links.length;
    links.forEach((lnk, idx)=>{ lnk.style.transitionDelay = ((total - idx - 1) * 65)+'ms'; });
    mobileOverlay.querySelectorAll('.overlay-animate').forEach(lnk=> lnk.classList.add('in-view'));
    const first = mobileOverlay.querySelector('.mobile-nav-inner a');
    lastFocus = document.activeElement;
    if(first) first.focus();
    document.addEventListener('keydown', onOverlayKeydown);
  }

  function closeMobileOverlay(){
    mobileOverlay.querySelectorAll('.overlay-animate').forEach(lnk=> lnk.classList.remove('in-view'));
    mobileOverlay.classList.remove('open');
    mobileOverlay.setAttribute('aria-hidden','true');
    document.body.classList.remove('nav-open');
    document.documentElement.classList.remove('nav-open');
    overlayHistoryActive = false;
    if(navToggle){ navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); }
    document.removeEventListener('keydown', onOverlayKeydown);
    if(lastFocus && typeof lastFocus.focus === 'function'){ lastFocus.focus(); }
  }
  mobileOverlay.addEventListener('click', (e)=>{
    if(e.target === mobileOverlay){
      closeMobileOverlay();
      e.preventDefault();
      e.stopPropagation();
    }
  });
  mobileOverlay.addEventListener('touchmove', (e)=>{
    if(mobileOverlay.classList.contains('open')){ e.preventDefault(); }
  }, { passive:false });
  mobileOverlay.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape'){ e.preventDefault(); closeMobileOverlay(); }
  });
  // Close nav when a link is clicked and perform smooth-scroll for hash links
  document.querySelectorAll('.site-nav a').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href')||'';
      // smooth scroll for same-page anchors
      if(href.startsWith('#')){
        e.preventDefault();
        const id = href.slice(1);
        const target = document.getElementById(id);
        if(target){ target.scrollIntoView({behavior:'smooth', block:'start'}); }
      }
      // close the nav for small/medium screens (matches CSS breakpoint)
      if(window.innerWidth <= 900){
        nav?.classList.remove('open');
        if(navToggle) navToggle.setAttribute('aria-expanded','false');
        document.body.classList.remove('nav-open');
      }
    });
  });

  // Modal
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modalContent');
  const modalClose = document.getElementById('modalClose');
  const modalPrev = document.getElementById('modalPrev');
  const modalNext = document.getElementById('modalNext');

  let lastModalFocus = null;
  let currentMediaList = [];
  let currentMediaIndex = -1;
  let currentMediaType = '';
  const resetMediaNav = ()=>{ currentMediaType=''; currentMediaIndex=-1; };
  let modalHistoryActive = false;

  function openModal(){
    if(typeof stopBanner === 'function') stopBanner();
    modal?.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    document.documentElement.classList.add('modal-open');
    if(!modalHistoryActive){
      try{ history.pushState({ modal:true }, '', location.href); modalHistoryActive = true; }catch(e){}
    }
    lastModalFocus = document.activeElement;
    const focusable = modal?.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
    const showNav = currentMediaType === 'image' && currentMediaList.length > 1;
    if(modalPrev) modalPrev.hidden = !showNav;
    if(modalNext) modalNext.hidden = !showNav;
  }
  function closeModal(){
    modal?.setAttribute('aria-hidden','true');
    document.body.classList.remove('modal-open');
    document.documentElement.classList.remove('modal-open');
    modalHistoryActive = false;
    if(modalContent) modalContent.innerHTML = '';
    if(typeof startBanner === 'function') startBanner();
    if(lastModalFocus && typeof lastModalFocus.focus === 'function') lastModalFocus.focus();
  }
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown',(e)=>{
    if(e.key==='Escape') return closeModal();
    if(modal?.getAttribute('aria-hidden') === 'true') return;
    if(currentMediaType === 'image' && currentMediaList.length){
      if(e.key === 'ArrowRight'){ e.preventDefault(); showMediaByOffset(1); }
      if(e.key === 'ArrowLeft'){ e.preventDefault(); showMediaByOffset(-1); }
    }
  });

  modalPrev?.addEventListener('click', ()=> showMediaByOffset(-1));
  modalNext?.addEventListener('click', ()=> showMediaByOffset(1));

  window.addEventListener('popstate', ()=>{
    // Prioridad: cerrar modal si está abierto; si no, cerrar overlay móvil.
    const isModalOpen = modal && modal.getAttribute('aria-hidden') === 'false';
    if(isModalOpen){ closeModal(); return; }
    const isOverlayOpen = mobileOverlay && mobileOverlay.classList.contains('open');
    if(isOverlayOpen){ closeMobileOverlay(); return; }
  });

  function showMediaByOffset(delta){
    if(currentMediaIndex < 0) return;
    currentMediaIndex = (currentMediaIndex + delta + currentMediaList.length) % currentMediaList.length;
    const item = currentMediaList[currentMediaIndex];
    if(!item) return;
    modalContent.innerHTML = `<img class="modal-media" src="${item.src}" alt="${item.alt}" />`;
  }

  // Open image in modal
  const imageNodes = Array.from(document.querySelectorAll('[data-type="image"]'));
  currentMediaList = imageNodes.map(n=>({src:n.getAttribute('src'), alt:n.getAttribute('alt')||''}));
  imageNodes.forEach((img, idx)=>{
    img.addEventListener('click', ()=>{
      if(!modalContent) return;
      currentMediaIndex = idx;
      currentMediaType = 'image';
      const item = currentMediaList[idx];
      modalContent.innerHTML = `<img class="modal-media" src="${item.src}" alt="${item.alt}" />`;
      openModal();
    });
  });

  // Gallery uses the grid; carousel removed to simplify UX and ensure images display.

  // --- Small reveal-on-scroll using IntersectionObserver for .animate ---
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.animate').forEach(el=> io.observe(el));

  // Animated title letters for elements with .animate-title
  function splitTitleLetters(){
    const titles = document.querySelectorAll('.animate-title');
    titles.forEach(t => {
      // avoid splitting twice
      if(t.dataset.splitDone) return;
      const text = t.textContent.trim();
      t.textContent = '';
      const frag = document.createDocumentFragment();
      Array.from(text).forEach((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        // small stagger via inline style -- JS will later set animationDelay when in view
        span.style.animationDelay = (i * 45) + 'ms';
        frag.appendChild(span);
      });
      t.appendChild(frag);
      t.dataset.splitDone = '1';
    });
  }
  splitTitleLetters();

  const titleObserver = new IntersectionObserver((entries, obs)=>{
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('in-view');
        // add stagger to spans (in case CSS animation needs inline delay)
        const spans = en.target.querySelectorAll('span');
        spans.forEach((s, idx)=> s.style.animationDelay = (idx * 45) + 'ms');
        obs.unobserve(en.target);
      }
    });
  },{threshold:0.12});
  document.querySelectorAll('.animate-title').forEach(el => titleObserver.observe(el));

  // Video cards
  document.querySelectorAll('[data-type="video"]').forEach(card=>{
    card.addEventListener('click', ()=>{
      const id = card.getAttribute('data-video-id');
      if(!id || !modalContent) return;
      currentMediaType = 'video';
      currentMediaIndex = -1;
      // If `data-video-id` points to a local video file (mp4/webm/ogg) use <video>
      const isFile = /\.(mp4|webm|ogg)(\?.*)?$/i.test(id) || id.startsWith('.') || id.startsWith('/');
      modalContent.innerHTML = '';
      if(isFile){
        const video = document.createElement('video');
        video.src = id;
        video.controls = true;
        video.autoplay = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.maxHeight = '80vh';
        modalContent.appendChild(video);
        // try to start playback (user click should allow it)
        video.addEventListener('error', ()=>{
          modalContent.innerHTML = '<p style="color:#fff;padding:1rem">No se pudo reproducir el video. Verifica que el archivo existe y el navegador soporta el formato.</p>';
        });
      } else {
        // treat as YouTube id (or full YouTube URL)
        let youtubeId = id;
        // if user pasted a full YouTube URL, try to extract the id
        const ytMatch = id.match(/(?:v=|\/embed\/|\.be\/)([A-Za-z0-9_-]{6,})/);
        if(ytMatch && ytMatch[1]) youtubeId = ytMatch[1];

        const iframe = document.createElement('iframe');
        iframe.width = '100%';
        iframe.height = '520';
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        modalContent.appendChild(iframe);
      }
      openModal();
    });
  });

  // Banner slideshow (hero) with start/stop control so modal can pause it
  const banner = document.getElementById('banner');
  let bannerSlides = [];
  let bannerCurrent = 0;
  let bannerIntervalId = null;
  function showBannerSlide(i){
    bannerSlides.forEach((s,idx)=> s.classList.toggle('active', idx===i));
  }
  function startBanner(){
    if(!bannerSlides.length) return;
    clearInterval(bannerIntervalId);
    bannerIntervalId = setInterval(()=>{
      bannerCurrent = (bannerCurrent + 1) % bannerSlides.length;
      showBannerSlide(bannerCurrent);
    }, 4500);
  }
  function stopBanner(){ clearInterval(bannerIntervalId); bannerIntervalId = null; }

  if(banner){
    bannerSlides = Array.from(banner.querySelectorAll('img'));
    bannerCurrent = bannerSlides.findIndex(s=>s.classList.contains('active'));
    if(bannerCurrent < 0) bannerCurrent = 0;
    showBannerSlide(bannerCurrent);
    // start autoplay
    startBanner();
    // Pause on hover (desktop); on touch devices hover doesn't fire, so this is safe
    banner.addEventListener('mouseenter', stopBanner);
    banner.addEventListener('mouseleave', startBanner);
  }

  // --- Calendar / Events (with localStorage + admin) ---
  // Firebase integration helpers (if Firebase is configured)
  const isFirebaseReady = typeof window._FIREBASE !== 'undefined' && window._FIREBASE.db;
  const ADMIN_EMAILS = (window._ADMIN_EMAILS || []).map(e=> (e||'').toLowerCase());
  let isAdmin = false;
  const serverTimestamp = (window.firebase && window.firebase.firestore && window.firebase.firestore.FieldValue && window.firebase.firestore.FieldValue.serverTimestamp) ? window.firebase.firestore.FieldValue.serverTimestamp : null;

  async function subscribeEventsAndRender() {
    if(!isFirebaseReady) return;
    try{
      const db = window._FIREBASE.db;
      // onSnapshot accepts (next, error) callbacks; handle permission errors explicitly
      db.collection('events').orderBy('date','asc').onSnapshot(snapshot=>{
        events = [];
        snapshot.forEach(doc=>{
          const d = doc.data();
          events.push({ id: doc.id, title: d.title||'', date: d.date, time: d.time||'', description: d.description||'', flyer: d.flyer||'', media: d.media || [] });
        });
        renderCalendar(currentDate);
        renderAdminList();
        renderNextEvent();
      }, err => {
        console.warn('Firestore onSnapshot error:', err);
        // If permission denied, fallback to localStorage events and notify admin to fix rules
        if(err && err.code === 'permission-denied'){
          console.warn('Firestore permission denied — usando eventos desde localStorage como fallback.');
          events = loadEvents();
          renderCalendar(currentDate);
          renderAdminList();
          renderNextEvent();
        }
      });
    }catch(e){ console.error('Firebase events listen setup error', e); }
  }

  async function ensureUserProfile(user){
    if(!isFirebaseReady || !user || !window._FIREBASE.db) return;
    try{
      const db = window._FIREBASE.db;
      const ref = db.collection('userRoles').doc(user.uid);
      const snap = await ref.get();
      const data = {
        email: user.email || '',
        displayName: user.displayName || '',
        updatedAt: serverTimestamp ? serverTimestamp() : new Date(),
      };
      if(!snap.exists) data.role = 'client';
      await ref.set(data, { merge: true });
    }catch(err){ console.warn('ensureUserProfile error', err); }
  }

  async function fetchUserRole(user){
    if(!isFirebaseReady || !user || !window._FIREBASE.db) return null;
    try{
      const snap = await window._FIREBASE.db.collection('userRoles').doc(user.uid).get();
      if(snap.exists) return snap.data().role || null;
    }catch(err){ console.warn('fetchUserRole error', err); }
    return null;
  }

  async function uploadFileAny(file){
    // Primero Cloudinary si está configurado
    if(window._UPLOAD && window._UPLOAD.provider === 'cloudinary'){
      return uploadToCloudinary(file);
    }
    // Luego Firebase Storage si existe
    if(window._FIREBASE && window._FIREBASE.storage){
      const storage = window._FIREBASE.storage;
      const path = 'flyers/' + Date.now() + '_' + file.name.replace(/\s+/g,'_');
      const uploadTask = await storage.ref().child(path).put(file);
      return await storage.ref().child(path).getDownloadURL();
    }
    throw new Error('No hay almacenamiento configurado para subir archivos');
  }

  async function adminCreateEventFirebase(dateISO, title, time, description, mediaFiles){
    try{
      const db = window._FIREBASE.db;
      const media = [];
      if(mediaFiles && mediaFiles.length){
        for(const file of mediaFiles){
          const url = await uploadFileAny(file);
          const type = file.type && file.type.startsWith('video') ? 'video' : 'image';
          media.push({ type, url, thumb: type==='image' ? url : '' });
        }
      }
      const flyerUrl = media.find(m=>m.type==='image')?.url || media[0]?.url || '';

      if(db){
        await db.collection('events').add({ date: dateISO, title: title||'', time: time||'', description: description||'', flyer: flyerUrl, media, createdAt: new Date() });
        notify('Evento creado en Firebase');
      } else {
        // fallback a localStorage con URLs ya subidas (Cloudinary) si se logró subir; de lo contrario sin media
        const obj = { id: cryptoRandomId(), title: title||'', date: dateISO, time: time||'', description: description||'', flyer: flyerUrl, media };
        events.push(obj);
        saveEvents();
        renderCalendar(currentDate);
        renderAdminList();
        renderNextEvent();
        notify('Evento creado en local (sin Firebase)');
      }
    }catch(err){ console.error(err); notify('Error creando evento: '+err.message); }
  }

  // Upload helper for Cloudinary (unsigned upload preset)
  async function uploadToCloudinary(file){
    if(!window._UPLOAD || !window._UPLOAD.cloudName || !window._UPLOAD.uploadPreset) throw new Error('Cloudinary no configurado');
    const url = `https://api.cloudinary.com/v1_1/${window._UPLOAD.cloudName}/upload`;
    const fd = new FormData();
    fd.append('upload_preset', window._UPLOAD.uploadPreset);
    fd.append('file', file);
    const res = await fetch(url, { method: 'POST', body: fd });
    if(!res.ok) throw new Error('Upload a Cloudinary falló');
    const json = await res.json();
    return json.secure_url || json.url;
  }

  function setupAuthUI(){
    if(!isFirebaseReady) return;
    const auth = window._FIREBASE.auth;
    auth.onAuthStateChanged(async user=>{
      if(user){
        // force token refresh to pick up custom claims set via admin script
        const token = await user.getIdTokenResult(true);
        const email = (user.email||'').toLowerCase();
        await ensureUserProfile(user);
        const roleFromDb = await fetchUserRole(user);
        isAdmin = roleFromDb === 'admin' || (token.claims && token.claims.admin === true) || ADMIN_EMAILS.includes(email);
        const adminLogoutBtn = document.getElementById('btnAdminLogout');
        const adminLoginBtn = document.getElementById('btnAdminLogin');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        const userChip = document.getElementById('userChip');
        const btnSignOut = document.getElementById('btnSignOut');
        if(adminLogoutBtn) adminLogoutBtn.style.display = 'inline-block';
        if(adminLoginBtn) adminLoginBtn.style.display = 'none';
        if(adminPanelBtn) adminPanelBtn.style.display = isAdmin ? 'inline-flex' : 'none';
        if(userChip){
          const labelRole = isAdmin ? 'Administrador' : (roleFromDb || 'Cliente');
          userChip.textContent = (user.displayName || user.email || '—') + ' — ' + labelRole;
          userChip.style.display = 'inline-flex';
        }
        if(btnSignOut) btnSignOut.style.display = 'inline-flex';
        // header popover controls (if present)
        const hbOut = document.getElementById('headerBtnLogout');
        const hbIn = document.getElementById('headerBtnLogin');
        if(hbOut) hbOut.style.display = 'inline-block';
        if(hbIn) hbIn.style.display = 'none';
        // show user info in header popover
        const hEmail = document.getElementById('headerUserEmail');
        const hStatus = document.getElementById('headerAdminStatus');
        const hRefresh = document.getElementById('headerRefreshClaims');
        if(hEmail) hEmail.textContent = user.email || '—';
        if(hStatus) hStatus.textContent = isAdmin ? 'Administrador' : 'No administrador';
        if(hRefresh) hRefresh.style.display = 'inline-block';
        if(isAdmin){ document.body.classList.add('is-admin'); }
        else document.body.classList.remove('is-admin');
        // if user is admin, automatically open the admin panel
        if(isAdmin && eventAdmin){ eventAdmin.removeAttribute('hidden'); renderAdminList(); }
      } else {
        isAdmin = false;
        const adminLogoutBtn = document.getElementById('btnAdminLogout');
        const adminLoginBtn = document.getElementById('btnAdminLogin');
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        const userChip = document.getElementById('userChip');
        const btnSignOut = document.getElementById('btnSignOut');
        if(adminLogoutBtn) adminLogoutBtn.style.display = 'none';
        if(adminLoginBtn) adminLoginBtn.style.display = 'inline-block';
        if(adminPanelBtn) adminPanelBtn.style.display = 'none';
        if(userChip) userChip.style.display = 'none';
        if(btnSignOut) btnSignOut.style.display = 'none';
        const hbOut = document.getElementById('headerBtnLogout');
        const hbIn = document.getElementById('headerBtnLogin');
        if(hbOut) hbOut.style.display = 'none';
        if(hbIn) hbIn.style.display = 'inline-block';
        document.body.classList.remove('is-admin');
        const hEmail = document.getElementById('headerUserEmail');
        const hStatus = document.getElementById('headerAdminStatus');
        const hRefresh = document.getElementById('headerRefreshClaims');
        if(hEmail) hEmail.textContent = '—';
        if(hStatus) hStatus.textContent = '—';
        if(hRefresh) hRefresh.style.display = 'none';
      }
    });
  }

  // Header popover: toggle and hook login/logout
  const headerLoginBtn = document.getElementById('headerLogin');
  const headerPopover = document.getElementById('headerLoginPopover');
  if(headerLoginBtn && headerPopover){
    headerLoginBtn.addEventListener('click', (e)=>{
      const visible = !headerPopover.hasAttribute('hidden');
      if(visible) headerPopover.setAttribute('hidden',''); else headerPopover.removeAttribute('hidden');
    });
    // close popover when clicking outside
    document.addEventListener('click', (e)=>{
      if(!headerPopover) return;
      if(headerPopover.hasAttribute('hidden')) return;
      const path = e.composedPath ? e.composedPath() : (e.path || []);
      if(path.indexOf(headerPopover)===-1 && e.target !== headerLoginBtn) headerPopover.setAttribute('hidden','');
    });
    document.getElementById('headerBtnLogin')?.addEventListener('click', ()=>{
      const e = document.getElementById('headerEmail').value;
      const p = document.getElementById('headerPass').value;
      if(!e||!p) return notify('Email y contraseña requeridos');
      adminLogin(e,p);
      // keep popover open briefly; setupAuthUI will update buttons after state change
    });
    document.getElementById('headerBtnLogout')?.addEventListener('click', ()=>{ adminLogout(); });
    document.getElementById('btnSignOut')?.addEventListener('click', ()=>{ adminLogout(); });
    // refresh claims button: force token refresh and update UI
    document.getElementById('headerRefreshClaims')?.addEventListener('click', async ()=>{
      try{
        const user = window._FIREBASE && window._FIREBASE.auth && window._FIREBASE.auth.currentUser;
        if(!user) return notify('No hay usuario autenticado');
        await user.getIdTokenResult(true); // force refresh
        const token = await user.getIdTokenResult();
        const email = (window._FIREBASE.auth.currentUser?.email||'').toLowerCase();
        const roleFromDb = await fetchUserRole(user);
        isAdmin = roleFromDb === 'admin' || (token.claims && token.claims.admin === true) || ADMIN_EMAILS.includes(email);
        const hStatus = document.getElementById('headerAdminStatus');
        if(hStatus) hStatus.textContent = isAdmin ? 'Administrador' : 'No administrador';
        const adminPanelBtn = document.getElementById('adminPanelBtn');
        if(adminPanelBtn) adminPanelBtn.style.display = isAdmin ? 'inline-flex' : 'none';
        if(isAdmin && eventAdmin){ eventAdmin.removeAttribute('hidden'); renderAdminList(); }
        notify('Claims actualizados. Estado: ' + (isAdmin ? 'Administrador' : 'No administrador'));
      }catch(err){ console.error(err); notify('Error actualizando claims: '+(err.message||err)); }
    });
  }

  async function adminLogin(email, password){
    try{
      await window._FIREBASE.auth.signInWithEmailAndPassword(email, password);
      // close the popover if it's open (better UX on mobile)
      try{ const hp = document.getElementById('headerLoginPopover'); if(hp && !hp.hasAttribute('hidden')) hp.setAttribute('hidden',''); }catch(e){}
      notify('Ingresado');
    }catch(e){ notify('Error login: '+e.message); }
  }

  async function adminLogout(){ if(isFirebaseReady) await window._FIREBASE.auth.signOut(); }

  // Start listening to Firebase if configured
  if(isFirebaseReady){ setupAuthUI(); subscribeEventsAndRender(); }

  function getISODateOffset(offsetDays){
    const d = new Date(); d.setDate(d.getDate() + offsetDays);
    return d.toISOString().slice(0,10);
  }

  // default demo events (used if no stored events)
  const DEFAULT_EVENTS = [
    { id: cryptoRandomId(), date: getISODateOffset(0), title: 'Servicio Sobrenatural', time: '10:00', description: '' },
    { id: cryptoRandomId(), date: getISODateOffset(2), title: 'Reunión de Jóvenes', time: '18:00', description: '' },
    { id: cryptoRandomId(), date: getISODateOffset(7), title: 'Casa de Oración Matutina', time: '05:00', description: '' }
  ];

  function cryptoRandomId(){ return Math.random().toString(36).slice(2,9); }

  function loadEvents(){
    try{
      const raw = localStorage.getItem('migp_events');
      if(!raw) return DEFAULT_EVENTS.slice();
      return JSON.parse(raw);
    }catch(e){ return DEFAULT_EVENTS.slice(); }
  }
  function saveEvents(){ localStorage.setItem('migp_events', JSON.stringify(events)); }

  let events = loadEvents();

  const calendarEl = document.getElementById('calendar');
  const monthYearEl = document.getElementById('monthYear');
  const prevBtn = document.getElementById('prevMonth');
  const nextBtn = document.getElementById('nextMonth');
  const eventsList = document.getElementById('eventsList');
  const toggleAdmin = document.getElementById('toggleAdmin');
  const eventAdmin = document.getElementById('eventAdmin');
  const eventForm = document.getElementById('eventForm');
  const adminEvents = document.getElementById('adminEvents');
  const eventMediaInput = document.getElementById('eventMedia');
  const eventDrop = document.getElementById('eventDrop');
  const eventPreviews = document.getElementById('eventPreviews');

  let pendingMedia = [];

  function clearPendingMedia(){
    pendingMedia.forEach(m=>{ if(m.preview) URL.revokeObjectURL(m.preview); });
    pendingMedia = [];
    renderPendingPreviews();
  }

  function renderPendingPreviews(){
    if(!eventPreviews) return;
    eventPreviews.innerHTML = '';
    if(!pendingMedia.length){
      eventPreviews.innerHTML = '<div class="muted">Sin archivos añadidos.</div>';
      return;
    }
    pendingMedia.forEach((item, idx)=>{
      const card = document.createElement('div'); card.className = 'media-card';
      const badge = document.createElement('div'); badge.className = 'badge'; badge.textContent = item.type === 'video' ? 'Video' : 'Imagen';
      const remove = document.createElement('button'); remove.className = 'remove'; remove.type = 'button'; remove.innerHTML = '×';
      remove.addEventListener('click', ()=>{
        if(item.preview) URL.revokeObjectURL(item.preview);
        pendingMedia.splice(idx,1);
        renderPendingPreviews();
      });
      let mediaEl;
      if(item.type === 'video'){
        mediaEl = document.createElement('video');
        mediaEl.src = item.preview;
        mediaEl.muted = true; mediaEl.playsInline = true; mediaEl.loop = true; mediaEl.autoplay = true;
      } else {
        mediaEl = document.createElement('img');
        mediaEl.src = item.preview;
        mediaEl.alt = item.file?.name || '';
      }
      card.appendChild(mediaEl);
      card.appendChild(badge);
      card.appendChild(remove);
      eventPreviews.appendChild(card);
    });
  }

  function addPendingFiles(files){
    if(!files) return;
    Array.from(files).forEach(file=>{
      if(!file) return;
      const type = file.type && file.type.startsWith('video') ? 'video' : 'image';
      // Evita duplicados por nombre y tamaño
      if(pendingMedia.some(m=> m.file && m.file.name === file.name && m.file.size === file.size)) return;
      const preview = URL.createObjectURL(file);
      pendingMedia.push({ file, type, preview });
    });
    renderPendingPreviews();
  }

  function readFileAsDataURL(file){
    return new Promise((resolve, reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function setupMediaInputs(){
    try{
      eventMediaInput?.addEventListener('change', (e)=>{
        addPendingFiles(e.target.files);
      });

      if(eventDrop){
        const activate = ()=> eventDrop.classList.add('dragover');
        const deactivate = ()=> eventDrop.classList.remove('dragover');
        ['dragenter','dragover'].forEach(ev=> eventDrop.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); activate(); }));
        ['dragleave','drop'].forEach(ev=> eventDrop.addEventListener(ev, (e)=>{ e.preventDefault(); e.stopPropagation(); deactivate(); }));
        eventDrop.addEventListener('drop', (e)=>{ addPendingFiles(e.dataTransfer.files); });
        eventDrop.addEventListener('click', ()=> eventMediaInput?.click());
        eventDrop.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); eventMediaInput?.click(); } });
      }
    }catch(err){ console.warn('setupMediaInputs error', err); }
  }
  setupMediaInputs();

  let currentDate = new Date();

  function renderWeekdays(){
    const names = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    names.forEach(n=>{
      const el = document.createElement('div'); el.className='weekday'; el.textContent = n; calendarEl.appendChild(el);
    });
  }

  function renderNextEvent(){
    const card = document.getElementById('nextEventCard');
    const hero = document.getElementById('heroNextEvent');
    if(!card && !hero) return;
    const lang = localStorage.getItem('siteLang') || 'es';
    const nowIso = new Date().toISOString().slice(0,10);
    const upcoming = events
      .filter(ev=> ev.date && ev.date >= nowIso)
      .sort((a,b)=> (a.date + (a.time||'')) < (b.date + (b.time||'')) ? -1 : 1);
    if(!upcoming.length){
      if(card) card.innerHTML = `<div class="muted" data-i18n="events.next.empty">Sin eventos futuros.</div>`;
      if(hero){ hero.innerHTML = ''; hero.setAttribute('aria-hidden','true'); }
      applyI18n(lang);
      return;
    }
    const ev = upcoming[0];
    // Parse as local date to avoid timezone shifting the displayed day
    const dateObj = new Date(`${ev.date}T00:00:00`);
    const dateStr = dateObj.toLocaleDateString(lang==='en'?'en-US':'es-ES',{weekday:'long', month:'long', day:'numeric'});
    if(card){
      card.innerHTML = `
        <div class="next-event-header" data-i18n="events.next.label">Próximo evento</div>
        <div class="next-event-body">
          <div class="next-event-title">${ev.title || ''}</div>
          <div class="next-event-meta">${dateStr}${ev.time ? ' — ' + ev.time : ''}</div>
          ${ev.description ? `<div class="muted">${ev.description}</div>` : ''}
        </div>`;
    }
    if(hero){
      hero.innerHTML = `
        <span class="label" data-i18n="events.next.label">Próximo evento</span>
        <span class="title">${ev.title || ''}</span>
        <span class="meta">${dateStr}${ev.time ? ' — ' + ev.time : ''}</span>`;
      hero.removeAttribute('aria-hidden');
    }
    applyI18n(lang);
  }
  function renderCalendar(date){
    calendarEl.innerHTML = '';
    renderWeekdays();
    const year = date.getFullYear();
    const month = date.getMonth();
    monthYearEl.textContent = date.toLocaleString('es-ES',{month:'long', year:'numeric'});

    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month+1, 0).getDate();

    // previous month's trailing days
    const prevMonthDays = startWeekday;
    const prevMonthLast = new Date(year, month, 0).getDate();
    for(let i = prevMonthDays-1; i >=0; i--){
      const dayNum = prevMonthLast - i;
      const d = new Date(year, month-1, dayNum);
      appendDay(d, true);
    }
    // current month days
    for(let d=1; d<=daysInMonth; d++){
      const dt = new Date(year, month, d);
      appendDay(dt, false);
    }
    // fill next month to complete grid (42 cells max)
    const cells = calendarEl.querySelectorAll('.day').length + calendarEl.querySelectorAll('.weekday').length;
    const toAdd = (7*6) - cells; // keep 6 rows
    for(let i=1;i<=toAdd;i++){
      const d = new Date(year, month+1, i);
      appendDay(d, true);
    }
  }

  // (duplicate onScrollHeader removed — single handler above controls header shrink and hero reveal)

  function appendDay(d, inactive){
    const el = document.createElement('div'); el.className='day' + (inactive? ' inactive':'');
    const iso = d.toISOString().slice(0,10);
    el.setAttribute('data-date', iso);
    const dateEl = document.createElement('div'); dateEl.className='date'; dateEl.textContent = d.getDate(); el.appendChild(dateEl);
    // event marker
    const has = events.filter(ev=>ev.date===iso);
    if(has.length){
      const dot = document.createElement('div'); dot.className='event-dot'; el.appendChild(dot);
      el.addEventListener('click', ()=> showEventsForDate(iso));
      el.style.cursor = 'pointer';
    }
    calendarEl.appendChild(el);
  }

  function showEventsForDate(iso){
    const list = events.filter(ev=>ev.date===iso).sort((a,b)=> (a.time||'').localeCompare(b.time||''));
    eventsList.innerHTML = '';
    const h = document.createElement('h4'); h.textContent = new Date(`${iso}T00:00:00`).toLocaleDateString('es-ES',{weekday:'long', year:'numeric', month:'long', day:'numeric'});
    eventsList.appendChild(h);
    if(!list.length){
      eventsList.appendChild(Object.assign(document.createElement('div'),{textContent:'No hay eventos para esta fecha.'}));
      return;
    }
    list.forEach(ev=>{
      const it = document.createElement('div'); it.className='events-item';
      let html = `<strong>${ev.title}</strong>`;
      if(ev.time) html += ` — <span class="muted">${ev.time}</span>`;
      if(ev.description) html += `<div>${ev.description}</div>`;
      const mediaList = (ev.media && ev.media.length) ? ev.media : (ev.flyer ? [{ type:'image', url: ev.flyer, thumb: ev.flyer }] : []);
      it.innerHTML = html;
      if(mediaList.length){
        const grid = document.createElement('div'); grid.className = 'media-previews';
        mediaList.forEach((m, idx)=>{
          const card = document.createElement('div'); card.className = 'media-card';
          const badge = document.createElement('div'); badge.className = 'badge'; badge.textContent = m.type === 'video' ? 'Video' : 'Imagen';
          let thumbEl;
          if(m.type === 'video'){
            thumbEl = document.createElement('video');
            thumbEl.src = m.url;
            thumbEl.muted = true; thumbEl.playsInline = true; thumbEl.loop = true; thumbEl.autoplay = true;
            if(m.thumb) thumbEl.poster = m.thumb;
          } else {
            thumbEl = document.createElement('img');
            thumbEl.src = m.thumb || m.url;
            thumbEl.alt = ev.title || 'Flyer';
          }
          thumbEl.style.cursor = 'pointer';
          card.appendChild(thumbEl);
          card.appendChild(badge);
          card.addEventListener('click', ()=>{
            if(!modalContent) return;
            if(m.type === 'video'){
              currentMediaType = 'video';
              currentMediaList = [];
              currentMediaIndex = -1;
              modalContent.innerHTML = `<video class="modal-media" src="${m.url}" controls playsinline autoplay style="max-height:80vh"></video>`;
              openModal();
            } else {
              currentMediaType = 'image';
              currentMediaList = mediaList.filter(x=> x.type === 'image').map(x=>({ src: x.url, alt: ev.title || 'Flyer' }));
              const imagesOnly = currentMediaList;
              const startIndex = imagesOnly.findIndex(x=> x.src === m.url);
              currentMediaIndex = startIndex >=0 ? startIndex : 0;
              modalContent.innerHTML = `<img class="modal-media" src="${m.url}" alt="${ev.title||'Flyer'}"/>`;
              openModal();
            }
          });
          grid.appendChild(card);
        });
        it.appendChild(grid);
      }
      eventsList.appendChild(it);
    });
      // Smooth-scroll the events panel into view so the user sees the flyer immediately
      try{ eventsList.scrollIntoView({behavior:'smooth', block:'start'}); }catch(e){}

      // mark selected day(s) in calendar for clearer focus
      try{
        document.querySelectorAll('.calendar-grid .day.selected').forEach(d=> d.classList.remove('selected'));
        document.querySelectorAll(`.calendar-grid .day[data-date="${iso}"]`).forEach(d=> d.classList.add('selected'));
      }catch(e){}
  }

  // Admin helpers
  function renderAdminList(){
    if(!adminEvents) return;
    adminEvents.innerHTML = '';
    if(!events.length) return adminEvents.textContent = 'No hay eventos.';
    events.slice().sort((a,b)=> a.date.localeCompare(b.date)).forEach(ev=>{
      const row = document.createElement('div'); row.className='admin-event-row';
      const left = document.createElement('div'); left.className = 'left';
      const info = document.createElement('div'); info.className = 'info';
      // thumbnail: usa primer media o flyer
      const firstMedia = (ev.media && ev.media.length) ? ev.media[0] : null;
      const thumbUrl = firstMedia ? (firstMedia.thumb || firstMedia.url) : (ev.flyer || '');
      if(thumbUrl){
        const isVideo = firstMedia && firstMedia.type === 'video';
        const img = document.createElement('img'); img.className = 'thumb'; img.src = thumbUrl; img.alt = ev.title + (isVideo ? ' video' : ' flyer'); img.loading = 'lazy';
        left.appendChild(img);
      }
      info.innerHTML = `<div class="event-title">${ev.title}</div><div class="event-meta">${ev.date}${ev.time? ' — '+ev.time:''}</div>`;
      left.appendChild(info);
      const right = document.createElement('div'); right.className = 'right';
      const del = document.createElement('button'); del.textContent = 'Eliminar'; del.className = 'btn-danger';
      del.addEventListener('click', async ()=>{
        if(!confirm('Eliminar evento?')) return;
        if(isFirebaseReady && ev.id && ev.id.length===20){
          // try delete from Firebase
          try{ await window._FIREBASE.db.collection('events').doc(ev.id).delete(); }
          catch(e){ console.error(e); notify('Error eliminando en Firebase: '+e.message); }
        } else {
          events = events.filter(x=>x.id!==ev.id); saveEvents();
        }
        renderCalendar(currentDate); renderAdminList(); eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>';
      });
      // optional view button
      const view = document.createElement('button'); view.textContent = 'Ver'; view.className = 'btn-outline';
      view.addEventListener('click', ()=>{
        if(!modalContent) return;
        resetMediaNav();
        let html = `<h3>${ev.title}</h3><p class="muted">${ev.date}${ev.time? ' — '+ev.time:''}</p>`;
        if(ev.description) html += `<p>${ev.description}</p>`;
        const mediaList = (ev.media && ev.media.length) ? ev.media : (ev.flyer ? [{ type:'image', url: ev.flyer, thumb: ev.flyer }] : []);
        if(mediaList.length){
          const first = mediaList[0];
          if(first.type === 'video'){
            html += `<video class="modal-media" src="${first.url}" controls playsinline style="max-height:70vh"></video>`;
          } else {
            html += `<img class="modal-media" src="${first.url}" alt="Flyer"/>`;
          }
        }
        modalContent.innerHTML = html; openModal();
      });
      right.appendChild(view);
      right.appendChild(del);
      row.appendChild(left); row.appendChild(right);
      adminEvents.appendChild(row);
    });
  }

  toggleAdmin?.addEventListener('click', ()=>{
    if(!eventAdmin) return;
    if(!isAdmin){
      notify('Solo administradores pueden acceder al panel. Inicia sesión con una cuenta de administrador.');
      return;
    }
    const showing = !eventAdmin.hasAttribute('hidden');
    if(showing){
      // hide with animation
      eventAdmin.classList.remove('open');
      // after transition, set hidden
      setTimeout(()=>{ eventAdmin.setAttribute('hidden',''); }, 380);
    } else {
      eventAdmin.removeAttribute('hidden');
      // allow a tick then add open to trigger transition
      requestAnimationFrame(()=> requestAnimationFrame(()=> eventAdmin.classList.add('open')));
    }
    renderAdminList();
  });

  eventForm?.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const desc = document.getElementById('eventDesc').value.trim();
    if(!title || !date) return notify('Complete título y fecha.');
    // Only allow admins to create events
    if(!isAdmin){
      return notify('Solo administradores pueden crear eventos.');
    }
    const mediaFiles = pendingMedia.map(m=> m.file).filter(Boolean);
    try{
      if(isFirebaseReady && isAdmin){
        await adminCreateEventFirebase(date, title, time, desc, mediaFiles);
      } else {
        // Intentar subir a Cloudinary si está configurado; si no, crear sin media
        let media = [];
        if(mediaFiles.length){
          if(window._UPLOAD && window._UPLOAD.provider === 'cloudinary'){
            for(const file of mediaFiles){
              const url = await uploadFileAny(file);
              const type = file.type && file.type.startsWith('video') ? 'video' : 'image';
              media.push({ type, url, thumb: type==='image' ? url : '' });
            }
          } else {
            // Fallback local: guarda dataURL (persistirá en localStorage). Evita archivos enormes.
            const TOO_LARGE = 4.5 * 1024 * 1024; // ~4.5MB límite de cortesía
            for(const file of mediaFiles){
              if(file.size > TOO_LARGE){
                notify(`Archivo demasiado grande para guardar localmente: ${file.name}`);
                continue;
              }
              const dataUrl = await readFileAsDataURL(file);
              const type = file.type && file.type.startsWith('video') ? 'video' : 'image';
              media.push({ type, url: dataUrl, thumb: type==='image' ? dataUrl : '' });
            }
          }
        }
        const flyer = media.find(m=>m.type==='image')?.url || media[0]?.url || '';
        const obj = { id: cryptoRandomId(), title, date, time, description: desc, flyer, media };
        events.push(obj);
        saveEvents();
        renderCalendar(currentDate);
        renderAdminList();
        renderNextEvent();
        eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>';
        notify(media.length ? 'Evento creado (local con media subida)' : 'Evento creado (local)');
      }
    }catch(err){ notify('Error guardando evento: '+(err.message||err)); }
    eventForm.reset();
    clearPendingMedia();
  });

  document.getElementById('cancelEvent')?.addEventListener('click', ()=>{ eventForm?.reset(); clearPendingMedia(); eventAdmin?.setAttribute('hidden',''); });

  prevBtn?.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(currentDate); });
  nextBtn?.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(currentDate); });

  // init
  if(calendarEl){ renderCalendar(currentDate); eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>'; renderNextEvent(); }
  // hookup admin buttons if present
  document.getElementById('btnAdminLogin')?.addEventListener('click', ()=>{
    const e = document.getElementById('adminEmail').value;
    const p = document.getElementById('adminPass').value;
    if(!e||!p) return alert('Email y contraseña requeridos');
    adminLogin(e,p);
  });
  document.getElementById('btnAdminLogout')?.addEventListener('click', ()=>{ adminLogout(); });
});