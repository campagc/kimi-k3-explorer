import { useMemo, useReducer } from 'react';
import { initialPlayback, playbackReducer, currentId } from '../playback.js';

// React adapter for the playback core in ../playback.
// modes: { [name]: { order: string[] } } — pass a stable (module-level) object.
export function usePlayback(modes) {
  const [state, dispatch] = useReducer((s, a) => playbackReducer(modes, s, a), initialPlayback);

  return useMemo(() => ({
    ...state,
    active: state.mode != null,
    current: currentId(modes, state),
    start: (mode) => dispatch({ type: 'start', mode }),
    stop: () => dispatch({ type: 'stop' }),
    step: (dir) => dispatch({ type: 'step', dir }),
  }), [modes, state]);
}
