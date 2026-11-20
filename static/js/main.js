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
     * Initialize theme system
     */
    function initTheme() {
        // Get saved theme or detect system preference
        const savedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? DARK_THEME : LIGHT_THEME);

        // Apply theme immediately
        applyTheme(initialTheme);

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleSystemThemeChange);

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
        localStorage.setItem(THEME_KEY, newTheme);

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
     * Handle system theme change
     * Only auto-switch if user hasn't explicitly set a preference
     * @param {MediaQueryListEvent} e
     */
    function handleSystemThemeChange(e) {
        const savedTheme = localStorage.getItem(THEME_KEY);
        if (!savedTheme) {
            const newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
            applyTheme(newTheme);
            updateToggleButton();
        }
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('light' or 'dark')
     */
    function getCurrentTheme() {
        return document.documentElement.getAttribute(THEME_ATTR) || LIGHT_THEME;
    }

    /**
     * Set theme programmatically
     * @param {string} theme - 'light' or 'dark'
     */
    function setTheme(theme) {
        if (theme !== LIGHT_THEME && theme !== DARK_THEME) return;
        applyTheme(theme);
        localStorage.setItem(THEME_KEY, theme);
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