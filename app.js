/* ============================================================
   Ae Language — 前端逻辑
   - 单页路由（hash-based）
   - 移动端导航
   - 滚动效果
   - 文档页侧边栏导航高亮
   ============================================================ */

(function () {
    'use strict';

    /* ---------- 路由 ---------- */
    const pages = ['home', 'download', 'docs'];

    function showPage(pageId) {
        // 隐藏所有页面
        pages.forEach(function (id) {
            const el = document.getElementById('page-' + id);
            if (el) el.style.display = 'none';
        });

        // 显示目标页面
        const target = document.getElementById('page-' + pageId);
        if (target) target.style.display = 'block';

        // 更新导航高亮
        document.querySelectorAll('.nav-link').forEach(function (link) {
            link.classList.toggle('active', link.dataset.page === pageId);
        });

        // 滚动到顶部
        window.scrollTo(0, 0);

        // 更新 URL hash（不触发滚动）
        const hash = pageId === 'home' ? '' : pageId;
        history.replaceState(null, '', hash ? '#' + hash : window.location.pathname);
    }

    function getPageFromHash() {
        const hash = window.location.hash.replace('#', '');
        return pages.includes(hash) ? hash : 'home';
    }

    // 拦截所有内链点击
    document.addEventListener('click', function (e) {
        const link = e.target.closest('[data-page]');
        if (!link) return;

        // 只处理同站链接
        const href = link.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const page = link.dataset.page;
            showPage(page);

            // 关闭移动端菜单
            const navLinks = document.getElementById('navLinks');
            if (navLinks) navLinks.classList.remove('open');
        }
    });

    // 浏览器前进后退
    window.addEventListener('hashchange', function () {
        showPage(getPageFromHash());
    });

    /* ---------- 移动端导航 ---------- */
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });

        // 点击外部关闭
        document.addEventListener('click', function (e) {
            if (!e.target.closest('.navbar')) {
                navLinks.classList.remove('open');
            }
        });
    }

    /* ---------- 导航栏滚动阴影 ---------- */
    const navbar = document.getElementById('navbar');
    let ticking = false;

    function updateNavbar() {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    /* ---------- 文档页：侧边栏导航高亮 (ScrollSpy) ---------- */
    const docsNavLinks = document.querySelectorAll('.docs-nav-link');
    const docSections = document.querySelectorAll('.doc-section');

    if (docsNavLinks.length > 0 && docSections.length > 0) {
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -60% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    docsNavLinks.forEach(function (link) {
                        link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, observerOptions);

        docSections.forEach(function (section) {
            observer.observe(section);
        });

        // 点击导航平滑滚动
        docsNavLinks.forEach(function (link) {
            link.addEventListener('click', function (e) {
                const targetId = link.getAttribute('href').replace('#', '');
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 80;
                    const top = target.getBoundingClientRect().top + window.scrollY - offset;
                    window.scrollTo({ top: top, behavior: 'smooth' });
                }
            });
        });
    }

    /* ---------- 初始化 ---------- */
    showPage(getPageFromHash());

})();
