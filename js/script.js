(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const header = document.getElementById("siteHeader");
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const mobileLinks = mobileMenu?.querySelectorAll("a[href^='#']") ?? [];

  const setMenu = (open) => {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuToggle.querySelector(".sr-only").textContent = open ? "Close menu" : "Open menu";
    if (open) setTimeout(() => mobileMenu.querySelector("a")?.focus(), 100);
  };

  menuToggle?.addEventListener("click", () => setMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
  mobileLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a")];
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-38% 0px -55%", threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const onScroll = () => header?.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -7%" });
  document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const timelineObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) timeline.style.setProperty("--timeline-progress", "100%");
    }, { threshold: 0.35 });
    timelineObserver.observe(timeline);
  }

  if (finePointer.matches && !reducedMotion.matches) {
    const dot = document.querySelector(".cursor-dot");
    const ring = document.querySelector(".cursor-ring");
    let mouseX = -100, mouseY = -100, ringX = -100, ringY = -100;
    document.body.classList.add("cursor-ready");
    window.addEventListener("pointermove", (event) => {
      mouseX = event.clientX; mouseY = event.clientY;
      if (dot) dot.style.transform = `translate3d(${mouseX}px,${mouseY}px,0) translate(-50%,-50%)`;
    }, { passive: true });
    const renderCursor = () => {
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      if (ring) ring.style.transform = `translate3d(${ringX}px,${ringY}px,0) translate(-50%,-50%)`;
      requestAnimationFrame(renderCursor);
    };
    renderCursor();
    document.querySelectorAll("a, button, input, textarea, [data-project]").forEach((item) => {
      item.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
      item.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });
    document.querySelectorAll(".magnetic").forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        item.style.transform = `translate(${(event.clientX - rect.left - rect.width / 2) * .14}px, ${(event.clientY - rect.top - rect.height / 2) * .14}px)`;
      });
      item.addEventListener("pointerleave", () => item.style.transform = "");
    });
  }

  const portraitStage = document.getElementById("portraitStage");
  if (portraitStage && finePointer.matches && !reducedMotion.matches) {
    portraitStage.addEventListener("pointermove", (event) => {
      const rect = portraitStage.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      portraitStage.style.setProperty("--px", `${x * 12}px`);
      portraitStage.style.setProperty("--py", `${y * 12}px`);
    });
    portraitStage.addEventListener("pointerleave", () => {
      portraitStage.style.setProperty("--px", "0px");
      portraitStage.style.setProperty("--py", "0px");
    });
  }

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - rect.left}px`);
      card.style.setProperty("--my", `${event.clientY - rect.top}px`);
    });
  });

  const slider = document.getElementById("certificateSlider");
  const progress = document.getElementById("archiveProgress");
  const updateProgress = () => {
    if (!slider || !progress) return;
    const scrollable = slider.scrollWidth - slider.clientWidth;
    const value = scrollable > 0 ? 8 + (slider.scrollLeft / scrollable) * 92 : 100;
    progress.style.width = `${value}%`;
  };
  document.getElementById("prevCert")?.addEventListener("click", () => slider?.scrollBy({ left: -Math.min(410, innerWidth * .82), behavior: "smooth" }));
  document.getElementById("nextCert")?.addEventListener("click", () => slider?.scrollBy({ left: Math.min(410, innerWidth * .82), behavior: "smooth" }));
  slider?.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  const lightbox = document.getElementById("certLightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxTitle = document.getElementById("lightboxTitle");
  let lastFocused = null;
  document.querySelectorAll("[data-cert]").forEach((card) => {
    card.addEventListener("click", () => {
      const image = card.querySelector("img");
      const title = card.querySelector("h3");
      if (!lightbox || !lightboxImage || !lightboxTitle || !image || !title) return;
      lastFocused = card;
      lightboxImage.src = image.src;
      lightboxImage.alt = image.alt;
      lightboxTitle.textContent = title.textContent;
      lightbox.showModal();
      lightbox.querySelector(".lightbox-close")?.focus();
    });
  });
  const closeLightbox = () => {
    lightbox?.close();
    lastFocused?.focus();
  };
  lightbox?.querySelector(".lightbox-close")?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  const form = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  form?.addEventListener("submit", () => {
    form.classList.add("submitting");
    const buttonText = form.querySelector("button[type='submit'] span");
    if (buttonText) buttonText.textContent = "Sending...";
    if (formStatus) formStatus.textContent = "Securely sending your message...";
  });

  const canvas = document.getElementById("heroCanvas");
  if (canvas && !reducedMotion.matches) {
    const context = canvas.getContext("2d", { alpha: true });
    let width = 0, height = 0, animationFrame = 0, particles = [], visible = true;
    const pointer = { x: 0, y: 0, active: false };
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = width * dpr; canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(finePointer.matches ? 68 : 32, Math.floor(width * height / 17000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width, y: Math.random() * height,
        vx: (Math.random() - .5) * .16, vy: (Math.random() - .5) * .16,
        r: Math.random() * 1.2 + .35, a: Math.random() * .45 + .15
      }));
    };
    const draw = () => {
      if (!visible) return;
      context.clearRect(0, 0, width, height);
      particles.forEach((particle, index) => {
        particle.x += particle.vx; particle.y += particle.vy;
        if (particle.x < 0 || particle.x > width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > height) particle.vy *= -1;
        if (pointer.active) {
          const dx = pointer.x - particle.x, dy = pointer.y - particle.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 1) { particle.x -= dx / dist * .12; particle.y -= dy / dist * .12; }
        }
        context.beginPath(); context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        context.fillStyle = `rgba(99,230,210,${particle.a})`; context.fill();
        for (let j = index + 1; j < particles.length; j++) {
          const other = particles[j], distance = Math.hypot(other.x - particle.x, other.y - particle.y);
          if (distance < 95) {
            context.beginPath(); context.moveTo(particle.x, particle.y); context.lineTo(other.x, other.y);
            context.strokeStyle = `rgba(143,134,255,${(1 - distance / 95) * .09})`; context.stroke();
          }
        }
      });
      animationFrame = requestAnimationFrame(draw);
    };
    const hero = canvas.parentElement;
    hero?.addEventListener("pointermove", (event) => { pointer.x = event.clientX; pointer.y = event.clientY; pointer.active = true; }, { passive: true });
    hero?.addEventListener("pointerleave", () => pointer.active = false);
    const canvasObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(animationFrame);
      if (visible) draw();
    });
    canvasObserver.observe(canvas);
    let resizeTimer;
    window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); }, { passive: true });
    resize(); draw();
  }
})();
