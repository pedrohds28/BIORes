const loginForm = document.getElementById('login-form');
const formTitle = document.getElementById('form-title');
const nameField = document.getElementById('name-field');
const formBtn = document.getElementById('form-btn');
const toggleLink = document.getElementById('toggle-link');

let isLogin = true;

toggleLink.addEventListener('click', (event) => {
    event.preventDefault();
    isLogin = !isLogin;

    formTitle.innerText = isLogin ? 'Fazer Login' : 'Criar Conta';
    nameField.style.display = isLogin ? 'none' : 'flex';
    formBtn.innerText = isLogin ? 'Entrar' : 'Cadastrar';
    toggleLink.innerText = isLogin ? 'Cadastre-se!' : 'Já tenho conta!';
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userData = {
        email: document.getElementById('email').value,
        password: document.getElementById('password').value
    }

    if (!isLogin) { userData.name = document.getElementById('name').value; }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';

    try {
        const response = await fetch(`http://localhost:5000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const data = await response.json();
            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('userName', data.userName);
                    localStorage.setItem('userEmail', data.userEmail);
                    showToast(`Bem vindo(a), ${data.userName}!`, 'success');
                    showToast('Redirecionando...', 'info')
                    setTimeout(() => {
                        window.location.href = '../../index.html';
                    }, 5000);
                } else {
                    showToast(data.message, 'success');
                    toggleLink.click();
                }
            } else {
                showToast(data.message, 'error');    
            }
        }
    } catch (error) {
        console.error("[Auth] Erro na autenticação:", error);
        showToast("Erro na autenticação. Tente novamente.", 'error');
    }
});