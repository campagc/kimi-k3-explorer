// A playback walks an ordered list of ids, stepped manually (guided tour).
// Only one mode can be active at a time.
//
// Pure core, no React imports: this reducer is the test surface.

export const initialPlayback = { mode: null, index: 0 };

export function playbackReducer(modes, state, action) {
  const mode = modes[state.mode];
  switch (action.type) {
    case 'start':
      return { mode: action.mode, index: 0 };
    case 'stop':
      return initialPlayback;
    case 'step': {
      if (!mode) return state;
      const last = mode.order.length - 1;
      return { ...state, index: Math.min(Math.max(state.index + action.dir, 0), last) };
    }
    default:
      return state;
  }
}

export function currentId(modes, state) {
  return state.mode ? modes[state.mode].order[state.index] : null;
}
