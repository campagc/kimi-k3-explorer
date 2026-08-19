import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getComponent } from '../data/registry';

const GAP = 14;

// The tooltip owns cursor geometry: position is tracked here and applied to the
// DOM node directly, so mouse movement never re-renders the app.
//
// Hotspots are also focusable, so the anchor depends on how the hover started:
// the cursor for pointer users, the focused element's box for keyboard users.
export default function Tooltip({ hoveredId }) {
  const info = getComponent(hoveredId);
  const ref = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pointerDriven = useRef(false);

  const place = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    let anchorX = mouse.current.x;
    let anchorY = mouse.current.y;
    let anchorBottom = anchorY;

    if (!pointerDriven.current) {
      const active = document.activeElement;
      const box = active?.getBoundingClientRect?.();
      if (!box || (box.width === 0 && box.height === 0)) return;
      anchorX = box.left;
      anchorY = box.top;
      anchorBottom = box.bottom;
    }

    const { offsetWidth: w, offsetHeight: h } = el;
    const maxX = window.innerWidth - w - 8;
    const below = anchorBottom + GAP;
    const fitsBelow = below + h <= window.innerHeight - 8;

    el.style.left = `${Math.max(8, Math.min(anchorX + (pointerDriven.current ? GAP : 0), maxX))}px`;
    el.style.top = `${fitsBelow ? below : Math.max(8, anchorY - h - GAP)}px`;
  }, []);

  useEffect(() => {
    const onMove = (e) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      pointerDriven.current = true;
      place();
    };
    const onKey = (e) => {
      if (e.key === 'Tab') pointerDriven.current = false;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('keydown', onKey);
    };
  }, [place]);

  useLayoutEffect(place, [hoveredId, place]);

  if (!info) return null;
  return (
    <div className="tooltip" role="tooltip" ref={ref}>
      <p className="tooltip-name">{info.name}</p>
      <p className="tooltip-body">{info.short}</p>
      <p className="tooltip-hint">Click for the deep dive</p>
    </div>
  );
}
