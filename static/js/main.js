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

    /**
     * Form loading state handler
     * Adds .loading class to submit button on form submit
     */
    function initFormLoading() {
        const forms = document.querySelectorAll('.auth-form');
        forms.forEach(form => {
            form.addEventListener('submit', function() {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                }
            });
        });
    }

    // Initialize form loading on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFormLoading);
    } else {
        initFormLoading();
    }
})();
