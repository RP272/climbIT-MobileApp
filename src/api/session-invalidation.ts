type SessionInvalidationListener = () => void;

const listeners = new Set<SessionInvalidationListener>();

export function onSessionInvalidated(listener: SessionInvalidationListener) {
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function notifySessionInvalidated() {
  for (const listener of listeners) {
    listener();
  }
}
