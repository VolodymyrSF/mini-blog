# Mini-Blog Backend (NestJS + Prisma)

Production-ready minimal blog backend: Auth (access + refresh tokens), Users, Posts, Swagger, Prisma/Postgres.

## Quickstart

1. Клонуй/скопіюй проект.
2. Скопіюй `.env.example` -> `.env` і налаштуй `DATABASE_URL` та інші значення.
3. Встанови залежності:

```bash
  npm install
```
4. Згенеруй Prisma клієнт:

```bash
  npx prisma generate
```
5. Створи міграцію і застосуй:

```bash
  npx prisma migrate dev --name init
```
6. (Опціонально) Seed DB:

```bash
  npm run seed
```
7. Зробити build:

```bash
  npm run build
```
8. Запустити сервер

```bash
  npm run start
```
API буде доступний: http://localhost:3000/api (Swagger UI)

Основні маршрути
POST /api/auth/register — реєстрація

POST /api/auth/login — логін -> повертає { accessToken, refreshToken }

POST /api/auth/refresh — оновлення токенів (тіло: { refreshToken })

POST /api/auth/logout — logout (Bearer access token)

GET /api/auth/me — отримати дані користувача (Bearer)

POST /api/posts — створити пост (Bearer)

GET /api/posts — отримати свої пости (Bearer, пагінація)

DELETE /api/posts/:id — видалити свій пост (Bearer)

Безпека та production notes
Паролі хешуються через bcrypt.

Refresh tokens зберігаються як хеш в базі.

Helmet + rate-limiter + compression увімкнені в main.ts.

Валідація через class-validator та ValidationPipe.

LoggingInterceptor робить базове логування запитів.

Exception filter форматує помилки в уніфікований формат.
