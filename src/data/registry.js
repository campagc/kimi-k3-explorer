// The component registry: one record per Kimi K3 architecture component,
// composed from the content maps in ./components and ./enrichment.
// Those maps are internal to this module — consumers use getComponent(id).
// TOUR_ORDER stays a plain list of ids, re-exported here so
// the registry is the single import site for component knowledge.

import { COMPONENTS, RELATED, FORMULAS, TOUR_ORDER } from './components.js';
import { LEVELS, ALTERNATIVES, COST } from './enrichment.js';

const records = Object.fromEntries(
  Object.entries(COMPONENTS).map(([id, c]) => [
    id,
    {
      id,
      name: c.name,
      short: c.short,
      what: c.what,
      why: c.why,
      intuition: c.intuition,
      eli5: LEVELS[id]?.eli5 ?? null,
      paper: LEVELS[id]?.paper ?? null,
      formula: FORMULAS[id] ?? null,
      alternative: ALTERNATIVES[id] ?? null,
      cost: COST[id] ?? null,
      related: RELATED[id] ?? [],
    },
  ]),
);

export function getComponent(id) {
  return records[id] ?? null;
}

export { TOUR_ORDER };

// Referential-integrity check: the interface is the test surface.
// Runs automatically in dev; returns the list of problems (empty = healthy).
export function validateRegistry() {
  const problems = [];
  for (const [id, r] of Object.entries(records)) {
    if (!r.eli5 || !r.paper) problems.push(`${id}: missing eli5/paper level text`);
    if (r.cost && (!Number.isInteger(r.cost.level) || r.cost.level < 0)) {
      problems.push(`${id}: cost level must be a non-negative integer`);
    }
    for (const target of r.related) {
      if (!records[target]) problems.push(`${id}: related target '${target}' has no record`);
    }
  }
  for (const id of TOUR_ORDER) {
    if (!records[id]) problems.push(`ordering references unknown id '${id}'`);
  }
  return problems;
}

if (import.meta.env?.DEV) {
  const problems = validateRegistry();
  if (problems.length) console.error('[registry] integrity problems:\n' + problems.join('\n'));
}
