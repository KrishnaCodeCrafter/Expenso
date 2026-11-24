/**
 * Expenso - Theme Management System
 * Dark mode only - theme toggle removed
 */

(function() {
    'use strict';

    // Theme is always dark
    const THEME_KEY = 'theme';
    const THEME_ATTR = 'data-theme';

    // DOM Elements
    let themeToggleBtn = null;

    /**
     * Set theme in localStorage with safety
     */
    function setStoredTheme(theme) {
        try {
            localStorage.setItem(THEME_KEY, theme);
        } catch (e) {
            // localStorage blocked or unavailable - silently fail
        }
    }

    /**
     * Initialize theme system - always dark mode
     */
    function initTheme() {
        // Always use dark theme
        applyTheme('dark');
        setStoredTheme('dark');

        // Hide/remove theme toggle button since we only have dark mode
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', removeThemeToggle);
        } else {
            removeThemeToggle();
        }
    }

    /**
     * Remove theme toggle button from DOM
     */
    function removeThemeToggle() {
        themeToggleBtn = document.getElementById('themeToggle');
        if (themeToggleBtn) {
            themeToggleBtn.remove();
        }
    }

    /**
     * Apply theme to document
     * @param {string} theme - 'dark'
     */
    function applyTheme(theme) {
        document.documentElement.setAttribute(THEME_ATTR, theme);
    }

    /**
     * Get current theme
     * @returns {string} Current theme ('dark')
     */
    function getCurrentTheme() {
        return 'dark';
    }

    // Auto-initialize
    initTheme();
})();