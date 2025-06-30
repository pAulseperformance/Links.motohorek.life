import { translations } from './translations.js';

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

    languageDropdown.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            const lang = e.target.dataset.lang;
            for (const key in translations[lang]) {
                const element = document.querySelector(`[data-translate="${key}"]`);
                if (element) {
                    if (key === 'footer_text') {
                        element.innerHTML = translations[lang][key].replace('${new Date().getFullYear()}', new Date().getFullYear());
                    } else {
                        element.textContent = translations[lang][key];
                    }
                }
            }
            languageDropdown.classList.add('hidden');
        }
    });
});
