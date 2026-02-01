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
function verifyLogin() {
    const token = localStorage.getItem('token');
    const profileToggle = document.getElementById('profile-toggle');
    const logoutBtn = document.getElementById('logout-btn');

    const isInPagesDir = window.location.pathname.includes('/pages/');

    const loginLink = isInPagesDir ? 'login.html' : 'src/pages/login.html';
    const profileLink = isInPagesDir ? 'profile.html' : 'src/pages/profile.html';

    if (token) {
        if (profileToggle) {
            profileToggle.innerText = 'Perfil';
            profileToggle.href = profileLink;
        }

        if (logoutBtn) { logoutBtn.style.display = 'block'; }
    } else {
        if (profileToggle) {
            profileToggle.innerText = 'Login';
            profileToggle.href = loginLink;
        }

        if (logoutBtn) { logoutBtn.style.display = 'none'; }
    }
}

function logout() {
    localStorage.clear();
    const isInPagesDir = window.location.pathname.includes('/pages/');
    window.location.href = isInPagesDir ? 'login.html' : 'src/pages/login.html';
}

document.addEventListener('DOMContentLoaded', verifyLogin);