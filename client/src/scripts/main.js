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