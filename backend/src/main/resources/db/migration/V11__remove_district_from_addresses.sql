-- Remove district columns for 2-tier address system
ALTER TABLE addresses
DROP COLUMN district_name,
DROP COLUMN district_code;
