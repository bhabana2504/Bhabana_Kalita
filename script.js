/* ==========================================================
   Bhabana Kalita Portfolio - Interactive Script
   - Dynamic entrance image shatter screen
   - Custom cursor follower
   - Hero parallax (mouse-driven 3D feel)
   - Card tilt effect
   - Scroll reveal via IntersectionObserver
   ========================================================== */

(function () {
  'use strict';

  /* ---------- 1. Dynamic Shatter Landing Screen ---------- */
  const overlay = document.getElementById('shatter-overlay');
  const container = document.getElementById('shatter-face-container');
  const flash = document.getElementById('shatter-flash');
  let isShattered = false;

  if (overlay && container) {
    // Lock scroll initially
    document.body.classList.add('shatter-lock');

    // Create a 10x10 grid of shards
    const rows = 10;
    const cols = 10;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const piece = document.createElement('div');
        piece.className = 'shatter-piece';
        
        // Sizing & coordinates (10% wide/tall)
        piece.style.width = '10%';
        piece.style.height = '10%';
        piece.style.left = `${c * 10}%`;
        piece.style.top = `${r * 10}%`;
        
        // Profile image & alignments
        piece.style.backgroundImage = 'url("bhabana.jpg")';
        piece.style.backgroundSize = '1000% 1000%';
        piece.style.backgroundPosition = `${c * 11.111}% ${r * 11.111}%`; // Math: 100 / (cols - 1)
        
        container.appendChild(piece);
      }
    }

    // Shatter function
    function shatter() {
      if (isShattered) return;
      isShattered = true;

      // Unlock body scrolling
      document.body.classList.remove('shatter-lock');

      // Trigger impact flash
      if (flash) {
        flash.style.opacity = '0.9';
        setTimeout(() => {
          flash.style.opacity = '0';
        }, 50);
      }

      // Explode the shards
      const pieces = container.querySelectorAll('.shatter-piece');
      pieces.forEach((piece) => {
        // Random 3D vectors
        const rx = (Math.random() - 0.5) * 1400; // translate range
        const ry = (Math.random() - 0.5) * 1400;
        const rz = (Math.random() - 0.5) * 1000 + 400; // push toward camera
        const rotX = (Math.random() - 0.5) * 720; // rotations
        const rotY = (Math.random() - 0.5) * 720;
        const rotZ = (Math.random() - 0.5) * 720;
        
        piece.style.transform = `translate3d(${rx}px, ${ry}px, ${rz}px) rotateX(${rotX}deg) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(0)`;
        piece.style.opacity = '0';
      });

      // Fade out background overlay container
      overlay.style.opacity = '0';
      overlay.style.pointerEvents = 'none';

      // Clean up overlay element after transition
      setTimeout(() => {
        overlay.remove();
        if (flash) flash.remove();
        
        // Trigger reveal animations for hero text instantly upon enter
        const heroText = document.querySelector('.hero-text');
        if (heroText) {
          heroText.classList.add('in');
        }
      }, 1200);
    }

    // Trigger listeners
    container.addEventListener('click', shatter);
    overlay.addEventListener('click', shatter);

    // Scroll, swipe, or wheel down triggers shatter
    window.addEventListener('wheel', (e) => {
      if (Math.abs(e.deltaY) > 2) shatter();
    }, { passive: true });
    window.addEventListener('scroll', () => {
      shatter();
    }, { passive: true });
    window.addEventListener('touchmove', () => {
      shatter();
    }, { passive: true });
  }

  /* ---------- 2. Custom Cursor Blob ---------- */
  const blob = document.getElementById('cursorBlob');
  if (blob && matchMedia('(hover: hover)').matches) {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let cx = mx, cy = my;
    document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function tick() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      blob.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    }
    tick();

    const hoverables = document.querySelectorAll('a, button, .tilt, .skill-tile, .chip, .cert-pill, .contact-tile, .contact-bigbtn, .btn');
    hoverables.forEach((el) => {
      el.addEventListener('mouseenter', () => blob.classList.add('hover'));
      el.addEventListener('mouseleave', () => blob.classList.remove('hover'));
    });
  }

  /* ---------- 3. Hero parallax (3D drifting elements) ---------- */
  const stage = document.getElementById('heroStage');
  if (stage) {
    const items = stage.querySelectorAll('.float-item');
    let targetX = 0, targetY = 0, curX = 0, curY = 0;

    document.addEventListener('mousemove', (e) => {
      const w = window.innerWidth, h = window.innerHeight;
      targetX = (e.clientX - w / 2) / w; // -0.5 .. 0.5
      targetY = (e.clientY - h / 2) / h;
    });

    function loop() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      items.forEach((el) => {
        const depth = parseFloat(el.dataset.depth || '1');
        const x = curX * 40 * depth;
        const y = curY * 30 * depth;
        const rz = curX * 4 * depth;
        el.style.transform =
          `translate3d(calc(-50% + var(--x) + ${x}px), calc(-50% + var(--y) + ${y}px), 0) ` +
          `rotate(calc(var(--r) + ${rz}deg))`;
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ---------- 4. Tilt Cards ---------- */
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      const rx = (-py * 8).toFixed(2);
      const ry = (px * 10).toFixed(2);
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- 5. Scroll Reveals ---------- */
  const revealEls = document.querySelectorAll(
    '.section-head, .about-card, .stat-card, .skill-tile, .project, .exp-card, .ach-card, .edu-row, .cert-pill, .contact-card'
  );
  revealEls.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => io.observe(el));

  /* ---------- 6. Smooth Scroll for Nav Links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ---------- 7. Subtle background mesh parallax ---------- */
  const mesh = document.querySelector('.bg-mesh');
  if (mesh) {
    let ticking = false;
    document.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          mesh.style.transform = `translateY(${window.scrollY * 0.15}px)`;
          ticking = false;
        });
        ticking = true;
      }
    });
  }
})();
