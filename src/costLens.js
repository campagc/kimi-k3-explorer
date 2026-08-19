// The cost lens: owns the vocabulary that maps a component's cost level
// (from its registry record) to hotspot highlight classes, chip classes,
// and labels. App.css holds the matching .cost-N / .cost-chip-N rules —
// this module is the single place that names them.

export const COST_LABELS = ['Negligible', 'Low', 'Moderate', 'Heavy'];

// Hotspot highlight under the lens; null level = component sits the lens out.
export function lensClassFor(level) {
  return level != null ? `cost cost-${level}` : 'cost-dim';
}

// Chip styling for the legend and the detail panel.
export function chipClassFor(level) {
  return `cost-chip-${level}`;
}

export const LENS_LEGEND = COST_LABELS.map((label, level) => ({
  label,
  className: chipClassFor(level),
}));
