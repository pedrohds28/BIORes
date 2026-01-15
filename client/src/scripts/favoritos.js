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
        console.error("[Favoritos] Erro ao carregar lista de favoritos:", error);
        container.innerHTML = '<div class="note"><b>Erro ao carregar favoritos.</b></div>';
    }
}