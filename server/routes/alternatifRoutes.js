// server/routes/alternatifRoutes.js
const express = require('express');
const router = express.Router();
const alternatifController = require('../controllers/alternatifController');

router.get('/', alternatifController.getAllAlternatif);
router.post('/', alternatifController.createAlternatif);
router.put('/:id', alternatifController.updateAlternatif);
router.delete('/:id', alternatifController.deleteAlternatif);

module.exports = router;