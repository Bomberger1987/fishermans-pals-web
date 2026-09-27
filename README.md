# Fisherman's Pals – Web App V1.2

Statische HTML-Web-App für Regeln, Serveränderungen, Labor-Balance, Pal-Freischaltungen, Weltkarte, Elemente, Spielwissen, Links und Serverstatus.

## Design V1.2

V1.2 verwendet das Fisherman's-Pals-Branding konsequent als Holz-/Nautik-UI:

- dunkle Holztafeln statt Glassmorphism
- Messing-/Goldkanten und warme Braun-/Goldtöne
- türkisfarbene Akzente passend zum Kompass/Fisch im Logo
- echtes Fisherman's-Pals-Logo in Sidebar und Startbereich
- Weltkarte in einem gerahmten Karten-/Holzpanel
- responsive Navigation bleibt erhalten

## Start

Einfach `index.html` im Browser öffnen oder den kompletten Ordner auf einen Webserver / Render Static Site / GitHub Pages hochladen.

## Eingebundene Bilder

- `assets/fishermans-pals-bg.png` – Haupt-/Hero-Hintergrund
- `assets/fishermans-pals-logo.png` – transparentes Fisherman's-Pals-Logo
- `assets/palworld-map-progression.png` – Boss-/Cap-Progressionskarte

## Datenpflege

Die servereigenen Werte liegen zentral in `data.js`. Dadurch müssen Regeln, Laborwerte, Pal-Level und Links nicht im HTML geändert werden.

## Datenstatus

- Lab: Zielmatrix und Multiplikatoren bleiben gegenüber V1.1 unverändert.
- Pal-Sperre: Die vorhandene 120er Native-Policy-Angabe und die bereits dokumentierten Freischaltwerte bleiben unverändert.
- Elemente, Links, Regeln und Status-API wurden beim Redesign nicht inhaltlich verändert.

## Dateien

- `index.html` – App-Shell
- `styles.css` – Holz-/Nautik-UI V1.2
- `data.js` – Inhalte und Serverdaten
- `app.js` – Tabs, Suche, Filter, Status-API
- `assets/` – Logo, Hintergrund und Weltkarte


## V1.2.6
- Regel-Einleitung und -Abschluss hervorgehoben/vergrößert.
- Regeln als aufklappbare Accordion-Tafeln.
- Suche filtert und öffnet passende Regeln automatisch.


V1.2.11
- Nur die Farbwirkung der Überschrift "Regeln" angepasst: näher an der silbrig-metallischen Optik von "Fisherman's" aus dem Logo.

V1.2.12
- Nur die Überschrift "Regeln" heller gemacht, bei gleicher Fisherman's-Farbwirkung.

V1.2.13
- Überschrift "Regeln" nochmals deutlich heller, nahezu weiß/silber wie "Fisherman's" im Logo.

V1.2.14
- Nur die Überschriften aller Reiter auf die neue helle Fisherman's-Formatierung von "Regeln" angepasst.

V1.2.15 – Labor
- Nur Reiter Labor überarbeitet.
- Datenstatus-Hinweis entfernt.
- Aufwand-Layout: zwei globale Karten mittig oben, drei Sonderfälle darunter; Arznei rechts.
- Aufwand-Typografie verkleinert, Überschriften größer.
- Handwerk als Belohnungskategorie ergänzt.
- Palworld-Arbeitseignungs-Symbole über Palpedia-Asset-URLs eingebunden; Emoji-Fallback bei Ladefehler.

V1.2.16
- Pal-Sperren: vollständige 120er Policy aus Fishermans_Pals_PalUsageGate_Freischaltliste_0.3.3 übernommen.
- Datenstatus-Hinweis entfernt.
- Ingame-Palpedia-Nummern vor den Palnamen ergänzt.
- Interne CharacterID als dritte Spalte.
- Level-Dropdown auf dunklen Options-Hintergrund angepasst.

V1.2.17
- Nur Reiter Elemente überarbeitet.
- Originale Palworld-Elementicons über Palpedia eingebunden.
- Elementicon + Name zentriert nebeneinander.
- Stark-/Schwach-Matchups zeigen ebenfalls Icon + Elementname.
- Erklärung unter Element-Regeln größer und kontrastreicher.

V1.2.18
- Elemente: nur Original-Element-Icons, keine Fallback-/Ersatzsymbole mehr.
- Die komplette Erklärung direkt unter "Element-Regeln" bleibt auf Desktop in einer Zeile; auf kleinen Displays darf sie umbrechen.

V1.2.19
- Nur Reiter Elemente: Elementnamen und Erklärung vollständig auf Deutsch gestellt. Original-Icon-IDs unverändert.

V1.2.21
- Im Reiter Elemente die deutsche Bezeichnung "Dunkel" auf "Schatten" korrigiert.

- Reiter Weltkarte überarbeitet: Schatzkarten-Icon im Button, Karte als mittiges Holzbrett mit Aufhängung, darunter Progressionserklärung mit Farblegende und Boss-/Cap-Folge.
