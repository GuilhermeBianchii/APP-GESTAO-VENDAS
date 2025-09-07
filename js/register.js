document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (password.length < 6) {
        alert('A senha deve ter no mínimo 6 caracteres.');
        return;
    }

    try {
        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const message = await response.text();
        alert(message);

        if (response.ok) {
            window.location.href = '/index.html';
        }
    } catch (error) {
        console.error('Erro ao registrar:', error);
        alert('Ocorreu um erro ao tentar registrar. Tente novamente.');
    }
});
