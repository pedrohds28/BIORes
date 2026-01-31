const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register Route
router.post('/signup', async (req, res) => {
    try {
        console.log("Dados recebidos no signup:", req.body); // Deletar depois

        const { name, email, password } = req.body;

        if (!name || !email || !password) { return res.status(400).json({ message: "Preencha todos os campos!" }); }

        let user = await User.findOne({ email });
        if (user) { return res.status(400).json({ message: 'Este email já está cadastrado.' }); }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name: name,
            email: email,
            password: hashedPassword
        });
        await user.save();

        console.log("Usuário cadastrado com sucesso"); // Deletar depois
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error("Erro no signup:", error);
        res.status(500).json({ message: 'Erro interno no servidor:', error: error.message });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ message: 'E-mail incorreto.' }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(400).json({ message: 'Senha incorreta.' }); }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            token,
            user: { nome: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor ao fazer login.' });
    }
});

module.exports = router;