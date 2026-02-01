const mongoose = require('mongoose');

const ResumoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, required: true },
  content: { type: String, required: true }
});

module.exports = mongoose.model('Resumo', ResumoSchema);