-- Breeds verilerini yükleme fonksiyonu
CREATE OR REPLACE FUNCTION string_to_array_trim(text) RETURNS text[] AS $$
  SELECT string_to_array(replace(replace($1, ' ', ''), '"', ''), ',');
$$ LANGUAGE SQL IMMUTABLE;

-- Önceki kayıtları temizle
TRUNCATE TABLE breeds CASCADE;
TRUNCATE TABLE drugs CASCADE;
TRUNCATE TABLE vaccines CASCADE;

-- Breeds verilerini yükleme
\COPY breeds(species, breed) FROM 'db/seeds/data/sigir_irk_listesi_genis.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/koyun_irk_listesi_genis.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/kopek_irk_listesi.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/kedi_irk_listesi.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/keci_irk_listesi_genis.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/kanatli_irk_listesi.csv' WITH (FORMAT csv, HEADER true);
\COPY breeds(species, breed) FROM 'db/seeds/data/at_irk_listesi.csv' WITH (FORMAT csv, HEADER true);

-- İlaçlar için geçici tablo oluşturma
CREATE TEMP TABLE temp_drugs (
    drug_name VARCHAR(255),
    active_substance VARCHAR(255),
    usage_area VARCHAR(255),
    species TEXT,
    administration_route VARCHAR(100),
    notes TEXT
);

-- İlaçlar verilerini geçici tabloya yükleme
\COPY temp_drugs FROM 'db/seeds/data/veteriner_ilac_listesi.csv' WITH (FORMAT csv, HEADER true);

-- Geçici tablodan asıl tabloya veri aktarma
INSERT INTO drugs (drug_name, active_substance, usage_area, species, administration_route, notes)
SELECT 
    drug_name,
    active_substance,
    usage_area,
    string_to_array_trim(species),
    administration_route,
    notes
FROM temp_drugs;

-- Aşılar için geçici tablo oluşturma
CREATE TEMP TABLE temp_vaccines (
    vaccine_name VARCHAR(255),
    disease_target TEXT,
    species TEXT,
    vaccine_type VARCHAR(100),
    application_method VARCHAR(100),
    notes TEXT
);

-- Aşılar verilerini geçici tabloya yükleme
\COPY temp_vaccines FROM 'db/seeds/data/veteriner_asi_listesi.csv' WITH (FORMAT csv, HEADER true);

-- Geçici tablodan asıl tabloya veri aktarma
INSERT INTO vaccines (vaccine_name, disease_target, species, vaccine_type, application_method, notes)
SELECT 
    vaccine_name,
    disease_target,
    string_to_array_trim(species),
    vaccine_type,
    application_method,
    notes
FROM temp_vaccines;

-- Örnek kullanıcıları güncelle veya ekle
INSERT INTO users (email, password, name, role)
VALUES 
    ('admin@evet.com', '$2a$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/tHqqHi.lP4Z7lS', 'Admin User', 'admin'),
    ('vet@evet.com', '$2a$10$K.0HwpsoPDGaB/atFBmmXOGTw4ceeg33.WrxJx/tHqqHi.lP4Z7lS', 'Veteriner User', 'veteriner')
ON CONFLICT (email) 
DO UPDATE SET 
    password = EXCLUDED.password,
    name = EXCLUDED.name,
    role = EXCLUDED.role;