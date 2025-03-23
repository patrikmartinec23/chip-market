document.addEventListener('DOMContentLoaded', function () {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute(
        'data-bs-theme',
        isDark ? 'dark' : 'light'
    );
});
