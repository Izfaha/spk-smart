const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Routes Import
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const alternatifRoutes = require('./routes/alternatifRoutes');
const kriteriaRoutes = require('./routes/kriteriaRoutes');
const penilaianRoutes = require('./routes/penilaianRoutes');
const laporanRoutes = require('./routes/laporanRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// === MIDDLEWARE (Best Practice Security) ===
app.use(helmet()); // Mengamankan Header HTTP
app.use(cors());   // Mengizinkan Frontend mengakses Backend
app.use(morgan('dev')); // Logging request ke console
app.use(express.json()); // Parsing body JSON

// === ROUTING ===
app.get('/', (req, res) => {
    res.json({ message: 'API SPK SMART is Running...' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alternatif', alternatifRoutes);
app.use('/api/kriteria', kriteriaRoutes);
app.use('/api/penilaian', penilaianRoutes);
app.use('/api/laporan', laporanRoutes);

// === ERROR HANDLING (Global) ===
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        status: 'error', 
        message: 'Terjadi kesalahan pada server' 
    });
});

// === SERVER START ===
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});