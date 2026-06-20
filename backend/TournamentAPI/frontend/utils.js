// utils.js – helper functions for API calls and auth
export async function api(path, method = 'GET', body = null) {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  if (body) opts.body = JSON.stringify(body);
  const resp = await fetch(path, opts);
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`${resp.status}: ${err}`);
  }
  return resp.json();
}

export function getUserId() {
  return localStorage.getItem('userId');
}

export function setUserId(id) {
  localStorage.setItem('userId', id);
}

export function requireAuth() {
  if (!getUserId()) location.href = 'index.html';
}

export function showToast(message, isError = false) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.background = isError ? 'rgba(200,0,0,0.8)' : 'rgba(0,0,0,0.8)';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// New helper to read query parameters
export function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// Logout helper – clears userId and redirects to login page
export function logout() {
  localStorage.removeItem('userId');
  location.href = 'index.html';
}
