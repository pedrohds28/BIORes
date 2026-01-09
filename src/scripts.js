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

// Save as Favorite Logic
async function favoritar(user, title) {
    const url = window.location.pathname;

    const data = {
        user: user,
        title: title,
        url: url
    };

    try {
        const response = await fetch('http://localhost:8080/favorites', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        alert(result.message);
    } catch (error) {
        console.error("Erro na conexão com a API!", error);
    }
}