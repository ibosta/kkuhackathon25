CREATE TABLE vaccines (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    vet_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vaccine_name VARCHAR(255) NOT NULL,
    vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    next_vaccination_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX vaccines_animal_id_idx ON vaccines(animal_id);
CREATE INDEX vaccines_vet_id_idx ON vaccines(vet_id);
CREATE INDEX vaccines_date_idx ON vaccines(vaccination_date);
CREATE INDEX vaccines_next_date_idx ON vaccines(next_vaccination_date);