import { useEffect, useRef } from 'react';
import { getComponent, TOUR_ORDER } from '../data/registry';
import { COST_LABELS, chipClassFor } from '../costLens';

// Whatever opened the panel gets focus back when it closes, so Esc from inside
// the panel returns you to the hotspot you came from instead of dumping focus
// on <body> (or, on the mobile drawer, inside a hidden element).
function useReturnFocus(open) {
  const opener = useRef(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open && !wasOpen.current) {
      opener.current = document.activeElement;
    } else if (!open && wasOpen.current) {
      const el = opener.current;
      opener.current = null;
      if (el?.isConnected) el.focus?.();
    }
    wasOpen.current = open;
  }, [open]);
}

const EMPTY_STATE = (
  <div className="detail-empty">
    <svg viewBox="0 0 48 48" width="40" height="40" aria-hidden="true">
      <rect x="6" y="8" width="22" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <rect x="6" y="26" width="22" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M17 18v8" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M32 13h9M32 31h9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="41" cy="22" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
    <p className="detail-empty-title">No Component Selected</p>
    <p className="detail-empty-body">
      Pick any box, circle, or label in the diagram to read what it does, why it’s there, and what
      it costs. Or take the guided tour.
    </p>
  </div>
);

export default function DetailPanel({
  selectedId, onClose, onSelect, tourActive, tourIndex, onTourStep, onTourExit, level,
}) {
  const info = getComponent(selectedId);
  const related = info?.related ?? [];
  const formula = info?.formula ?? null;
  const levelText = info?.[level] ?? null;
  const alternative = info?.alternative ?? null;
  const cost = info?.cost ?? null;

  useReturnFocus(Boolean(info));

  return (
    <aside
      className="detail-panel"
      data-open={info ? 'true' : 'false'}
      aria-label="Component details"
    >
      {info ? (
        <>
          <div className="detail-head">
            {tourActive ? (
              <div className="tour-bar">
                <span className="tour-progress" aria-live="polite">
                  Tour · Step {tourIndex + 1} of {TOUR_ORDER.length}
                </span>
                <div className="tour-buttons">
                  <button
                    type="button" className="btn btn-ghost btn-sm"
                    disabled={tourIndex === 0} onClick={() => onTourStep(-1)}
                  >
                    ← Prev
                  </button>
                  <button
                    type="button" className="btn btn-ghost btn-sm"
                    disabled={tourIndex === TOUR_ORDER.length - 1} onClick={() => onTourStep(1)}
                  >
                    Next →
                  </button>
                  <button type="button" className="btn btn-ghost btn-sm tour-exit" onClick={onTourExit}>
                    Exit
                  </button>
                </div>
              </div>
            ) : null}

            <div className="detail-title-row">
              <h2>{info.name}</h2>
              <button type="button" className="close-btn" onClick={onClose} aria-label="Close details">
                <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
                  <path
                    d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor"
                    strokeWidth="1.8" strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <p className="detail-short">{info.short}</p>
          </div>

          {cost ? (
            <div className="cost-row">
              <span className={`cost-chip ${chipClassFor(cost.level)}`}>
                {COST_LABELS[cost.level]} cost
              </span>
              <span className="cost-note">{cost.note}</span>
            </div>
          ) : null}

          {level === 'undergrad' ? (
            <>
              <section>
                <h3>What It Is</h3>
                <p>{info.what}</p>
              </section>
              {formula ? (
                <section>
                  <h3>Key Formula</h3>
                  <div className="formula" translate="no">{formula}</div>
                </section>
              ) : null}
              <section>
                <h3>Why It’s Here</h3>
                <p>{info.why}</p>
              </section>
              <section>
                <h3>Intuition</h3>
                <p>{info.intuition}</p>
              </section>
            </>
          ) : null}

          {level === 'eli5' ? (
            <section>
              <h3>Explain Like I’m 12</h3>
              <p>{levelText ?? info.what}</p>
            </section>
          ) : null}

          {level === 'paper' ? (
            <>
              <section>
                <h3>Technical View</h3>
                <p>{levelText ?? info.what}</p>
              </section>
              {formula ? (
                <section>
                  <h3>Key Formula</h3>
                  <div className="formula" translate="no">{formula}</div>
                </section>
              ) : null}
            </>
          ) : null}

          {alternative ? (
            <section>
              <h3>Why Not the Alternative?</h3>
              <p className="alt-title">{alternative.title}</p>
              <p>{alternative.text}</p>
            </section>
          ) : null}

          {related.length > 0 ? (
            <section>
              <h3>Related Components</h3>
              <div className="related-links">
                {related.map((id) => (
                  <button type="button" key={id} className="related-link" onClick={() => onSelect(id)}>
                    {getComponent(id)?.name ?? id}
                  </button>
                ))}
              </div>
            </section>
          ) : null}
        </>
      ) : EMPTY_STATE}
    </aside>
  );
}
