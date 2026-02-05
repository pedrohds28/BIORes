// Global Variables
let allResumos = [];

// [API] Load Resumos
async function loadNavbar() {
    try {
        const response = await fetch('http://localhost:5000/api/resumos');
        allResumos = await response.json();
        renderNavbar(allResumos);
        initSearch();
    } catch (error) {
        console.error('[Navbar] Erro ao carregar resumos:', error);
    }
}

// [UI] Render Navbar
async function renderNavbar(resumos) {
    const navbar = document.querySelector('nav');
    if (!navbar) { return; }

    const isInPagesDir = window.location.pathname.includes('/pages/');
    const urlBase = isInPagesDir ? 'resumos.html' : 'src/pages/resumos.html';

    try {
        const categoryIcons = {
            'Zoologia': '🐾',
            'Botânica': '🌱',
            'Biologia Celular': '🔬',
            'Genética': '🧬',
            'Sistemática Biológica': '🌿'
        };

        const grouped = resumos.reduce((acc, resumo) => {
            if (!acc[resumo.category]) { acc[resumo.category] = []; }
            acc[resumo.category].push(resumo);
            return acc;
        }, {});

        let navHTML = '';
        for (const category in grouped) {
            const icon = categoryIcons[category] || '📚';
            navHTML += `
                <details class="dropdown" name="dropdown">
                    <summary class="dropdown-btn">
                        ${icon} ${category}
                        <span class="icon"></span>
                    </summary>
                    <div class="dropdown-content">
                        <ul>
                            ${grouped[category].map(resumo => `
                                <li><a href="${urlBase}?title=${resumo.slug}">${resumo.title}</a></li>
                            `).join('')}
                        </ul>
                    </div>
                </details>
            `;
        }

        navbar.innerHTML = navHTML;
    } catch (error) {
        console.error('[Navbar] Erro ao carregar navbar:', error);
    }
}

// [Search] Real-time Search Functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (!searchInput || !searchResults) { return; }

    searchInput.addEventListener('input', (event) => {
        const term = event.target.value.toLowerCase();

        if (term.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const filtered = allResumos.filter(resumo => resumo.title.toLowerCase().includes(term) || resumo.category.toLowerCase().includes(term));

        renderSearchResults(filtered, searchResults);
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.search-container')) { searchResults.style.display = 'none'; }
    });
}

// [UI] Render Search Results
function renderSearchResults(results, container) {
    if (results.length === 0) {
        container.innerHTML = '<div class="search-item">Nenhum resultado encontrado.</div>';
    } else {
        const isInPagesDir = window.location.pathname.includes('/pages/');
        const urlBase = isInPagesDir ? 'resumos.html' : 'src/pages/resumos.html';

        container.innerHTML = results.map(resumo => `
            <a href="${urlBase}?title=${resumo.slug}">
                <span class="search-title">${resumo.title}</span>
                <span class="search-category">${resumo.category}</span>
            </a>
        `).join('');
    }
    container.style.display = 'block';
}

// [UI] Menu Hamburguer
const openMenuBtn = document.getElementById('openMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');

if (openMenuBtn) {
    openMenuBtn.addEventListener('click', () => {
        menu.classList.add('active');
        overlay.classList.add('active');
    });
}

const _closeMenu = () => {
    menu?.classList.remove('active');
    overlay?.classList.remove('active');
};

closeMenuBtn?.addEventListener('click', _closeMenu);
overlay?.addEventListener('click', _closeMenu);

// [UI] Toast Notification
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('fade-out');
        toast.addEventListener('animationend', () => { toast.remove(); });
    }, 3000);
}

// [Auth] Verify Login Status
async function verifyLogin() {
    const token = localStorage.getItem('token');
    const profileToggle = document.getElementById('profile-toggle');
    const logoutBtn = document.getElementById('logout-btn');

    const isInPagesDir = window.location.pathname.includes('/pages/');
    const loginLink = isInPagesDir ? 'login.html' : 'src/pages/login.html';
    const profileLink = isInPagesDir ? 'profile.html' : 'src/pages/profile.html';

    if (!token) {
        setLoggedOutUI(profileToggle, logoutBtn, loginLink);
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            setLoggedInUI(profileToggle, logoutBtn, profileLink);
        } else {
            console.warn('[Auth] Token inválido ou expirado.');
            logout();
        }
    } catch (error) {
        console.error('[Auth] Erro ao validar login:', error);
    }
}

function setLoggedInUI(profileToggle, logoutBtn, profileLink) {
    if (profileToggle) {
        profileToggle.innerText = 'Perfil';
        profileToggle.href = profileLink;
    }
    if (logoutBtn) { logoutBtn.style.display = 'block'; }
}

function setLoggedOutUI(profileToggle, logoutBtn, loginLink) {
    if (profileToggle) {
        profileToggle.innerText = 'Login';
        profileToggle.href = loginLink;
    }
    if (logoutBtn) { logoutBtn.style.display = 'none'; }
}

function logout() {
    localStorage.clear();
    const isInPagesDir = window.location.pathname.includes('/pages/');
    window.location.href = isInPagesDir ? 'login.html' : 'src/pages/login.html';
}

// [UI] DOMContentLoaded Event
document.addEventListener('DOMContentLoaded', () => {
    loadNavbar();
    verifyLogin();
});