// Load Profile Logic
async function loadProfile() {
    const userName = localStorage.getItem('userName');
    const userEmail = localStorage.getItem('userEmail');
    const token = localStorage.getItem('token');

    if (!token) {
        window.location.href = 'login.html';
    }

    document.getElementById('display-name').innerText = userName;
    document.getElementById('display-email').innerText = userEmail;

    try {
        const response = await fetch(`http://localhost:8080/favorites/${userEmail}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const favorites = await response.json();
        document.getElementById('fav-count').innerText = favorites.length;
    } catch (error) {
        console.error("Erro ao carregar stats:", error);
    }
}