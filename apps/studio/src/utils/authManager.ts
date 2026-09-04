/**
 * 🔐 Auth & Account Support Link Manager
 * Handles login, session state, and per-account donation links.
 */

export interface UserProfile {
  username: string;
  displayName: string;
  avatar: string;
  role: 'host' | 'admin';
  defaultDonationUrl: string;
}

export interface AccountDonationSettings {
  url: string;
  title: string;
  qrImageUrl?: string;
}

export const VALID_USERS: Record<string, { password: string; profile: UserProfile }> = {
  shayeb: {
    password: 'Aa10203040',
    profile: {
      username: 'shayeb',
      displayName: 'الشايب (Shayeb)',
      avatar: '/alshaib-streamer.jpg',
      role: 'host',
      defaultDonationUrl: 'https://tip.live/shayeb'
    }
  },
  ashley: {
    password: 'ash11223344',
    profile: {
      username: 'ashley',
      displayName: 'آشلي (Ashley)',
      avatar: '/hunter-character.png',
      role: 'host',
      defaultDonationUrl: 'https://tip.live/ashley'
    }
  },
  admin: {
    password: '11223344',
    profile: {
      username: 'admin',
      displayName: 'الإدارة (Admin)',
      avatar: '/alshaib-logo.png',
      role: 'admin',
      defaultDonationUrl: 'https://tip.live/admin'
    }
  }
};

const AUTH_STORAGE_KEY = 'aep_auth_user';
const DONATION_STORAGE_KEY = 'aep_donation_links';
const ACTIVE_DONATION_KEY = 'aep_active_donation_user';

export const authManager = {
  login(username: string, password: string): { success: boolean; error?: string; user?: UserProfile } {
    const cleanUser = username.trim().toLowerCase();
    const account = VALID_USERS[cleanUser];

    if (!account) {
      return { success: false, error: 'اسم المستخدم غير صحيح' };
    }

    if (account.password !== password.trim()) {
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, cleanUser);
      // Set active donation account to logged-in user if not set
      if (!localStorage.getItem(ACTIVE_DONATION_KEY)) {
        localStorage.setItem(ACTIVE_DONATION_KEY, cleanUser);
      }
      window.dispatchEvent(new Event('aep:auth-change'));
    }

    return { success: true, user: account.profile };
  },

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(new Event('aep:auth-change'));
    }
  },

  getCurrentUser(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (saved && VALID_USERS[saved]) {
      return VALID_USERS[saved].profile;
    }
    return null;
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  },

  // 💰 Donation link management per account
  getAllDonationSettings(): Record<string, AccountDonationSettings> {
    const defaults: Record<string, AccountDonationSettings> = {
      shayeb: {
        url: VALID_USERS.shayeb.profile.defaultDonationUrl,
        title: 'رابط دعم الشايب 💎'
      },
      ashley: {
        url: VALID_USERS.ashley.profile.defaultDonationUrl,
        title: 'رابط دعم آشلي 💎'
      },
      admin: {
        url: VALID_USERS.admin.profile.defaultDonationUrl,
        title: 'رابط دعم المنصة 💎'
      }
    };

    if (typeof window === 'undefined') return defaults;

    try {
      const saved = localStorage.getItem(DONATION_STORAGE_KEY);
      if (saved) {
        return { ...defaults, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Error reading donation settings:', e);
    }
    return defaults;
  },

  getDonationForUser(username: string): AccountDonationSettings {
    const all = this.getAllDonationSettings();
    return all[username] || {
      url: VALID_USERS[username]?.profile?.defaultDonationUrl || 'https://tip.live',
      title: `رابط دعم ${username} 💎`
    };
  },

  saveDonationForUser(username: string, settings: AccountDonationSettings) {
    if (typeof window === 'undefined') return;
    const all = this.getAllDonationSettings();
    all[username] = settings;
    localStorage.setItem(DONATION_STORAGE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('aep:donation-change'));
  },

  getActiveDonationUser(): string {
    if (typeof window === 'undefined') return 'shayeb';
    const saved = localStorage.getItem(ACTIVE_DONATION_KEY);
    if (saved && VALID_USERS[saved]) return saved;
    const current = this.getCurrentUser();
    return current ? current.username : 'shayeb';
  },

  setActiveDonationUser(username: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACTIVE_DONATION_KEY, username);
    window.dispatchEvent(new Event('aep:donation-change'));
  },

  getActiveDonation(): { user: UserProfile; settings: AccountDonationSettings } {
    const activeUsername = this.getActiveDonationUser();
    const user = VALID_USERS[activeUsername]?.profile || VALID_USERS.shayeb.profile;
    const settings = this.getDonationForUser(activeUsername);
    return { user, settings };
  }
};
