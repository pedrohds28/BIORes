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

// Load Favorites Logic
async function loadFavorites(user) {
    const container = document.getElementById('favorites-list');

    try {
        const response = await fetch(`http://localhost:8080/favorites/${user}`);
        const favorites = await response.json();

        if (favorites.length === 0) {
            container.innerHTML = '<div class="note"><b>Você ainda não favoritou nenhum resumo!</b></div>';
            return;
        }

        container.innerHTML = '';

        let i = favorites.length;
        favorites.forEach(fav => {
            const card = document.createElement('div');
            card.className = 'fav-card';
            card.innerHTML = `
                <a href="${fav.url}">${fav.title}</a>
            `;
            container.appendChild(card);
            i--;
            if (favorites.length !== 1 && i !== 0) { container.appendChild(document.createElement('hr')); }
        });
    } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        container.innerHTML = '<div class="note"><b>Erro ao carregar favoritos.</b></div>';
    }
}