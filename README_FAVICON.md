# Smart Workspace favicon package

Bộ favicon này dùng concept: nền navy công nghệ + accent xanh mint + biểu tượng màn hình/bàn làm việc + monogram `SW`.

## Cách dùng nhanh cho React/Vite

Copy các file này vào thư mục `frontend/public/`:

- favicon.ico
- favicon.svg
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png
- android-chrome-192x192.png
- android-chrome-512x512.png
- site.webmanifest

Sau đó kiểm tra `frontend/index.html` có các dòng sau trong thẻ `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="any" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
<link rel="manifest" href="/site.webmanifest" />
<meta name="theme-color" content="#0A1624" />
```

Nếu trình duyệt vẫn hiện favicon cũ, hard refresh bằng `Ctrl + F5` hoặc đổi URL favicon tạm thời thành `/favicon.ico?v=2`.
