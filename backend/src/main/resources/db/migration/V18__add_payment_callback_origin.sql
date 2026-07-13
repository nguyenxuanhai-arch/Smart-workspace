ALTER TABLE payments
    ADD COLUMN callback_origin VARCHAR(500) NULL AFTER checkout_url;
