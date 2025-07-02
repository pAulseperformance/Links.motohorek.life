import { translations, loadTranslation } from './translations.js';

document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.link-card');
    links.forEach((link, index) => {
        setTimeout(() => {
            link.style.opacity = '1';
            link.style.transform = 'translateY(0)';
        }, 100 * index);
    });
    document.getElementById('year').textContent = new Date().getFullYear();

    const languageSwitcher = document.getElementById('language-switcher');
    const languageDropdown = document.getElementById('language-dropdown');
    const optionsMenu = document.getElementById('options-menu');

    optionsMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        languageDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (event) => {
        if (!languageSwitcher.contains(event.target)) {
            languageDropdown.classList.add('hidden');
        }
    });

    languageDropdown.addEventListener('click', async (e) => {
        if (e.target.tagName === 'A') {
            const lang = e.target.dataset.lang;
            const langData = await loadTranslation(lang);
            
            for (const key in langData) {
                const element = document.querySelector(`[data-translate="${key}"]`);
                if (element) {
                    if (key === 'footer_text') {
                        // Handle both template string format and direct year format
                        let footerText = langData[key];
                        if (footerText.includes('${new Date().getFullYear()}')) {
                            footerText = footerText.replace('${new Date().getFullYear()}', new Date().getFullYear());
                        }
                        element.innerHTML = footerText;
                    } else {
                        element.textContent = langData[key];
                    }
                }
            }
            languageDropdown.classList.add('hidden');
        }
    });
});
