/*
 * Alpin 3D Design – Interaktion
 *
 * Alle Inhalte stehen in index.html. Dieses Skript liest sie aus und baut
 * daraus Navigation, Slider-Punkte, Schrittleiste, Projektliste und
 * Jahresleiste. Neue Slides, Schritte, Projekte oder Jahre einfach im HTML
 * ergänzen – hier muss nichts geändert werden.
 */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  // Texte, die das Skript selbst erzeugt – Sprache aus <html lang="…">
  const i18n = {
    de: {
      lightbox: "Bild in Großansicht",
      gallery: "Bildergalerie",
      prev: "Vorheriges Bild",
      next: "Nächstes Bild",
      image: "Bild",
      showAll: (all, more) => `Alle ${all} anzeigen (+${more})`,
      showLess: "Weniger anzeigen",
      railnav: "Seitennavigation",
    },
    en: {
      lightbox: "Enlarged image",
      gallery: "Image gallery",
      prev: "Previous image",
      next: "Next image",
      image: "Image",
      showAll: (all, more) => `Show all ${all} (+${more})`,
      showLess: "Show less",
      railnav: "Page navigation",
    },
  };
  const t = i18n[document.documentElement.lang.slice(0, 2)] || i18n.de;
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ------------------------------------------------------------------
   * Wiederverwendbarer Wechsler: zeigt immer ein Element einer Liste an,
   * optional mit automatischem Weiterschalten.
   * ------------------------------------------------------------------ */
  function createSwitcher({
    root,
    items,
    buttons = [],
    interval = 0,
    start = 0,
    onChange,
  }) {
    let index = -1;
    let timer = null;

    function show(next) {
      index = (next + items.length) % items.length;
      items.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
        item.setAttribute("aria-hidden", String(i !== index));
      });
      buttons.forEach((button, i) => {
        button.classList.toggle("is-active", i === index);
        button.classList.toggle("is-done", i <= index);
        button.setAttribute("aria-current", i === index ? "true" : "false");
      });
      root.style.setProperty("--index", index);
      root.style.setProperty("--count", items.length);
      if (onChange) onChange(index);
    }

    function restart() {
      clearInterval(timer);
      if (interval && !reducedMotion && items.length > 1) {
        timer = setInterval(() => show(index + 1), interval);
      }
    }

    buttons.forEach((button, i) => {
      button.addEventListener("click", () => {
        show(i);
        restart();
      });
    });

    if (interval) root.style.setProperty("--interval", interval + "ms");
    show(start);
    restart();
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  const text = (root, selector) =>
    (root.querySelector(selector)?.textContent || "").trim();

  /* ---------- Titelseite: Slider ---------- */
  const hero = document.querySelector(".hero");
  if (hero) {
    const slides = [...hero.querySelectorAll(".hero__slide")];
    const dots = hero.querySelector(".hero__dots");
    const label = hero.querySelector(".hero__label");
    const buttons = slides.map((slide) => {
      const name = slide.dataset.label || text(slide, "h2");
      const button = el("button");
      button.type = "button";
      button.setAttribute("aria-label", name);
      dots.append(button);
      return button;
    });
    createSwitcher({
      root: hero,
      items: slides,
      buttons,
      interval: Number(hero.dataset.interval) || 6500,
      onChange: (i) => {
        label.textContent = slides[i].dataset.label || text(slides[i], "h2");
      },
    });
  }

  /* ---------- Workflow: Schrittleiste ---------- */
  const workflow = document.querySelector(".workflow");
  if (workflow) {
    const steps = [...workflow.querySelectorAll(".step")];
    const track = el("ol", "workflow__track");
    const buttons = steps.map((step, i) => {
      const li = el("li");
      const button = el("button");
      button.type = "button";
      button.append(
        el("span", "num", String(i + 1).padStart(2, "0")),
        el("span", "title", text(step, "h3")),
      );
      li.append(button);
      track.append(li);
      return button;
    });
    workflow.querySelector(".workflow__stage").before(track);
    createSwitcher({
      root: track,
      items: steps,
      buttons,
      interval: Number(workflow.dataset.interval) || 7000,
    });
    // Leiste und Bühne teilen sich die Laufzeit für den Zeitbalken
    workflow.style.setProperty(
      "--interval",
      (Number(workflow.dataset.interval) || 7000) + "ms",
    );
  }

  /* ---------- Projekte: Liste rechts ---------- */
  const projects = document.querySelector(".projects");
  if (projects) {
    const items = [...projects.querySelectorAll(".project")];
    const nav = el("ul", "projects__nav");
    const buttons = items.map((project) => {
      const li = el("li");
      const button = el("button");
      button.type = "button";
      button.append(
        el("span", "sim", project.dataset.sim || ""),
        el("span", "title", text(project, "h3")),
      );
      li.append(button);
      nav.append(li);
      return button;
    });
    projects.append(nav);
    createSwitcher({
      root: projects,
      items,
      buttons,
      interval: Number(projects.dataset.interval) || 6000,
    });
  }

  /* ---------- Geschichte: Jahresleiste ---------- */
  const timeline = document.querySelector(".timeline");
  if (timeline) {
    const entries = [...timeline.querySelectorAll(".timeline__entry")];
    const years = el("ol", "timeline__years");
    const buttons = entries.map((entry) => {
      const li = el("li");
      const button = el("button", null, text(entry, "h3"));
      button.type = "button";
      li.append(button);
      years.append(li);
      return button;
    });
    timeline.before(years);
    const preset = entries.findIndex((entry) =>
      entry.classList.contains("is-active"),
    );
    createSwitcher({
      root: timeline,
      items: entries,
      buttons,
      start: preset >= 0 ? preset : entries.length - 1,
    });
  }

  /* ---------- Bildergalerien (.gallery) ----------
   * Bilder einfach untereinander in <div class="gallery"> schreiben.
   * Ab zwei Bildern entstehen Pfeile, Punkte und Zähler automatisch.
   * Klick auf ein Bild öffnet die Großansicht. */
  let lightbox = null;
  function openLightbox(img) {
    if (!lightbox) {
      lightbox = el("dialog", "lightbox");
      lightbox.setAttribute("aria-label", t.lightbox);
      lightbox.append(el("img"));
      lightbox.addEventListener("click", () => lightbox.close());
      document.body.append(lightbox);
    }
    const big = lightbox.querySelector("img");
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    if (typeof lightbox.showModal === "function") lightbox.showModal();
  }

  document.querySelectorAll(".gallery").forEach((gallery) => {
    const images = [...gallery.querySelectorAll("img")];
    if (!images.length) return;
    const track = el("div", "gallery__track");
    track.append(...images);
    gallery.append(track);
    images.forEach((img) =>
      img.addEventListener("click", () => openLightbox(img)),
    );
    if (images.length < 2) return;

    gallery.setAttribute("role", "region");
    gallery.setAttribute("aria-roledescription", t.gallery);
    const prev = el("button", "gallery__btn gallery__btn--prev");
    const next = el("button", "gallery__btn gallery__btn--next");
    prev.type = next.type = "button";
    prev.setAttribute("aria-label", t.prev);
    next.setAttribute("aria-label", t.next);

    const bar = el("div", "gallery__bar");
    const dots = el("div", "gallery__dots");
    const count = el("span", "gallery__count");
    const dotButtons = images.map((img, i) => {
      const dot = el("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `${t.image} ${i + 1}: ${img.alt}`);
      dot.addEventListener("click", () => go(i));
      dots.append(dot);
      return dot;
    });
    bar.append(dots, count);
    gallery.append(prev, next, bar);

    let current = 0;
    function go(i) {
      const target = Math.max(0, Math.min(images.length - 1, i));
      track.scrollTo({
        left: target * track.clientWidth,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
    function update() {
      const width = track.clientWidth || 1;
      current = Math.round(track.scrollLeft / width);
      dotButtons.forEach((dot, i) =>
        dot.classList.toggle("is-active", i === current),
      );
      count.textContent = `${current + 1} / ${images.length}`;
      prev.disabled = current === 0;
      next.disabled = current === images.length - 1;
    }
    prev.addEventListener("click", () => go(current - 1));
    next.addEventListener("click", () => go(current + 1));
    track.addEventListener("scroll", () => requestAnimationFrame(update), {
      passive: true,
    });
    gallery.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") go(current - 1);
      if (event.key === "ArrowRight") go(current + 1);
    });
    update();
  });

  /* ---------- Team: lange Gruppen einklappen (data-show="6") ---------- */
  document.querySelectorAll(".team-group[data-show]").forEach((group) => {
    const limit = Number(group.dataset.show);
    const members = [...group.querySelectorAll(".member")];
    if (!limit || members.length <= limit) return;
    const extra = members.slice(limit);
    const button = el("button", "team-group__more");
    button.type = "button";
    let open = false;
    function render() {
      extra.forEach((member) => (member.hidden = !open));
      button.textContent = open
        ? t.showLess
        : t.showAll(members.length, extra.length);
      button.setAttribute("aria-expanded", String(open));
    }
    button.addEventListener("click", () => {
      open = !open;
      render();
    });
    group.append(button);
    render();
  });

  /* ---------- Seitennavigation rechts aus section[data-nav] ---------- */
  const sections = [...document.querySelectorAll("[data-nav]")];
  if (sections.length) {
    const rail = el("nav", "railnav");
    rail.setAttribute("aria-label", t.railnav);
    const links = sections.map((section) => {
      const link = el("a");
      link.href = "#" + section.id;
      link.append(el("span", null, section.dataset.nav));
      rail.append(link);
      return link;
    });
    document.body.append(rail);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const i = sections.indexOf(entry.target);
          links.forEach((link, k) =>
            link.classList.toggle("is-active", k === i),
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
  }
})();
