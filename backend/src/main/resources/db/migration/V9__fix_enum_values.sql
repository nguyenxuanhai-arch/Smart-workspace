UPDATE orders SET status = 'SHIPPING' WHERE status = 'SHIPPED';
UPDATE payments SET payment_method = 'CARD' WHERE payment_method = 'CREDIT_CARD';
