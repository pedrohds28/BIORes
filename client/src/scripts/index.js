window.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const userName = localStorage.getItem('userName');

    if (token) {
        const welcomeMsg = document.getElementById('welcome-message');
        if (welcomeMsg) { welcomeMsg.innerText = `Bem vindo(a), ${userName}, ao BIORes!`; }
    }
});