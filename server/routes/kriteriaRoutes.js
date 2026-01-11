// server/routes/kriteriaRoutes.js
const express = require('express');
const router = express.Router();
const kriteriaController = require('../controllers/kriteriaController');

router.get('/', kriteriaController.getAllKriteria);
router.post('/', kriteriaController.createKriteria);
router.put('/:id', kriteriaController.updateKriteria);
router.delete('/:id', kriteriaController.deleteKriteria);

module.exports = router;