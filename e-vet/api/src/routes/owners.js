const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    getOwnerAnimals,
    searchOwners
} = require('../controllers/ownerController');

router.get('/', auth, getAllOwners);
router.get('/search', auth, searchOwners);
router.get('/:id', auth, getOwnerById);
router.get('/:id/animals', auth, getOwnerAnimals);
router.post('/', auth, checkRole(['veteriner', 'admin']), createOwner);
router.put('/:id', auth, checkRole(['veteriner', 'admin']), updateOwner);
router.delete('/:id', auth, checkRole(['admin']), deleteOwner);

module.exports = router;