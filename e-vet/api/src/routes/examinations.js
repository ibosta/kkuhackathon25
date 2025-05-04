const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllExaminations,
    getExaminationById,
    createExamination,
    updateExamination,
    deleteExamination,
    getExaminationsByAnimal,
    getExaminationsByVet
} = require('../controllers/examinationController');

router.get('/', auth, getAllExaminations);
router.get('/:id', auth, getExaminationById);
router.get('/animal/:animalId', auth, getExaminationsByAnimal);
router.get('/vet/:vetId', auth, getExaminationsByVet);
router.post('/', auth, checkRole(['veteriner']), createExamination);
router.put('/:id', auth, checkRole(['veteriner']), updateExamination);
router.delete('/:id', auth, checkRole(['veteriner', 'admin']), deleteExamination);

module.exports = router;