/**
 * Enhanced Language Switcher Component
 * Integrates with TranslationManager for dynamic language switching
 */

export class LanguageSwitcher {
    constructor(translationManager, options = {}) {
        this.translationManager = translationManager;
        this.container = null;
        this.dropdown = null;
        this.button = null;
        this.isOpen = false;
        
        // Configuration options
        this.options = {
            showFlags: true,
            showNativeNames: true,
            position: 'top-right',
            theme: 'light',
            animation: true,
            ...options
        };

        // Wait for config to load before initializing
        this.initialize();
    }

    async initialize() {
        // Wait for translation manager config to load
        await this.waitForConfig();
        
        // Find existing language switcher container
        this.container = document.getElementById('language-switcher');
        if (!this.container) {
            console.error('Language switcher container not found');
            return;
        }

        // Create enhanced language switcher
        this.render();
        this.bindEvents();
        
        // Set initial language from localStorage or default
        const savedLanguage = localStorage.getItem('selectedLanguage') || 
                             this.translationManager.config?.defaultLanguage || 'en';
        
        if (savedLanguage !== this.translationManager.currentLanguage) {
            await this.switchLanguage(savedLanguage);
        }
        
        this.updateButtonText();
    }

    async waitForConfig() {
        // Wait for config to be loaded
        let attempts = 0;
        while (!this.translationManager.config && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
    }

    render() {
        const config = this.translationManager.config;
        if (!config) return;

        const currentLang = config.supportedLanguages.find(lang => 
            lang.code === this.translationManager.currentLanguage
        ) || config.supportedLanguages[0];

        // Enhanced button with flag and current language
        const buttonHTML = `
            <button type="button" 
                    class="language-switcher-button inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" 
                    id="language-button" 
                    aria-haspopup="true" 
                    aria-expanded="false"
                    title="Select Language">
                ${this.options.showFlags ? `<span class="text-lg">${currentLang.flag}</span>` : ''}
                <span class="language-name">${this.options.showNativeNames ? currentLang.nativeName : currentLang.name}</span>
                <svg class="h-4 w-4 text-gray-400 transition-transform duration-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
            </button>
        `;

        // Enhanced dropdown with search and better organization
        const dropdownHTML = `
            <div class="language-dropdown origin-top-right absolute right-0 mt-2 w-72 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none hidden z-50" 
                 role="menu" 
                 aria-orientation="vertical" 
                 id="language-dropdown">
                
                <!-- Search box for many languages -->
                ${config.supportedLanguages.length > 6 ? `
                <div class="p-3 border-b border-gray-100">
                    <input type="text" 
                           class="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                           placeholder="Search languages..." 
                           id="language-search">
                </div>
                ` : ''}
                
                <!-- Language options -->
                <div class="py-2 max-h-64 overflow-y-auto" id="language-options">
                    ${this.renderLanguageOptions(config.supportedLanguages)}
                </div>
                
                <!-- Footer with language count -->
                <div class="px-3 py-2 border-t border-gray-100 text-xs text-gray-500 bg-gray-50 rounded-b-xl">
                    ${config.supportedLanguages.filter(lang => lang.enabled).length} languages available
                </div>
            </div>
        `;

        // Update container content
        this.container.innerHTML = `
            <div class="relative inline-block text-left">
                ${buttonHTML}
                ${dropdownHTML}
            </div>
        `;

        // Get references to new elements
        this.button = document.getElementById('language-button');
        this.dropdown = document.getElementById('language-dropdown');
    }

    renderLanguageOptions(languages) {
        const enabledLanguages = languages.filter(lang => lang.enabled);
        
        return enabledLanguages.map(lang => {
            const isActive = lang.code === this.translationManager.currentLanguage;
            
            return `
                <button type="button" 
                        class="language-option w-full text-left px-4 py-3 text-sm transition-all duration-150 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-3 ${isActive ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'}" 
                        role="menuitem" 
                        data-lang="${lang.code}"
                        data-name="${lang.name}"
                        data-native-name="${lang.nativeName}">
                    ${this.options.showFlags ? `<span class="text-lg flex-shrink-0">${lang.flag}</span>` : ''}
                    <div class="flex-1 min-w-0">
                        <div class="font-medium truncate">${lang.nativeName}</div>
                        ${lang.nativeName !== lang.name ? `<div class="text-xs text-gray-500 truncate">${lang.name}</div>` : ''}
                    </div>
                    ${isActive ? `
                        <svg class="h-4 w-4 text-indigo-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                        </svg>
                    ` : ''}
                </button>
            `;
        }).join('');
    }

    bindEvents() {
        if (!this.button || !this.dropdown) return;

        // Toggle dropdown
        this.button.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown();
        });

        // Handle language selection
        this.dropdown.addEventListener('click', async (e) => {
            const languageOption = e.target.closest('.language-option');
            if (languageOption) {
                const langCode = languageOption.dataset.lang;
                await this.switchLanguage(langCode);
                this.closeDropdown();
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.closeDropdown();
            }
        });

        // Search functionality
        const searchInput = document.getElementById('language-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterLanguages(e.target.value);
            });
        }

        // Keyboard navigation
        this.dropdown.addEventListener('keydown', (e) => {
            this.handleKeyboardNavigation(e);
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeDropdown();
                this.button.focus();
            }
        });
    }

    async switchLanguage(langCode) {
        try {
            // Show loading state
            this.setLoadingState(true);
            
            // Load translation using TranslationManager
            const translation = await this.translationManager.loadLanguage(langCode);
            
            if (translation) {
                // Apply translations to the page
                await this.applyTranslations(translation, langCode);
                
                // Update current language
                this.translationManager.setCurrentLanguage(langCode);
                
                // Save to localStorage
                localStorage.setItem('selectedLanguage', langCode);
                
                // Update document language
                document.documentElement.lang = langCode;
                
                // Update RTL direction if needed
                this.updateTextDirection(langCode);
                
                // Update button text
                this.updateButtonText();
                
                // Re-render options to show new active state
                this.updateLanguageOptions();
                
                // Trigger custom event
                this.dispatchLanguageChangeEvent(langCode);
            }
        } catch (error) {
            console.error('Failed to switch language:', error);
            this.showError('Failed to load language');
        } finally {
            this.setLoadingState(false);
        }
    }

    async applyTranslations(translation, langCode) {
        // Apply translations to all elements with data-translate attribute
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translatedText = translation[key];
            
            if (translatedText) {
                if (key === 'footer_text') {
                    // Handle footer text with year replacement
                    let footerText = translatedText;
                    if (footerText.includes('${new Date().getFullYear()}')) {
                        footerText = footerText.replace('${new Date().getFullYear()}', new Date().getFullYear());
                    }
                    element.innerHTML = footerText;
                } else {
                    element.textContent = translatedText;
                }
            }
        });

        // Update meta tags for SEO
        this.updateMetaTags(translation, langCode);
    }

    updateMetaTags(translation, langCode) {
        // Update page title
        if (translation.page_title) {
            document.title = translation.page_title;
        }
        
        // Update meta description
        if (translation.page_description) {
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute('content', translation.page_description);
            }
        }

        // Update Open Graph tags
        if (translation.page_title) {
            const ogTitle = document.querySelector('meta[property="og:title"]');
            if (ogTitle) {
                ogTitle.setAttribute('content', translation.page_title);
            }
        }

        if (translation.page_description) {
            const ogDesc = document.querySelector('meta[property="og:description"]');
            if (ogDesc) {
                ogDesc.setAttribute('content', translation.page_description);
            }
        }
    }

    updateTextDirection(langCode) {
        const config = this.translationManager.config;
        if (!config) return;

        const language = config.supportedLanguages.find(lang => lang.code === langCode);
        if (language && language.rtl) {
            document.documentElement.dir = 'rtl';
            document.body.classList.add('rtl');
        } else {
            document.documentElement.dir = 'ltr';
            document.body.classList.remove('rtl');
        }
    }

    updateButtonText() {
        const config = this.translationManager.config;
        if (!config) return;

        const currentLang = config.supportedLanguages.find(lang => 
            lang.code === this.translationManager.currentLanguage
        );

        if (currentLang && this.button) {
            const flagElement = this.button.querySelector('.text-lg');
            const nameElement = this.button.querySelector('.language-name');
            
            if (flagElement && this.options.showFlags) {
                flagElement.textContent = currentLang.flag;
            }
            
            if (nameElement) {
                nameElement.textContent = this.options.showNativeNames ? 
                    currentLang.nativeName : currentLang.name;
            }
        }
    }

    updateLanguageOptions() {
        const optionsContainer = document.getElementById('language-options');
        if (optionsContainer && this.translationManager.config) {
            optionsContainer.innerHTML = this.renderLanguageOptions(
                this.translationManager.config.supportedLanguages
            );
        }
    }

    filterLanguages(searchTerm) {
        const options = this.dropdown.querySelectorAll('.language-option');
        const term = searchTerm.toLowerCase();

        options.forEach(option => {
            const name = option.dataset.name.toLowerCase();
            const nativeName = option.dataset.nativeName.toLowerCase();
            const matches = name.includes(term) || nativeName.includes(term);
            
            option.style.display = matches ? 'flex' : 'none';
        });
    }

    toggleDropdown() {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    openDropdown() {
        if (!this.dropdown) return;
        
        this.dropdown.classList.remove('hidden');
        this.isOpen = true;
        this.button.setAttribute('aria-expanded', 'true');
        
        // Animate chevron
        const chevron = this.button.querySelector('svg');
        if (chevron) {
            chevron.style.transform = 'rotate(180deg)';
        }

        // Focus search input if available
        const searchInput = document.getElementById('language-search');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }

    closeDropdown() {
        if (!this.dropdown) return;
        
        this.dropdown.classList.add('hidden');
        this.isOpen = false;
        this.button.setAttribute('aria-expanded', 'false');
        
        // Reset chevron
        const chevron = this.button.querySelector('svg');
        if (chevron) {
            chevron.style.transform = 'rotate(0deg)';
        }

        // Clear search
        const searchInput = document.getElementById('language-search');
        if (searchInput) {
            searchInput.value = '';
            this.filterLanguages(''); // Show all options
        }
    }

    setLoadingState(isLoading) {
        if (!this.button) return;
        
        const nameElement = this.button.querySelector('.language-name');
        if (nameElement) {
            if (isLoading) {
                nameElement.textContent = 'Loading...';
                this.button.disabled = true;
            } else {
                this.button.disabled = false;
                this.updateButtonText();
            }
        }
    }

    showError(message) {
        // You could implement a toast notification here
        console.error(message);
    }

    handleKeyboardNavigation(e) {
        const options = Array.from(this.dropdown.querySelectorAll('.language-option:not([style*="display: none"])'));
        const currentIndex = options.findIndex(option => option === document.activeElement);

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % options.length;
                options[nextIndex]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                const prevIndex = currentIndex <= 0 ? options.length - 1 : currentIndex - 1;
                options[prevIndex]?.focus();
                break;
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (document.activeElement.classList.contains('language-option')) {
                    document.activeElement.click();
                }
                break;
        }
    }

    dispatchLanguageChangeEvent(langCode) {
        const event = new CustomEvent('languageChanged', {
            detail: { 
                language: langCode,
                translationManager: this.translationManager
            }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getCurrentLanguage() {
        return this.translationManager.currentLanguage;
    }

    getSupportedLanguages() {
        return this.translationManager.config?.supportedLanguages || [];
    }

    async preloadLanguages(langCodes) {
        for (const langCode of langCodes) {
            await this.translationManager.loadLanguage(langCode);
        }
    }

    destroy() {
        // Clean up event listeners
        document.removeEventListener('click', this.handleOutsideClick);
        document.removeEventListener('keydown', this.handleEscapeKey);
        
        // Clear container
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
}
