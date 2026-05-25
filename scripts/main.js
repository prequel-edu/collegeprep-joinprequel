/* main.js — College Prep LP behaviors
 * - A/B hero variant swap (?v=A|B|C)
 * - Sticky CTA after 25% scroll, dismissible
 * - Accordion (curriculum + FAQ)
 * - Placement card flip on click/tap (mobile-friendly)
 * - lp_referrer capture for HubSpot form
 */

(function () {
  'use strict';

  // ----------------------------------------------------------
  // A/B HERO VARIANT SWAP
  // Reads ?v=A|B|C, defaults to A.
  // ----------------------------------------------------------
  function applyHeroVariant() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    var params = new URLSearchParams(window.location.search);
    var v = (params.get('v') || 'A').toUpperCase();
    if (v !== 'A' && v !== 'B' && v !== 'C') v = 'A';

    var line1 = hero.dataset['variant' + v + 'H1Line1'];
    var line2 = hero.dataset['variant' + v + 'H1Line2'];
    var sub = hero.dataset['variant' + v + 'Sub'];

    var line1El = hero.querySelector('.hero-h1-line1');
    var line2El = hero.querySelector('.hero-h1-line2');
    var subEl = hero.querySelector('.hero-sub');

    if (line1El && line1) line1El.textContent = line1;
    if (line2El && line2) line2El.textContent = line2;
    if (subEl && sub) subEl.textContent = sub;

    // Mark which variant is live for analytics
    hero.setAttribute('data-active-variant', v);
  }

  // ----------------------------------------------------------
  // STICKY CTA
  // Shows after 25% scroll, dismissible via X button.
  // ----------------------------------------------------------
  function initStickyCta() {
    var cta = document.getElementById('sticky-cta');
    if (!cta) return;

    var dismissed = false;
    try {
      dismissed = sessionStorage.getItem('lp1_sticky_dismissed') === '1';
    } catch (e) {}

    if (dismissed) return;

    function onScroll() {
      var scrolled = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      var pct = docHeight > 0 ? scrolled / docHeight : 0;

      if (pct >= 0.25) {
        cta.classList.add('is-visible');
      } else {
        cta.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var dismiss = cta.querySelector('.sticky-cta-dismiss');
    if (dismiss) {
      dismiss.addEventListener('click', function (e) {
        e.preventDefault();
        cta.classList.remove('is-visible');
        cta.style.display = 'none';
        try {
          sessionStorage.setItem('lp1_sticky_dismissed', '1');
        } catch (err) {}
      });
    }
  }

  // ----------------------------------------------------------
  // ACCORDION
  // Curriculum + FAQ
  // ----------------------------------------------------------
  function initAccordions() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.accordion-item');
        if (!item) return;
        var open = item.classList.contains('is-open');

        // Optional: close siblings (single-open behavior)
        var parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.accordion-item.is-open').forEach(function (sib) {
            if (sib !== item) sib.classList.remove('is-open');
          });
        }

        item.classList.toggle('is-open', !open);
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  // ----------------------------------------------------------
  // PLACEMENT CARDS — click to flip
  // ----------------------------------------------------------
  function initPlacementCards() {
    var cards = document.querySelectorAll('.placement-card');
    cards.forEach(function (card) {
      card.addEventListener('click', function () {
        card.classList.toggle('is-flipped');
      });
      // Keyboard accessibility
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.classList.toggle('is-flipped');
        }
      });
    });
  }

  // ----------------------------------------------------------
  // LP REFERRER CAPTURE
  // ----------------------------------------------------------
  function captureReferrer() {
    try {
      var ref = document.referrer || '';
      sessionStorage.setItem('lp_referrer', ref);
    } catch (e) {}
  }

  // ----------------------------------------------------------
  // SMOOTH SCROLL TO ANCHOR
  // ----------------------------------------------------------
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');
    anchors.forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (!href || href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ----------------------------------------------------------
  // INIT
  // ----------------------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    applyHeroVariant();
    initStickyCta();
    initAccordions();
    initPlacementCards();
    initSmoothScroll();
    captureReferrer();
  }
})();
