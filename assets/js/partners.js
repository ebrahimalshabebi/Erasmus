(function () {
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function normalize(value) {
    return String(value || "").trim();
  }

  function getPartnersFromStaticData() {
    function parsePartnersTable(text) {
      var lines = String(text || "").split(/\r?\n/).map(function (line) {
        return line.trim();
      }).filter(Boolean);

      var dataLines = lines.filter(function (line) {
        if (!line.startsWith("|")) {
          return false;
        }

        if (/^\|\s*:?-{2,}/.test(line)) {
          return false;
        }

        var columns = line.split("|").slice(1, -1).map(function (column) {
          return normalize(column);
        });

        if (columns.length < 5) {
          return false;
        }

        if ((columns[0] || "").toLowerCase() === "program") {
          return false;
        }

        return true;
      });

      return dataLines.map(function (line, index) {
        var columns = line.split("|").slice(1, -1).map(function (column) {
          return normalize(column);
        });

        var studyAreasRaw = normalize(columns[4] || "");
        var studyAreas = studyAreasRaw
          .split(",")
          .map(function (area) { return normalize(area); })
          .filter(Boolean);

        return {
          id: normalize(columns[2] || ("partner-" + index)),
          program: normalize(columns[0] || ""),
          country: normalize(columns[1] || ""),
          erasmusIdCode: normalize(columns[2] || ""),
          universityName: normalize(columns[3] || ""),
          studyAreas: studyAreas,
          studyAreasRaw: studyAreasRaw
        };
      }).filter(function (entry) {
        return entry.universityName && entry.erasmusIdCode;
      });
    }

    var rawTable = normalize(window.PARTNERS_DATA_RAW || "");
    if (rawTable) {
      return parsePartnersTable(rawTable);
    }

    var raw = Array.isArray(window.PARTNERS_DATA) ? window.PARTNERS_DATA : [];

    return raw.map(function (item, index) {
      var studyAreasRaw = normalize(item && item.studyAreasRaw ? item.studyAreasRaw : "");
      var studyAreas = Array.isArray(item && item.studyAreas)
        ? item.studyAreas.map(function (area) { return normalize(area); }).filter(Boolean)
        : studyAreasRaw.split(",").map(function (area) { return normalize(area); }).filter(Boolean);

      var erasmusIdCode = normalize(item && item.erasmusIdCode ? item.erasmusIdCode : "");

      return {
        id: normalize(item && item.id ? item.id : erasmusIdCode || ("partner-" + index)),
        program: normalize(item && item.program ? item.program : ""),
        country: normalize(item && item.country ? item.country : ""),
        erasmusIdCode: erasmusIdCode,
        universityName: normalize(item && item.universityName ? item.universityName : ""),
        studyAreas: studyAreas,
        studyAreasRaw: studyAreasRaw
      };
    }).filter(function (entry) {
      return entry.universityName && entry.erasmusIdCode;
    });
  }

  function uniqueSorted(values) {
    return Array.from(new Set(values.filter(Boolean))).sort(function (a, b) {
      return a.localeCompare(b);
    });
  }

  function updateSelectOptions(selectEl, values, defaultLabel, selectedValue) {
    selectEl.innerHTML = "";

    var defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = defaultLabel;
    selectEl.appendChild(defaultOption);

    values.forEach(function (value) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      if (value === selectedValue) {
        option.selected = true;
      }
      selectEl.appendChild(option);
    });
  }

  function renderPartnerCards(partners, rootEl) {
    if (!partners.length) {
      rootEl.innerHTML = '<div class="partners-empty">No partners found for the selected filters.</div>';
      return;
    }

    rootEl.innerHTML = partners.map(function (partner) {
      var detailUrl = "partner-detail.html?id=" + encodeURIComponent(partner.id);
      return '' +
        '<a class="partner-card" href="' + detailUrl + '">' +
        '  <div class="partner-card-logo" aria-hidden="true">Logo</div>' +
        '  <h3 class="partner-card-name">' + escapeHtml(partner.universityName) + '</h3>' +
        '</a>';
    }).join("");
  }

  function initPartnersListPage(partners) {
    var grid = document.getElementById("partnersGrid");
    if (!grid) {
      return;
    }

    var countLabel = document.getElementById("partnersCount");
    var programFilter = document.getElementById("programFilter");
    var countryFilter = document.getElementById("countryFilter");
    var studyAreaFilter = document.getElementById("studyAreaFilter");
    var studyAreaOptions = document.getElementById("studyAreaOptions");
    var searchInput = document.getElementById("partnersSearch");

    function selectedProgramsPool() {
      var selectedProgram = normalize(programFilter.value);
      if (!selectedProgram) {
        return partners;
      }
      return partners.filter(function (partner) {
        return partner.program === selectedProgram;
      });
    }

    function selectedProgramAndCountryPool() {
      var selectedProgram = normalize(programFilter.value);
      var selectedCountry = normalize(countryFilter.value);

      return partners.filter(function (partner) {
        var programMatch = !selectedProgram || partner.program === selectedProgram;
        var countryMatch = !selectedCountry || partner.country === selectedCountry;
        return programMatch && countryMatch;
      });
    }

    function refreshFilterOptions() {
      var selectedProgram = normalize(programFilter.value);
      var selectedCountry = normalize(countryFilter.value);

      var programs = uniqueSorted(partners.map(function (partner) { return partner.program; }));
      updateSelectOptions(programFilter, programs, "All Programs", selectedProgram);

      var countries = uniqueSorted(selectedProgramsPool().map(function (partner) { return partner.country; }));
      if (selectedCountry && countries.indexOf(selectedCountry) === -1) {
        selectedCountry = "";
      }
      updateSelectOptions(countryFilter, countries, "All Countries", selectedCountry);

      var studyAreas = uniqueSorted(
        selectedProgramAndCountryPool().reduce(function (allAreas, partner) {
          return allAreas.concat(partner.studyAreas);
        }, [])
      );

      studyAreaOptions.innerHTML = studyAreas.map(function (area) {
        return '<option value="' + escapeHtml(area) + '"></option>';
      }).join("");
    }

    function applyFilters() {
      var selectedProgram = normalize(programFilter.value);
      var selectedCountry = normalize(countryFilter.value);
      var selectedStudyArea = normalize(studyAreaFilter.value).toLowerCase();
      var searchQuery = normalize(searchInput.value).toLowerCase();

      var filtered = partners.filter(function (partner) {
        var programMatch = !selectedProgram || partner.program === selectedProgram;
        var countryMatch = !selectedCountry || partner.country === selectedCountry;
        var studyAreaMatch = !selectedStudyArea || partner.studyAreas.some(function (area) {
          return area.toLowerCase().includes(selectedStudyArea);
        });
        var searchMatch = !searchQuery || 
          partner.universityName.toLowerCase().includes(searchQuery) || 
          partner.country.toLowerCase().includes(searchQuery);

        return programMatch && countryMatch && studyAreaMatch && searchMatch;
      });

      countLabel.textContent = filtered.length + " partners";
      renderPartnerCards(filtered, grid);
    }

    refreshFilterOptions();
    applyFilters();

    programFilter.addEventListener("change", function () {
      refreshFilterOptions();
      applyFilters();
    });

    countryFilter.addEventListener("change", function () {
      refreshFilterOptions();
      applyFilters();
    });

    studyAreaFilter.addEventListener("input", applyFilters);
    
    if (searchInput) {
      searchInput.addEventListener("input", applyFilters);
    }
  }

  function initPartnerDetailPage(partners) {
    var detailRoot = document.getElementById("partnerDetail");
    if (!detailRoot) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var selectedId = normalize(params.get("id"));

    var partner = partners.find(function (item) {
      return item.id === selectedId;
    });

    var nameEl = document.getElementById("partnerName");
    var summaryEl = document.getElementById("partnerSummary");
    var detailGrid = document.getElementById("partnerDetailGrid");

    if (!partner) {
      nameEl.textContent = "Partner not found";
      summaryEl.textContent = "The selected partner does not exist in the current data source.";
      detailGrid.innerHTML = '<div class="partners-empty">Please return to the partners page and choose a valid university.</div>';
      return;
    }

    nameEl.textContent = partner.universityName;
    summaryEl.textContent = partner.country + " • " + partner.program;

    var studyAreaItems = partner.studyAreas.map(function (area) {
      return '<li>' + escapeHtml(area) + '</li>';
    }).join("");

    detailGrid.innerHTML = '' +
      '<article class="partner-detail-item">' +
      '  <h2>Program</h2>' +
      '  <p>' + escapeHtml(partner.program) + '</p>' +
      '</article>' +
      '<article class="partner-detail-item">' +
      '  <h2>Country</h2>' +
      '  <p>' + escapeHtml(partner.country) + '</p>' +
      '</article>' +
      '<article class="partner-detail-item">' +
      '  <h2>Erasmus ID Code</h2>' +
      '  <p>' + escapeHtml(partner.erasmusIdCode) + '</p>' +
      '</article>' +
      '<article class="partner-detail-item partner-detail-areas">' +
      '  <h2>Study Area(s)</h2>' +
      '  <ul>' + studyAreaItems + '</ul>' +
      '</article>';
  }

  document.addEventListener("DOMContentLoaded", function () {
    try {
      var partners = getPartnersFromStaticData();
      if (!partners.length) {
        throw new Error("No static partner data available.");
      }
      initPartnersListPage(partners);
      initPartnerDetailPage(partners);
    } catch (error) {
      var grid = document.getElementById("partnersGrid");
      if (grid) {
        grid.innerHTML = '<div class="partners-empty">Unable to load partners right now.</div>';
      }

      var nameEl = document.getElementById("partnerName");
      var summaryEl = document.getElementById("partnerSummary");
      if (nameEl && summaryEl) {
        nameEl.textContent = "Unable to load data";
        summaryEl.textContent = "Please try again later.";
      }
    }
  });
})();
