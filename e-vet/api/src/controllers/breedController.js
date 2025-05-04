const db = require('../config/database');

const getAllBreeds = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT b.*,
                   COUNT(a.id) as animal_count
            FROM breeds b
            LEFT JOIN animals a ON b.id = a.breed_id
            GROUP BY b.id
            ORDER BY b.species ASC, b.breed ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getBreedById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT b.*,
                   COUNT(a.id) as animal_count
            FROM breeds b
            LEFT JOIN animals a ON b.id = a.breed_id
            WHERE b.id = $1
            GROUP BY b.id
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Irk bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getBreedsBySpecies = async (req, res) => {
    try {
        const { species } = req.params;
        const result = await db.query(`
            SELECT b.*,
                   COUNT(a.id) as animal_count
            FROM breeds b
            LEFT JOIN animals a ON b.id = a.breed_id
            WHERE b.species = $1
            GROUP BY b.id
            ORDER BY b.breed ASC
        `, [species]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createBreed = async (req, res) => {
    try {
        const { species, breed } = req.body;

        const result = await db.query(
            `INSERT INTO breeds (species, breed)
             VALUES ($1, $2)
             RETURNING *`,
            [species, breed]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ 
                message: 'Bu tür ve ırk kombinasyonu zaten mevcut' 
            });
        }
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateBreed = async (req, res) => {
    try {
        const { id } = req.params;
        const { species, breed } = req.body;

        const result = await db.query(
            `UPDATE breeds 
             SET species = $1,
                 breed = $2,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $3 
             RETURNING *`,
            [species, breed, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Irk bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ 
                message: 'Bu tür ve ırk kombinasyonu zaten mevcut' 
            });
        }
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteBreed = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Önce bu ırka ait hayvanları kontrol et
        const checkAnimals = await db.query(
            'SELECT COUNT(*) FROM animals WHERE breed_id = $1',
            [id]
        );

        if (parseInt(checkAnimals.rows[0].count) > 0) {
            return res.status(400).json({ 
                message: 'Bu ırka ait hayvanlar bulunmaktadır. Önce hayvanları silmelisiniz.' 
            });
        }

        const result = await db.query(
            'DELETE FROM breeds WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Irk bulunamadı' });
        }

        res.json({ message: 'Irk başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllBreeds,
    getBreedById,
    getBreedsBySpecies,
    createBreed,
    updateBreed,
    deleteBreed
};