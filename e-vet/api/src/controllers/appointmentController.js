const db = require('../config/database');

const getAllAppointments = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                a.id,
                a.appointment_date,
                a.reason,
                a.status,
                a.notes,
                an.name as animal_name,
                an.species as animal_species,
                o.name as owner_name,
                o.phone as owner_phone,
                u.name as vet_name
            FROM appointments a
            LEFT JOIN animals an ON a.animal_id = an.id
            LEFT JOIN owners o ON an.owner_id = o.id
            LEFT JOIN users u ON a.vet_id = u.id
            ORDER BY a.appointment_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getAppointmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT 
                a.*,
                an.name as animal_name,
                an.species as animal_species,
                o.name as owner_name,
                o.phone as owner_phone,
                u.name as vet_name
            FROM appointments a
            LEFT JOIN animals an ON a.animal_id = an.id
            LEFT JOIN owners o ON an.owner_id = o.id
            LEFT JOIN users u ON a.vet_id = u.id
            WHERE a.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createAppointment = async (req, res) => {
    try {
        const { animal_id, appointment_date, reason, notes } = req.body;
        const result = await db.query(
            `INSERT INTO appointments (
                animal_id, vet_id, appointment_date, reason, notes
            ) VALUES ($1, $2, $3, $4, $5) 
            RETURNING *`,
            [animal_id, req.user.id, appointment_date, reason, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const { appointment_date, reason, status, notes } = req.body;
        
        const result = await db.query(
            `UPDATE appointments 
             SET appointment_date = $1,
                 reason = $2,
                 status = $3,
                 notes = $4,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $5 
             RETURNING *`,
            [appointment_date, reason, status, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteAppointment = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM appointments WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Randevu bulunamadı' });
        }

        res.json({ message: 'Randevu başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllAppointments,
    getAppointmentById,
    createAppointment,
    updateAppointment,
    deleteAppointment
};