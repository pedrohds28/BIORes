const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Conectado com sucesso ao MongoDB!"))
    .catch(error => console.error("Erro:", error));

const FavoriteSchema =  new mongoose.Schema({
    user: String,
    title: String,
    url: String
});
const Favorite = mongoose.model('Favorite', FavoriteSchema);

app.post('/favorites', async (req, res) => {
    const newFav = new Favorite(req.body);
    await newFav.save();
    res.json({ message: "Salvo com sucesso!" });
});

app.get('/favorites/:userName', async (req, res) => {
    const list = await Favorite.find({ user: req.params.userName });
    res.json(list);
});

const _PORT = process.env.PORT || 8080;
app.listen(_PORT, () => console.log(`API rodando na porta ${_PORT}`));