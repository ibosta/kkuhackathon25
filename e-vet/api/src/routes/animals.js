const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalsByOwner,
    getAnimalsBySpecies
} = require('../controllers/animalController');

router.get('/', auth, getAllAnimals);
router.get('/:id', auth, getAnimalById);
router.get('/owner/:ownerId', auth, getAnimalsByOwner);
router.get('/species/:species', auth, getAnimalsBySpecies);
router.post('/', auth, checkRole(['veteriner', 'admin']), createAnimal);
router.put('/:id', auth, checkRole(['veteriner', 'admin']), updateAnimal);
router.delete('/:id', auth, checkRole(['admin']), deleteAnimal);

module.exports = router;