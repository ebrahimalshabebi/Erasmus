/**
 * partners.js
 * Renders the partner university grid.
 * Data comes from window.__PARTNERS_DATA__ (set by partners-data.js).
 * No fetch required — works on any static file server or file://.
 */

(function () {
  'use strict';

  function escHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function norm(s) {
    return String(s || '').toUpperCase().trim();
  }

  function deriveProgram(erasmusId) {
    return "KA131";
  }

  /* ── Filter dropdowns ── */
  function populateFilters(universities) {
    var programs  = new Set();
    var countries = new Set();
    var areas     = new Set();

    programs.add("KA131");
    programs.add("KA171");

    universities.forEach(function (u) {
      if (u.country) countries.add(u.country);
      (u.studyAreas || []).forEach(function (a) { if (a) areas.add(a.trim()); });
    });

    fillSelect('programFilter', Array.from(programs).sort());
    fillSelect('countryFilter', Array.from(countries).sort());

    var dl = document.getElementById('studyAreaOptions');
    if (dl) {
      dl.innerHTML = Array.from(areas).sort().map(function (a) {
        return '<option value="' + escHtml(a) + '">';
      }).join('');
    }
  }

  function fillSelect(id, options) {
    var sel = document.getElementById(id);
    if (!sel) return;
    while (sel.options.length > 1) sel.remove(1);
    options.forEach(function (val) {
      var opt = document.createElement('option');
      opt.value = val;
      opt.textContent = val;
      sel.appendChild(opt);
    });
  }

  /* ── Card builder ── */
  function buildCard(u) {
    var card = document.createElement('article');
    card.className = 'partner-card';
    card.setAttribute('data-id',      u.erasmusId || '');
    card.setAttribute('data-name',    u.name      || '');
    card.setAttribute('data-country', norm(u.country || ''));
    card.setAttribute('data-program', deriveProgram(u.erasmusId));
    card.setAttribute('data-areas',   (u.studyAreas || []).join('|').toUpperCase());

    var qs = 'id=' + encodeURIComponent(u.erasmusId || '')
           + '&name=' + encodeURIComponent(u.name || '');
    var detailUrl = 'partner-detail.html?' + qs;

    var logoHtml;
    if (u.logoUrl) {
      logoHtml =
        '<img class="partner-logo-img"' +
        ' src="'  + escHtml(u.logoUrl) + '"' +
        ' alt="'  + escHtml(u.name)    + ' logo"' +
        ' onerror="this.style.display=\'none\';var s=this.parentNode.querySelector(\'.partner-logo-initials\');if(s)s.style.display=\'flex\';"' +
        '>' +
        '<span class="partner-logo-initials" style="display:none">' +
        escHtml((u.name || '?')[0].toUpperCase()) +
        '</span>';
    } else {
      logoHtml =
        '<span class="partner-logo-initials">' +
        escHtml((u.name || '?')[0].toUpperCase()) +
        '</span>';
    }

    var validAreas = (u.studyAreas || []).map(function (a) { return a.trim(); }).filter(Boolean);
    var shown      = validAreas.slice(0, 3);
    var moreCount  = Math.max(0, validAreas.length - 3);
    var areaTagsHtml = shown.map(function (a) {
      return '<span class="partner-area-tag">' + escHtml(a) + '</span>';
    }).join('');
    if (moreCount > 0) {
      areaTagsHtml += '<span class="partner-area-tag partner-area-more">+' + moreCount + ' more</span>';
    }

    card.innerHTML =
      '<a class="partner-card-inner" href="' + escHtml(detailUrl) + '">' +
      '  <div class="partner-logo-wrap">' + logoHtml + '</div>' +
      '  <div class="partner-card-body">' +
      '    <span class="partner-card-country">' + escHtml(u.country || '') + '</span>' +
      '    <h2 class="partner-card-name">'    + escHtml(u.name    || '') + '</h2>' +
      '  </div>' +
      '</a>';

    return card;
  }

  /* ── Filter & render ── */
  function filterAndRender(universities, grid, countEl) {
    var search    = norm((document.getElementById('partnersSearch')  || {}).value || '');
    var program   = norm((document.getElementById('programFilter')   || {}).value || '');
    var country   = norm((document.getElementById('countryFilter')   || {}).value || '');
    var studyArea = norm((document.getElementById('studyAreaFilter') || {}).value || '');

    var filtered = universities.filter(function (u) {
      if (search) {
        var haystack = norm(u.name) + ' ' + norm(u.country) + ' ' + norm(u.erasmusId);
        if (haystack.indexOf(search) === -1) return false;
      }
      if (program && norm(deriveProgram(u.erasmusId)) !== program) return false;
      if (country && norm(u.country) !== country) return false;
      if (studyArea) {
        var hit = (u.studyAreas || []).some(function (a) {
          return norm(a).indexOf(studyArea) !== -1;
        });
        if (!hit) return false;
      }
      return true;
    });

    grid.innerHTML = '';
    var frag = document.createDocumentFragment();
    filtered.forEach(function (u) { frag.appendChild(buildCard(u)); });
    grid.appendChild(frag);

    if (countEl) {
      countEl.textContent = filtered.length === universities.length
        ? 'Showing all ' + universities.length + ' partner universities'
        : 'Showing ' + filtered.length + ' of ' + universities.length + ' partner universities';
    }
  }

  /* ── Init ── */
  function init() {
    var universities = window.__PARTNERS_DATA__;
    var grid    = document.getElementById('partnersGrid');
    var countEl = document.getElementById('partnersCount');

    if (!grid) return;

    if (!universities || !universities.length) {
      if (countEl) countEl.textContent = 'No partner data available.';
      grid.innerHTML = '<p style="text-align:center;color:#5f6b7a;padding:3rem">Unable to load partners.</p>';
      return;
    }

    populateFilters(universities);
    filterAndRender(universities, grid, countEl);

    ['partnersSearch', 'programFilter', 'countryFilter', 'studyAreaFilter'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input',  function () { filterAndRender(universities, grid, countEl); });
      el.addEventListener('change', function () { filterAndRender(universities, grid, countEl); });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
