// Load Favorites Logic
async function loadFavorites() {
    const user = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');
    const container = document.getElementById('favorites-list');

    if (!token) {
        container.innerHTML = '<div class="note"><b>Faça login para ver seus favoritos.</b></div>';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/favorites/${user}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada! Faça login novamente.");
            logout();
            return;
        }

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