# StaffSync — MERN Human Resource Management System

StaffSync is a learning/certification project built with MongoDB, Express, React and Node.js. It includes role-based access for HR, managers and employees.

## Features
- JWT authentication and role-based authorization
- Employee directory and employee profile management (HR)
- Leave application and approval workflow
- Attendance check-in / check-out
- Company announcements
- Training program creation and enrollment
- Responsive React dashboard

## Tech stack
- Frontend: React + Vite + React Router
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Authentication: JWT + bcryptjs

## Prerequisites
- Node.js 18+
- MongoDB local instance or MongoDB Atlas connection string

## 1. Configure the backend
```bash
cd server
npm install
```
Copy `.env.example` to `.env` and update `MONGO_URI` and `JWT_SECRET`.

```bash
npm run dev
```
The API runs at `http://localhost:5000`.

## 2. Configure the frontend
Open a second terminal:
```bash
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal (normally `http://localhost:5173`).

## 3. Create the first HR account
Use the registration page to create an account. For a local demo, the first registered account can be promoted to HR by updating its `role` field in MongoDB to `hr`. Do not expose public role selection in a real deployment.
Example Mongo shell:
```js
use staff_sync
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "hr" } })
```
Then log out and log in again to receive a token with the updated role.

## API overview
- `POST /api/auth/register` — create an employee account
- `POST /api/auth/login` — sign in
- `GET /api/employees` — HR/manager employee directory
- `PUT /api/employees/:id` — HR update employee record
- `POST /api/leaves` — employee submits leave request
- `GET /api/leaves` — list relevant leave requests
- `PATCH /api/leaves/:id` — HR/manager approves or rejects
- `POST /api/attendance/check-in` — mark attendance
- `POST /api/attendance/check-out` — check out
- `GET /api/attendance` — view attendance records
- `GET/POST /api/announcements` — list/create announcements
- `GET/POST /api/trainings` — list/create training programs
- `POST /api/trainings/:id/enroll` — enroll in a program

## Suggested GitHub push
Create a repository named `StaffSync`, then from the project folder:
```bash
git init
git add .
git commit -m "Initial StaffSync MERN HRMS project"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/StaffSync.git
git push -u origin main
```

## Important
This is a student project starter, not production HR software. Before production use, add email verification, password reset, audit logs, rate limiting, stronger input validation, pagination, automated tests, and tighter manager/team scoping. Keep `.env` out of GitHub.
