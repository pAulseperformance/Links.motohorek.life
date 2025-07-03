// Initialize translations object with inline English, Spanish, and Russian
export const translations = {
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
    },
    es: {
        language_selector: 'Idioma',
        username: '@motohorek',
        description: 'Viajera | Creadora de contenido | 8 años de aventuras sin parar',
        youtube_title: 'Canal de YouTube',
        youtube_description: 'Mira mis últimos videos',
        instagram_title: 'Instagram',
        instagram_description: 'Actualizaciones diarias e historias',
        telegram_title: 'Telegram',
        telegram_description: 'Únete a mi canal de Telegram',
        website_title: 'Sitio Web Oficial',
        website_description: 'Sitio web oficial motohorek.life, 500+ artículos en mi blog de viajes',
        tiktok_title: 'TikTok',
        tiktok_description: 'Mira mis últimos videos',
        contact_title: 'Contacto para negocios',
        contact_description: 'Colaboración, contáctame para consultas de negocios',
        blog_title: 'Apps que me ahorran $$$',
        blog_description: 'Recursos útiles que me ahorran $$$ mientras viajo',
        donations_title: 'Donaciones',
        donations_description: 'Apoya mi trabajo',
        consultation_title: 'Consulta',
        consultation_description: 'Reserva una consulta conmigo',
        footer_text: '© 2025 Motohorek. Todos los derechos reservados.'
    },
    ru: {
        language_selector: 'Язык',
        username: '@motohorek',
        description: 'Путешественница | Создатель контента | 8 лет приключений без остановки',
        youtube_title: 'YouTube канал',
        youtube_description: 'Смотрите мои последние видео',
        instagram_title: 'Instagram',
        instagram_description: 'Ежедневные обновления и истории',
        telegram_title: 'Telegram',
        telegram_description: 'Присоединяйтесь к моему каналу в Telegram',
        website_title: 'Официальный сайт',
        website_description: 'Официальный сайт motohorek.life , 500+ статей в моем блоге о путешествиях',
        tiktok_title: 'TikTok',
        tiktok_description: 'Смотрите мои последние видео',
        contact_title: 'Контакт для бизнеса',
        contact_description: 'Сотрудничество, связаться со мной по рабочим вопросам',
        blog_title: 'Приложения, которые экономят мне $$$',
        blog_description: 'Полезные ресурсы , которые экономят мне $$$ в путешествиях',
        donations_title: 'Пожертвования',
        donations_description: 'Поддержите мою работу',
        consultation_title: 'Консультация',
        consultation_description: 'Забронируйте консультацию со мной',
        footer_text: '© 2025 Motohorek. Все права защищены.'
    }
};

// Function to load additional translation files dynamically
export async function loadTranslation(lang) {
    if (translations[lang]) {
        return translations[lang];
    }
    
    try {
        const response = await fetch(`./assets/translations/${lang}.json`);
        if (response.ok) {
            const data = await response.json();
            translations[lang] = data;
            return data;
        }
    } catch (error) {
        console.warn(`Failed to load translation for ${lang}:`, error);
    }
    
    // Return English as fallback
    return translations.en;
}
