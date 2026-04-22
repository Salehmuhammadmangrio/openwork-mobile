// Lightweight in-app toast system (no external deps).
let toastHandler = null;

export const registerToastHandler = (handler) => {
  toastHandler = handler;
};

export const showToast = ({ type = 'info', message, duration = 2600 }) => {
  if (!message) return;
  if (toastHandler) {
    toastHandler({ type, message, duration, id: Date.now() + Math.random() });
  }
};

export const toast = {
  success: (message, opts) => showToast({ type: 'success', message, ...(opts || {}) }),
  error: (message, opts) => showToast({ type: 'error', message, ...(opts || {}) }),
  info: (message, opts) => showToast({ type: 'info', message, ...(opts || {}) }),
  warn: (message, opts) => showToast({ type: 'warn', message, ...(opts || {}) }),
};
