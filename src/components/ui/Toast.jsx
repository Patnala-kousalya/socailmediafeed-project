import { useEffect } from 'react';

export default function Toast({ toasts, onRemove }) {
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => {
        onRemove(toast.id);
      }, 4000),
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts, onRemove]);

  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-container" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`} role="status">
          <span>{toast.message}</span>
          <button type="button" onClick={() => onRemove(toast.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
