const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("[Database] Conexão estabelecida com secesso ao MongoDB."))
    .catch(error => console.error("[Database] Erro fatal na conexão:", error));

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: "Acesso negado. Faça login!" });
    jwt.verify(token, process.env.JWT_TOKEN, (error, user) => {
        if (error) { return res.status(403).json({ message: "Token inválido ou expirado." }) }
        req.user = user;
        next();
    });
};

const FavoriteSchema =  new mongoose.Schema({
    user: String,
    title: String,
    url: String
});
const Favorite = mongoose.model('Favorite', FavoriteSchema);

app.post('/favorites', authenticateToken, async (req, res) => {
    try {
        const newFav = new Favorite({ ...req.body, user: req.body.user });
        await newFav.save();
        res.json({ message: "Resumo salvo nos favoritos!" });
    } catch (error) {
        console.error("[API] Erro ao salvar favorito:", error);
        res.status(500).json({ message: "Erro ao salvar favorito." });
    }
});

app.get('/favorites/check', authenticateToken, async (req, res) => {
    const { user, url } = req.query;
    try {
        const exists = await Favorite.findOne({ user: user, url: url });
        res.json({ favorited: !!exists });
    } catch (error) {
        console.error("[API] Erro na verificação de status:", error);
        res.status(500).json({error: "Erro interno na verificação." });
    }
});

app.get('/favorites/:userEmail', authenticateToken, async (req, res) => {
    try {
        const list = await Favorite.find({ user: req.params.userEmail });
        res.json(list);
    } catch (error) {
        console.error("[API] Erro ao buscar lista por usuário:", error);
        res.status(500).json({ error: "Erro ao buscar favoritos." });
    }
});

app.delete('/favorites', authenticateToken, async (req, res) => {
    const { user, url } = req.body;
    try {
        await Favorite.findOneAndDelete({ user: user, url: url });
        res.json({ message: "Removido dos favoritos!" })
    } catch (error) {
        console.error("[API] Erro ao deletar favorito:", error);
        res.status(500).json({ message: "Erro ao remover favorito." });
    }
});

app.post('/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "Este e-mail já está cadastrado!" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser =  new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "Usuário criado!" });
    } catch (error) {
        console.error("[Auth] Erro no cadastro:", error);
        res.status(500).json({ message: "Erro ao criar conta." });
    }
});

app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "E-mail ou senha incorretos." });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "E-mail ou senha incorretos." });
        }
        const token = jwt.sign(
            { id: user._id, name: user.name, email: user.email },
            process.env.JWT_TOKEN,
            { expiresIn: '1d' }
        );
        res.json({
            message: "Login realizado com sucesso!",
            token,
            userName: user.name,
            userEmail: user.email
        });
    } catch (error) {
        console.error("[Auth] Erro no login:", error);
        res.status(500).json({ message: "Erro interno no servidor." })
    }
});

const _PORT = process.env.PORT || 8080;
app.listen(_PORT, () => console.log(`[Server] API ativa e rodando na porta ${_PORT}.`));