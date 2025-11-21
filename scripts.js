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
});
