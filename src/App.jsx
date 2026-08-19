import { useState, useCallback, useEffect, useMemo } from 'react';
import MainDiagram from './components/MainDiagram';
import { MlaDiagram, KdaDiagram, RatioPanel } from './components/Insets';
import DetailPanel from './components/DetailPanel';
import Tooltip from './components/Tooltip';
import { TOUR_ORDER } from './data/registry';
import { LENS_LEGEND } from './costLens';
import { usePlayback } from './hooks/usePlayback';
import './App.css';

const PLAYBACK_MODES = {
  tour: { order: TOUR_ORDER },
};

const LEVELS = [
  ['eli5', 'ELI5'],
  ['undergrad', 'Undergrad'],
  ['paper', 'Paper'],
];

// Arrow keys belong to the focused control (the segmented radio group) before
// they belong to the tour.
function ownsArrowKeys(target) {
  const tag = target?.tagName;
  return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA';
}

export default function App() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [level, setLevel] = useState('undergrad');
  const [lensOn, setLensOn] = useState(false);
  const playback = usePlayback(PLAYBACK_MODES);
  const { mode, current, index, start, stop, step } = playback;
  const tourActive = mode === 'tour';

  const onHover = useCallback((id) => setHoveredId(id), []);

  // A null id means "deselect" — clicking diagram background, Esc, or Close.
  // Deselecting also leaves the tour, so the two can't disagree.
  const onSelect = useCallback((id) => {
    setSelectedId(id);
    if (id === null) stop();
  }, [stop]);

  const closePanel = useCallback(() => onSelect(null), [onSelect]);

  const startTour = useCallback(() => {
    start('tour');
    setSelectedId(TOUR_ORDER[0]);
  }, [start]);

  const toggleLens = useCallback(() => setLensOn((v) => !v), []);

  // Playback drives the detail panel as it advances.
  useEffect(() => {
    if (current) setSelectedId(current);
  }, [current]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        stop();
        setSelectedId(null);
        return;
      }
      if (!tourActive || ownsArrowKeys(e.target)) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [tourActive, stop, step]);

  const io = useMemo(() => ({
    hoveredId,
    selectedId,
    onHover,
    onSelect,
    lensOn,
  }), [hoveredId, selectedId, onHover, onSelect, lensOn]);

  return (
    <div className={`app ${lensOn ? 'lens-on' : ''}`}>
      <a className="skip-link" href="#diagram">Skip to Diagram</a>

      <header className="app-header">
        <h1>
          Kimi&nbsp;K3 <span className="param-count" translate="no">2.8T</span>
        </h1>
        <p className="tagline">Interactive Architecture Explorer</p>
        <p className="shortcuts">
          <kbd>Hover</kbd> a component for a summary
          <span className="dot" aria-hidden="true" />
          <kbd>Click</kbd> or <kbd>Enter</kbd> for the deep dive
          <span className="dot" aria-hidden="true" />
          <kbd>Tab</kbd> to walk the diagram
          <span className="dot" aria-hidden="true" />
          <kbd>Esc</kbd> to close
        </p>
      </header>

      <div className="toolbar">
        <fieldset className="segmented">
          <legend className="sr-only">Explanation depth</legend>
          {LEVELS.map(([key, label]) => (
            <label className="segment" key={key}>
              <input
                type="radio"
                name="level"
                value={key}
                checked={level === key}
                onChange={() => setLevel(key)}
              />
              <span>{label}</span>
            </label>
          ))}
        </fieldset>

        <button
          type="button"
          className={`btn btn-secondary ${lensOn ? 'active' : ''}`}
          onClick={toggleLens}
          aria-pressed={lensOn}
        >
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" className="btn-icon">
            <circle cx="8" cy="8" r="6.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
            <path d="M8 1.6a6.4 6.4 0 0 1 0 12.8Z" fill="currentColor" />
          </svg>
          Cost Lens
        </button>

        <span className="toolbar-divider" aria-hidden="true" />

        <button type="button" className="btn btn-primary" onClick={startTour}>
          <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true" className="btn-icon">
            <path d="M4 2.6 13 8l-9 5.4Z" fill="currentColor" />
          </svg>
          Guided Tour
        </button>
      </div>

      <main className="layout" id="diagram">
        <div className="column column-main">
          <MainDiagram io={io} />
        </div>

        <div className="column column-insets">
          <section className="inset-card">
            <h2 className="inset-title">Gated Multi-head Latent Attention</h2>
            <p className="inset-sub">
              Full attention with a compressed KV cache — used every 4th layer
            </p>
            <MlaDiagram io={io} />
          </section>

          <section className="inset-card">
            <h2 className="inset-title">Kimi Delta Attention</h2>
            <p className="inset-sub">
              Linear-time attention with a fixed-size, gated memory — used in 3 of every 4 layers
            </p>
            <KdaDiagram io={io} />
          </section>

          <RatioPanel io={io} />
        </div>

        <DetailPanel
          selectedId={selectedId}
          onClose={closePanel}
          onSelect={onSelect}
          tourActive={tourActive}
          tourIndex={index}
          onTourStep={step}
          onTourExit={stop}
          level={level}
        />
      </main>

      <button
        type="button"
        className="panel-backdrop"
        data-open={selectedId ? 'true' : 'false'}
        tabIndex={-1}
        aria-label="Close details"
        onClick={closePanel}
      />

      {lensOn ? (
        <aside className="lens-legend" aria-label="Cost lens legend">
          <p className="lens-legend-title">Cost Lens</p>
          <p className="lens-legend-sub">Per-token compute &amp; memory</p>
          <div className="lens-legend-row">
            {LENS_LEGEND.map(({ label, className }) => (
              <span key={label} className={`cost-chip ${className}`}>{label}</span>
            ))}
          </div>
        </aside>
      ) : null}

      <Tooltip hoveredId={hoveredId} />

      <footer className="app-footer">
        Diagram based on Sebastian Raschka’s Kimi&nbsp;K3 architecture figure.
      </footer>
    </div>
  );
}
