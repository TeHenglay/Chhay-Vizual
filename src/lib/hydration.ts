// True once the first client render has committed. Media mounted before that came
// from prerendered HTML and is already on screen, so it must not fade in again.
let hydrated = false;

export const isHydrated = () => hydrated;

export function markHydrated() {
  hydrated = true;
}
