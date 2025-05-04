const db = require('../config/database');

const getAllAnimals = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT a.*, 
                   b.breed as breed_name,
                   o.name as owner_name,
                   o.phone as owner_phone
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            LEFT JOIN owners o ON a.owner_id = o.id
            ORDER BY a.name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getAnimalById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT a.*, 
                   b.breed as breed_name,
                   o.name as owner_name,
                   o.phone as owner_phone
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            LEFT JOIN owners o ON a.owner_id = o.id
            WHERE a.id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hayvan bulunamadı' });
        }

        // Muayene geçmişini getir
        const examinations = await db.query(`
            SELECT e.*, u.name as vet_name
            FROM examinations e
            LEFT JOIN users u ON e.vet_id = u.id
            WHERE e.animal_id = $1
            ORDER BY e.examination_date DESC
        `, [id]);

        // Aşı geçmişini getir
        const vaccinations = await db.query(`
            SELECT v.*, vac.vaccine_name, u.name as vet_name
            FROM vaccinations v
            LEFT JOIN vaccines vac ON v.vaccine_id = vac.id
            LEFT JOIN users u ON v.vet_id = u.id
            WHERE v.animal_id = $1
            ORDER BY v.vaccination_date DESC
        `, [id]);

        const animal = result.rows[0];
        animal.examinations = examinations.rows;
        animal.vaccinations = vaccinations.rows;

        res.json(animal);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getAnimalsByOwner = async (req, res) => {
    try {
        const { ownerId } = req.params;
        const result = await db.query(`
            SELECT a.*, 
                   b.breed as breed_name
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.owner_id = $1
            ORDER BY a.name ASC
        `, [ownerId]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getAnimalsBySpecies = async (req, res) => {
    try {
        const { species } = req.params;
        const result = await db.query(`
            SELECT a.*, 
                   b.breed as breed_name,
                   o.name as owner_name
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            LEFT JOIN owners o ON a.owner_id = o.id
            WHERE a.species = $1
            ORDER BY a.name ASC
        `, [species]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createAnimal = async (req, res) => {
    try {
        const {
            name,
            species,
            breed_id,
            age,
            weight,
            gender,
            owner_id,
            medical_history
        } = req.body;

        const result = await db.query(
            `INSERT INTO animals (
                name, species, breed_id, age, weight, 
                gender, owner_id, medical_history
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
            RETURNING *`,
            [name, species, breed_id, age, weight, gender, owner_id, medical_history]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            species,
            breed_id,
            age,
            weight,
            gender,
            owner_id,
            medical_history
        } = req.body;

        const result = await db.query(
            `UPDATE animals 
             SET name = $1, 
                 species = $2, 
                 breed_id = $3, 
                 age = $4,
                 weight = $5,
                 gender = $6,
                 owner_id = $7,
                 medical_history = $8,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $9 
             RETURNING *`,
            [name, species, breed_id, age, weight, gender, owner_id, medical_history, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hayvan bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteAnimal = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM animals WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Hayvan bulunamadı' });
        }

        res.json({ message: 'Hayvan başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllAnimals,
    getAnimalById,
    createAnimal,
    updateAnimal,
    deleteAnimal,
    getAnimalsByOwner,
    getAnimalsBySpecies
};