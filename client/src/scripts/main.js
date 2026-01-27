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

// Is logged Functions
const profileToggle = document.getElementById('profile-toggle');
const logoutBtn = document.getElementById('logout-btn');

function verifyLogin(loginURL, profileURL) {
    const userName = localStorage.getItem('userName');

    if (userName) {
        console.log(`[Auth] Usuário logado: ${userName}`);
        logoutBtn.style.display = 'inline-block';
        const display = document.getElementById('userName-display');
        if (display) { display.innerText = `, ${userName},` }
        profileToggle.innerText = 'Perfil';
        profileToggle.href = profileURL.toString();
    } else {
        console.log(`[Auth] Usuário deslogou!`);
        logoutBtn.styles.display = 'none';
        const display = document.getElementById('userName-display');
        if (display) { display.innerText = '' }
        profileToggle.innerText = 'Login';
        profileToggle.href = loginURL.toString();
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/client/index.html'
}

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