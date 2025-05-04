CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    weight DECIMAL(5,2),
    gender VARCHAR(50),
    owner_id INTEGER REFERENCES owners(id) ON DELETE SET NULL,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX animals_owner_id_idx ON animals(owner_id);
CREATE INDEX animals_name_idx ON animals(name);