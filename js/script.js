
/* =========================================
   CUSTOM CURSOR
========================================= */

const dot = document.getElementById("cur-dot");

if (dot) {
  document.addEventListener("mousemove", (e) => {
    dot.style.left = e.clientX + "px";
    dot.style.top = e.clientY + "px";
  });
}

/* =========================================
   TYPEWRITER EFFECT
========================================= */

const typedEl = document.getElementById("typed");

const words = [
  "Full Stack Developer",
  "UI/UX Designer",
  "Frontend Developer",
  "Problem Solver",
  "AI Enthusiast"
];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

function typeEffect() {
  if (!typedEl) return;

  const currentWord = words[wordIndex];

  if (!deleting) {
    typedEl.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;

    if (charIndex === currentWord.length) {
      deleting = true;
      setTimeout(typeEffect, 1500);
      return;
    }
  } else {
    typedEl.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      deleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }
  }

  setTimeout(typeEffect, deleting ? 50 : 100);
}

typeEffect();

/* =========================================
   MOBILE MENU
========================================= */

const navToggle = document.getElementById("navToggle");
const mobileMenu = document.getElementById("mobileMenu");

if (navToggle && mobileMenu) {
  navToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("open");
    });
  });
}

/* =========================================
   ACTIVE NAV LINK
========================================= */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-pill a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach(section => {
    const top = section.offsetTop - 150;

    if (scrollY >= top) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");

    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});

/* =========================================
   REVEAL ANIMATION
========================================= */

const reveals = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
      }
    });
  },
  { threshold: 0.15 }
);

reveals.forEach(el => revealObserver.observe(el));

/* =========================================
   SKILLS SECTION
========================================= */

const skills = [
  { name: "HTML5", icon: "🌐", pct: 95 },
  { name: "CSS3", icon: "🎨", pct: 92 },
  { name: "JavaScript", icon: "⚡", pct: 88 },
  { name: "Python", icon: "🐍", pct: 85 },
  { name: "Java", icon: "☕", pct: 82 },
  { name: "GitHub", icon: "🔗", pct: 90 }
];

const skGrid = document.getElementById("skGrid");

if (skGrid) {
  skills.forEach(skill => {
    const card = document.createElement("div");
    card.className = "sk-card reveal";

    card.innerHTML = `
      <div class="sk-ico">${skill.icon}</div>
      <h3 class="sk-nm">${skill.name}</h3>
      <div class="sk-pct">${skill.pct}%</div>
    `;

    skGrid.appendChild(card);
  });
}
const form = document.querySelector(".contact-form form");

form.addEventListener("submit", async function(e){

    e.preventDefault();

    const formData = new FormData(form);

    await fetch(form.action,{
        method:"POST",
        body:formData
    });

    document.getElementById("successMsg").style.display="block";

    form.reset();
});
/* =========================================
   CERTIFICATE SLIDER
========================================= */

const certSlider = document.getElementById("certificateSlider");
const prevBtn = document.getElementById("prevCert");
const nextBtn = document.getElementById("nextCert");

if (certSlider) {
  prevBtn?.addEventListener("click", () => {
    certSlider.scrollBy({ left: -380, behavior: "smooth" });
  });

  nextBtn?.addEventListener("click", () => {
    certSlider.scrollBy({ left: 380, behavior: "smooth" });
  });
}

const grid = document.getElementById("projectGrid");
let cards = Array.from(document.querySelectorAll(".project-card"));

let cardWidth = cards[0].offsetWidth + 24;
let index = 0;

// ================== MAKE TRUE INFINITE LOOP ==================
function setupInfiniteLoop() {
  const total = cards.length;

  // clone last 3 → prepend
  for (let i = total - 3; i < total; i++) {
    const clone = cards[i].cloneNode(true);
    grid.insertBefore(clone, grid.firstChild);
  }

  // clone first 3 → append
  for (let i = 0; i < 3; i++) {
    const clone = cards[i].cloneNode(true);
    grid.appendChild(clone);
  }

  // refresh cards AFTER cloning
  cards = Array.from(document.querySelectorAll(".project-card"));

  // start position at real first slide
  index = 3;
  grid.style.transform = `translateX(-${index * cardWidth}px)`;
}

setupInfiniteLoop();

// ================== MOVE ==================
function moveNext() {
  index++;
  slide();
}

function movePrev() {
  index--;
  slide();
}

function slide() {
  grid.style.transition = "transform 0.6s ease";
  grid.style.transform = `translateX(-${index * cardWidth}px)`;

  const total = cards.length;

  // 👉 loop reset (infinite effect)
  if (index >= total - 3) {
    setTimeout(() => {
      grid.style.transition = "none";
      index = 3;
      grid.style.transform = `translateX(-${index * cardWidth}px)`;
    }, 600);
  }

  if (index <= 0) {
    setTimeout(() => {
      grid.style.transition = "none";
      index = total - 6;
      grid.style.transform = `translateX(-${index * cardWidth}px)`;
    }, 600);
  }
}

// ================== AUTO SLIDE ==================
let autoSlide = setInterval(moveNext, 3000);

// pause on hover
grid.addEventListener("mouseenter", () => clearInterval(autoSlide));
grid.addEventListener("mouseleave", () => {
  autoSlide = setInterval(moveNext, 3000);
});

// ================== DRAG (MOUSE) ==================
let startX = 0;
let isDown = false;

grid.addEventListener("mousedown", (e) => {
  isDown = true;
  startX = e.pageX;
});

grid.addEventListener("mouseup", () => (isDown = false));

grid.addEventListener("mousemove", (e) => {
  if (!isDown) return;

  let diff = e.pageX - startX;

  if (Math.abs(diff) > 80) {
    if (diff < 0) moveNext();
    else movePrev();
    isDown = false;
  }
});

// ================== TOUCH ==================
grid.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

grid.addEventListener("touchend", (e) => {
  let endX = e.changedTouches[0].clientX;
  let diff = startX - endX;

  if (Math.abs(diff) > 50) {
    if (diff > 0) moveNext();
    else movePrev();
  }
});
/* =========================================
   CONSOLE MESSAGE
========================================= */

console.log(
  "%cPortfolio Developed by MADHIYARASU 🚀",
  "color:#00eaff;font-size:16px;font-weight:bold"
);