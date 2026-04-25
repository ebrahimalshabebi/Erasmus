/**
 * university-data-loader.js
 * Loads universities-detailed.json and enriches partner cards on partners.html
 * with logos and "View Details" links.
 */

(function () {
  'use strict';

  /* ── helpers ── */
  function normalize(str) {
    return String(str || '')
      .toUpperCase()
      .trim()
      .replace(/\s+/g, ' ')
      .replace(/[^A-Z0-9 ]/g, '');
  }

  function buildIndex(data) {
    var byId   = {};
    var byName = {};
    data.forEach(function (u) {
      var id   = normalize(u.erasmusId);
      var name = normalize(u.name);
      if (id)   byId[id]     = u;
      if (name) byName[name] = u;
    });
    return { byId: byId, byName: byName, list: data };
  }

  function lookupCard(index, cardEl) {
    // Cards have data-id and/or data-name attributes set by partners.js
    var rawId   = cardEl.getAttribute('data-id')   || '';
    var rawName = cardEl.getAttribute('data-name')  || '';

    var u = index.byId[normalize(rawId)]
         || index.byName[normalize(rawName)]
         || null;

    // Fuzzy fallback: startsWith either direction
    if (!u && rawName) {
      var key = normalize(rawName);
      var keys = Object.keys(index.byName);
      for (var i = 0; i < keys.length; i++) {
        if (keys[i].startsWith(key) || key.startsWith(keys[i])) {
          u = index.byName[keys[i]];
          break;
        }
      }
    }
    return u;
  }

  /* ── logo injection ── */
  function injectLogo(cardEl, u) {
    if (!u || !u.logoUrl) return;

    // Look for existing logo containers used by partners.js
    var logoImg = cardEl.querySelector('.partner-logo, .partner-card-logo, img[class*="logo"]');
    if (logoImg && logoImg.tagName === 'IMG') {
      logoImg.src = u.logoUrl;
      logoImg.onerror = function () { this.style.display = 'none'; };
      return;
    }

    // Placeholder element (span / div with class containing "placeholder" or "initials")
    var placeholder = cardEl.querySelector(
      '.partner-logo-placeholder, .logo-placeholder, .logo-initials, [class*="placeholder"]'
    );

    if (placeholder) {
      var img = document.createElement('img');
      img.src = u.logoUrl;
      img.alt = u.name + ' logo';
      img.className = placeholder.className.replace('placeholder', 'img');
      img.style.cssText = 'width:100%;height:100%;object-fit:contain;padding:6px;';
      img.onerror = function () { this.style.display = 'none'; };
      placeholder.parentNode.replaceChild(img, placeholder);
      return;
    }

    // Generic: inject at top of card if a logo wrapper exists
    var logoWrap = cardEl.querySelector('.partner-logo-wrap, .logo-wrap, .card-logo');
    if (logoWrap) {
      logoWrap.innerHTML = '';
      var img2 = document.createElement('img');
      img2.src = u.logoUrl;
      img2.alt = u.name + ' logo';
      img2.style.cssText = 'max-width:100%;max-height:80px;object-fit:contain;';
      img2.onerror = function () { this.style.display = 'none'; };
      logoWrap.appendChild(img2);
    }
  }

  /* ── detail link injection ── */
  function injectDetailLink(cardEl, u) {
    // Build query string
    var qs = 'id=' + encodeURIComponent(u.erasmusId || '')
           + '&name=' + encodeURIComponent(u.name || '');
    var url = 'partner-detail.html?' + qs;

    // If the card itself is already an <a>, update its href
    if (cardEl.tagName === 'A') {
      cardEl.href = url;
      return;
    }

    // Look for existing detail / "more info" links
    var existing = cardEl.querySelector(
      'a[href*="partner-detail"], a[class*="detail"], a[class*="more"], a[class*="view"]'
    );
    if (existing) {
      existing.href = url;
      return;
    }

    // Inject a new link at the bottom of the card
    var link = document.createElement('a');
    link.href = url;
    link.textContent = 'View Details →';
    link.className = 'partner-card-detail-link';
    link.style.cssText = [
      'display:inline-block',
      'margin-top:0.75rem',
      'font-size:0.8rem',
      'font-weight:600',
      'color:#0E4C92',
      'text-decoration:none',
      'border-bottom:1px solid transparent',
      'transition:border-color .2s'
    ].join(';');
    link.addEventListener('mouseover', function () {
      this.style.borderBottomColor = '#0E4C92';
    });
    link.addEventListener('mouseout', function () {
      this.style.borderBottomColor = 'transparent';
    });
    cardEl.appendChild(link);
  }

  /* ── enrich all cards ── */
  function enrichCards(index) {
    // Partner cards may use various selectors — cover them all
    var cards = Array.from(document.querySelectorAll(
      '.partner-card, [class*="partner-card"], .university-card, [data-id], [data-name]'
    ));

    if (!cards.length) {
      // Try generic grid children
      var grid = document.getElementById('partnersGrid')
              || document.querySelector('.partners-grid, .university-grid');
      if (grid) cards = Array.from(grid.children);
    }

    cards.forEach(function (card) {
      var u = lookupCard(index, card);
      if (!u) return;
      injectLogo(card, u);
      injectDetailLink(card, u);
    });
  }

  /* ── public init ── */
  window.initUniversityDataLoader = function (jsonPath) {
    jsonPath = jsonPath || 'assets/data/universities-detailed.json';

    fetch(jsonPath)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        window.__universityData = data;
        var index = buildIndex(data);

        // Enrich immediately, then again after short delay in case cards render late
        enrichCards(index);
        setTimeout(function () { enrichCards(index); }, 400);

        // Also watch for dynamically rendered cards (filter/search)
        if (typeof MutationObserver !== 'undefined') {
          var grid = document.getElementById('partnersGrid')
                  || document.querySelector('.partners-grid');
          if (grid) {
            var obs = new MutationObserver(function () { enrichCards(index); });
            obs.observe(grid, { childList: true, subtree: false });
          }
        }
      })
      .catch(function (err) {
        console.warn('[university-data-loader] Failed to load', jsonPath, err);
      });
  };
})();
