import { TranslationManager } from './translations.js';
import { LanguageSwitcher } from './components/LanguageSwitcher.js';
import { ThemeToggle } from './components/ThemeToggle.js';

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize link animations
    const links = document.querySelectorAll('.link-card');
    links.forEach((link, index) => {
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    
    // Update year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Initialize theme toggle
    const themeToggle = new ThemeToggle();

    // Initialize translation system
    const translationManager = new TranslationManager();
    
    // Initialize enhanced language switcher
    const languageSwitcher = new LanguageSwitcher(translationManager, {
        showFlags: true,
        showNativeNames: true,
        position: 'top-right',
        theme: themeToggle.getCurrentTheme(),
        animation: true
    });

    // Listen for language change events
    document.addEventListener('languageChanged', (event) => {
        console.log('Language changed to:', event.detail.language);
        
        // You can add additional logic here that should run when language changes
        // For example, updating analytics, user preferences, etc.
    });

    // Listen for theme change events
    document.addEventListener('themeChanged', (event) => {
        console.log('Theme changed to:', event.detail.theme);
        
        // Update language switcher theme if it has the method
        if (languageSwitcher && typeof languageSwitcher.updateTheme === 'function') {
            languageSwitcher.updateTheme(event.detail.theme);
        }
        
        // You can add additional logic here that should run when theme changes
        // For example, updating analytics, user preferences, etc.
    });

    // Preload common languages for better performance
    const commonLanguages = ['en', 'es', 'ru'];
    try {
        await languageSwitcher.preloadLanguages(commonLanguages);
    } catch (error) {
        console.warn('Failed to preload some languages:', error);
    }
});
