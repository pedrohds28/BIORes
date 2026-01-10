const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("[Database] Conexão estabelecida com secesso ao MongoDB."))
    .catch(error => console.error("[Database] Erro fatal na conexão:", error));

const FavoriteSchema =  new mongoose.Schema({
    user: String,
    title: String,
    url: String
});
const Favorite = mongoose.model('Favorite', FavoriteSchema);

app.post('/favorites', async (req, res) => {
    try {
        const newFav = new Favorite(req.body);
        await newFav.save();
        res.json({ message: "Resumo salvo nos favoritos!" });
    } catch (error) {
        console.error("[API] Erro ao salvar favorito:", error);
        res.status(500).json({ message: "Erro ao salvar favorito." });
    }
});

app.get('/favorites/check', async (req, res) => {
    const { user, url } = req.query;
    try {
        const exists = await Favorite.findOne({ user: user, url: url });
        res.json({ favorited: !!exists });
    } catch (error) {
        console.error("[API] Erro na verificação de status:", error);
        res.status(500).json({error: "Erro interno na verificação." });
    }
});

app.get('/favorites/:userName', async (req, res) => {
    try {
        const list = await Favorite.find({ user: req.params.userName });
        res.json(list);
    } catch (error) {
        console.error("[API] Erro ao buscar lista por usuário:", error);
        res.status(500).json({ error: "Erro ao buscar favoritos." });
    }
});

app.delete('/favorites', async (req, res) => {
    const { user, url } = req.body;
    try {
        await Favorite.findOneAndDelete({ user: user, url: url });
        res.json({ message: "Removido dos favoritos!" })
    } catch (error) {
        console.error("[API] Erro ao deletar favorito:", error);
        res.status(500).json({ message: "Erro ao remover favorito." });
    }
});

const _PORT = process.env.PORT || 8080;
app.listen(_PORT, () => console.log(`[Server] API ativa e rodando na porta ${_PORT}.`));