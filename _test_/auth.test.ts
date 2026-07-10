import { isAuthenticated, getAuthToken, setAuthToken, clearAuth } from '@/lib/auth';

describe('Auth Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('מחזיר false כשאין token', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('מחזיר true כשיש token', () => {
      localStorage.setItem('authToken', 'abc');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getAuthToken', () => {
    it('מחזיר null כשאין token', () => {
      expect(getAuthToken()).toBeNull();
    });

    it('מחזיר את ה-token כשקיים', () => {
      localStorage.setItem('authToken', 'abc');
      expect(getAuthToken()).toBe('abc');
    });
  });

  describe('setAuthToken', () => {
    it('שומר token ב-localStorage', () => {
      setAuthToken('xyz');
      expect(localStorage.getItem('authToken')).toBe('xyz');
    });
  });

  describe('clearAuth', () => {
    it('מוחק את ה-token מ-localStorage', () => {
      localStorage.setItem('authToken', 'xyz');
      clearAuth();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });
});
