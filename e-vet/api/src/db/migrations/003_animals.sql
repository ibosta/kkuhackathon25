CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(100) NOT NULL,
    breed_id INTEGER,
    owner_id INTEGER REFERENCES owners(id),
    birth_date DATE,
    gender VARCHAR(20),
    weight DECIMAL,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);