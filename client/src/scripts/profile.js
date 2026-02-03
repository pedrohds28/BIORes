// [UI] Load User Profile and Favorites
window.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const displayName = document.getElementById('display-name');
    const displayEmail = document.getElementById('display-email');
    const favoritesList = document.getElementById('favorites-list');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/auth/user', {
            headers: { 'x-auth-token': token }
        });

        if (response.ok) {
            const user = await response.json();

            if (displayName) { displayName.innerText = user.name; }
            if (displayEmail) { displayEmail.innerText = user.email; }
            if (favoritesList && user.favorites && user.favorites.length > 0) {
                favoritesList.innerHTML = user.favorites.map((resumo) => `
                    <div class="fav-card">
                        <div class="fav-infos">
                            <b>${resumo.title || 'Título Indisponível'}</b>
                            <span>${resumo.category || 'Categoria Indisponível'}</span>
                        </div>
                        <div class="fav-functions">
                            <a href="resumos.html?title=${resumo.slug}">Acessar</a>
                            <button onclick="removeFavorite('${resumo._id}')">Remover</button>
                        </div>
                    </div>
                `).join('');
            } else {
                favoritesList.innerHTML = '<h4>Você ainda não salvou nenhum resumo.</h4>';
            }
        }
    } catch (error) {
        console.error('[Profile] Erro ao carregar favoritos:', error);
        favoritesList.innerHTML = '<h4>Erro ao carregar os favoritos!</h4>';
    }
});

// [UI] Remove Favorite
async function removeFavorite(resumoId) {
    const token = localStorage.getItem('token');

    try {        
        const response = await fetch(`http://localhost:5000/api/auth/favorites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({ resumoId })
        });
    
        if (response.ok) {
            showToast('Removido dos favoritos!');
            setTimeout(() => { location.reload(); }, 1500);
        }
    } catch (error) {
        console.error('[Profile] Erro ao remover favorito:', error);
        showToast('Erro ao remover favorito!', 'error');
    }
}