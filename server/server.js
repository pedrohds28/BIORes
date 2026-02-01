const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, { family: 4 })
    .then(() => console.log('[Database] MongoDB Local conectado com sucesso!'))
    .catch(error => console.error('[Database] Erro de conexão:', error));

// Routes
app.use('/api/auth', require('./routes/auth-routes'));
app.use('/api/resumos', require('./routes/resumo-routes'));

// 404 Handler
app.use((req, res) => { res.status(404).json({ message: '[Server] Rota não encontrada ou em manutenção.' }); });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`[Server] Ativo em: http://localhost:${PORT}`) });