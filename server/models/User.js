const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Resumo' }],
  marcacoes: [{
    idResumo: { type: mongoose.Schema.Types.ObjectId, ref: 'Resumo' },
    texto: String,
    data: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('User', UserSchema);