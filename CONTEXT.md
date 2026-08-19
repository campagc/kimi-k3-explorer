# Context — kimi-k3-explorer

Domain glossary for the interactive Kimi K3 architecture explorer. Use these
terms in code, reviews, and architecture discussions.

- **Component** — a labelled part of the Kimi K3 architecture (e.g. RMSNorm 1,
  the KDA block), identified by a string id. The unit of content and of
  interaction.
- **Registry** — `src/data/registry.js`. One record per component, composed
  from the content maps in `data/components.js` and `data/enrichment.js`
  (those maps are internal to the registry). The single lookup interface is
  `getComponent(id)`; `validateRegistry()` is the integrity test surface.
- **Playback** — an ordered walk over a list of component ids
  (`src/playback.js` + `src/hooks/usePlayback.js`). One mode: the guided
  **tour** (manual stepping over `TOUR_ORDER`).
- **Cost lens** — a highlight mode that colours hotspots by per-token cost
  level 0–3. The level → class/label mapping lives in `src/costLens.js`.
- **Level** — explanation register: `eli5`, `undergrad`, `paper`.
- **Inset** — the MLA and KDA sub-diagrams beside the main diagram.
- **Hotspot** — an interactive SVG element bound to a component id.
- **io** — the seam between app state and the diagram modules:
  `{ hoveredId, selectedId, lensOn, onHover(id|null), onSelect(id) }`.
  Cursor geometry deliberately does not cross it; the tooltip owns position.
- **Tokens** — the design scales the app chrome is built from: spacing, type,
  radius, color and shadow, declared as CSS custom properties on `:root` in
  `src/App.css`. Chrome styles reference tokens, never raw values.
- **Palette** — `src/palette.js`, exported as `P`. The single home for every
  color used *inside* the SVG diagrams, since SVG presentation attributes are
  set from JS rather than CSS. Distinct from the chrome tokens above.
- **Toolbar** — the sticky control strip (depth, cost lens, guided tour). A
  direct child of `.app` on purpose: nested inside `<header>` it would unstick
  as soon as the header scrolled away.
