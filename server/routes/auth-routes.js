const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// [POST] Signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) { return res.status(400).json({ message: 'Preencha todos os campos!' }); }

        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'Este email já está cadastrado.' }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({ name: name, email: email, password: hashedPassword });
        await user.save();

        console.log(`Novo usuário cadastrado: ${email}`);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error("[Auth] Erro no signup:", error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
});

// [POST] Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) { return res.status(400).json({ message: 'E-mail ou senha incoretos.' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'E-mail ou senha incoretos.' }); }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({
            token,
            user: { nome: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao fazer login' });
    }
});

// [GET] User Data
router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: '[API] Erro ao buscar dados do usuário.' });
    }
});

// [POST] Toggle Favorites
router.post('/favorites', auth, async (req, res) => {
    try {
        const { resumoId } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.favorites.indexOf(resumoId);
        if (index === -1) {
            user.favorites.push(resumoId);
        } else {
            user.favorites.splice(index, 1);
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (error) {
        console.error('[Auth] Erro ao favoritar:', error)
        res.status(500).json({ message: 'Erro ao salvar favorito' });
    }
});

module.exports = router;