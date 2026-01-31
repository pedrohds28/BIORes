const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Express App Setup
const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  family: 4
})
    .then(() => console.log('[Database] MongoDB Cloud conectado com sucesso!'))
    .catch(error => console.error('[Database] Erro ao conectar ao MongoDB Cloud:', error));

// Routes
app.use('/api/auth', require('./routes/auth-routes'));
app.use('/api/resumos', require('./routes/resumo-routes'));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => { console.log(`[Server] Servidor ativo na porta ${PORT}`) });