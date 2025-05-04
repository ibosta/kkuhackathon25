CREATE TABLE examinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    vet_id INTEGER NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    notes TEXT,
    examination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX examinations_animal_id_idx ON examinations(animal_id);
CREATE INDEX examinations_vet_id_idx ON examinations(vet_id);
CREATE INDEX examinations_date_idx ON examinations(examination_date);