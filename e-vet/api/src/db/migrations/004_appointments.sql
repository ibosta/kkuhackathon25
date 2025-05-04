CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id),
    vet_id INTEGER REFERENCES users(id),
    appointment_date TIMESTAMP NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);