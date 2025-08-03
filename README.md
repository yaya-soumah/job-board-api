# Job Board API

A fully-featured **RESTful API** for a job board platform built using **Node.js**, **TypeScript**, **Sequelize**, and **PostgreSQL**. Includes full **authentication**, **recruiter profiles**, **job postings**, **applications**, **role-based access control**, **avatar upload**, **pagination**, and more.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Language:** TypeScript
- **ORM:** Sequelize (with Sequelize CLI + Migrations)
- **Database:** PostgreSQL
- **Authentication:** JWT (access & refresh tokens)
- **File Uploads:** Multer
- **Testing:** Jest
- **Validation:** Zod
- **Documentation:** Swagger (OpenAPI YAML)
- **Architecture:** Modular & Component-based (repository → service → controller)

## Project Structure

```
src/
├── components/
│   ├── auth/
│   ├── users/
│   ├── recruiters/
│   ├── models/
│   ├── job-posts/
│   └── job-applications/
├── config/
├── middleware/
├── models/
├── migrations/
├── routes/
├── utils/
├── app.ts/
└── index.ts
```

## Features

### Authentication

- Register, Login, Refresh token
- Roles: `user`, `recruiter`, `admin`
- Password hashing, token-based auth

### User Features

- View and update own profile
- Change password and avatar
- Admin: view/delete all users

### Recruiter Features

- Create/update own profile
- Post, update, and delete job listings
- View applications for their jobs

### Job Posting

- Public endpoint to list jobs (with filters & pagination)
- Admin: list and delete any job
- Recruiter: CRUD operations on own jobs

### Applications

- Users can apply to jobs with cover letter + resume link
- Users can view and withdraw applications
- Recruiters can shortlist or reject applications
- Admin can view all applications

## API Documentation

- **Swagger UI**: [View Live Docs](https://job-board-api-wxmn.onrender.com/docs)
- **Base URL**: `https://job-board-api-wxmn.onrender.com/api/v1`

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yaya-soumah/job-board-api.git
cd job-board-api
npm install
```

### 2. Configure Environment

Create a `.env` file:

```env
NODE_ENV=development
PORT=8080
DB_DIALECT=postgres
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job-board
DB_USER=postgres
DB_PASS=your-password
TEST_DB_STORAGE=:memory:
ACCESS_TOKEN_SECRET=your-secret-code
REFRESH_TOKEN_SECRET="your-refresh-secret-code"
```

### 3. Run Migrations & Seeders

```bash
npx sequelize-cli db:migrate
```

### 4. Start the Server

```bash
npm run dev
```

## Run Tests

```bash
npm run test
```

## Linting & Formatting

```bash
npm run lint
npm run format
```

## Author

**Yaya Soumah** – [LinkedIn](https:www.linkedin.com/in/yaya-soumah-11b75b1b9) | [GitHub](https://github.com/yaya-soumah)

## License

MIT License
