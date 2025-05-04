const db = require('../config/database');

const getDashboardData = async (req, res) => {
    try {
        // Yaklaşan aşılar
        const upcomingVaccines = await db.query(`
            SELECT 
                v.id,
                a.name as animal_name,
                v.vaccine_name,
                v.next_vaccination_date
            FROM vaccinations v
            JOIN animals a ON v.animal_id = a.id
            WHERE v.next_vaccination_date >= CURRENT_DATE
            ORDER BY v.next_vaccination_date ASC
            LIMIT 5
        `);

        // Son hastalar
        const recentPatients = await db.query(`
            SELECT 
                a.id,
                a.name,
                o.name as owner_name
            FROM animals a
            JOIN owners o ON a.owner_id = o.id
            ORDER BY a.created_at DESC
            LIMIT 5
        `);

        // Son muayeneler/reçeteler
        const recentPrescriptions = await db.query(`
            SELECT 
                e.id,
                a.name as animal_name,
                e.diagnosis
            FROM examinations e
            JOIN animals a ON e.animal_id = a.id
            ORDER BY e.examination_date DESC
            LIMIT 5
        `);

        // Yaklaşan randevular
        const upcomingAppointments = await db.query(`
            SELECT 
                app.id,
                a.name as animal_name,
                o.name as owner_name,
                app.appointment_date
            FROM appointments app
            JOIN animals a ON app.animal_id = a.id
            JOIN owners o ON a.owner_id = o.id
            WHERE app.appointment_date >= CURRENT_DATE
            ORDER BY app.appointment_date ASC
            LIMIT 5
        `);

        res.json({
            upcomingVaccines: upcomingVaccines.rows,
            recentPatients: recentPatients.rows,
            recentPrescriptions: recentPrescriptions.rows,
            upcomingAppointments: upcomingAppointments.rows
        });
    } catch (error) {
        console.error('Dashboard veri hatası:', error);
        res.status(500).json({ 
            message: 'Dashboard verileri yüklenirken hata oluştu', 
            error: error.message 
        });
    }
};

module.exports = {
    getDashboardData
};