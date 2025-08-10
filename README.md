# MINI BLOG PROJECT

## ОПИС
Цей репозиторій містить backend (NestJS + Prisma) та frontend (Next.js + Tailwind CSS) для простого блогу з авторизацією, створенням постів, пагінацією, темною темою та адаптивним інтерфейсом.

## СТРУКТУРА ПРОЕКТУ
/backend  — NestJS API з Prisma/PostgreSQL
/frontend — Next.js UI з TypeScript, Tailwind CSS, Zustand, React Query, Zod, Framer Motion, React Icons

--------------------------------------------------
### ШВИДКИЙ СТАРТ

# 1. BACKEND (NestJS + Prisma)

1) Перейти у папку backend:
   
```bash
  cd backend
```

2) Скопіювати .env.example → .env і налаштувати:

    - DATABASE_URL (PostgreSQL)
    - інші змінні середовища

3) Встановити залежності:
```bash
  npm install
```
4) Згенерувати Prisma клієнт:
```bash
  npx prisma generate
```

5) Створити міграцію та застосувати:
```bash
  npx prisma migrate dev --name init
```

6) (Опціонально) Засідити початкові дані:
   
```bash
  npm run seed
```

7) Зробити збірку:
   
```bash
  npm run build
```

8) Запустити сервер:
   
```bash
  npm run start
```

API доступний: http://localhost:3000/api (Swagger UI)

### ОСНОВНІ МАРШРУТИ

POST   /api/auth/register — реєстрація

POST   /api/auth/login — логін (повертає { accessToken, refreshToken })

POST   /api/auth/refresh — оновлення токенів

POST   /api/auth/logout — вихід (Bearer access token)

GET    /api/auth/me — дані користувача

POST   /api/posts — створення посту

GET    /api/posts — отримання постів (з пагінацією)

DELETE /api/posts/:id — видалення посту


### БЕЗПЕКА
- Паролі хешуються через bcrypt
- Refresh tokens зберігаються у хешованому вигляді
- Helmet + rate-limiter + compression
- Валідація через class-validator та ValidationPipe
- Логування запитів (LoggingInterceptor)
- Уніфікований формат помилок (Exception filter)

--------------------------------------------------
# 2. FRONTEND (Next.js + Tailwind)

1) Перейти у папку frontend:
   
```bash
  cd frontend
```

2) Встановити залежності:
```bash
  npm install
```
   

3) Запустити проект:
```bash
  npm run dev
```
   

UI доступний: http://localhost:3002

--------------------------------------------------
## ВИКОРИСТАНІ ТЕХНОЛОГІЇ

## BACKEND:
- NestJS
- Prisma ORM + PostgreSQL
- JWT (access + refresh tokens)
- Swagger
- Helmet, rate limiter, compression

## FRONTEND:
- Next.js + TypeScript
- Tailwind CSS
- Zustand
- React Query
- React Hook Form + Zod
- Framer Motion
- React Icons

--------------------------------------------------
## КОНТАКТИ
Якщо маєш питання або пропозиції — звертайся!

Telegram: https://t.me/VOVA_SF
