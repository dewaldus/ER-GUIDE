/* =============================================
   ERGuide — Main JS
   - Navbar scroll shadow
   - Mobile menu toggle
   - Screenshot tabs
   - Stat counters (IntersectionObserver)
   - Scroll reveal
   - Connected workflow reveal
   ============================================= */

(function () {
  'use strict';

  /* --- Navbar: shadow on scroll --- */
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  /* --- Mobile menu toggle --- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (hamburger && mobileMenu) {
    const closeMobileMenu = () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      mobileMenu.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && hamburger.classList.contains('open')) {
        closeMobileMenu();
        hamburger.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 1024 && hamburger.classList.contains('open')) {
        closeMobileMenu();
      }
    });
  }

  /* --- Screenshot showcase tabs --- */
  const tabs = document.querySelectorAll('.showcase-tab');
  const panels = document.querySelectorAll('.showcase-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.querySelector(`.showcase-panel[data-panel="${target}"]`);
      if (panel) panel.classList.add('active');
    });
  });

  /* --- Stat counters --- */
  function formatCounterValue(value, decimalPlaces, useComma) {
    if (decimalPlaces > 0) {
      const formatted = value.toFixed(decimalPlaces);
      return useComma ? formatted.replace('.', ',') : formatted;
    }
    return String(Math.round(value));
  }

  function getCounterTarget(targetAttr) {
    const raw = String(targetAttr).trim();
    const useComma = raw.includes(',') && !raw.includes('.');
    const normalized = raw.replace(/,/g, '.');
    const value = Number(normalized);
    const decimalPlaces = normalized.includes('.') ? normalized.split('.')[1].length : 0;
    return {
      value: Number.isFinite(value) ? value : 0,
      decimalPlaces,
      useComma,
    };
  }

  function animateCounter(el, target, decimalPlaces, useComma, duration) {
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = eased * target;
      el.textContent = formatCounterValue(value, decimalPlaces, useComma);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('.counter');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          const { value, decimalPlaces, useComma } = getCounterTarget(entry.target.dataset.target);
          animateCounter(entry.target, value, decimalPlaces, useComma, 1800);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* --- Scroll-reactive depth for solution and process cards --- */
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scrollDepthSourceCards = Array.from(document.querySelectorAll(
    '.solution-grid .feature-card, .process-grid .feature-card'
  ));
  const scrollDepthItems = scrollDepthSourceCards.map(card => {
    const grid = card.parentElement;
    const cardIndex = Array.from(grid.children).indexOf(card);
    const shell = document.createElement('div');
    const motionLayer = document.createElement('div');

    shell.className = 'scroll-card-shell reveal';
    motionLayer.className = 'scroll-card-motion';
    grid.insertBefore(shell, card);
    shell.appendChild(motionLayer);
    motionLayer.appendChild(card);
    card.classList.remove('reveal');
    card.classList.add('scroll-card-surface');

    return {
      card,
      shell,
      motionLayer,
      side: cardIndex % 2 === 0 ? -1 : 1
    };
  });
  let scrollDepthFrame = null;
  let scrollDepthSettleTimer = null;
  let scrollDepthLastY = window.scrollY;
  let scrollDepthEnabled = false;

  function clampMotion(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function resetScrollDepth() {
    scrollDepthItems.forEach(({ motionLayer }) => {
      motionLayer.style.removeProperty('--scroll-depth-y');
      motionLayer.style.removeProperty('--scroll-depth-z');
      motionLayer.style.removeProperty('--scroll-depth-rx');
      motionLayer.style.removeProperty('--scroll-depth-ry');
    });
  }

  function updateScrollDepth() {
    scrollDepthFrame = null;
    if (!scrollDepthEnabled || motionPreference.matches) return;

    const viewportHeight = window.innerHeight;
    const strength = window.innerWidth < 768 ? 0.55 : 1;
    const scrollDelta = clampMotion(window.scrollY - scrollDepthLastY, -20, 20);
    scrollDepthLastY = window.scrollY;
    const measured = scrollDepthItems.map(item => ({
      ...item,
      rect: item.shell.getBoundingClientRect()
    }));

    measured.forEach(({ motionLayer, side, rect }) => {
      if (rect.bottom < -160 || rect.top > viewportHeight + 160) return;

      const cardCentre = rect.top + (rect.height / 2);
      const range = (viewportHeight + rect.height) / 2;
      const progress = clampMotion((cardCentre - (viewportHeight / 2)) / range, -1, 1);
      const rotateX = clampMotion((-progress * 2.4) + (scrollDelta * 0.018), -2.8, 2.8) * strength;
      const rotateY = side * progress * 0.9 * strength;
      const translateY = progress * 6 * strength;
      const translateZ = -Math.abs(progress) * 8 * strength;

      motionLayer.style.setProperty('--scroll-depth-y', `${translateY.toFixed(2)}px`);
      motionLayer.style.setProperty('--scroll-depth-z', `${translateZ.toFixed(2)}px`);
      motionLayer.style.setProperty('--scroll-depth-rx', `${rotateX.toFixed(2)}deg`);
      motionLayer.style.setProperty('--scroll-depth-ry', `${rotateY.toFixed(2)}deg`);
    });
  }

  function scheduleScrollDepth() {
    if (scrollDepthFrame === null && scrollDepthEnabled && !motionPreference.matches) {
      scrollDepthFrame = requestAnimationFrame(updateScrollDepth);
    }
  }

  function handleScrollDepth() {
    scheduleScrollDepth();
    window.clearTimeout(scrollDepthSettleTimer);
    scrollDepthSettleTimer = window.setTimeout(() => {
      scrollDepthLastY = window.scrollY;
      scheduleScrollDepth();
    }, 90);
  }

  function enableScrollDepth() {
    if (scrollDepthEnabled || !scrollDepthItems.length || motionPreference.matches) return;
    scrollDepthEnabled = true;
    scrollDepthLastY = window.scrollY;
    window.addEventListener('scroll', handleScrollDepth, { passive: true });
    window.addEventListener('resize', scheduleScrollDepth);
    scheduleScrollDepth();
  }

  function disableScrollDepth() {
    if (!scrollDepthEnabled) {
      resetScrollDepth();
      return;
    }

    scrollDepthEnabled = false;
    window.removeEventListener('scroll', handleScrollDepth);
    window.removeEventListener('resize', scheduleScrollDepth);
    window.clearTimeout(scrollDepthSettleTimer);
    if (scrollDepthFrame !== null) cancelAnimationFrame(scrollDepthFrame);
    scrollDepthFrame = null;
    resetScrollDepth();
  }

  if (!motionPreference.matches) enableScrollDepth();

  const handleScrollMotionPreference = event => {
    if (event.matches) disableScrollDepth();
    else enableScrollDepth();
  };
  if (typeof motionPreference.addEventListener === 'function') {
    motionPreference.addEventListener('change', handleScrollMotionPreference);
  } else {
    motionPreference.addListener(handleScrollMotionPreference);
  }

  /* --- Scroll reveal --- */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          if (entry.target.classList.contains('scroll-card-shell')) {
            window.setTimeout(() => {
              const motionLayer = entry.target.querySelector('.scroll-card-motion');
              if (motionLayer) motionLayer.classList.add('scroll-3d-live');
              scheduleScrollDepth();
            }, 540);
          }
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));
  }

  /* --- Connected workflow: staged entry and looping active step --- */
  const workflowJourney = document.querySelector('.workflow-journey');
  if (workflowJourney) {
    const workflowStages = Array.from(workflowJourney.querySelectorAll('.workflow-stage'));
    const workflowRail = workflowJourney.querySelector('.workflow-rail');
    const workflowToggle = document.getElementById('workflowToggle');
    const workflowToggleText = workflowToggle ? workflowToggle.querySelector('span') : null;

    if (workflowStages.length) {
      let workflowInterval = null;
      let workflowStartTimer = null;
      let workflowIndex = -1;
      let workflowInView = false;
      let workflowHoverPaused = false;
      let workflowUserPaused = false;

      workflowJourney.classList.add('workflow-motion-ready');
      workflowStages.forEach((stage, index) => {
        stage.style.setProperty('--workflow-delay', `${120 + (index * 65)}ms`);
      });

      function clearWorkflowTimers() {
        window.clearTimeout(workflowStartTimer);
        window.clearInterval(workflowInterval);
        workflowStartTimer = null;
        workflowInterval = null;
      }

      function setWorkflowActive(index) {
        workflowStages.forEach((stage, stageIndex) => {
          stage.classList.toggle('workflow-stage-active', stageIndex === index);
        });
        workflowIndex = index;
      }

      function updateWorkflowToggle() {
        if (!workflowToggle) return;
        workflowToggle.setAttribute('aria-pressed', String(workflowUserPaused));
        workflowToggle.setAttribute(
          'aria-label',
          workflowUserPaused ? 'Play workflow animation' : 'Pause workflow animation'
        );
        if (workflowToggleText) {
          workflowToggleText.textContent = workflowUserPaused ? 'Play animation' : 'Pause animation';
        }
      }

      function prepareWorkflowLoop() {
        workflowJourney.classList.add('workflow-loop-ready');
        workflowStages.forEach(stage => stage.classList.remove('workflow-stage-highlight'));
        if (workflowToggle) workflowToggle.hidden = false;
        updateWorkflowToggle();
      }

      function restoreWorkflowFallback() {
        clearWorkflowTimers();
        workflowJourney.classList.remove('workflow-loop-ready');
        workflowStages.forEach(stage => stage.classList.remove('workflow-stage-active', 'workflow-stage-highlight'));
        if (workflowStages[2]) workflowStages[2].classList.add('workflow-stage-highlight');
        workflowIndex = -1;
        workflowUserPaused = false;
        if (workflowToggle) workflowToggle.hidden = true;
        updateWorkflowToggle();
      }

      function workflowCanPlay() {
        return workflowInView
          && !workflowHoverPaused
          && !workflowUserPaused
          && !motionPreference.matches
          && !document.hidden;
      }

      function beginWorkflowLoop(resetToStart) {
        clearWorkflowTimers();
        if (!workflowCanPlay()) return;

        if (resetToStart || workflowIndex < 0) setWorkflowActive(0);
        workflowInterval = window.setInterval(() => {
          setWorkflowActive((workflowIndex + 1) % workflowStages.length);
        }, window.innerWidth < 960 ? 2400 : 2000);
      }

      function queueWorkflowLoop(resetToStart, delay) {
        clearWorkflowTimers();
        if (!workflowCanPlay()) return;
        workflowStartTimer = window.setTimeout(() => beginWorkflowLoop(resetToStart), delay);
      }

      if (!motionPreference.matches) prepareWorkflowLoop();

      const workflowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('workflow-visible');
            workflowInView = true;
            if (!motionPreference.matches) {
              prepareWorkflowLoop();
              queueWorkflowLoop(true, 760);
            }
          } else {
            workflowInView = false;
            clearWorkflowTimers();
            workflowStages.forEach(stage => stage.classList.remove('workflow-stage-active'));
            workflowIndex = -1;
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

      workflowObserver.observe(workflowJourney);

      if (workflowRail) {
        workflowRail.addEventListener('pointerenter', () => {
          workflowHoverPaused = true;
          clearWorkflowTimers();
        });
        workflowRail.addEventListener('pointerleave', () => {
          workflowHoverPaused = false;
          queueWorkflowLoop(false, 240);
        });
      }

      if (workflowToggle) {
        workflowToggle.addEventListener('click', () => {
          workflowUserPaused = !workflowUserPaused;
          updateWorkflowToggle();
          if (workflowUserPaused) clearWorkflowTimers();
          else queueWorkflowLoop(false, 120);
        });
      }

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) clearWorkflowTimers();
        else queueWorkflowLoop(false, 300);
      });

      const handleWorkflowMotionPreference = event => {
        if (event.matches) {
          restoreWorkflowFallback();
        } else {
          prepareWorkflowLoop();
          queueWorkflowLoop(true, 500);
        }
      };
      if (typeof motionPreference.addEventListener === 'function') {
        motionPreference.addEventListener('change', handleWorkflowMotionPreference);
      } else {
        motionPreference.addListener(handleWorkflowMotionPreference);
      }
    }
  }

  /* --- Active nav link on scroll --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');

  if (sections.length && navLinks.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const isCurrent = link.getAttribute('href') === `#${id}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) {
              link.setAttribute('aria-current', 'location');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* --- Contact form: prepare a message in the visitor's email app --- */
  const contactForm = document.getElementById('contactForm');
  const contactFormStatus = document.getElementById('contactFormStatus');

  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const organisation = String(formData.get('organisation') || '').trim();
      const message = String(formData.get('message') || '').trim();

      const subject = `ERGuide website enquiry from ${name}`;
      const body = [
        'Hello ERGuide,',
        '',
        `Name: ${name}`,
        `Work email: ${email}`,
        organisation ? `Organisation: ${organisation}` : '',
        '',
        'I would like help with:',
        message,
      ].filter((line, index, lines) => line || lines[index - 1] !== '').join('\n');

      if (contactFormStatus) {
        contactFormStatus.textContent = 'Opening your email app so you can review and send the enquiry.';
      }

      window.location.href = `mailto:info@erguide.co.za?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  }

})();
