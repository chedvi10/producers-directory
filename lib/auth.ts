export function isAuthenticated() {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('producerId');
}

export function getProducerId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('producerId');
}

export function setAuth(producerId: string) {
  localStorage.setItem('producerId', producerId);
}

export function clearAuth() {
  localStorage.removeItem('producerId');
}
