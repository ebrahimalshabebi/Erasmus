/**
 * partners.js
 * Renders the partner university grid with custom animated dropdowns.
 * Data comes from window.__PARTNERS_DATA__ (set by partners-data.js).
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

  /* ===============================================
     Custom Animated Dropdown
     =============================================== */
  function CustomDropdown(wrapId, onChange) {
    var wrap     = document.getElementById(wrapId);
    if (!wrap) return null;
    var select   = wrap.querySelector('select');
    var trigger  = wrap.querySelector('.filter-select-trigger');
    var trigText = trigger.querySelector('.trigger-text');
    var list     = wrap.querySelector('.filter-dropdown-list');
    var self     = this;

    this.value = '';
    this.wrap = wrap;
    this.select = select;
    this.trigger = trigger;
    this.list = list;
    this.trigText = trigText;
    this.onChange = onChange;
    this.highlighted = -1;
    this.options = [];
    this.isOpen = false;

    // Click trigger to toggle
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (self.isOpen) { self.close(); } else { self.open(); }
    });

    // Keyboard nav
    trigger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (self.isOpen) { self.close(); } else { self.open(); }
      } else if (e.key === 'Escape') {
        self.close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!self.isOpen) { self.open(); }
        self.highlighted = Math.min(self.highlighted + 1, self.options.length - 1);
        self.updateHighlight();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        self.highlighted = Math.max(self.highlighted - 1, 0);
        self.updateHighlight();
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) { self.close(); }
    });
  }

  CustomDropdown.prototype.populate = function (items) {
    this.options = items;
    this.list.innerHTML = '';
    var self = this;
    // "All" option first
    var defaultLabel = this.select.options[0].textContent;
    var allLi = document.createElement('li');
    allLi.textContent = defaultLabel;
    allLi.setAttribute('role', 'option');
    allLi.setAttribute('data-value', '');
    if (this.value === '') allLi.classList.add('is-selected');
    allLi.addEventListener('click', function (e) {
      e.stopPropagation();
      self.selectValue('', defaultLabel);
    });
    this.list.appendChild(allLi);

    items.forEach(function (val) {
      var li = document.createElement('li');
      li.textContent = val;
      li.setAttribute('role', 'option');
      li.setAttribute('data-value', val);
      if (self.value === val) li.classList.add('is-selected');
      li.addEventListener('click', function (e) {
        e.stopPropagation();
        self.selectValue(val, val);
      });
      self.list.appendChild(li);
    });
  };

  CustomDropdown.prototype.selectValue = function (val, label) {
    this.value = val;
    this.trigText.textContent = label;
    // Update hidden select
    this.select.value = val;
    // Update selection styling
    var items = this.list.querySelectorAll('li');
    items.forEach(function (li) {
      li.classList.toggle('is-selected', li.getAttribute('data-value') === val);
    });
    this.close();
    if (this.onChange) this.onChange();
  };

  CustomDropdown.prototype.open = function () {
    this.isOpen = true;
    this.trigger.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.list.classList.add('is-open');
    this.highlighted = -1;
    // Close other open dropdowns
    var allWraps = document.querySelectorAll('.filter-select-wrap');
    var self = this;
    allWraps.forEach(function (w) {
      if (w !== self.wrap) {
        var t = w.querySelector('.filter-select-trigger');
        var l = w.querySelector('.filter-dropdown-list');
        if (t) t.classList.remove('is-open');
        if (l) l.classList.remove('is-open');
      }
    });
  };

  CustomDropdown.prototype.close = function () {
    this.isOpen = false;
    this.trigger.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.list.classList.remove('is-open');
    this.highlighted = -1;
  };

  CustomDropdown.prototype.updateHighlight = function () {
    var items = this.list.querySelectorAll('li');
    var self = this;
    items.forEach(function (li, i) {
      li.classList.toggle('is-highlighted', i === self.highlighted);
    });
    if (items[this.highlighted]) {
      items[this.highlighted].scrollIntoView({ block: 'nearest' });
      // Select on Enter
      var self2 = this;
      this.trigger.onkeyup = function (e) {
        if (e.key === 'Enter' && self2.highlighted >= 0) {
          items[self2.highlighted].click();
          self2.trigger.onkeyup = null;
        }
      };
    }
  };

  /* ===============================================
     Study Area Autocomplete
     =============================================== */
  var allAreas = [];

  function initAutocomplete(onSelect) {
    var input    = document.getElementById('studyAreaFilter');
    var list     = document.getElementById('studyAreaList');
    var clearBtn = document.getElementById('studyAreaClear');
    if (!input || !list) return;

    var highlighted = -1;

    function showSuggestions(query) {
      var q = query.trim().toUpperCase();
      list.innerHTML = '';
      highlighted = -1;

      if (!q) {
        list.classList.remove('is-open');
        return;
      }

      var matches = allAreas.filter(function (a) {
        return a.toUpperCase().indexOf(q) !== -1;
      }).slice(0, 20);

      if (matches.length === 0) {
        list.classList.remove('is-open');
        return;
      }

      matches.forEach(function (area) {
        var li = document.createElement('li');
        li.setAttribute('role', 'option');
        var upper = area.toUpperCase();
        var start = upper.indexOf(q);
        if (start !== -1) {
          li.innerHTML = escHtml(area.substring(0, start)) +
            '<mark>' + escHtml(area.substring(start, start + q.length)) + '</mark>' +
            escHtml(area.substring(start + q.length));
        } else {
          li.textContent = area;
        }
        li.addEventListener('mousedown', function (e) {
          e.preventDefault();
          input.value = area;
          list.classList.remove('is-open');
          clearBtn.style.display = '';
          onSelect();
        });
        list.appendChild(li);
      });

      list.classList.add('is-open');
    }

    input.addEventListener('input', function () {
      showSuggestions(input.value);
      clearBtn.style.display = input.value ? '' : 'none';
      onSelect();
    });

    input.addEventListener('focus', function () {
      if (input.value.trim()) showSuggestions(input.value);
    });

    input.addEventListener('blur', function () {
      setTimeout(function () { list.classList.remove('is-open'); }, 150);
    });

    input.addEventListener('keydown', function (e) {
      var items = list.querySelectorAll('li');
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlighted = Math.min(highlighted + 1, items.length - 1);
        updateHL(items);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlighted = Math.max(highlighted - 1, 0);
        updateHL(items);
      } else if (e.key === 'Enter' && highlighted >= 0) {
        e.preventDefault();
        items[highlighted].dispatchEvent(new Event('mousedown'));
      } else if (e.key === 'Escape') {
        list.classList.remove('is-open');
      }
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        input.value = '';
        clearBtn.style.display = 'none';
        list.classList.remove('is-open');
        input.focus();
        onSelect();
      });
    }

    function updateHL(items) {
      items.forEach(function (li, i) {
        li.classList.toggle('is-highlighted', i === highlighted);
      });
      if (items[highlighted]) {
        items[highlighted].scrollIntoView({ block: 'nearest' });
      }
    }
  }

  /* ===============================================
     Filter population
     =============================================== */
  var programDropdown = null;
  var countryDropdown = null;

  function populateFilters(universities, rerender) {
    var programs  = new Set();
    var countries = new Set();
    var areasSet  = new Set();

    programs.add("KA131");
    programs.add("KA171");

    universities.forEach(function (u) {
      if (u.country) countries.add(u.country);
      (u.studyAreas || []).forEach(function (a) { if (a) areasSet.add(a.trim()); });
    });

    // Custom dropdowns
    programDropdown = new CustomDropdown('programFilterWrap', rerender);
    programDropdown.populate(Array.from(programs).sort());

    countryDropdown = new CustomDropdown('countryFilterWrap', rerender);
    countryDropdown.populate(Array.from(countries).sort());

    allAreas = Array.from(areasSet).sort();
  }

  /* ===============================================
     Card builder
     =============================================== */
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

  /* ===============================================
     Filter & render
     =============================================== */
  function filterAndRender(universities, grid) {
    var search    = norm((document.getElementById('partnersSearch')  || {}).value || '');
    var program   = programDropdown ? norm(programDropdown.value) : '';
    var country   = countryDropdown ? norm(countryDropdown.value) : '';
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

    if (filtered.length === 0) {
      grid.innerHTML = '<div class="partners-empty"><p>No partners found matching your criteria.</p></div>';
    }
  }

  /* ===============================================
     Init
     =============================================== */
  function init() {
    var universities = window.__PARTNERS_DATA__;
    var grid = document.getElementById('partnersGrid');

    if (!grid) return;

    if (!universities || !universities.length) {
      grid.innerHTML = '<p style="text-align:center;color:#5f6b7a;padding:3rem">Unable to load partners.</p>';
      return;
    }

    var rerender = function () { filterAndRender(universities, grid); };

    populateFilters(universities, rerender);
    filterAndRender(universities, grid);

    // Autocomplete for study area
    initAutocomplete(rerender);

    // Main search input
    var searchEl = document.getElementById('partnersSearch');
    if (searchEl) {
      searchEl.addEventListener('input', rerender);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
