document.addEventListener('DOMContentLoaded', ()=>{
  // Año en footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if(navToggle) navToggle.setAttribute('aria-expanded','false');
  // fallback: if nav is not found, try alternate container
  const navEl = nav || document.querySelector('.header-center .site-nav') || document.querySelector('.header--elrey .site-nav');
  // Replace the textual burger with a 3-bar burger element for animation
  if(navToggle){
    navToggle.innerHTML = '';
    const burger = document.createElement('span'); burger.className = 'burger';
    for(let i=0;i<3;i++){ const b = document.createElement('i'); burger.appendChild(b); }
    navToggle.appendChild(burger);
  }

  function handleNavToggle(ev){
    // unify open/close behavior so the animated X always performs the close action
    const isMobile = window.innerWidth <= 900;
    const isOpen = mobileOverlay.classList.contains('open');
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
  navToggle?.addEventListener('click', handleNavToggle);
  // also respond to pointerdown for improved touch reliability
  navToggle?.addEventListener('pointerdown', handleNavToggle);

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
  layoutMobileOverlay();
  window.addEventListener('resize', layoutMobileOverlay, {passive:true});

  // wire overlay open/close to toggles
  function openMobileOverlay(){
    // ensure header remains visible when menu opens
    if(headerEl) headerEl.classList.remove('hidden');
    layoutMobileOverlay();
    mobileOverlay.classList.add('open');
    // sync toggle button state
    if(navToggle){ navToggle.classList.add('open'); navToggle.setAttribute('aria-expanded','true'); }
    const links = mobileOverlay.querySelectorAll('.mobile-nav-inner a');
    const total = links.length;
    links.forEach((lnk, idx)=>{ lnk.style.transitionDelay = ((total - idx - 1) * 65)+'ms'; });
    // trigger letter animations for overlay links
    mobileOverlay.querySelectorAll('.overlay-animate').forEach(lnk=> lnk.classList.add('in-view'));
    const first = mobileOverlay.querySelector('.mobile-nav-inner a'); if(first) first.focus();
  }
  function closeMobileOverlay(){
    // remove letter animation class first (for smoother reverse animation)
    mobileOverlay.querySelectorAll('.overlay-animate').forEach(lnk=> lnk.classList.remove('in-view'));
    mobileOverlay.classList.remove('open');
    // sync toggle button state and aria
    if(navToggle){ navToggle.classList.remove('open'); navToggle.setAttribute('aria-expanded','false'); navToggle.focus(); }
  }
  // (removed redundant click handler that forced mobile overlay open)
  // listen to pointer and click events on close button for better mobile compatibility
  // (inner close button removed)
  // close on ESC
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ if(mobileOverlay.classList.contains('open')) closeMobileOverlay(); } });
  // debug: log overlay pointer interactions
  mobileOverlay.addEventListener('pointerdown', (e)=>{ if(e.target === mobileOverlay) closeMobileOverlay(); });
  mobileOverlay.addEventListener('click', (e)=>{ if(e.target === mobileOverlay) closeMobileOverlay(); });
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

  function openModal(){
    // pause banner slideshow when modal opens
    if(typeof stopBanner === 'function') stopBanner();
    modal?.setAttribute('aria-hidden','false');
  }
  function closeModal(){
    modal?.setAttribute('aria-hidden','true');
    if(modalContent) modalContent.innerHTML = '';
    // resume banner slideshow when modal closes
    if(typeof startBanner === 'function') startBanner();
  }
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e)=>{ if(e.target===modal) closeModal(); });
  document.addEventListener('keydown',(e)=>{ if(e.key==='Escape') closeModal(); });

  // Open image in modal
  document.querySelectorAll('[data-type="image"]').forEach(img=>{
    img.addEventListener('click', ()=>{
      if(!modalContent) return;
      const src = img.getAttribute('src');
      modalContent.innerHTML = `<img class="modal-media" src="${src}" alt="" />`;
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
  let isAdmin = false;

  async function subscribeEventsAndRender() {
    if(!isFirebaseReady) return;
    try{
      const db = window._FIREBASE.db;
      // onSnapshot accepts (next, error) callbacks; handle permission errors explicitly
      db.collection('events').orderBy('date','asc').onSnapshot(snapshot=>{
        events = [];
        snapshot.forEach(doc=>{
          const d = doc.data();
          events.push({ id: doc.id, title: d.title||'', date: d.date, time: d.time||'', description: d.description||'', flyer: d.flyer||'' });
        });
        renderCalendar(currentDate);
        renderAdminList();
      }, err => {
        console.warn('Firestore onSnapshot error:', err);
        // If permission denied, fallback to localStorage events and notify admin to fix rules
        if(err && err.code === 'permission-denied'){
          console.warn('Firestore permission denied — usando eventos desde localStorage como fallback.');
          events = loadEvents();
          renderCalendar(currentDate);
          renderAdminList();
        }
      });
    }catch(e){ console.error('Firebase events listen setup error', e); }
  }

  async function adminCreateEventFirebase(dateISO, title, time, description, file){
    try{
      const db = window._FIREBASE.db;
      let flyerUrl = '';
      // If Cloudinary configured, upload there
      if(window._UPLOAD && window._UPLOAD.provider === 'cloudinary' && file){
        try{
          flyerUrl = await uploadToCloudinary(file);
        }catch(err){ console.error('Cloudinary upload failed', err); throw err; }
      }
      // If Firebase storage is available and no flyerUrl yet, try Firebase storage
      else if(window._FIREBASE && window._FIREBASE.storage && file){
        const storage = window._FIREBASE.storage;
        const path = 'flyers/' + Date.now() + '_' + file.name.replace(/\s+/g,'_');
        const uploadTask = await storage.ref().child(path).put(file);
        flyerUrl = await storage.ref().child(path).getDownloadURL();
      }

      if(db){
        await db.collection('events').add({ date: dateISO, title: title||'', time: time||'', description: description||'', flyer: flyerUrl, createdAt: new Date() });
        alert('Evento creado en Firebase');
      } else {
        // fallback to localStorage
        const obj = { id: cryptoRandomId(), title: title||'', date: dateISO, time: time||'', description: description||'', flyer: flyerUrl };
        events.push(obj);
        saveEvents();
        renderCalendar(currentDate);
        renderAdminList();
        alert('Evento creado en local (sin Firebase)');
      }
    }catch(err){ console.error(err); alert('Error creando evento: '+err.message); }
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
        isAdmin = token.claims && token.claims.admin === true;
        const adminLogoutBtn = document.getElementById('btnAdminLogout');
        const adminLoginBtn = document.getElementById('btnAdminLogin');
        if(adminLogoutBtn) adminLogoutBtn.style.display = 'inline-block';
        if(adminLoginBtn) adminLoginBtn.style.display = 'none';
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
        if(adminLogoutBtn) adminLogoutBtn.style.display = 'none';
        if(adminLoginBtn) adminLoginBtn.style.display = 'inline-block';
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
      if(!e||!p) return alert('Email y contraseña requeridos');
      adminLogin(e,p);
      // keep popover open briefly; setupAuthUI will update buttons after state change
    });
    document.getElementById('headerBtnLogout')?.addEventListener('click', ()=>{ adminLogout(); });
    // refresh claims button: force token refresh and update UI
    document.getElementById('headerRefreshClaims')?.addEventListener('click', async ()=>{
      try{
        const user = window._FIREBASE && window._FIREBASE.auth && window._FIREBASE.auth.currentUser;
        if(!user) return alert('No hay usuario autenticado');
        await user.getIdTokenResult(true); // force refresh
        const token = await user.getIdTokenResult();
        isAdmin = token.claims && token.claims.admin === true;
        const hStatus = document.getElementById('headerAdminStatus');
        if(hStatus) hStatus.textContent = isAdmin ? 'Administrador' : 'No administrador';
        if(isAdmin && eventAdmin){ eventAdmin.removeAttribute('hidden'); renderAdminList(); }
        alert('Claims actualizados. Estado: ' + (isAdmin ? 'Administrador' : 'No administrador'));
      }catch(err){ console.error(err); alert('Error actualizando claims: '+(err.message||err)); }
    });
  }

  async function adminLogin(email, password){
    try{
      await window._FIREBASE.auth.signInWithEmailAndPassword(email, password);
      // close the popover if it's open (better UX on mobile)
      try{ const hp = document.getElementById('headerLoginPopover'); if(hp && !hp.hasAttribute('hidden')) hp.setAttribute('hidden',''); }catch(e){}
      alert('Ingresado');
    }catch(e){ alert('Error login: '+e.message); }
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

  let currentDate = new Date();

  function renderWeekdays(){
    const names = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
    names.forEach(n=>{
      const el = document.createElement('div'); el.className='weekday'; el.textContent = n; calendarEl.appendChild(el);
    });
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
    const h = document.createElement('h4'); h.textContent = new Date(iso).toLocaleDateString('es-ES',{weekday:'long', year:'numeric', month:'long', day:'numeric'});
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
      if(ev.flyer){
        // show a single, modestly sized preview image (not duplicate thumbnail)
        html += `<div class="event-flyer-preview"><img src="${ev.flyer}" alt="Flyer preview" class="event-flyer-img"/></div>`;
      }
      it.innerHTML = html;
      const img = it.querySelector('img');
      if(img){
        img.addEventListener('click', ()=>{
          if(!modalContent) return;
          modalContent.innerHTML = `<img class="modal-media" src="${ev.flyer}" alt="Flyer"/>`;
          openModal();
        });
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
      // thumbnail if exists
      if(ev.flyer){
        const img = document.createElement('img'); img.className = 'thumb'; img.src = ev.flyer; img.alt = ev.title + ' flyer'; img.loading = 'lazy';
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
          catch(e){ console.error(e); alert('Error eliminando en Firebase: '+e.message); }
        } else {
          events = events.filter(x=>x.id!==ev.id); saveEvents();
        }
        renderCalendar(currentDate); renderAdminList(); eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>';
      });
      // optional view button
      const view = document.createElement('button'); view.textContent = 'Ver'; view.className = 'btn-outline';
      view.addEventListener('click', ()=>{
        if(!modalContent) return;
        let html = `<h3>${ev.title}</h3><p class="muted">${ev.date}${ev.time? ' — '+ev.time:''}</p>`;
        if(ev.description) html += `<p>${ev.description}</p>`;
        if(ev.flyer) html += `<img class="modal-media" src="${ev.flyer}" alt="Flyer"/>`;
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
      alert('Solo administradores pueden acceder al panel. Inicia sesión con una cuenta de administrador.');
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

  eventForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const desc = document.getElementById('eventDesc').value.trim();
    const flyerFile = document.getElementById('eventFlyer')?.files?.[0];
    if(!title || !date) return alert('Complete título y fecha.');
    // Only allow admins to create events
    if(!isAdmin){
      return alert('Solo administradores pueden crear eventos.');
    }
    if(isFirebaseReady && isAdmin){
      // create in Firebase and upload flyer
      adminCreateEventFirebase(date, title, time, desc, flyerFile).then(()=>{
        eventForm.reset();
      });
    } else {
      const obj = { id: cryptoRandomId(), title, date, time, description: desc };
      events.push(obj);
      saveEvents();
      renderCalendar(currentDate);
      renderAdminList();
      eventForm.reset();
      eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>';
    }
  });

  document.getElementById('cancelEvent')?.addEventListener('click', ()=>{ eventForm?.reset(); eventAdmin?.setAttribute('hidden',''); });

  prevBtn?.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()-1); renderCalendar(currentDate); });
  nextBtn?.addEventListener('click', ()=>{ currentDate.setMonth(currentDate.getMonth()+1); renderCalendar(currentDate); });

  // init
  if(calendarEl){ renderCalendar(currentDate); eventsList.innerHTML = '<div class="muted">Selecciona un día con punto para ver los eventos.</div>'; }
  // hookup admin buttons if present
  document.getElementById('btnAdminLogin')?.addEventListener('click', ()=>{
    const e = document.getElementById('adminEmail').value;
    const p = document.getElementById('adminPass').value;
    if(!e||!p) return alert('Email y contraseña requeridos');
    adminLogin(e,p);
  });
  document.getElementById('btnAdminLogout')?.addEventListener('click', ()=>{ adminLogout(); });
});