// DevLog storage helper
export const Storage = {
  get(key) {
    try {
      const val = localStorage.getItem(`DevLog_${key}`);
      if (val !== null) return JSON.parse(val);
      const legacy = localStorage.getItem(`BlogCraft_${key}`);
      return legacy ? JSON.parse(legacy) : null;
    } catch {
      return null;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(`DevLog_${key}`, JSON.stringify(val));
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },
  remove(key) {
    localStorage.removeItem(`DevLog_${key}`);
    localStorage.removeItem(`BlogCraft_${key}`);
  },

  getUser() {
    return this.get('user');
  },
  setUser(u) {
    this.set('user', u);
  },
  clearUser() {
    this.remove('user');
  },

  getContent() {
    return this.get('content') || [];
  },
  setContent(c) {
    this.set('content', c);
  },

  getToken() {
    return localStorage.getItem('devlogToken') || localStorage.getItem('blogcraftToken') || '';
  },
  setToken(token) {
    localStorage.setItem('devlogToken', token);
    localStorage.setItem('blogcraftToken', token);
  },
  clearToken() {
    localStorage.removeItem('devlogToken');
    localStorage.removeItem('blogcraftToken');
  }
};

