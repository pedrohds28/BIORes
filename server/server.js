const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('[Database] MongoDB Cloud conectado com sucesso!'))
    .catch(error => console.error('[Database] Erro ao conectar ao MongoDB Cloud:', error));

// Rotas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`[Server] Servidor ativo na porta ${PORT}`) });