const db = require('../config/database');

const getAllDrugs = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT * FROM drugs
            ORDER BY drug_name ASC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getDrugById = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query(`
            SELECT * FROM drugs WHERE id = $1
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'İlaç bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const getDrugsBySpecies = async (req, res) => {
    try {
        const { species } = req.params;
        const result = await db.query(`
            SELECT * FROM drugs 
            WHERE $1 = ANY(species)
            ORDER BY drug_name ASC
        `, [species]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const createDrug = async (req, res) => {
    try {
        const {
            drug_name,
            active_substance,
            usage_area,
            species,
            administration_route,
            notes
        } = req.body;

        const result = await db.query(
            `INSERT INTO drugs (
                drug_name, active_substance, usage_area,
                species, administration_route, notes
            ) VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *`,
            [drug_name, active_substance, usage_area, 
             species, administration_route, notes]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const updateDrug = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            drug_name,
            active_substance,
            usage_area,
            species,
            administration_route,
            notes
        } = req.body;

        const result = await db.query(
            `UPDATE drugs 
             SET drug_name = $1,
                 active_substance = $2,
                 usage_area = $3,
                 species = $4,
                 administration_route = $5,
                 notes = $6,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $7 
             RETURNING *`,
            [drug_name, active_substance, usage_area, 
             species, administration_route, notes, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'İlaç bulunamadı' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

const deleteDrug = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('DELETE FROM drugs WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'İlaç bulunamadı' });
        }

        res.json({ message: 'İlaç başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

module.exports = {
    getAllDrugs,
    getDrugById,
    createDrug,
    updateDrug,
    deleteDrug,
    getDrugsBySpecies
};