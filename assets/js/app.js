document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");

  const setNavState = (isOpen) => {
    if (!toggleBtn || !nav) {
      return;
    }

    nav.classList.toggle("is-open", isOpen);
    toggleBtn.classList.toggle("is-open", isOpen);
    toggleBtn.setAttribute("aria-expanded", String(isOpen));
    toggleBtn.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  };

  if (toggleBtn && nav) {
    toggleBtn.addEventListener("click", () => {
      setNavState(!nav.classList.contains("is-open"));
    });

    // Optional: close menu when clicking a link (mobile)
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        if (nav.classList.contains("is-open")) {
          setNavState(false);
        }
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 720 && nav.classList.contains("is-open")) {
        setNavState(false);
      }
    });
  }

  const translations = {
  en: {
    nav_about: "About",
    nav_incoming: "Incoming",
    nav_outgoing: "Outgoing",
    nav_bips: "BIPs",
    nav_partners: "Partners",
    nav_projects: "Projects",
    nav_events: "Events",
    contact: "Contact",
    preview_title: "Campus Preview",
    preview_subtitle: "Explore our modern learning spaces and student life in Rotterdam.",
    preview_label: "Featured Story",
    preview_heading: "Inside the Erasmus Experience",
    preview_link: "Watch the overview",
    announcements_title: "Latest Announcements",
    card_tag_important: "Important",
    card_tag_event: "Event",
    card_tag_project: "Project",
    announce1_title: "Application Deadline 2026",
    announce1_body:
      "The deadline for the upcoming winter semester is approaching fast. Make sure to submit all documents.",
    announce1_link: "Read More →",
    announce2_title: "Welcome Orientation",
    announce2_body:
      "Join us next Monday for the international students welcome meeting in the main hall.",
    announce2_link: "View Details →",
    announce3_title: "New BIP Partnership",
    announce3_body:
      "We are excited to announce a new Blended Intensive Program with our partners in Rome.",
    announce3_link: "Learn More →",
    opportunities_title: "Explore Your Opportunities",
    opportunities_subtitle:
      "Navigate Erasmus pathways built for global mobility and academic growth.",
    opp_incoming_title: "Incoming",
    opp_incoming_body:
      "Plan your exchange at Erasmus with clear timelines, support, and step-by-step guidance.",
    opp_incoming_link: "Get Started →",
    opp_outgoing_title: "Outgoing",
    opp_outgoing_body:
      "Discover partner institutions, funding options, and curated mobility tracks.",
    opp_outgoing_link: "Find Destinations →",
    opp_bips_title: "BIPs",
    opp_bips_body:
      "Explore Blended Intensive Programmes combining short mobility and digital learning.",
    opp_bips_link: "View Programmes →",
    why_title: "Why Choose Us",
    why_subtitle: "A trusted international partner with a student-first experience.",
    why1_title: "Global Reputation",
    why1_body:
      "Ranked among Europe’s leading universities with a strong international network.",
    why2_title: "Personal Support",
    why2_body:
      "Dedicated advisors, housing guidance, and arrivals teams focused on your success.",
    why3_title: "Career Impact",
    why3_body:
      "Build real-world experience through internships, research, and industry projects."
  },
  tr: {
    nav_about: "Hakkimizda",
    nav_incoming: "Gelen",
    nav_outgoing: "Giden",
    nav_bips: "BIP'ler",
    nav_partners: "Ortaklar",
    nav_projects: "Projeler",
    nav_events: "Etkinlikler",
    contact: "Iletisim",
    preview_title: "Kampus Onizleme",
    preview_subtitle: "Rotterdam'daki modern ogrenme alanlarini ve ogrenci yasamini kesfedin.",
    preview_label: "One Cikan",
    preview_heading: "Erasmus Deneyiminin Icinde",
    preview_link: "Genel bakisi izle",
    announcements_title: "Son Duyurular",
    card_tag_important: "Onemli",
    card_tag_event: "Etkinlik",
    card_tag_project: "Proje",
    announce1_title: "2026 Basvuru Son Tarihi",
    announce1_body:
      "Yaklasan kis donemi icin son basvuru tarihi geliyor. Tum belgeleri gondermeyi unutmayin.",
    announce1_link: "Daha fazla →",
    announce2_title: "Hos Geldiniz Oryantasyonu",
    announce2_body:
      "Onumuzdeki Pazartesi uluslararasi ogrenci karsilama toplantisina katilin.",
    announce2_link: "Detaylari gor →",
    announce3_title: "Yeni BIP Ortakligi",
    announce3_body:
      "Roma'daki ortaklarimizla yeni bir Karma Yogun Program duyuruyoruz.",
    announce3_link: "Daha fazla →",
    opportunities_title: "Firsatlari Kesfedin",
    opportunities_subtitle:
      "Kuresel hareketlilik ve akademik gelisim icin Erasmus yollarini kesfedin.",
    opp_incoming_title: "Gelen",
    opp_incoming_body:
      "Erasmus'ta degisiminizi net takvim, destek ve adim adim rehberlikle planlayin.",
    opp_incoming_link: "Baslayin →",
    opp_outgoing_title: "Giden",
    opp_outgoing_body:
      "Ortak universiteler, finansman secenekleri ve hareketlilik rotalarini kesfedin.",
    opp_outgoing_link: "Destinasyonlari bul →",
    opp_bips_title: "BIP'ler",
    opp_bips_body:
      "Kisa sureli hareketlilik ve dijital ogrenmeyi birlestiren BIP'leri inceleyin.",
    opp_bips_link: "Programlari gor →",
    why_title: "Neden Bizi Secmelisiniz",
    why_subtitle: "Ogrenci odakli deneyimle guvenilir bir uluslararasi ortagiz.",
    why1_title: "Kuresel Itibar",
    why1_body:
      "Guclu uluslararasi agiyla Avrupa'nin oncu universiteleri arasinda.",
    why2_title: "Kisisel Destek",
    why2_body:
      "Basariniz icin danismanlar, konaklama rehberi ve karsilama ekipleri.",
    why3_title: "Kariyer Etkisi",
    why3_body:
      "Stajlar, arastirma ve sektor projeleriyle gercek deneyim kazanin."
  }
  };

  const applyTranslations = (locale) => {
    const dictionary = translations[locale] || translations.en;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (dictionary[key]) {
        el.textContent = dictionary[key];
      }
    });
    document.documentElement.lang = locale;
  };

  const langButtons = document.querySelectorAll(".lang-btn");

  langButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const locale = button.textContent.trim().toLowerCase();

      langButtons.forEach((btn) => {
        btn.classList.remove("is-active");
        btn.setAttribute("aria-pressed", "false");
      });

      button.classList.add("is-active");
      button.setAttribute("aria-pressed", "true");
      applyTranslations(locale);
    });
  });

  applyTranslations("en");
});
