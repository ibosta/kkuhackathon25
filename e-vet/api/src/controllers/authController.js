const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;

        const userExists = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Bu e-posta zaten kullanımda' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const result = await db.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, name, role',
            [email, hashedPassword, name, role]
        );

        const token = jwt.sign(
            { id: result.rows[0].id, role: result.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Kayıt hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ message: 'Geçersiz e-posta veya şifre' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    register,
    login
};