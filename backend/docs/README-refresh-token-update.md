# Refresh Token & Token Blacklist Update

Tài liệu này tóm tắt phần auth mở rộng cần triển khai cho Smart Workspace.

Mục tiêu:
- Access token ngắn hạn.
- Refresh token lưu database dạng hash.
- Rotate refresh token sau mỗi lần refresh.
- Revoke refresh token khi logout.
- Blacklist access token theo claim `jti`.
- Migration mới `V5__add_refresh_token_and_blacklist_token.sql`.
- API mới `POST /api/auth/refresh` và `POST /api/auth/logout`.

Luồng chính:
1. Login trả `accessToken`, `refreshToken`, `tokenType`, `expiresIn`.
2. Client dùng access token để gọi API.
3. Khi access token gần hết hạn hoặc đã hết hạn, client gọi `/api/auth/refresh` bằng refresh token.
4. Backend kiểm tra refresh token hash trong database, revoke token cũ, cấp access token và refresh token mới.
5. Khi logout, backend revoke refresh token và lưu `jti` của access token vào `blacklisted_tokens`.
6. `JwtAuthenticationFilter` từ chối access token có `jti` nằm trong blacklist.

Scope lab:
- Không dùng Redis.
- Không cần refresh token family phức tạp.
- Có thể lưu blacklist token trong MySQL đến khi access token hết hạn.
