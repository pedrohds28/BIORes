// Login/Register Toggle Button Form
const loginForm = document.getElementById('login-form');
const formTitle = document.getElementById('form-title');
const nameField = document.getElementById('name-field');
const formBtn = document.getElementById('form-btn');
const toggleLink = document.getElementById('toggle-link');

let isLogin = true;

toggleLink.addEventListener('click', (event) => {
    event.preventDefault();
    isLogin = !isLogin;

    if (isLogin) {
        formTitle.innerText = 'Fazer Login';
        nameField.style.display = 'none';
        formBtn.innerText = 'Entrar';
        toggleLink.innerText = 'Cadastre-se!';
    } else {
        formTitle.innerText = 'Criar Conta';
        nameField.style.display = 'flex';
        formBtn.innerText = 'Cadastrar';
        toggleLink.innerText = 'Já tenho conta!';
    }
});

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const endpoint = isLogin? '/auth/login': '/auth/signup';
    const bodyData = isLogin? { email, password }: { name, email, password };

    try {
        const response = await fetch(`http://localhost:8080${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            if (!isLogin) {
                toggleLink.click();
            } else {
                console. log("Sucesso no login!");
            }
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error("[Auth] Erro na autenticação:", error);
        alert("Erro ao conectar com o servidor.");
    }
});