window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('title');
    if (!slug) {
        window.location.href = '../../index.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/resumos/slug/${slug}`);
        if (response.ok) {
            // Adicionar resumo na página
        } else {
            showToast('Resumo não encontrado', 'error');
        }
    } catch (error) {
        console.error('Erro ao carregar resumo:', error);
    }
});