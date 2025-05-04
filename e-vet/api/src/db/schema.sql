-- Tüm tabloları silme (eğer varsa)
DROP TABLE IF EXISTS vaccinations CASCADE;
DROP TABLE IF EXISTS examinations CASCADE;
DROP TABLE IF EXISTS drugs CASCADE;
DROP TABLE IF EXISTS vaccines CASCADE;
DROP TABLE IF EXISTS animals CASCADE;
DROP TABLE IF EXISTS breeds CASCADE;
DROP TABLE IF EXISTS owners CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Kullanıcılar tablosu
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hayvan sahipleri tablosu
CREATE TABLE owners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Hayvan ırkları tablosu
CREATE TABLE breeds (
    id SERIAL PRIMARY KEY,
    species VARCHAR(50) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(species, breed)
);

-- Hayvanlar tablosu
CREATE TABLE animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    species VARCHAR(50) NOT NULL,
    breed_id INTEGER REFERENCES breeds(id),
    age INTEGER,
    weight DECIMAL(5,2),
    gender VARCHAR(50),
    owner_id INTEGER REFERENCES owners(id) ON DELETE SET NULL,
    medical_history TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İlaçlar tablosu
CREATE TABLE drugs (
    id SERIAL PRIMARY KEY,
    drug_name VARCHAR(255) NOT NULL,
    active_substance VARCHAR(255),
    usage_area VARCHAR(255),
    species TEXT[],
    administration_route VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Aşılar tablosu
CREATE TABLE vaccines (
    id SERIAL PRIMARY KEY,
    vaccine_name VARCHAR(255) NOT NULL,
    disease_target TEXT,
    species TEXT[],
    vaccine_type VARCHAR(100),
    application_method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Aşılama kayıtları tablosu
CREATE TABLE vaccinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER REFERENCES animals(id) ON DELETE CASCADE,
    vaccine_id INTEGER REFERENCES vaccines(id),
    vet_id INTEGER REFERENCES users(id),
    vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    next_vaccination_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Muayene kayıtları tablosu
CREATE TABLE examinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER NOT NULL REFERENCES animals(id) ON DELETE CASCADE,
    vet_id INTEGER NOT NULL REFERENCES users(id),
    diagnosis TEXT NOT NULL,
    treatment TEXT,
    prescribed_drugs INTEGER[],
    notes TEXT,
    examination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    next_examination_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX animals_owner_id_idx ON animals(owner_id);
CREATE INDEX animals_breed_id_idx ON animals(breed_id);
CREATE INDEX vaccinations_animal_id_idx ON vaccinations(animal_id);
CREATE INDEX vaccinations_vet_id_idx ON vaccinations(vet_id);
CREATE INDEX examinations_animal_id_idx ON examinations(animal_id);
CREATE INDEX examinations_vet_id_idx ON examinations(vet_id);