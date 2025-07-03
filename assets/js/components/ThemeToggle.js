/**
 * ThemeToggle Component
 * Handles dark/light mode toggle functionality
 */
export class ThemeToggle {
    constructor() {
        this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
        this.themeButton = document.getElementById('theme-toggle-button');
        this.themeIcon = document.getElementById('theme-icon');
        
        this.init();
    }

    /**
     * Initialize the theme toggle component
     */
    init() {
        // Apply the current theme
        this.applyTheme(this.currentTheme);
        
        // Add event listener for theme toggle button
        if (this.themeButton) {
            this.themeButton.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
            if (!this.getStoredTheme()) {
                this.applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    /**
     * Get the user's preferred theme from system settings
     */
    getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    /**
     * Get the stored theme from localStorage
     */
    getStoredTheme() {
        return localStorage.getItem('theme');
    }

    /**
     * Store the theme preference in localStorage
     */
    setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    /**
     * Apply the theme to the document
     */
    applyTheme(theme) {
        this.currentTheme = theme;
        
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            this.updateIcon('moon');
        } else {
            document.body.classList.remove('dark-mode');
            this.updateIcon('sun');
        }

        // Store the theme preference
        this.setStoredTheme(theme);

        // Dispatch custom event for other components
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme: theme }
        }));
    }

    /**
     * Update the theme toggle icon
     */
    updateIcon(iconType) {
        if (!this.themeIcon) return;

        if (iconType === 'moon') {
            this.themeIcon.className = 'fas fa-moon text-blue-400 text-lg';
            this.themeButton.setAttribute('aria-label', 'Switch to light mode');
        } else {
            this.themeIcon.className = 'fas fa-sun text-yellow-500 text-lg';
            this.themeButton.setAttribute('aria-label', 'Switch to dark mode');
        }
    }

    /**
     * Toggle between light and dark themes
     */
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
        
        // Add a subtle animation effect
        this.themeButton.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.themeButton.style.transform = '';
        }, 150);
    }

    /**
     * Get the current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Set a specific theme
     */
    setTheme(theme) {
        if (theme === 'dark' || theme === 'light') {
            this.applyTheme(theme);
        }
    }
}
