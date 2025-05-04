const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animals', require('./routes/animals'));
app.use('/api/examinations', require('./routes/examinations'));
app.use('/api/vaccines', require('./routes/vaccines'));
app.use('/api/drugs', require('./routes/drugs'));
app.use('/api/owners', require('./routes/owners'));
app.use('/api/breeds', require('./routes/breeds'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Hata yakalama middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Bir hata oluştu', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'Sunucu hatası' 
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor`);
});