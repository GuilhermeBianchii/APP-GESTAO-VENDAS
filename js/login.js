function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

function validatePassword(password) {
    return password.length >= 6; // Exemplo: comprimento mínimo da senha
}

function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!validateEmail(email)) {
        alert('Por favor, insira um endereço de e-mail válido.');
        return;
    }

    if (!validatePassword(password)) {
        alert('A senha deve ter pelo menos 6 caracteres.');
        return;
    }

    // Simula a verificação de credenciais (substitua pela verificação real no banco de dados)
    const validCredentials = {
        email: 'user@example.com',
        password: 'password123'
    };

    if (email === validCredentials.email && password === validCredentials.password) {
        window.location.href = 'dashboard.html'; // Redireciona para o painel
    } else {
        alert('E-mail ou senha inválidos. Por favor, tente novamente.');
    }
}

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    login();
});