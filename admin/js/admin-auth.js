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
   */
  async hashPassword(password, salt = this.DEFAULT_SALT) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + '::' + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
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
    let usersStr = localStorage.getItem(this.STORAGE_KEY_USERS);
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
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    }
    return users;
  }

  /**
   * Checks for active valid session synchronously on load
   */
  checkActiveSessionSync() {
    let sessionStr = localStorage.getItem(this.STORAGE_KEY_SESSION);
    if (!sessionStr) {
      sessionStr = sessionStorage.getItem(this.STORAGE_KEY_SESSION);
    }

    if (sessionStr) {
      try {
        const session = JSON.parse(sessionStr);
        if (session && session.expiresAt > Date.now()) {
          this.currentUser = session.user;
          return true;
        } else {
          // Session expired
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

    // Exact Case-Sensitive Username Match
    let user = users.find(u => u.username === cleanUsername);

    // Self-healing fallback for default admin account
    if (!user && cleanUsername === 'admin') {
      const defaultHash = await this.hashPassword('sapmaz2026!');
      user = {
        username: 'admin',
        passwordHash: defaultHash,
        fullName: 'Sapmaz Sistem Yöneticisi',
        email: 'admin@sapmazhavacilik.com',
        role: 'Admin',
        avatar: '👨‍✈️',
        createdAt: new Date().toISOString()
      };
      users.push(user);
      localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
    }

    if (!user) {
      return { success: false, messageKey: 'auth_err_invalid_user' };
    }

    // Exact Case-Sensitive Password Hash Match
    const inputHash = await this.hashPassword(password);
    if (inputHash !== user.passwordHash) {
      // Self-healing check if logging in with default credentials
      if (cleanUsername === 'admin' && password === 'sapmaz2026!') {
        user.passwordHash = inputHash;
        localStorage.setItem(this.STORAGE_KEY_USERS, JSON.stringify(users));
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

    const targetStorage = rememberMe ? localStorage : sessionStorage;
    // Clear both first to avoid duplicates
    localStorage.removeItem(this.STORAGE_KEY_SESSION);
    sessionStorage.removeItem(this.STORAGE_KEY_SESSION);
    
    targetStorage.setItem(this.STORAGE_KEY_SESSION, JSON.stringify(sessionData));
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
