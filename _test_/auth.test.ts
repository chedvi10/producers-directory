import { isAuthenticated, getProducerId, setAuth, clearAuth } from '@/lib/auth';

describe('Auth Functions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('isAuthenticated', () => {
    it('מחזיר false כשאין producerId', () => {
      expect(isAuthenticated()).toBe(false);
    });

    it('מחזיר true כשיש producerId', () => {
      localStorage.setItem('producerId', '123');
      expect(isAuthenticated()).toBe(true);
    });
  });

  describe('getProducerId', () => {
    it('מחזיר null כשאין producerId', () => {
      expect(getProducerId()).toBeNull();
    });

    it('מחזיר את ה-producerId כשקיים', () => {
      localStorage.setItem('producerId', '123');
      expect(getProducerId()).toBe('123');
    });
  });

  describe('setAuth', () => {
    it('שומר producerId ב-localStorage', () => {
      setAuth('456');
      expect(localStorage.getItem('producerId')).toBe('456');
    });
  });

  describe('clearAuth', () => {
    it('מוחק את ה-producerId מ-localStorage', () => {
      localStorage.setItem('producerId', '789');
      clearAuth();
      expect(localStorage.getItem('producerId')).toBeNull();
    });
  });
});
