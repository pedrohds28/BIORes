const express = require('express');
const router = express.Router();
const Resumo = require('../models/Resumo');

router.get('/:slug', async (req, res) => {
    try {
        const resumo = await Resumo.findOne({ slug: req.params.slug });
        if (!resumo) { return res.status(404).json({ message: 'Resumo não encontrado' }); }
        res.json(resumo);
    } catch (error) {
        res.status(500).json({ message: '[Server] Erro ao buscar o resumo:', error });
    }
});

module.exports = router;