# SSL Certificates

Place your SSL certificates in this directory to enable HTTPS on the frontend container.

- `cert.pem`: Your public certificate (including the intermediate CA chain if necessary).
- `key.pem`: Your private key.

Nginx is configured to look for these two files in `/etc/nginx/ssl/`, which is mapped to this directory in `docker-compose.yml`.

> **Note**: Do not commit your `key.pem` to version control! Ensure this directory or the key file is added to `.gitignore`.
