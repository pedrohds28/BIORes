// Check Favorites Logic
async function uploadStatusBtn(user) {
    const url = window.location.pathname;
    const btn = document.getElementById('fav-btn');

    if (!btn) {
        console.warn("[Favoritos] Botão de favoritos não encontrado na página.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/favorites/check?user=${user}&url=${url}`);
        const data = await response.json();
    
        if (data.favorited) {
            btn.innerText= '★';
            btn.dataset.active = "true";
        } else {
            btn.innerText = '☆';
            btn.dataset.active = "false";
        }
    } catch(error) {
        console.error("[Favoritos] Erro ao verificar status do botão:", error);
    }
}

// Save/Delete as Favorite Logic
async function favoritar(user, title) {
    const url = window.location.pathname;
    const btn = document.getElementById('fav-btn');
    const isFavorite = btn.dataset.active === "true";

    const method = isFavorite? 'DELETE': 'POST';

    const data = {
        user: user,
        title: title,
        url: url
    };

    try {
        const response = await fetch('http://localhost:8080/favorites', {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (isFavorite) {
            btn.innerText = '☆';
            btn.dataset.active = "false";
        } else {
            btn.innerText= '★';
            btn.dataset.active = "true";
        }

        alert(result.message);
    } catch (error) {
        console.error("[Favoritos] Erro ao processar o clique no favorito:", error);
    }
}

window.addEventListener('DOMContentLoaded', () => { uploadStatusBtn('John Doe') });