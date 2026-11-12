# Alpin 3D Design – Website

Statische Website ohne Build-Schritt. **Inhalte stehen ausschließlich in den HTML-Dateien**, das Aussehen in `css/`, das Verhalten in `js/main.js`.

## Struktur

| Pfad                      | Inhalt                                                      |
| ------------------------- | ----------------------------------------------------------- |
| `index.html`              | Startseite – nur Inhalte                                    |
| `en/index.html`           | Startseite auf Englisch                                     |
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
  <div class="gallery">
    <img src="assets/img/bild1.jpg" alt="Was auf dem Bild zu sehen ist" width="1920" height="1080" loading="lazy" decoding="async" />
    <img src="assets/img/bild2.jpg" alt="…" width="1920" height="1080" loading="lazy" decoding="async" />
  </div>
</li>
```

Die Galerie ist optional. Ab zwei Bildern entsteht automatisch ein Slider mit Pfeilen, Punkten und Wischen; ein Klick öffnet die Großansicht. Bilder werden nie abgeschnitten (16:9-Rahmen). `width`/`height` = echte Pixelmaße des Bildes, `alt` = kurze Beschreibung (wichtig für Google-Bildersuche).

**Team-Gruppe einklappen** – `data-show="6"` an `<section class="team-group …">` zeigt nur die ersten 6 Karten plus Button „Alle anzeigen“.

## Englische Version

`en/index.html` ist die englische Fassung der Startseite – eine eigenständige Kopie mit übersetzten Texten. **Inhaltliche Änderungen bitte in beiden Dateien machen** (gleiche Struktur, gleiche Klassen). Unterschiede zur deutschen Datei:

- Pfade beginnen mit `../` (z. B. `../assets/img/…`, `../css/…`).
- `<html lang="en">`, eigene `canonical`/`og:url` auf `/en/`, Abschnitts-IDs auf Englisch (`#projects`, `#history`, `#join`, `#contact`).
- Spielname: „Ski Region Simulator“.

Texte, die `js/main.js` selbst erzeugt (Galerie-Buttons, „Alle anzeigen“ …), stehen oben in `main.js` im Objekt `i18n` und richten sich nach `<html lang>`. Impressum und Datenschutz gibt es nur auf Deutsch.

## SEO

- Titel, Beschreibung, Canonical, Open Graph und strukturierte Daten (JSON-LD) stehen im `<head>` von `index.html`.
- `robots.txt` und `sitemap.xml` liegen im Hauptverzeichnis. **Domain prüfen:** überall ist `https://alpin3d-design.com/` eingetragen.
- Nach dem Upload die Sitemap in der Google Search Console einreichen.

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
