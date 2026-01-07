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