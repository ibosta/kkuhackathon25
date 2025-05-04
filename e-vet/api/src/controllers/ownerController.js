const db = require('../config/database');

const getAllOwners = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*,
                   COUNT(a.id) as pet_count
            FROM owners o
            LEFT JOIN animals a ON o.id = a.owner_id
            GROUP BY o.id
            ORDER BY o.name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const searchOwners = async (req, res) => {
    try {
        const { query } = req.query;
        const result = await db.query(`
            SELECT o.*,
                   COUNT(a.id) as pet_count
            FROM owners o
            LEFT JOIN animals a ON o.id = a.owner_id
            WHERE o.name ILIKE $1 
               OR o.phone ILIKE $1
               OR o.email ILIKE $1
            GROUP BY o.id
            ORDER BY o.name ASC
        `, [`%${query}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getOwnerById = async (req, res) => {
    try {
        const { id } = req.params;
        const ownerResult = await db.query(`
            SELECT o.*,
                   COUNT(a.id) as pet_count
            FROM owners o
            LEFT JOIN animals a ON o.id = a.owner_id
            WHERE o.id = $1
            GROUP BY o.id
        `, [id]);

        if (ownerResult.rows.length === 0) {
            return res.status(404).json({ message: 'Sahip bulunamadı' });
        }

        const owner = ownerResult.rows[0];

        // Sahibin hayvanlarını getir
        const animalsResult = await db.query(`
            SELECT a.*, b.breed as breed_name
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            WHERE a.owner_id = $1
            ORDER BY a.name ASC
        `, [id]);

        owner.animals = animalsResult.rows;

        res.json(owner);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createOwner = async (req, res) => {
    try {
        const { name, phone, email, address, city, notes } = req.body;

        const result = await db.query(
            `INSERT INTO owners (name, phone, email, address, city, notes)
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [name, phone, email, address, city, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateOwner = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, phone, email, address, city, notes } = req.body;

        const result = await db.query(
            `UPDATE owners 
             SET name = $1,
                 phone = $2,
                 email = $3,
                 address = $4,
                 city = $5,
                 notes = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 
             RETURNING *`,
            [name, phone, email, address, city, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sahip bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteOwner = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Önce sahibin hayvanlarını kontrol et
        const checkAnimals = await db.query(
            'SELECT COUNT(*) FROM animals WHERE owner_id = $1',
            [id]
        );

        if (parseInt(checkAnimals.rows[0].count) > 0) {
            return res.status(400).json({ 
                message: 'Bu sahibin hayvanları bulunmaktadır. Önce hayvanları silmelisiniz.' 
            });
        }

        const result = await db.query(
            'DELETE FROM owners WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Sahip bulunamadı' });
        }

        res.json({ message: 'Sahip başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getOwnerAnimals = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT a.*, 
                   b.breed as breed_name,
                   COUNT(e.id) as examination_count,
                   COUNT(v.id) as vaccination_count
            FROM animals a
            LEFT JOIN breeds b ON a.breed_id = b.id
            LEFT JOIN examinations e ON a.id = e.animal_id
            LEFT JOIN vaccinations v ON a.id = v.animal_id
            WHERE a.owner_id = $1
            GROUP BY a.id, b.breed
            ORDER BY a.name ASC
        `, [id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllOwners,
    getOwnerById,
    createOwner,
    updateOwner,
    deleteOwner,
    searchOwners,
    getOwnerAnimals
};