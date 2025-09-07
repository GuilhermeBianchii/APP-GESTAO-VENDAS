const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Configurar o body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname)));

// Conectar ao banco de dados SQLite
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Conectado ao banco de dados.');
});

// Criar tabela de usuários se não existir
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
)`);

// Rota para o registro de novos usuários
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('E-mail e senha são obrigatórios.');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (email, password) VALUES (?, ?)`;

        db.run(sql, [email, hashedPassword], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).send('E-mail já cadastrado.');
                }
                return res.status(500).send('Erro ao registrar usuário.');
            }
            res.status(201).send('Usuário registrado com sucesso!');
        });
    } catch (error) {
        res.status(500).send('Erro no servidor.');
    }
});

// Rota para o login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('E-mail e senha são obrigatórios.');
    }

    const sql = `SELECT * FROM users WHERE email = ?`;
    db.get(sql, [email], async (err, user) => {
        if (err) {
            return res.status(500).send('Erro no servidor.');
        }
        if (!user) {
            return res.status(404).send('Usuário não encontrado.');
        }

        const match = await bcrypt.compare(password, user.password);
        if (match) {
            res.status(200).json({ message: 'Login bem-sucedido!', redirectUrl: '/dashboard.html' });
        } else {
            res.status(401).send('Senha incorreta.');
        }
    });
});

// Rota para a página de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});


app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
