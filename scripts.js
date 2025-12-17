document.addEventListener('DOMContentLoaded', ()=>{
  // Año en footer
  const yearEl = document.getElementById('year');
  if(yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  navToggle?.addEventListener('click', ()=>{
    nav?.classList.toggle('open');
  });
  // Close mobile nav when a link is clicked (better UX on phones)
  document.querySelectorAll('.site-nav a').forEach(a=>{
    a.addEventListener('click', ()=>{
      if(window.innerWidth <= 640) nav?.classList.remove('open');
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
      modalContent.innerHTML = `<img src="${src}" alt="" />`;
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
      db.collection('events').orderBy('date','asc').onSnapshot(snapshot=>{
        events = [];
        snapshot.forEach(doc=>{
          const d = doc.data();
          events.push({ id: doc.id, title: d.title||'', date: d.date, time: d.time||'', description: d.description||'', flyer: d.flyer||'' });
        });
        renderCalendar(currentDate);
        renderAdminList();
      });
    }catch(e){ console.error('Firebase events listen error', e); }
  }

  async function adminCreateEventFirebase(dateISO, title, time, description, file){
    try{
      const storage = window._FIREBASE.storage;
      const db = window._FIREBASE.db;
      let flyerUrl = '';
      if(file){
        const path = 'flyers/' + Date.now() + '_' + file.name.replace(/\s+/g,'_');
        const uploadTask = await storage.ref().child(path).put(file);
        flyerUrl = await storage.ref().child(path).getDownloadURL();
      }
      await db.collection('events').add({ date: dateISO, title: title||'', time: time||'', description: description||'', flyer: flyerUrl, createdAt: new Date() });
      alert('Evento creado en Firebase');
    }catch(err){ console.error(err); alert('Error creando evento: '+err.message); }
  }

  function setupAuthUI(){
    if(!isFirebaseReady) return;
    const auth = window._FIREBASE.auth;
    auth.onAuthStateChanged(async user=>{
      if(user){
        const token = await user.getIdTokenResult();
        isAdmin = token.claims && token.claims.admin === true;
        document.getElementById('btnAdminLogout').style.display = 'inline-block';
        document.getElementById('btnAdminLogin').style.display = 'none';
        if(isAdmin){ document.body.classList.add('is-admin'); }
        else document.body.classList.remove('is-admin');
      } else {
        isAdmin = false;
        document.getElementById('btnAdminLogout').style.display = 'none';
        document.getElementById('btnAdminLogin').style.display = 'inline-block';
        document.body.classList.remove('is-admin');
      }
    });
  }

  async function adminLogin(email, password){
    try{ await window._FIREBASE.auth.signInWithEmailAndPassword(email, password); alert('Ingresado'); }
    catch(e){ alert('Error login: '+e.message); }
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
    { id: cryptoRandomId(), date: getISODateOffset(0), title: 'Culto Dominical', time: '10:00', description: '' },
    { id: cryptoRandomId(), date: getISODateOffset(2), title: 'Reunión de Jóvenes', time: '18:00', description: '' },
    { id: cryptoRandomId(), date: getISODateOffset(7), title: 'Oración y Ayuno', time: '05:00', description: '' }
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
      it.innerHTML = html;
      eventsList.appendChild(it);
    });
  }

  // Admin helpers
  function renderAdminList(){
    if(!adminEvents) return;
    adminEvents.innerHTML = '';
    if(!events.length) return adminEvents.textContent = 'No hay eventos.';
    events.slice().sort((a,b)=> a.date.localeCompare(b.date)).forEach(ev=>{
      const row = document.createElement('div'); row.className='admin-event-row';
      const left = document.createElement('div'); left.innerHTML = `<strong>${ev.title}</strong><div class="muted">${ev.date} ${ev.time? ' - '+ev.time:''}</div>`;
      const right = document.createElement('div');
      const del = document.createElement('button'); del.textContent = 'Eliminar';
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
      right.appendChild(del);
      row.appendChild(left); row.appendChild(right);
      adminEvents.appendChild(row);
    });
  }

  toggleAdmin?.addEventListener('click', ()=>{
    if(!eventAdmin) return;
    const showing = !eventAdmin.hasAttribute('hidden');
    if(showing) eventAdmin.setAttribute('hidden',''); else eventAdmin.removeAttribute('hidden');
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
