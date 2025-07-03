// Translation system - Source of Truth
// This file defines the English fallback and loads all other languages dynamically

// English as the source of truth and fallback
export const defaultTranslations = {
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

// Cache for loaded translations
export const translations = { ...defaultTranslations };

// Supported languages
export const supportedLanguages = [
    'en', 'es', 'ru', 'zh', 'hi', 'fr', 'ar', 'bn', 'pt', 'ur', 'ko'
];

// Function to load translation files dynamically
export async function loadTranslation(lang) {
    // Return cached translation if already loaded
    if (translations[lang]) {
        return translations[lang];
    }
    
    // Don't try to load English from file, use default
    if (lang === 'en') {
        return defaultTranslations.en;
    }
    
    // Check if language is supported
    if (!supportedLanguages.includes(lang)) {
        console.warn(`Language ${lang} is not supported, falling back to English`);
        return defaultTranslations.en;
    }
    
    try {
        const response = await fetch(`./assets/translations/${lang}.json`);
        if (response.ok) {
            const data = await response.json();
            translations[lang] = data;
            return data;
        } else {
            throw new Error(`Failed to fetch ${lang}.json: ${response.status}`);
        }
    } catch (error) {
        console.warn(`Failed to load translation for ${lang}:`, error);
        // Return English as fallback
        return defaultTranslations.en;
    }
}

// Function to get all available language codes
export function getAvailableLanguages() {
    return supportedLanguages;
}

// Function to validate that a translation object has all required keys
export function validateTranslation(translation, lang) {
    const requiredKeys = Object.keys(defaultTranslations.en);
    const missingKeys = requiredKeys.filter(key => !(key in translation));
    
    if (missingKeys.length > 0) {
        console.warn(`Translation for ${lang} is missing keys:`, missingKeys);
        return false;
    }
    
    return true;
}
