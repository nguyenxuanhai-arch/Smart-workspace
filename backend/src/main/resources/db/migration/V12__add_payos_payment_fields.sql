ALTER TABLE payments
    MODIFY COLUMN payment_method
        ENUM('COD', 'BANK_TRANSFER', 'MOMO', 'VNPAY', 'ZALOPAY', 'CARD', 'PAYOS') NOT NULL;

ALTER TABLE payments
    ADD COLUMN provider_order_code BIGINT NULL AFTER transaction_code,
    ADD COLUMN payment_link_id VARCHAR(64) NULL AFTER provider_order_code,
    ADD COLUMN checkout_url VARCHAR(1000) NULL AFTER payment_link_id,
    ADD COLUMN provider_reference VARCHAR(100) NULL AFTER checkout_url,
    ADD COLUMN expired_at DATETIME NULL AFTER provider_reference,
    ADD CONSTRAINT uq_payments_provider_order_code UNIQUE (provider_order_code),
    ADD CONSTRAINT uq_payments_payment_link_id UNIQUE (payment_link_id),
    ADD CONSTRAINT uq_payments_provider_reference UNIQUE (provider_reference);
