const db = require('../config/database');

const getAllExaminations = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT e.*,
                   a.name as animal_name,
                   a.species as animal_species,
                   o.name as owner_name,
                   u.name as vet_name
            FROM examinations e
            LEFT JOIN animals a ON e.animal_id = a.id
            LEFT JOIN owners o ON a.owner_id = o.id
            LEFT JOIN users u ON e.vet_id = u.id
            ORDER BY e.examination_date DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getExaminationById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT e.*,
                   a.name as animal_name,
                   a.species as animal_species,
                   o.name as owner_name,
                   u.name as vet_name
            FROM examinations e
            LEFT JOIN animals a ON e.animal_id = a.id
            LEFT JOIN owners o ON a.owner_id = o.id
            LEFT JOIN users u ON e.vet_id = u.id
            WHERE e.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Muayene kaydı bulunamadı' });
        }

        // Reçete edilen ilaçların detaylarını getir
        if (result.rows[0].prescribed_drugs && result.rows[0].prescribed_drugs.length > 0) {
            const drugs = await db.query(`
                SELECT * FROM drugs WHERE id = ANY($1)
            `, [result.rows[0].prescribed_drugs]);
            
            result.rows[0].prescribed_drugs_details = drugs.rows;
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getExaminationsByAnimal = async (req, res) => {
    try {
        const { animalId } = req.params;
        const result = await db.query(`
            SELECT e.*,
                   u.name as vet_name
            FROM examinations e
            LEFT JOIN users u ON e.vet_id = u.id
            WHERE e.animal_id = $1
            ORDER BY e.examination_date DESC
        `, [animalId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getExaminationsByVet = async (req, res) => {
    try {
        const { vetId } = req.params;
        const result = await db.query(`
            SELECT e.*,
                   a.name as animal_name,
                   a.species as animal_species,
                   o.name as owner_name
            FROM examinations e
            LEFT JOIN animals a ON e.animal_id = a.id
            LEFT JOIN owners o ON a.owner_id = o.id
            WHERE e.vet_id = $1
            ORDER BY e.examination_date DESC
        `, [vetId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createExamination = async (req, res) => {
    try {
        const {
            animal_id,
            diagnosis,
            treatment,
            prescribed_drugs,
            notes,
            examination_date,
            next_examination_date
        } = req.body;

        const result = await db.query(
            `INSERT INTO examinations (
                animal_id, vet_id, diagnosis, treatment,
                prescribed_drugs, notes, examination_date,
                next_examination_date
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [animal_id, req.user.id, diagnosis, treatment, 
             prescribed_drugs, notes, examination_date, next_examination_date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateExamination = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            diagnosis,
            treatment,
            prescribed_drugs,
            notes,
            examination_date,
            next_examination_date
        } = req.body;

        const result = await db.query(
            `UPDATE examinations 
             SET diagnosis = $1,
                 treatment = $2,
                 prescribed_drugs = $3,
                 notes = $4,
                 examination_date = $5,
                 next_examination_date = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 AND vet_id = $8
             RETURNING *`,
            [diagnosis, treatment, prescribed_drugs, notes, 
             examination_date, next_examination_date, id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Muayene kaydı bulunamadı veya düzenleme yetkiniz yok' 
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteExamination = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(
            'DELETE FROM examinations WHERE id = $1 AND vet_id = $2 RETURNING *',
            [id, req.user.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ 
                message: 'Muayene kaydı bulunamadı veya silme yetkiniz yok' 
            });
        }

        res.json({ message: 'Muayene kaydı başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllExaminations,
    getExaminationById,
    createExamination,
    updateExamination,
    deleteExamination,
    getExaminationsByAnimal,
    getExaminationsByVet
};