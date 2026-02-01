let currentResumo = '';

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
            const resumoData = await response.json();
            const resumoContainer = document.getElementById('resumo-container');
            
            resumoContainer.innerHTML = `
                <h1>${resumoData.category}</h1>
                <hr>
                <h2>${resumoData.title}</h2>
                ${resumoData.content}
            `;

            currentResumo = resumoData._id;

            checkFavoriteStatus();
        } else {
            showToast('Resumo não encontrado', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
    }
});

async function checkFavoriteStatus() {
    const token = localStorage.getItem('token');
    const favoriteBtn = document.getElementById('favorite-btn');

    if (!token || !favoriteBtn) { return; }

    try {
        const response = await fetch(`http://localhost:5000/api/auth/user`, {
            headers: { 'x-auth-token': token }
        });
        const user = await response.json();

        if (user.favorites && user.favorites.includes(currentResumo)) {
            favoriteBtn.innerText = '★';
            favoriteBtn.dataset.active = 'true';
        } else {
            favoriteBtn.innerText = '☆';
            favoriteBtn.dataset.active = 'false';
        }
    } catch (error) {
        console.error('Erro ao verificar favoritos:', error);
    }
}

async function toggleFavorito() {
    const token = localStorage.getItem('token');
    if (!token) {
        showToast("Faça login para favoritar!", "info");
        return;
    }

    const res = await fetch('http://localhost:5000/api/auth/favorites', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'x-auth-token': token 
        },
        body: JSON.stringify({ resumoId: currentResumo })
    });

    if (res.ok) {
        checkFavoriteStatus();
        showToast("Lista de favoritos atualizada!", "success");
    }
}