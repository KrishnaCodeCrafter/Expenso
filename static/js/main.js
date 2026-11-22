/**
 * Expenso - Theme Management System
 * Handles dark/light mode toggle with localStorage persistence
 * and smooth transitions
 */

(function() {
    'use strict';

    // Theme configuration
    const THEME_KEY = 'theme';
    const THEME_ATTR = 'data-theme';
    const LIGHT_THEME = 'light';
    const DARK_THEME = 'dark';

    // DOM Elements
    let themeToggleBtn = null;
    let themeToggleTooltip = null;

    /**
     * Get stored theme from localStorage with safety
     * @returns {string|null} The stored theme or null if not set/error
     */
    function getStoredTheme() {
        try {
            return localStorage.getItem(THEME_KEY);
        } catch (e) {
            return null;
        }
    }

    /**
     * Set theme in localStorage with safety
     * @param {string} theme - 'light' or 'dark'
     */
    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // localStorage blocked or unavailable - silently fail
        }
    }

    /**
     * Initialize theme system
     */
    function initTheme() {
        // Get saved theme or default to dark
        const savedTheme = getStoredTheme();
        const initialTheme = (savedTheme === LIGHT_THEME || savedTheme === DARK_THEME)
            ? savedTheme
            : DARK_THEME;

        // Apply theme immediately
        applyTheme(initialTheme);

        // Initialize toggle button after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initToggleButton);
        } else {
            initToggleButton();
        }
    }

    /**
     * Initialize theme toggle button
     */
    function initToggleButton() {
        themeToggleBtn = document.getElementById('themeToggle');
        if (!themeToggleBtn) return;

        themeToggleTooltip = themeToggleBtn.querySelector('.tooltip');

        // Set initial tooltip and aria-label
        updateToggleButton();

        // Add click handler
        themeToggleBtn.addEventListener('click', toggleTheme);

        // Add keyboard support
        themeToggleBtn.addEventListener('keydown', handleKeydown);
    }

    /**
     * Toggle between light and dark themes
     */
    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute(THEME_ATTR);
        const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

        // Add transition class for smooth animation
        document.documentElement.classList.add('theme-transitioning');

        // Apply new theme
        applyTheme(newTheme);

        // Save to localStorage
        setStoredTheme(newTheme);

        // Update button state
        updateToggleButton();

        // Remove transition class after animation
        setTimeout(() => {
            document.documentElement.classList.remove('theme-transitioning');
        }, 350);
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'light' or 'dark'
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute(THEME_ATTR, theme);
    }

    /**
     * Update toggle button appearance and accessibility attributes
     */
    function updateToggleButton() {
        if (!themeToggleBtn || !themeToggleTooltip) return;

        const currentTheme = document.documentElement.getAttribute(THEME_ATTR);
        const isDark = currentTheme === DARK_THEME;

        // Update aria-pressed for accessibility
        themeToggleBtn.setAttribute('aria-pressed', isDark);

        // Update aria-label
        themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');

        // Update tooltip
        themeToggleTooltip.textContent = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    /**
     * Handle keyboard navigation
     * @param {KeyboardEvent} e
     */
    function handleKeydown(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleTheme();
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    function getCurrentTheme() {
        return document.documentElement.getAttribute(THEME_ATTR) || DARK_THEME;
    }

    /**
     * Set theme programmatically
     * @param {string} theme - 'light' or 'dark'
     */
    function setTheme(theme) {
        if (theme !== LIGHT_THEME && theme !== DARK_THEME) return;
        applyTheme(theme);
        setStoredTheme(theme);
        updateToggleButton();
    }

    // Export for global access if needed
    window.ThemeManager = {
        init: initTheme,
        toggle: toggleTheme,
        setTheme: setTheme,
        getCurrentTheme: getCurrentTheme,
        LIGHT_THEME: LIGHT_THEME,
        DARK_THEME: DARK_THEME
    };

    // Auto-initialize
    initTheme();
})();