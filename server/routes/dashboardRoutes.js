// server/routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();

// Import controller yang baru kamu kirim tadi
const dashboardController = require('../controllers/dashboardController');

// Route path '/' ini relatif terhadap '/api/dashboard' yang ada di index.js
// Jadi ini akan menangani GET /api/dashboard/
router.get('/', dashboardController.getDashboardData);

// WAJIB ADA: Export router
module.exports = router;