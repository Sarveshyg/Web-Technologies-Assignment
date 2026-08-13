(function () {
    function getStoredTheme() {
        return localStorage.getItem('theme');
    }

    function getPreferredTheme() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function getTheme() {
        return getStoredTheme() || getPreferredTheme();
    }

    function applyTheme(theme) {
        document.body.classList.toggle('dark', theme === 'dark');
    }

    function toggleTheme() {
        var current = document.body.classList.contains('dark') ? 'dark' : 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme', next);
        applyTheme(next);
        updateToggleIcon(next);
    }

    function updateToggleIcon(theme) {
        var btn = document.getElementById('themeToggle');
        if (!btn) return;
        if (theme === 'dark') {
            btn.innerHTML = '<i class=\"fa-solid fa-sun\"></i>';
        } else {
            btn.innerHTML = '<i class=\"fa-solid fa-moon\"></i>';
        }
    }

    var theme = getTheme();
    applyTheme(theme);

    document.addEventListener('DOMContentLoaded', function () {
        updateToggleIcon(theme);
        var btn = document.getElementById('themeToggle');
        if (btn) btn.addEventListener('click', toggleTheme);
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
        if (!getStoredTheme()) {
            theme = getPreferredTheme();
            applyTheme(theme);
            updateToggleIcon(theme);
        }
    });
})();
