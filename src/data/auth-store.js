// ============================================
// TalentLens - Browser Auth Store
// ============================================

const DB_NAME = 'talentlens_virtual_storage';
const DB_VERSION = 1;
const USER_STORE = 'users';

function normalizeUsername(username) {
    return username.trim().toLowerCase();
}

function arrayBufferToHex(buffer) {
    return [...new Uint8Array(buffer)]
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
}

async function hashPassword(password, salt) {
    const encoded = new TextEncoder().encode(`${salt}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', encoded);
    return arrayBufferToHex(digest);
}

function createSalt() {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return arrayBufferToHex(bytes);
}

function validatePassword(password) {
    if (password.length < 6) {
        return 'Password must be at least 6 characters.';
    }
    if (!/[A-Za-z]/.test(password)) {
        return 'Password must include at least one alphabet letter.';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must include at least one number.';
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
        return 'Password must include at least one special symbol.';
    }
    return null;
}

class AuthStore {
    constructor() {
        this.dbPromise = this.open();
    }

    open() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB is not available in this browser.'));
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onupgradeneeded = () => {
                const db = request.result;
                if (!db.objectStoreNames.contains(USER_STORE)) {
                    const store = db.createObjectStore(USER_STORE, { keyPath: 'usernameKey' });
                    store.createIndex('role', 'role', { unique: false });
                    store.createIndex('candidateId', 'candidateId', { unique: false });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async withStore(mode, callback) {
        const db = await this.dbPromise;
        return new Promise((resolve, reject) => {
            const tx = db.transaction(USER_STORE, mode);
            const store = tx.objectStore(USER_STORE);
            const request = callback(store);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async getUser(username) {
        return this.withStore('readonly', store => store.get(normalizeUsername(username)));
    }

    async registerUser({ username, password, role, candidateId = null }) {
        const trimmedUsername = username.trim();
        if (!trimmedUsername) {
            throw new Error('Please enter a username.');
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            throw new Error(passwordError);
        }

        const usernameKey = normalizeUsername(trimmedUsername);
        const existing = await this.getUser(usernameKey);
        if (existing) {
            throw new Error('Username is already taken. Choose a different one.');
        }

        const salt = createSalt();
        const passwordHash = await hashPassword(password, salt);
        const userRecord = {
            username: trimmedUsername,
            usernameKey,
            role,
            candidateId,
            salt,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        await this.withStore('readwrite', store => store.add(userRecord));
        return { username: trimmedUsername, role, candidateId };
    }

    async authenticate(username, password, role) {
        const user = await this.getUser(username);
        if (!user || user.role !== role) {
            return null;
        }

        const passwordHash = await hashPassword(password, user.salt);
        if (passwordHash !== user.passwordHash) {
            return null;
        }

        return {
            username: user.username,
            role: user.role,
            candidateId: user.candidateId
        };
    }
}

export const authStore = new AuthStore();
export { validatePassword };
