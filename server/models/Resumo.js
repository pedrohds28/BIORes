const mongoose = require('mongoose');

const ResumoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categoria: { type: String, required: true },
  conteudo: { type: String, required: true }
});

module.exports = mongoose.model('Resumo', ResumoSchema);