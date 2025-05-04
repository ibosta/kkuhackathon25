const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
} = require('../controllers/appointmentController');

router.get('/', auth, getAllAppointments);
router.get('/:id', auth, getAppointmentById);
router.post('/', auth, createAppointment);
router.put('/:id', auth, updateAppointment);
router.delete('/:id', auth, deleteAppointment);

module.exports = router;