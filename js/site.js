document.addEventListener('DOMContentLoaded', function () {

    /* ---------- 1. DARK / LIGHT MODE ---------- */
    (function initTheme() {
        var root = document.documentElement;
        var themeToggle = document.getElementById('themeToggle');
        var themeIcon = document.getElementById('themeIcon');
        var STORAGE_KEY = 'portfolio-theme';

        function applyTheme(theme) {
            if (theme === 'dark') {
                root.setAttribute('data-theme', 'dark');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            } else {
                root.removeAttribute('data-theme');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
        }

        var saved = null;
        try {
            saved = localStorage.getItem(STORAGE_KEY);
        } catch (e) {
            saved = null;
        }

        if (saved) {
            applyTheme(saved);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var isDark = root.getAttribute('data-theme') === 'dark';
                var next = isDark ? 'light' : 'dark';
                applyTheme(next);
                try {
                    localStorage.setItem(STORAGE_KEY, next);
                } catch (e) { }
            });
        }
    })();

    /* ---------- 2. NAVBAR SCROLL + ACTIVE LINK ---------- */
    (function initNavbar() {
        var navbar = document.getElementById('mainNavbar');
        var navLinks = document.querySelectorAll('.nav-links .nav-link');
        var sections = Array.prototype.slice.call(document.querySelectorAll('section[id]'));

        function onScroll() {
            if (navbar) {
                if (window.scrollY > 20) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            }

            var scrollPos = window.scrollY + 120;
            var currentId = null;
            sections.forEach(function (sec) {
                if (sec.offsetTop <= scrollPos) {
                    currentId = sec.getAttribute('id');
                }
            });

            navLinks.forEach(function (link) {
                link.classList.remove('active');
                var href = link.getAttribute('href');
                if (href === '#' + currentId) {
                    link.classList.add('active');
                }
            });
        }

        window.addEventListener('scroll', onScroll);
        onScroll();

        var navbarCollapseEl = document.getElementById('navbarContent');
        navLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (navbarCollapseEl && navbarCollapseEl.classList.contains('show')) {
                    if (window.bootstrap && window.bootstrap.Collapse) {
                        var collapseInstance = window.bootstrap.Collapse.getInstance(navbarCollapseEl)
                            || new window.bootstrap.Collapse(navbarCollapseEl, { toggle: false });
                        collapseInstance.hide();
                    } else {
                        navbarCollapseEl.classList.remove('show');
                    }
                }
            });
        });
    })();

    /* ---------- 3. SMOOTH SCROLLING ---------- */
    (function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
            anchor.addEventListener('click', function (e) {
                var targetId = this.getAttribute('href');
                if (targetId.length > 1) {
                    var target = document.querySelector(targetId);
                    if (target) {
                        e.preventDefault();
                        var navbarHeight = document.getElementById('mainNavbar')
                            ? document.getElementById('mainNavbar').offsetHeight
                            : 0;
                        var top = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight + 1;
                        window.scrollTo({ top: top, behavior: 'smooth' });
                    }
                }
            });
        });
    })();

    /* ---------- 4. SCROLL-TO-TOP BUTTON ---------- */
    (function initScrollTop() {
        var btn = document.getElementById('scrollTopBtn');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 400) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();

    /* ---------- 5. SCROLL REVEAL ANIMATIONS ---------- */
    (function initReveal() {
        var revealEls = document.querySelectorAll('.reveal-up');
        if (!revealEls.length) return;

        if (!('IntersectionObserver' in window)) {
            revealEls.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        revealEls.forEach(function (el) { observer.observe(el); });
    })();

    /* ---------- 6. SKILL PROGRESS BAR ANIMATION ---------- */
    (function initSkillBars() {
        var bars = document.querySelectorAll('.skill-progress-bar');
        if (!bars.length) return;

        if (!('IntersectionObserver' in window)) {
            bars.forEach(function (bar) {
                bar.style.width = (bar.getAttribute('data-percent') || 0) + '%';
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var bar = entry.target;
                    var percent = bar.getAttribute('data-percent') || 0;
                    bar.style.width = percent + '%';
                    observer.unobserve(bar);
                }
            });
        }, { threshold: 0.4 });

        bars.forEach(function (bar) { observer.observe(bar); });
    })();

    /* ---------- 7. STATIC CONTACT FORM ---------- */
    (function initFormValidation() {
        var form = document.getElementById('contactForm');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!form.reportValidity()) return;
            var data = new FormData(form);
            var subject = encodeURIComponent(data.get('subject') || 'Portfolio contact');
            var body = encodeURIComponent('Name: ' + data.get('name') + '\nEmail: ' + data.get('email') + '\n\n' + data.get('message'));
            window.location.href = 'mailto:your-email@example.com?subject=' + subject + '&body=' + body;
        });
    })();

    /* ---------- 8. HERO ROLE TYPING EFFECT ---------- */
    (function initTypingEffect() {
        var el = document.getElementById('typedRole');
        if (!el) return;

        var roles = ['Full Stack Developer', 'ASP.NET Core MVC Developer', 'C# Backend Developer'];
        var roleIndex = 0;
        var charIndex = 0;
        var deleting = false;

        function tick() {
            var current = roles[roleIndex];

            if (!deleting) {
                charIndex++;
                el.textContent = current.substring(0, charIndex);
                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(tick, 1600);
                    return;
                }
            } else {
                charIndex--;
                el.textContent = current.substring(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }

            setTimeout(tick, deleting ? 40 : 80);
        }

        setTimeout(tick, 1200);
    })();

});