import { getComponent } from './data/registry';
import { lensClassFor } from './costLens';

// The hotspot state vocabulary: how a component id maps to the CSS classes
// that show hover, selection, and the cost lens — and to the DOM props that
// make an SVG shape behave like a real control.
//
// Both live here rather than in components/primitives.jsx so that module can
// export components only, which is what React Fast Refresh requires.

export function hotspotClass(id, io) {
  let c = 'hotspot';
  if (io.hoveredId === id) c += ' hovered';
  if (io.selectedId === id) c += ' selected';
  if (io.lensOn) c += ` ${lensClassFor(getComponent(id)?.cost?.level)}`;
  return c;
}

// A tap on a touch screen fires mouseenter but no reliable mouseleave, which
// would leave the .hovered highlight stuck on the last-tapped hotspot. Only
// real cursors drive hover; focus/blur still cover keyboard users.
const CAN_HOVER = window.matchMedia('(hover: hover)').matches;

// Hotspots are keyboard-reachable: role + tabIndex + Enter/Space, and an
// aria-label carrying the component name and its one-line summary.
export function hotspotProps(id, io) {
  if (!id) return { 'aria-hidden': 'true' };
  const info = getComponent(id);
  const select = () => io.onSelect(id);
  return {
    role: 'button',
    tabIndex: 0,
    'aria-label': info ? `${info.name} — ${info.short}` : id,
    'aria-pressed': io.selectedId === id,
    onMouseEnter: CAN_HOVER ? () => io.onHover(id) : undefined,
    onMouseLeave: CAN_HOVER ? () => io.onHover(null) : undefined,
    onFocus: () => io.onHover(id),
    onBlur: () => io.onHover(null),
    onClick: (e) => {
      e.stopPropagation();
      select();
    },
    onKeyDown: (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      e.preventDefault();
      e.stopPropagation();
      select();
    },
  };
}
