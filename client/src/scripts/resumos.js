let currentResumoId = '';

window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('title');

    if (!slug) {
        window.location.href = '../../index.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/resumos/${slug}`);
        if (response.ok) {
            const data = await response.json();
            currentResumoId = data._id;
            
            document.getElementById('resumo-container').innerHTML = `
                <h1>${data.category}</h1>
                <hr>
                <h2>${data.title}</h2>
                ${data.content}
            `;

            checkFavoriteStatus();
        } else {
            showToast('Resumo não encontrado', 'error');
        }
    } catch (error) {
        console.error('[API] Erro ao carregar:', error);
    }
});

async function checkFavoriteStatus() {
    const token = localStorage.getItem('token');
    const favoriteBtn = document.getElementById('favorite-btn');

    if (!token || !favoriteBtn) { return; }

    try {
        const res = await fetch(`http://localhost:5000/api/auth/user`, {
            headers: { 'x-auth-token': token }
        });
        const user = await res.json();

        const isFavorited = user.favorites?.some(fav => {
            const id = typeof fav === 'object' ? fav._id : fav;
            return id === currentResumoId;
        });
        
        favoriteBtn.innerText = isFavorited ? '★' : '☆';
        favoriteBtn.dataset.active = isFavorited;
    } catch (error) {
        console.error('[API] Erro nos favoritos:', error);
    }
}

async function toggleFavorito() {
    const token = localStorage.getItem('token');
    if (!token) { showToast('Faça login para favoritar!', 'info'); }

    try {
        const res = await fetch('http://localhost:5000/api/auth/favorites', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'x-auth-token': token 
            },
            body: JSON.stringify({ resumoId: currentResumoId })
        });

        if (res.ok) {
            checkFavoriteStatus();
            showToast('Favoritos atualizados!');
        }
    } catch (error) {
        showToast('Erro ao processar favorito.', 'error');
    }
}