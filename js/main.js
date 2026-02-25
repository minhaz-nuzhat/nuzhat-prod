/* ═══════════════════════════════════════════════════════════
   NUZHAT MINHAZ — PORTFOLIO
   Main JavaScript: Scroll animations, counters, interactions
   ═══════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── DOM REFS ───
  const scrollProgress = document.getElementById('scrollProgress');
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const sideDots = document.querySelectorAll('.side-dot');
  const sections = document.querySelectorAll('.hero, .section');

  // ─── SCROLL PROGRESS BAR ───
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  // ─── NAV SCROLL STATE ───
  function updateNavState() {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  // ─── MOBILE NAV TOGGLE ───
  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  // Close nav on link click
  navLinks.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // ─── SIDE DOTS: ACTIVE SECTION TRACKING ───
  function updateActiveDot() {
    let currentSection = 'hero';
    const scrollY = window.scrollY + window.innerHeight * 0.4;

    sections.forEach(function (section) {
      if (scrollY >= section.offsetTop) {
        currentSection = section.id;
      }
    });

    sideDots.forEach(function (dot) {
      dot.classList.toggle('active', dot.dataset.section === currentSection);
    });

    // Update nav links active state
    navLinks.querySelectorAll('.nav__link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.section === currentSection);
    });
  }

  // Side dot click navigation
  sideDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var target = document.getElementById(dot.dataset.section);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ─── REVEAL ON SCROLL (Intersection Observer) ───
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px',
    }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });

  // ─── STAGGERED REVEALS (cards, timeline, stats, grid items) ───
  var staggerSelectors = [
    '.card-grid .card',
    '.timeline__item',
    '.impact-stat',
    '.story__grid-item',
  ];

  var staggerObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Find siblings and stagger
          var parent = entry.target.parentElement;
          var siblings = Array.from(parent.children).filter(function (child) {
            return child.matches(entry.target.tagName + '.' + Array.from(entry.target.classList).join('.'));
          });

          // Simpler: just delay this element based on its index
          var index = Array.from(parent.children).indexOf(entry.target);
          entry.target.style.transitionDelay = (index * 0.1) + 's';
          entry.target.classList.add('visible');
          staggerObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -20px 0px',
    }
  );

  staggerSelectors.forEach(function (selector) {
    document.querySelectorAll(selector).forEach(function (el) {
      staggerObserver.observe(el);
    });
  });

  // ─── COUNTER ANIMATION ───
  var counterAnimated = new Set();

  var counterObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !counterAnimated.has(entry.target)) {
          counterAnimated.add(entry.target);
          animateCounter(entry.target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  // Observe stat numbers and impact numbers
  document.querySelectorAll('.stat__number[data-target], .impact-stat__number[data-target]').forEach(function (el) {
    counterObserver.observe(el);
  });

  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var isDecimal = target % 1 !== 0;
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);

      // Ease out quad
      var eased = 1 - (1 - progress) * (1 - progress);
      var current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else {
        el.textContent = Math.floor(current);
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        if (isDecimal) {
          el.textContent = target.toFixed(1);
        } else {
          el.textContent = target;
        }
      }
    }

    requestAnimationFrame(step);
  }

  // ─── TYPEWRITER EFFECT (Hero Tag) ───
  var heroTag = document.getElementById('heroTag');
  if (heroTag) {
    var fullText = heroTag.textContent;
    heroTag.textContent = '';
    heroTag.style.visibility = 'visible';

    var charIndex = 0;
    var typeSpeed = 60;

    function typeWriter() {
      if (charIndex < fullText.length) {
        heroTag.textContent = fullText.substring(0, charIndex + 1);
        charIndex++;
        setTimeout(typeWriter, typeSpeed);
      }
    }

    // Start after a small delay
    setTimeout(typeWriter, 500);
  }

  // ─── SMOOTH SCROLL PERFORMANCE ───
  var ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(function () {
        updateScrollProgress();
        updateNavState();
        updateActiveDot();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ─── PARALLAX FOR SECTION NUMBER BACKGROUNDS ───
  var numberBgs = document.querySelectorAll('.section__number-bg');

  var parallaxObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.dataset.parallaxActive = 'true';
        } else {
          entry.target.dataset.parallaxActive = 'false';
        }
      });
    },
    {
      threshold: 0,
      rootMargin: '100px',
    }
  );

  numberBgs.forEach(function (bg) {
    parallaxObserver.observe(bg);
  });

  function updateParallax() {
    numberBgs.forEach(function (bg) {
      if (bg.dataset.parallaxActive === 'true') {
        var rect = bg.getBoundingClientRect();
        var speed = 0.08;
        var offset = rect.top * speed;
        bg.style.transform = 'translateY(' + offset + 'px)';
      }
    });
    requestAnimationFrame(updateParallax);
  }

  // Only run parallax on devices that likely support it well
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    requestAnimationFrame(updateParallax);
  }

  // ─── INITIAL STATE ───
  updateScrollProgress();
  updateNavState();
  updateActiveDot();

  // ─── HERO CARDS ENTRANCE ───
  var heroCards = document.querySelectorAll('.hero__card');
  heroCards.forEach(function (card, i) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    setTimeout(function () {
      card.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 800 + i * 150);
  });

  // ─── HERO NAME ENTRANCE ───
  var heroNameParts = document.querySelectorAll('.hero__name-first, .hero__name-last');
  heroNameParts.forEach(function (part, i) {
    part.style.opacity = '0';
    part.style.transform = 'translateY(40px)';
    setTimeout(function () {
      part.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      part.style.opacity = '1';
      part.style.transform = 'translateY(0)';
    }, 1400 + i * 200);
  });

})();
