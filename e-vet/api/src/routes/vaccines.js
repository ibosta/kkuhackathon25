const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllVaccines,
    getVaccineById,
    createVaccine,
    updateVaccine,
    deleteVaccine,
    getVaccinesByAnimal,
    getUpcomingVaccinations
} = require('../controllers/vaccineController');

router.get('/', auth, getAllVaccines);
router.get('/:id', auth, getVaccineById);
router.get('/animal/:animalId', auth, getVaccinesByAnimal);
router.get('/upcoming', auth, getUpcomingVaccinations);
router.post('/', auth, checkRole(['veteriner', 'admin']), createVaccine);
router.put('/:id', auth, checkRole(['veteriner', 'admin']), updateVaccine);
router.delete('/:id', auth, checkRole(['admin']), deleteVaccine);

module.exports = router;