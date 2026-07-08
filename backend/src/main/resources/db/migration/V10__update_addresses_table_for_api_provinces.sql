-- Update addresses table for provinces.open-api.vn format
ALTER TABLE addresses
ADD COLUMN province_name VARCHAR(100) NOT NULL DEFAULT 'N/A',
ADD COLUMN province_code INT NOT NULL DEFAULT 0,
ADD COLUMN district_name VARCHAR(100) NOT NULL DEFAULT 'N/A',
ADD COLUMN district_code INT NOT NULL DEFAULT 0,
ADD COLUMN ward_name VARCHAR(100) NOT NULL DEFAULT 'N/A',
ADD COLUMN ward_code INT NOT NULL DEFAULT 0;

UPDATE addresses 
SET province_name = province, 
    district_name = district, 
    ward_name = ward;

ALTER TABLE addresses
DROP COLUMN province,
DROP COLUMN district,
DROP COLUMN ward;
