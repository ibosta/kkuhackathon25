const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllDrugs,
    getDrugById,
    createDrug,
    updateDrug,
    deleteDrug,
    getDrugsBySpecies
} = require('../controllers/drugController');

router.get('/', auth, getAllDrugs);
router.get('/:id', auth, getDrugById);
router.get('/species/:species', auth, getDrugsBySpecies);
router.post('/', auth, checkRole(['veteriner', 'admin']), createDrug);
router.put('/:id', auth, checkRole(['veteriner', 'admin']), updateDrug);
router.delete('/:id', auth, checkRole(['admin']), deleteDrug);

module.exports = router;