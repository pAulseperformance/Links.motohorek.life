// Enhanced Translation Management System
// Maintains backward compatibility while adding enterprise features

class TranslationManager {
    constructor() {
        this.cache = new Map();
        this.currentLanguage = 'en';
        this.fallbackLanguage = 'en';
        this.observers = new Set();
        this.loadingPromises = new Map();
        this.config = null;
        
        // Initialize with English as default
        this.cache.set('en', defaultTranslations.en);
        
        // Load configuration
        this.loadConfig();
    }

    // Load configuration file
    async loadConfig() {
        try {
            const response = await fetch('./assets/config/translation-config.json');
            if (response.ok) {
                this.config = await response.json();
            }
        } catch (error) {
            console.warn('Could not load translation config, using defaults');
        }
    }

    // Subscribe to language changes
    subscribe(callback) {
        this.observers.add(callback);
        return () => this.observers.delete(callback);
    }

    // Notify observers of language changes
    notify(language, translations) {
        this.observers.forEach(callback => {
            try {
                callback(language, translations);
            } catch (error) {
                console.error('Error in translation observer:', error);
            }
        });
    }

    // Enhanced load translation with caching and error handling
    async loadTranslation(lang) {
        // Return cached translation if available
        if (this.cache.has(lang)) {
            return this.cache.get(lang);
        }

        // Prevent duplicate loading requests
        if (this.loadingPromises.has(lang)) {
            return this.loadingPromises.get(lang);
        }

        // Validate language support
        if (!this.isLanguageSupported(lang)) {
            console.warn(`Language '${lang}' not supported. Using fallback: ${this.fallbackLanguage}`);
            return this.getFallbackTranslation();
        }

        // Create loading promise
        const loadingPromise = this.fetchTranslation(lang);
        this.loadingPromises.set(lang, loadingPromise);

        try {
            const translation = await loadingPromise;
            this.cache.set(lang, translation);
            this.loadingPromises.delete(lang);
            return translation;
        } catch (error) {
            this.loadingPromises.delete(lang);
            console.error(`Failed to load translation for '${lang}':`, error);
            return this.getFallbackTranslation();
        }
    }

    // Fetch translation from file
    async fetchTranslation(lang) {
        if (lang === this.fallbackLanguage) {
            return defaultTranslations.en;
        }

        const response = await fetch(`./assets/translations/${lang}.json`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch ${lang}.json`);
        }

        const data = await response.json();
        
        // Validate translation completeness
        if (this.config?.enableValidation && !this.validateTranslation(data, lang)) {
            console.warn(`Translation '${lang}' is incomplete. Some keys may fallback to English.`);
        }

        return this.mergeWithFallback(data);
    }

    // Merge translation with fallback for missing keys
    mergeWithFallback(translation) {
        const fallback = this.cache.get(this.fallbackLanguage);
        return { ...fallback, ...translation };
    }

    // Validate translation completeness
    validateTranslation(translation, lang) {
        const requiredKeys = Object.keys(defaultTranslations.en);
        const providedKeys = Object.keys(translation);
        const missingKeys = requiredKeys.filter(key => !providedKeys.includes(key));
        
        if (missingKeys.length > 0) {
            console.warn(`Translation '${lang}' missing keys:`, missingKeys);
            return false;
        }
        
        return true;
    }

    // Get translation with fallback support
    getTranslation(key, lang = this.currentLanguage) {
        const translations = this.cache.get(lang) || this.getFallbackTranslation();
        
        // Return translation or fallback to English
        const value = translations[key];
        if (value === undefined && lang !== this.fallbackLanguage) {
            return this.getTranslation(key, this.fallbackLanguage);
        }
        
        return value || key; // Return key as final fallback
    }

    // Set current language and notify observers
    async setLanguage(lang) {
        if (lang === this.currentLanguage) return;
        
        const translations = await this.loadTranslation(lang);
        this.currentLanguage = lang;
        this.notify(lang, translations);
        
        // Store preference
        try {
            localStorage.setItem('preferred-language', lang);
        } catch (error) {
            console.warn('Could not save language preference');
        }
        
        return translations;
    }

    // Get user's preferred language
    getPreferredLanguage() {
        try {
            // Check localStorage first
            const stored = localStorage.getItem('preferred-language');
            if (stored && this.isLanguageSupported(stored)) {
                return stored;
            }
        } catch (error) {
            console.warn('Could not access localStorage');
        }
        
        // Check browser language
        try {
            const browserLang = navigator.language.split('-')[0];
            if (this.isLanguageSupported(browserLang)) {
                return browserLang;
            }
        } catch (error) {
            console.warn('Could not detect browser language');
        }
        
        return this.fallbackLanguage;
    }

    // Utility methods
    isLanguageSupported(lang) {
        return supportedLanguages.includes(lang);
    }

    getFallbackTranslation() {
        return this.cache.get(this.fallbackLanguage);
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    getSupportedLanguages() {
        return [...supportedLanguages];
    }

    getLanguageMetadata() {
        return this.config?.supportedLanguages || languageMetadata;
    }

    // Method for LanguageSwitcher component
    async loadLanguage(lang) {
        return await this.loadTranslation(lang);
    }

    // Method for LanguageSwitcher component
    setCurrentLanguage(lang) {
        this.currentLanguage = lang;
    }

    // Preload translations for better performance
    async preloadTranslations(languages = []) {
        const preloadLangs = languages.length > 0 ? languages : (this.config?.preloadLanguages || ['en', 'es', 'ru']);
        const loadPromises = preloadLangs
            .filter(lang => this.isLanguageSupported(lang))
            .map(lang => this.loadTranslation(lang));
        
        await Promise.allSettled(loadPromises);
    }
}

// Source of Truth - English translations (backward compatible)
const defaultTranslations = {
    en: {
        language_selector: 'Language',
        username: '@motohorek',
        description: 'Female Traveler | Content Creator | 8 years of non-stop adventures',
        youtube_title: 'YouTube Channel',
        youtube_description: 'Watch my latest videos',
        instagram_title: 'Instagram',
        instagram_description: 'Daily updates & stories',
        telegram_title: 'Telegram',
        telegram_description: 'Join my Telegram channel',
        website_title: 'Official Website',
        website_description: 'Official website motohorek.life, 500+ articles in my travel blog',
        tiktok_title: 'TikTok',
        tiktok_description: 'Watch my latest videos',
        contact_title: 'Business Contact',
        contact_description: 'Collaboration, contact me for business inquiries',
        blog_title: 'Apps that save me $$$',
        blog_description: 'Useful resources that save me $$$ while traveling',
        donations_title: 'Donations',
        donations_description: 'Support my work',
        consultation_title: 'Consultation',
        consultation_description: 'Book a consultation with me',
        footer_text: '© 2025 Motohorek. All rights reserved.'
    }
};

// Supported languages configuration
const supportedLanguages = [
    'en', 'es', 'ru', 'zh', 'hi', 'fr', 'ar', 'bn', 'pt', 'ur', 'ko'
];

// Language metadata for enhanced UI (fallback if config not loaded)
const languageMetadata = {
    en: { name: 'English', nativeName: 'English', flag: '🇺🇸', rtl: false },
    es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', rtl: false },
    ru: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', rtl: false },
    zh: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', rtl: false },
    hi: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', rtl: false },
    fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷', rtl: false },
    ar: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', rtl: true },
    bn: { name: 'Bengali', nativeName: 'বাংলা', flag: '🇧🇩', rtl: false },
    pt: { name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹', rtl: false },
    ur: { name: 'Urdu', nativeName: 'اردو', flag: '🇵🇰', rtl: true },
    ko: { name: 'Korean', nativeName: '한국어', flag: '🇰🇷', rtl: false }
};

// Create singleton instance
const translationManager = new TranslationManager();

// BACKWARD COMPATIBILITY: Maintain existing API
export const translations = new Proxy({}, {
    get(target, prop) {
        // Legacy support - return cached translations
        return translationManager.cache.get(prop) || defaultTranslations[prop];
    }
});

// Backward compatible functions
export async function loadTranslation(lang) {
    return translationManager.loadTranslation(lang);
}

export function getAvailableLanguages() {
    return translationManager.getSupportedLanguages();
}

export function validateTranslation(translation, lang) {
    return translationManager.validateTranslation(translation, lang);
}

// New enhanced API
export { translationManager };
export { TranslationManager };
export { languageMetadata };

// Initialize with user's preferred language
translationManager.setLanguage(translationManager.getPreferredLanguage());
