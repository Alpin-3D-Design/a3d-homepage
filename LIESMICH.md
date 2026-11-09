# Alpin 3D Design – Website

Statische Website ohne Build-Schritt. **Inhalte stehen ausschließlich in den HTML-Dateien**, das Aussehen in `css/`, das Verhalten in `js/main.js`.

## Struktur

| Pfad                      | Inhalt                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `index.html`              | Startseite – nur Inhalte                                    |
| `impressum.html`          | Impressum (Vorlage)                                         |
| `datenschutz.html`        | Datenschutzerklärung (Vorlage)                              |
| `css/fonts.css`           | lokal eingebundene Schriften                                |
| `css/base.css`            | Farben, Typografie, Buttons, Tags, Animationen              |
| `css/hero.css`            | Titelseite mit Slider und Downloads                         |
| `css/workflow.css`        | „So entsteht eine Mod“                                      |
| `css/projects.css`        | Projekt-Showcase                                            |
| `css/history.css`         | Geschichte                                                  |
| `css/team.css`            | Team                                                        |
| `css/join.css`            | Banner „Lust, mitzubauen?“                                  |
| `css/contact.css`         | Kontakt, Social Media, Spende, Fußzeile                     |
| `css/railnav.css`         | Navigation am rechten Rand                                  |
| `css/legal.css`           | Impressum und Datenschutz                                   |
| `js/main.js`              | baut Navigation, Slider-Punkte, Leisten und Listen aus HTML |
| `assets/img/`             | Bilder, `logo.png`, `favicon.png`, Deko-Grafiken (SVG)      |
| `assets/icons/`           | Icons für Kontakt und Social Media                          |
| `.pre-commit-config.yaml` | pre-commit-Hooks                                            |

Farben ändern: oben in `css/base.css` unter `:root`.

## Inhalte ergänzen

Einfach einen vorhandenen Block kopieren und anpassen. Navigationselemente, Nummern und Listen entstehen automatisch.

**Teammitglied** – in die passende Gruppe (`team-group--dev`, `--marketing`, `--testing`, `--core`):

```html
<article class="member">
  <p class="member__role">Scripting</p>
  <h4>Max Mustermann</h4>
  <dl>
    <dt>Dabei seit</dt>
    <dd>2021</dd>
  </dl>
  <ul class="tags">
    <li>Techno Alpin Pack</li>
  </ul>
</article>
```

**Slide auf der Titelseite** – in `.hero__slides`:

```html
<article class="hero__slide" data-label="Beschriftung rechts unten">
  <img class="hero__img" src="assets/img/bild.jpg" alt="" />
  <div class="hero__copy">
    <p class="eyebrow">Kategorie · Simulator</p>
    <h2>Überschrift</h2>
    <p>Beschreibung.</p>
  </div>
</article>
```

**Projekt** – in `.projects__stage`; `data-sim` erscheint in der Liste rechts:

```html
<article class="project" data-sim="Winter Resort Simulator">
  <img class="project__img" src="assets/img/bild.jpg" alt="Projektname" />
  <div class="project__card facet-card">
    <p class="eyebrow">Kategorie</p>
    <h3>Projektname</h3>
    <p>Beschreibung.</p>
    <ul class="tags">
      <li>Label</li>
    </ul>
  </div>
</article>
```

**Workflow-Schritt** – in `.workflow__stage`. Für Grafiken auf dunklem Grund `step__media--contain`, für ein Raster über dem Bild `step__media--grid` ergänzen.

**Jahr in der Geschichte** – in `.timeline`; `is-active` legt das Startjahr fest:

```html
<li class="timeline__entry facet-card">
  <h3>2019</h3>
  <p>Was in diesem Jahr passiert ist.</p>
</li>
```

**Abschnitt in der rechten Navigation** – `id` und `data-nav="Name"` an die `<section>` setzen.

Bildausschnitt: Liegt das Motiv rechts oder links im Foto, dem `<img>` die Klasse `focus-right` bzw. `focus-left` geben.

## Noch auszufüllen

Nach `[` bzw. `href="#"` suchen: Teammitglieder, Download-Links, E-Mail, Discord-, YouTube-, Facebook-, Instagram- und PayPal-Link sowie Impressum und Datenschutz.

## pre-commit

```bash
pip install pre-commit
pre-commit install
pre-commit run --all-files
```
