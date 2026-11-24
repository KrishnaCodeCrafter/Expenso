/**
 * Expenso - Theme Management System
 * Dark mode only
 */

(function() {
    'use strict';

    // Theme is always dark
    document.documentElement.setAttribute('data-theme', 'dark');
    try {
        localStorage.setItem('theme', 'dark');
    } catch (e) {
        // localStorage blocked or unavailable
    }
})();
