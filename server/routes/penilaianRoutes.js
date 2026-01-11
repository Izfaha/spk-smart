const express = require('express');
const router = express.Router();
const penilaianController = require('../controllers/penilaianController');

router.get('/', penilaianController.getPenilaianMatrix);
router.post('/', penilaianController.savePenilaian);

module.exports = router;