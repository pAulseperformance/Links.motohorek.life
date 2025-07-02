# Motohorek Links Website

A modern, multilingual personal links website for travel creator Motohorek.

## Features

- **Multilingual Support**: 11 languages (English, Spanish, Russian, Chinese, Hindi, French, Arabic, Bengali, Portuguese, Urdu, Korean)
- **Smooth Animations**: Card animations on page load
- **Responsive Design**: Mobile-friendly layout using Tailwind CSS
- **Modern ES6 Modules**: Clean, modular JavaScript architecture
- **Dynamic Translation Loading**: Translations loaded on-demand for better performance

## Local Development

### Prerequisites
- Node.js installed on your system

### Running the Development Server

1. **Start the local server:**
   ```bash
   npx serve . -p 3000
   ```

2. **Open in browser:**
   Visit `http://localhost:3000`

### Why Use a Local Server?

This website uses ES6 modules (`import`/`export` statements) which require an HTTP server to work properly. Opening the HTML file directly in a browser (`file://` protocol) will cause CORS errors and the JavaScript won't function.

## Project Structure

```
├── index.html                 # Main HTML file
├── assets/
│   ├── css/
│   │   └── style.css         # Custom styles and animations
│   ├── js/
│   │   ├── main.js           # Main application logic
│   │   └── translations.js   # Translation management
│   ├── img/
│   │   └── profile-picture.jpg
│   └── translations/         # Translation JSON files
│       ├── ar.json          # Arabic
│       ├── bn.json          # Bengali
│       ├── fr.json          # French
│       ├── hi.json          # Hindi
│       ├── ko.json          # Korean
│       ├── pt.json          # Portuguese
│       ├── ur.json          # Urdu
│       └── zh.json          # Chinese
└── README.md
```

## Technologies Used

- **HTML5**: Modern semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: ES6+ modules and async/await
- **Font Awesome**: Icons for social media links
- **Inter Font**: Modern typography from Google Fonts

## Language Switching

The website supports dynamic language switching:

1. Click the "Language" dropdown in the top-right corner
2. Select your preferred language
3. All content updates automatically using async translation loading
4. Translations are cached after first load for better performance

## Browser Compatibility

- Modern browsers with ES6 module support
- Chrome 61+, Firefox 60+, Safari 10.1+, Edge 16+

## Issues Fixed

This README documents the resolution of JavaScript execution issues when running locally:

### Problem
- ES6 modules blocked by CORS when opening HTML directly in browser
- Missing translation files for 8 out of 11 supported languages
- CSS animations not visible due to missing initial styles

### Solution
- ✅ Set up local HTTP server using Node.js `serve` package
- ✅ Created all missing translation JSON files
- ✅ Implemented async translation loading system
- ✅ Fixed CSS animations with proper initial opacity and transform states
- ✅ Modern ES6 module structure maintained for better code organization

## Development Notes

- Translations are loaded dynamically to improve initial page load time
- English, Spanish, and Russian are embedded in the JavaScript for faster access
- Other languages are loaded from JSON files when needed
- All text content is translatable via `data-translate` attributes
- Footer year updates automatically

---

© 2025 Motohorek. All rights reserved.
