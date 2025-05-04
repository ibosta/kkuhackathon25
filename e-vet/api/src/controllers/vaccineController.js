const db = require('../config/database');

const getAllVaccines = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM vaccines
            ORDER BY vaccine_name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getVaccineById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT * FROM vaccines WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aşı bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getVaccinesByAnimal = async (req, res) => {
    try {
        const { animalId } = req.params;
        const result = await db.query(`
            SELECT v.*, 
                   vac.vaccine_name,
                   vac.disease_target,
                   u.name as vet_name
            FROM vaccinations v
            LEFT JOIN vaccines vac ON v.vaccine_id = vac.id
            LEFT JOIN users u ON v.vet_id = u.id
            WHERE v.animal_id = $1
            ORDER BY v.vaccination_date DESC
        `, [animalId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getUpcomingVaccinations = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT v.*,
                   a.name as animal_name,
                   a.species as animal_species,
                   o.name as owner_name,
                   o.phone as owner_phone,
                   vac.vaccine_name
            FROM vaccinations v
            LEFT JOIN animals a ON v.animal_id = a.id
            LEFT JOIN owners o ON a.owner_id = o.id
            LEFT JOIN vaccines vac ON v.vaccine_id = vac.id
            WHERE v.next_vaccination_date IS NOT NULL
            AND v.next_vaccination_date > CURRENT_DATE
            ORDER BY v.next_vaccination_date ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createVaccine = async (req, res) => {
    try {
        const {
            vaccine_name,
            disease_target,
            species,
            vaccine_type,
            application_method,
            notes
        } = req.body;

        const result = await db.query(
            `INSERT INTO vaccines (
                vaccine_name, disease_target, species,
                vaccine_type, application_method, notes
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [vaccine_name, disease_target, species, 
             vaccine_type, application_method, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateVaccine = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            vaccine_name,
            disease_target,
            species,
            vaccine_type,
            application_method,
            notes
        } = req.body;

        const result = await db.query(
            `UPDATE vaccines 
             SET vaccine_name = $1,
                 disease_target = $2,
                 species = $3,
                 vaccine_type = $4,
                 application_method = $5,
                 notes = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 
             RETURNING *`,
            [vaccine_name, disease_target, species, 
             vaccine_type, application_method, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aşı bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteVaccine = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM vaccines WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Aşı bulunamadı' });
        }

        res.json({ message: 'Aşı başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllVaccines,
    getVaccineById,
    createVaccine,
    updateVaccine,
    deleteVaccine,
    getVaccinesByAnimal,
    getUpcomingVaccinations
};