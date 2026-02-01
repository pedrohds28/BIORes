// Hamburguer Menu Logic
const openMenuBtn = document.getElementById('openMenu');
const closeMenuBtn = document.getElementById('closeMenu');
const menu = document.getElementById('menu');
const overlay = document.getElementById('overlay');

openMenuBtn.addEventListener('click', () => {
    menu.classList.add('active');
    overlay.classList.add('active');
});

const _closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
};

closeMenuBtn.addEventListener('click', _closeMenu);
overlay.addEventListener('click', _closeMenu);

// Toast Logic
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
        toast.addEventListener('animationend', () => {
            toast.remove();
        });
    }, 3000);
}

// Is Logged Logic
function verifyLogin() {
    const token = localStorage.getItem('token');
    const profileToggle = document.getElementById('profile-toggle');
    const logoutBtn = document.getElementById('logout-btn');

    const path = window.location.pathname;
    let loginLink, profileLink;

    if (path.includes('/pages/')) {
        loginLink = 'login.html';
        profileLink = 'profile.html';
    } else {
        loginLink = 'src/pages/login.html';
        profileLink = 'src/pages/profile.html';
    }

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
    
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        window.location.href = '../../index.html';
    } else {
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', verifyLogin);