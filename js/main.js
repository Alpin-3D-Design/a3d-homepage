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

  /* ---------- Seitennavigation rechts aus section[data-nav] ---------- */
  const sections = [...document.querySelectorAll("[data-nav]")];
  if (sections.length) {
    const rail = el("nav", "railnav");
    rail.setAttribute("aria-label", "Seitennavigation");
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
