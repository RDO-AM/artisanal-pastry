/**
 * L'Étoile Dorée - Interactive Artisanal Pastry Landing Page
 * Apple-Style 60 FPS Sequence Scrubbing with Responsive Full-Screen Canvas
 */

(function () {
  'use strict';

  // Disable browser scroll restoration to prevent mid-scroll reload jumps
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);

  // --- Configuration ---
  const TOTAL_FRAMES = 434; // site000.jpg to site433.jpg
  const PHASE1_FRAMES = 35;
  const CHUNK_SIZE = 20;
  const FRAME_BASE_URL = 'images/sequence/site';

  // Cache & State
  const imageCache = new Array(TOTAL_FRAMES);
  const loadedFlags = new Uint8Array(TOTAL_FRAMES);
  let currentRenderedIndex = -1;
  let rafId = null;

  // DOM Elements
  const canvas = document.getElementById('sequence-canvas');
  const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
  const heroSection = document.getElementById('hero-section');
  const topLoader = document.getElementById('top-loader');
  const loaderBar = document.getElementById('loader-bar');
  const scrollIndicator = document.getElementById('scroll-indicator');
  const storyItems = document.querySelectorAll('.story-text-item');

  /**
   * Helper: Formats index 0-433 into 'site000.jpg' to 'site433.jpg'
   */
  function getFramePath(index) {
    const padded = String(index).padStart(3, '0');
    return `${FRAME_BASE_URL}${padded}.jpg`;
  }

  /**
   * Phase 1: Preload first 35 frames eagerly
   */
  function loadPhase1() {
    let loadedCount = 0;
    const initialTarget = PHASE1_FRAMES;

    return new Promise((resolve) => {
      for (let i = 0; i < initialTarget; i++) {
        const img = new Image();
        img.src = getFramePath(i);

        img.onload = () => {
          imageCache[i] = img;
          loadedFlags[i] = 1;
          loadedCount++;

          const percent = Math.round((loadedCount / initialTarget) * 100);
          if (loaderBar) loaderBar.style.width = `${percent}%`;

          // If frame 0 is loaded, draw it immediately!
          if (i === 0 && currentRenderedIndex === -1) {
            renderFrame(0);
          }

          if (loadedCount >= initialTarget) {
            if (topLoader) topLoader.classList.add('done');
            resolve();
          }
        };

        img.onerror = () => {
          loadedCount++;
          if (loadedCount >= initialTarget) {
            if (topLoader) topLoader.classList.add('done');
            resolve();
          }
        };
      }
    });
  }

  /**
   * Phase 2: Background idle loading of remaining frames (35 to 433)
   */
  function loadPhase2() {
    let nextIndex = PHASE1_FRAMES;

    function loadChunk(deadline) {
      while (
        (deadline.timeRemaining() > 1 || deadline.didTimeout) &&
        nextIndex < TOTAL_FRAMES
      ) {
        const chunkEnd = Math.min(nextIndex + CHUNK_SIZE, TOTAL_FRAMES);
        for (let i = nextIndex; i < chunkEnd; i++) {
          if (!imageCache[i]) {
            const img = new Image();
            img.src = getFramePath(i);
            img.onload = () => {
              imageCache[i] = img;
              loadedFlags[i] = 1;
            };
          }
        }
        nextIndex = chunkEnd;
      }

      if (nextIndex < TOTAL_FRAMES) {
        if ('requestIdleCallback' in window) {
          window.requestIdleCallback(loadChunk, { timeout: 150 });
        } else {
          setTimeout(() => loadChunk({ timeRemaining: () => 5, didTimeout: true }), 25);
        }
      }
    }

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(loadChunk, { timeout: 150 });
    } else {
      setTimeout(() => loadChunk({ timeRemaining: () => 5, didTimeout: true }), 25);
    }
  }

  /**
   * Canvas Sizing with Retina DPI Handling
   */
  function resizeCanvas() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    // Lightweight buffer scaling on mobile
    const isMobile = w < 768;
    const bufferScale = isMobile ? 0.75 : 1.0;

    canvas.width = Math.round(w * dpr * bufferScale);
    canvas.height = Math.round(h * dpr * bufferScale);

    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    // Redraw current frame
    if (currentRenderedIndex >= 0) {
      renderFrame(currentRenderedIndex, true);
    }
  }

  /**
   * Find nearest loaded frame if scrub moves faster than loading
   */
  function getBestAvailableImage(targetIndex) {
    if (loadedFlags[targetIndex] && imageCache[targetIndex]) {
      return imageCache[targetIndex];
    }
    // Search backward
    for (let i = targetIndex - 1; i >= 0; i--) {
      if (loadedFlags[i] && imageCache[i]) return imageCache[i];
    }
    // Search forward
    for (let i = targetIndex + 1; i < TOTAL_FRAMES; i++) {
      if (loadedFlags[i] && imageCache[i]) return imageCache[i];
    }
    return imageCache[0] || null;
  }

  /**
   * Universal Responsive Scale Calculation:
   * Adapts seamlessly to 1920x1080 (Desktop), 1366x768 (Laptop), 1440x900 (MacBook),
   * 768x1024 (iPad) and 390x844 (Mobile).
   */
  function calculateDimensions(canvasW, canvasH, imgW, imgH) {
    const imgAspect = imgW / imgH; // 1920 / 1080 = 1.7778
    const canvasAspect = canvasW / canvasH;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > imgAspect) {
      // Desktop / Laptop screens (wider than 16:9 due to browser toolbar)
      // Fill width 100% so there are no empty bars on sides
      drawW = canvasW;
      drawH = canvasW / imgAspect;
      drawX = 0;
      // Slight vertical alignment: keep bottom crust and top berries in view
      const overflowY = drawH - canvasH;
      drawY = -overflowY * 0.42;
    } else {
      // Mobile / Tablet screens (taller than 16:9)
      // Fill height 100%
      drawH = canvasH;
      drawW = canvasH * imgAspect;
      drawY = 0;
      drawX = (canvasW - drawW) / 2;
    }

    return { drawW, drawH, drawX, drawY };
  }

  /**
   * Render frame to canvas with responsive full-cover and seamless background tone
   */
  function renderFrame(index, force = false) {
    if (index === currentRenderedIndex && !force) return;

    const img = getBestAvailableImage(index);
    if (!img) return;

    currentRenderedIndex = index;

    const cw = canvas.width;
    const ch = canvas.height;

    const imgW = img.naturalWidth || 1920;
    const imgH = img.naturalHeight || 1080;

    const { drawW, drawH, drawX, drawY } = calculateDimensions(cw, ch, imgW, imgH);

    // Dynamic background blend matching studio tone
    const progress = index / (TOTAL_FRAMES - 1);
    let bgTone = '#F7F2EB';
    if (progress > 0.65) {
      const p = (progress - 0.65) / 0.35;
      const r = Math.round(247 + (238 - 247) * p);
      const g = Math.round(242 + (221 - 242) * p);
      const b = Math.round(235 + (201 - 235) * p);
      bgTone = `rgb(${r}, ${g}, ${b})`;
    }

    ctx.fillStyle = bgTone;
    ctx.fillRect(0, 0, cw, ch);

    // Draw frame
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }

  /**
   * Synchronized Contextual Persian Editorial Overlays
   */
  function updateStoryOverlay(frame) {
    // Stage 1 (فریم‌های ابتدایی 0 تا 105 | تزریق خامه)
    const stage1Active = frame >= 0 && frame <= 105;

    // Stage 2 (فریم‌های 115 تا 215 | سقوط میوه‌ها)
    const stage2Active = frame >= 115 && frame <= 215;

    // Stage 3 (فریم‌های 225 تا 320 | لعاب براق)
    const stage3Active = frame >= 225 && frame <= 320;

    // Stage 4 (فریم‌های 325 تا 433 | کالکشن نهایی)
    const stage4Active = frame >= 325;

    const activeMap = {
      1: stage1Active,
      2: stage2Active,
      3: stage3Active,
      4: stage4Active
    };

    storyItems.forEach((item) => {
      const stage = item.getAttribute('data-stage');
      if (activeMap[stage]) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    // Scroll indicator mouse icon (fade out after initial scrolling)
    if (scrollIndicator) {
      if (frame < 15) {
        scrollIndicator.classList.remove('fade-out');
      } else {
        scrollIndicator.classList.add('fade-out');
      }
    }
  }

  /**
   * GSAP ScrollTrigger Setup with TRUE PINNING
   */
  let scrollTriggerInstance = null;

  function initScrollAnimation() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      console.warn('GSAP or ScrollTrigger not loaded yet.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Clear browser scroll memory to prevent jump on page reload
    if (typeof ScrollTrigger.clearScrollMemory === 'function') {
      ScrollTrigger.clearScrollMemory('manual');
    }

    // Pin heroSection for 3200px of scroll distance
    scrollTriggerInstance = ScrollTrigger.create({
      trigger: heroSection,
      start: 'top top',
      end: '+=3200',
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      onUpdate: (self) => {
        const targetFrame = Math.min(
          Math.floor(self.progress * TOTAL_FRAMES),
          TOTAL_FRAMES - 1
        );

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          renderFrame(targetFrame);
          updateStoryOverlay(targetFrame);
        });
      }
    });

    // Header scroll background toggle
    const header = document.querySelector('.site-header');
    if (header) {
      ScrollTrigger.create({
        start: 'top -40',
        onUpdate: (self) => {
          if (self.progress > 0.01) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
      });
    }
  }

  /**
   * Web Audio API: Luxury Subtle Chimes
   */
  let audioCtx = null;
  let isSoundEnabled = false;
  const soundBtn = document.getElementById('sound-toggle');

  function playSoftChime(freq = 528) {
    if (!isSoundEnabled) return;
    try {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 1.25);
    } catch (e) {
      console.log('Audio error:', e);
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      soundBtn.style.color = isSoundEnabled ? 'var(--accent-gold)' : 'var(--text-secondary)';
      soundBtn.setAttribute('title', isSoundEnabled ? 'صدا روشن' : 'صدا خاموش');
      if (isSoundEnabled) {
        playSoftChime(660);
      }
    });
  }

  /**
   * Mobile Hamburger Menu Drawer
   */
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const drawerOverlay = document.getElementById('mobile-drawer-overlay');
  const drawerCloseBtn = document.getElementById('drawer-close-btn');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (drawer) drawer.classList.add('active');
    if (drawerOverlay) drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('active');
    if (drawerOverlay) drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);
  drawerLinks.forEach((link) => link.addEventListener('click', closeDrawer));


  /**
   * Window Resize with Debounce
   */
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      resizeCanvas();
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 100);
  });

  /**
   * Main Initialization Routine
   */
  async function init() {
    window.scrollTo(0, 0);
    resizeCanvas();

    // Eagerly render Frame 0 immediately
    const img0 = new Image();
    img0.src = getFramePath(0);
    img0.onload = () => {
      imageCache[0] = img0;
      loadedFlags[0] = 1;
      renderFrame(0, true);
      updateStoryOverlay(0);
    };
    if (img0.complete && img0.naturalWidth > 0) {
      imageCache[0] = img0;
      loadedFlags[0] = 1;
      renderFrame(0, true);
      updateStoryOverlay(0);
    }

    // Init GSAP Scroll scrubbing with pin
    initScrollAnimation();

    // Initial render and overlay
    renderFrame(0, true);
    updateStoryOverlay(0);

    // Phase 1: eager load 35 frames
    await loadPhase1();

    // Phase 2: background idle loading of remaining frames (35 to 433)
    loadPhase2();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.addEventListener('beforeunload', () => {
    window.scrollTo(0, 0);
    if (scrollTriggerInstance) {
      scrollTriggerInstance.kill();
    }
  });
})();
