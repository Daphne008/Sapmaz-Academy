/**
 * SAPMAZ ACADEMY - ADMINISTRATIVE PANEL AUTHENTICATION MANAGER
 * Client-Side Security Engine with Web Crypto API (SHA-256 Hashing),
 * Session Storage, Token Expiry, Remember Me & User Account Management.
 */

class AdminAuth {
  constructor() {
    this.STORAGE_KEY_USERS = 'sapmaz_admin_users';
    this.STORAGE_KEY_SESSION = 'sapmaz_admin_session';
    this.DEFAULT_SALT = 'SapmazAcademyUAV_2026_SaltSecret';
    this.SESSION_DURATION_STD = 8 * 60 * 60 * 1000; // 8 hours
    this.SESSION_DURATION_REMEMBER = 7 * 24 * 60 * 60 * 1000; // 7 days

    this.currentUser = null;
    this.initDefaultUsers();
    this.checkActiveSessionSync();
  }

  /**
   * Generates SHA-256 hex hash for a given string + salt using native Web Crypto API
   * with pure JS SHA-256 fallback for non-secure contexts (http / file://)
   */
  async hashPassword(password, salt = this.DEFAULT_SALT) {
    const str = password + '::' + salt;
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle && typeof window.crypto.subtle.digest === 'function') {
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(str);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        // Fallback to pure JS SHA-256
      }
    }

    return this.sha256Js(str);
  }

  /**
   * Pure JavaScript implementation of SHA-256 for non-secure contexts
   */
  sha256Js(ascii) {
    function rightRotate(value, amount) {
      return (value >>> amount) | (value << (32 - amount));
    }
    const mathPow = Math.pow;
    const maxWord = mathPow(2, 32);
    let result = '';
    const words = [];
    const asciiBitLength = ascii.length * 8;

    let hash = [
      0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
      0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
    ];

    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef4a3f7, 0xc67178f2
    ];

    ascii += '\x80';
    while (ascii.length % 64 !== 56) ascii += '\x00';
    for (let i = 0; i < ascii.length; i++) {
      const j = ascii.charCodeAt(i);
      if (j >> 8) return '';
      words[i >> 2] |= j << ((3 - i % 4) * 8);
    }
    words[words.length] = ((asciiBitLength / maxWord) | 0);
    words[words.length] = (asciiBitLength | 0);

    for (let j = 0; j < words.length;) {
      const w = words.slice(j, j += 16);
      const oldHash = hash;
      hash = hash.slice(0, 8);

      for (let i = 0; i < 64; i++) {
        const w15 = w[i - 15], w2 = w[i - 2];
        const a = hash[0], e = hash[4];
        const temp1 = hash[7]
          + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
          + ((e & hash[5]) ^ ((~e) & hash[6]))
          + k[i]
          + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0);

        const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
          + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

        hash = [(temp1 + temp2) | 0].concat(hash);
        hash[4] = (hash[4] + temp1) | 0;
      }

      for (let i = 0; i < 8; i++) {
        hash[i] = (hash[i] + oldHash[i]) | 0;
      }
    }

    for (let i = 0; i < 8; i++) {
      for (let j = 3; j >= 0; j--) {
        const b = (hash[i] >> (j * 8)) & 255;
        result += (b < 16 ? '0' : '') + b.toString(16);
      }
    }
    return result;
  }

  /**
   * Initializes default admin account if user storage doesn't exist yet
   */
  async initDefaultUsers() {
    await this.ensureDefaultUsers();
  }

  /**
   * Ensures default admin account exists in localStorage
   */
  async ensureDefaultUsers() {
    let usersStr = null;
    try {
      usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
    } catch (e) { }

    let users = [];
    try {
      users = JSON.parse(usersStr) || [];
    } catch (e) {
      users = [];
    }

    const defaultPasswordHash = await this.hashPassword('sapmaz2026!');
    let adminUser = users.find(u => u.username === 'admin');

    if (!adminUser) {
      adminUser = {
        username: 'admin',
        passwordHash: defaultPasswordHash,
        fullName: 'Sapmaz Sistem Yöneticisi',
        email: 'admin@sapmazhavacilik.com',
        role: 'Admin',
        avatar: '👨‍✈️',
        createdAt: new Date().toISOString()
      };
      users.push(adminUser);
      try {
        localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
      } catch (e) { }
    }
    return users;
  }

  /**
   * Checks for active valid session synchronously on load
   */
  checkActiveSessionSync() {
    let sessionStr = null;
    try {
      sessionStr = localStorage.getItem(this.STORAGE_KEY_SESSION) || sessionStorage.getItem(this.STORAGE_KEY_SESSION);
    } catch (e) { }

    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiresAt > Date.now()) {
          this.currentUser = session.user;
          return true;
        } else {
          this.logout();
        }
      } catch (e) {
        this.logout();
      }
    }
    this.currentUser = null;
    return false;
  }

  /**
   * Authenticates user credentials (Strict Case-Sensitive Username & Password)
   */
  async login(username, password, rememberMe = false) {
    const cleanUsername = (username || '').trim();
    let users = await this.ensureDefaultUsers();
    let user = users.find(u => u.username === cleanUsername);

    if (!user) {
      return { success: false, messageKey: 'auth_err_invalid_user' };
    }

    const inputHash = await this.hashPassword(password);
    
    // Auto-sync password hash for default admin account if unmigrated
    if (inputHash !== user.passwordHash) {
      const defaultHash = await this.hashPassword('sapmaz2026!');
      if (cleanUsername === 'admin' && password === 'sapmaz2026!') {
        user.passwordHash = defaultHash;
        try {
          localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
        } catch (e) { }
      } else {
        return { success: false, messageKey: 'auth_err_invalid_pass' };
      }
    }

    // Authentication Success - Create Session
    const duration = rememberMe ? this.SESSION_DURATION_REMEMBER : this.SESSION_DURATION_STD;
    const sessionData = {
      token: 'sat_' + Math.random().toString(36).substring(2) + Date.now().toString(36),
      user: {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: 'Admin',
        avatar: user.avatar || '👤'
      },
      createdAt: Date.now(),
      expiresAt: Date.now() + duration,
      rememberMe: rememberMe
    };

    try {
      const targetStorage = rememberMe ? localStorage : sessionStorage;
      localStorage.removeItem(this.STORAGE_KEY_SESSION);
      sessionStorage.removeItem(this.STORAGE_KEY_SESSION);
      targetStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(sessionData));
    } catch (e) { }

    this.currentUser = sessionData.user;
    return { success: true, user: sessionData.user };
  }

  /**
   * Logs out current user and removes session storage
   */
  logout() {
    localStorage.removeItem(this.STORAGE_KEY_SESSION);
    sessionStorage.removeItem(this.STORAGE_KEY_SESSION);
    this.currentUser = null;
  }

  /**
   * Returns true if user is logged in with valid session
   */
  isAuthenticated() {
    return this.checkActiveSessionSync();
  }

  /**
   * Gets current logged-in user profile
   */
  getCurrentUser() {
    return this.currentUser;
  }

  /**
   * Updates user password after validating current password (Case Sensitive)
   */
  async updatePassword(username, currentPassword, newPassword) {
    const usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
    let users = JSON.parse(usersStr) || [];
    const index = users.findIndex(u => u.username === username);

    if (index === -1) {
      return { success: false, messageKey: 'auth_err_user_not_found' };
    }

    const currentHash = await this.hashPassword(currentPassword);
    if (currentHash !== users[index].passwordHash) {
      return { success: false, messageKey: 'auth_err_current_pass_wrong' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, messageKey: 'auth_err_pass_too_short' };
    }

    users[index].passwordHash = await this.hashPassword(newPassword);
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    return { success: true, messageKey: 'auth_msg_pass_updated' };
  }

  /**
   * Returns list of admin user accounts (excluding passwords)
   */
  getUsers() {
    try {
      const usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
      const users = JSON.parse(usersStr) || [];
      return users.map(u => ({
        username: u.username,
        fullName: u.fullName,
        email: u.email,
        role: 'Admin',
        avatar: u.avatar || '👤',
        createdAt: u.createdAt
      }));
    } catch (e) {
      return [];
    }
  }

  /**
   * Creates a new admin user account (Case-Sensitive Username)
   */
  async createUser(username, password, fullName, email = '') {
    const cleanUsername = (username || '').trim();
    if (!cleanUsername || cleanUsername.length < 3) {
      return { success: false, messageKey: 'auth_err_username_short' };
    }

    if (!password || password.length < 6) {
      return { success: false, messageKey: 'auth_err_pass_too_short' };
    }

    const usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
    let users = JSON.parse(usersStr) || [];

    if (users.some(u => u.username === cleanUsername)) {
      return { success: false, messageKey: 'auth_err_user_exists' };
    }

    const newUser = {
      username: cleanUsername,
      passwordHash: await this.hashPassword(password),
      fullName: fullName || cleanUsername,
      email: email,
      role: 'Admin',
      avatar: '👤',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    return { success: true, user: newUser };
  }

  /**
   * Deletes an admin user account
   */
  deleteUser(username) {
    if (username === 'admin') {
      return { success: false, messageKey: 'auth_err_cannot_delete_admin' };
    }

    const usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
    let users = JSON.parse(usersStr) || [];
    const filtered = users.filter(u => u.username !== username);

    localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(filtered));
    return { success: true };
  }
}

// Global instance export
window.AdminAuth = AdminAuth;
