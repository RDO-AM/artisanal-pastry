/**
 * Artisanal Pastry - Advanced Client-Side Security & Threat Protection Layer
 * Protects against XSS, Brute-Force, Parameter Tampering, Data Poisoning & Unauthorized Role Escalation.
 */

(function() {
  'use strict';

  class SecurityManager {
    constructor() {
      this.RATE_LIMIT_STORAGE = 'artisanal_security_rate_limits';
      this.FAILED_ATTEMPTS_LIMIT = 5;
      this.LOCKOUT_SECONDS = 60;
    }

    /**
     * 1. XSS Sanitization: Escapes dangerous HTML entities and script tags
     */
    sanitize(input) {
      if (typeof input !== 'string') return input;
      const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        '`': '&#x60;'
      };
      // Strip javascript: URLs, event handler attributes (onload, onerror, etc.)
      let cleaned = input.replace(/[&<>"'/`]/g, m => map[m]);
      cleaned = cleaned.replace(/javascript:/gi, 'blocked:');
      cleaned = cleaned.replace(/data:/gi, 'blocked:');
      cleaned = cleaned.replace(/vbscript:/gi, 'blocked:');
      cleaned = cleaned.replace(/on\w+=/gi, 'blocked_attr=');
      return cleaned.trim();
    }

    /**
     * Safe HTML builder: sanitizes dynamic string parameters
     */
    escapeHtml(strings, ...values) {
      return strings.reduce((result, str, i) => {
        const val = values[i - 1];
        const safeVal = typeof val === 'string' ? this.sanitize(val) : (val !== undefined && val !== null ? val : '');
        return result + safeVal + str;
      });
    }

    /**
     * 2. Brute-Force Rate Limiter: Blocks repeated login guessing attacks
     */
    checkRateLimit(actionKey = 'login') {
      try {
        const limits = JSON.parse(sessionStorage.getItem(this.RATE_LIMIT_STORAGE)) || {};
        const now = Date.now();
        const record = limits[actionKey] || { attempts: 0, lockoutUntil: 0 };

        if (record.lockoutUntil > now) {
          const remainingSecs = Math.ceil((record.lockoutUntil - now) / 1000);
          return {
            allowed: false,
            remainingSeconds: remainingSecs,
            message: `دسترسی موقتاً مسدود است. لطفاً ${remainingSecs} ثانیه دیگر مجدداً تلاش فرمایید.`
          };
        }

        return { allowed: true, attempts: record.attempts };
      } catch {
        return { allowed: true, attempts: 0 };
      }
    }

    recordFailedAttempt(actionKey = 'login') {
      try {
        const limits = JSON.parse(sessionStorage.getItem(this.RATE_LIMIT_STORAGE)) || {};
        const now = Date.now();
        const record = limits[actionKey] || { attempts: 0, lockoutUntil: 0 };

        record.attempts += 1;
        if (record.attempts >= this.FAILED_ATTEMPTS_LIMIT) {
          record.lockoutUntil = now + (this.LOCKOUT_SECONDS * 1000);
          record.attempts = 0; // reset counter after locking
        }

        limits[actionKey] = record;
        sessionStorage.setItem(this.RATE_LIMIT_STORAGE, JSON.stringify(limits));

        if (record.lockoutUntil > now) {
          return {
            locked: true,
            remainingSeconds: this.LOCKOUT_SECONDS,
            message: `به دلیل ۵ تلاش ناموفق پیاپی، سیستم به مدت ${this.LOCKOUT_SECONDS} ثانیه مسدود گردید.`
          };
        }
        return { locked: false, remainingAttempts: this.FAILED_ATTEMPTS_LIMIT - record.attempts };
      } catch {
        return { locked: false, remainingAttempts: 3 };
      }
    }

    resetRateLimit(actionKey = 'login') {
      try {
        const limits = JSON.parse(sessionStorage.getItem(this.RATE_LIMIT_STORAGE)) || {};
        delete limits[actionKey];
        sessionStorage.setItem(this.RATE_LIMIT_STORAGE, JSON.stringify(limits));
      } catch {}
    }

    /**
     * 3. Input Validation Hardening
     */
    isValidIranianPhone(phone) {
      if (!phone) return false;
      const clean = phone.replace(/[\s\-\(\)]/g, '');
      // Accepts 09XXXXXXXXX or +989XXXXXXXXX or 9XXXXXXXXX
      const re = /^(?:0|\+98)?9\d{9}$/;
      return re.test(clean);
    }

    validatePositiveNumber(num, defaultVal = 1, min = 1, max = 999) {
      const parsed = parseInt(num, 10);
      if (isNaN(parsed) || !isFinite(parsed)) return defaultVal;
      return Math.min(Math.max(parsed, min), max);
    }

    validatePrice(price) {
      const parsed = Number(price);
      if (isNaN(parsed) || !isFinite(parsed) || parsed < 0) return 0;
      return Math.round(parsed);
    }

    /**
     * 4. Session & Privilege Guard
     */
    isAuthorizedRole(requiredRole = 'admin') {
      try {
        const isAuth = sessionStorage.getItem('artisanal_pastry_admin_auth') === 'true';
        if (!isAuth) return false;

        const curUser = JSON.parse(localStorage.getItem('artisanal_pastry_current_user'));
        if (!curUser || !curUser.role) return false;

        if (requiredRole === 'ceo') {
          return curUser.role === 'ceo';
        }
        return curUser.role === 'admin' || curUser.role === 'ceo';
      } catch {
        return false;
      }
    }
  }

  // Global instance
  window.pastrySecurity = new SecurityManager();
})();
