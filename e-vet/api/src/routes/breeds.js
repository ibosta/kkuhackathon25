const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllBreeds,
    getBreedById,
    getBreedsBySpecies,
    createBreed,
    updateBreed,
    deleteBreed
} = require('../controllers/breedController');

router.get('/', auth, getAllBreeds);
router.get('/:id', auth, getBreedById);
router.get('/species/:species', auth, getBreedsBySpecies);
router.post('/', auth, checkRole(['veteriner', 'admin']), createBreed);
router.put('/:id', auth, checkRole(['veteriner', 'admin']), updateBreed);
router.delete('/:id', auth, checkRole(['admin']), deleteBreed);

module.exports = router;