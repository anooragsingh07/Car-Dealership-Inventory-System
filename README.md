# Car Dealership Inventory System

A full-stack **Car Dealership Inventory System** built using **Test-Driven Development (TDD)**. The application allows authenticated users to browse, search, and purchase vehicles while providing administrators with inventory management capabilities through a modern React Single Page Application.

---

# Project Overview

This project was developed as part of a full-stack engineering assessment.

The objective was to build a secure, maintainable, and well-tested inventory management system while following modern software engineering practices such as:

* Test-Driven Development (TDD)
* RESTful API Design
* JWT Authentication
* Role-Based Authorization
* Responsive Single Page Application (SPA)
* PostgreSQL Database Integration
* Git Version Control
* AI-assisted Development

---

# Architecture

```
                 React + Tailwind CSS
                        │
                        │ REST API
                        ▼
             Node.js + Express Backend
                        │
             JWT Authentication Middleware
                        │
               Repository / SQL Layer
                        │
                        ▼
               Neon PostgreSQL Database
```

---

# Tech Stack

| Layer                   | Technology                     |
| ----------------------- | ------------------------------ |
| Frontend                | React, Vite, Tailwind CSS v4   |
| Backend                 | Node.js, Express               |
| Database                | Neon PostgreSQL                |
| Database Driver         | node-postgres (pg)             |
| Authentication          | JWT + bcrypt                   |
| Backend Testing         | Jest + Supertest               |
| Frontend Testing        | Vitest + React Testing Library |
| API Style               | REST                           |
| Version Control         | Git                            |
| Development Methodology | Test-Driven Development (TDD)  |

---

# Project Structure

```
Car-Dealership-Inventory/

├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   │   └── integration/
│   │
│   ├── scripts/
│   ├── schema.sql
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── .env.example
│   └── package.json
│
├── images/
│   ├── login.png
│   ├── dashboard.png
│   ├── admin-dashboard.png
│   └── search.png
│
├── PROMPTS.md
├── README.md
└── test-report.txt
```

---

# Features

## Authentication

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Password Hashing using bcrypt

---

## Vehicle Inventory

* Add Vehicle
* Update Vehicle
* Delete Vehicle
* View Vehicle Details
* Purchase Vehicle
* Restock Inventory

---

## Search

* Search by Make
* Search by Model
* Search by Category
* Search by Price Range

---

## Admin Features

* Role-Based Authorization
* Admin Dashboard
* Add Vehicles
* Update Vehicles
* Delete Vehicles
* Restock Inventory

---

## Frontend

* React SPA
* Responsive Design
* Tailwind CSS
* Loading States
* Empty States
* 404 Page
* Protected Routes
* Mobile Navigation

---

# MVP Scope

This project intentionally focuses on the required MVP features.

### Included

* User Authentication
* Vehicle CRUD
* Vehicle Search
* Purchase Vehicles
* Restock Inventory
* Admin Controls
* Responsive UI

### Not Included

* Payment Gateway
* Image Uploads
* Email Verification
* Password Reset
* Refresh Tokens
* Notifications
* Analytics Dashboard

---

# Development Workflow

This project follows **Test-Driven Development (TDD).**

Every feature was implemented using the following cycle:

```
1. Write failing test
        ↓
2. Run test (Red)
        ↓
3. Implement minimum code
        ↓
4. Run test (Green)
        ↓
5. Refactor
        ↓
6. Commit
```

The backend business logic was developed following this workflow.

---

# API Base URL

```
http://localhost:4000/api
```

---

# API Endpoints

## Authentication

| Method | Endpoint       | Description       |
| ------ | -------------- | ----------------- |
| POST   | /auth/register | Register new user |
| POST   | /auth/login    | Login user        |

---

## Vehicles

| Method | Endpoint         | Auth  | Description      |
| ------ | ---------------- | ----- | ---------------- |
| GET    | /vehicles        | Yes   | Get all vehicles |
| GET    | /vehicles/search | Yes   | Search vehicles  |
| POST   | /vehicles        | Yes   | Add vehicle      |
| PUT    | /vehicles/:id    | Yes   | Update vehicle   |
| DELETE | /vehicles/:id    | Admin | Delete vehicle   |

---

## Inventory

| Method | Endpoint               | Auth  | Description       |
| ------ | ---------------------- | ----- | ----------------- |
| POST   | /vehicles/:id/purchase | Yes   | Purchase vehicle  |
| POST   | /vehicles/:id/restock  | Admin | Restock inventory |

---

# Environment Variables

## Backend

```
DATABASE_URL=

TEST_DATABASE_URL=

JWT_SECRET=

PORT=4000
```

## Frontend

```
VITE_API_URL=http://localhost:4000/api
```

---

# Installation

## Prerequisites

* Node.js 22+ (24 LTS Recommended)
* npm
* Neon PostgreSQL Account

---

## Clone Repository

```bash
git clone https://github.com/<your-username>/Car-Dealership-Inventory.git

cd Car-Dealership-Inventory
```

---

## Backend Setup

```bash
cd backend

npm install

cp .env.example .env
```

Update the `.env` file with your database credentials.

Run the development server.

```bash
npm run dev
```

---

## Database Setup

Create a Neon PostgreSQL project.

Open the SQL editor.

Run

```
backend/schema.sql
```

---

## Seed Demo Data

```bash
cd backend

node scripts/seed-admin.cjs

node scripts/seed-cars.cjs
```

Demo Admin Account

```
Email:
admin@dealership.com

Password:
Admin123
```

---

## Frontend Setup

```bash
cd frontend

npm install

cp .env.example .env

npm run dev
```

Open

```
http://localhost:5173
```

---

# Running Tests

## Backend

```bash
cd backend

npm test
```

Coverage

```bash
npm run test:coverage
```

## Frontend

```bash
cd frontend

npm test
```

---



# Screenshots

## Login

<img width="1710" height="853" alt="image" src="https://github.com/user-attachments/assets/914b3ed1-25d5-42c6-9d6c-4bf49e526e64" />

## Signup

<img width="1341" height="815" alt="image" src="https://github.com/user-attachments/assets/f3ed8d2c-cd88-4bfb-8fbd-074997ffb09f" />


## Dashboard

<img width="1535" height="757" alt="image" src="https://github.com/user-attachments/assets/3cdadd12-11b9-40bb-a270-20e53e3bc316" />


## Admin Dashboard

<img width="1390" height="813" alt="image" src="https://github.com/user-attachments/assets/fe4d02d6-7c9b-41bd-867e-d17af6733943" />


## Vehicle Search

<img width="1360" height="489" alt="image" src="https://github.com/user-attachments/assets/c8dbfe79-ecbd-49ed-83ce-7934b4ea2289" />


# Live Demo

Frontend

```
Coming Soon
```

Backend API

```
Coming Soon
```

---

# AI Prompt History

This repository includes a **PROMPTS.md** file containing the prompts used during development, including project planning, TDD workflow, debugging, implementation, documentation, and code review.

---

# My AI Usage

## AI Tools Used

* OpenCode (development interface)
* DeepSeek V4 (primary coding assistant through OpenCode)
* ChatGPT (architecture guidance, TDD planning, debugging, code review, documentation)

---

## How AI Was Used

AI was used as a development assistant throughout the project.

Examples include:

* Generating initial project scaffolding
* Designing REST API structure
* Creating TDD test cases before implementation
* Generating Express boilerplate
* Assisting with React component structure
* Suggesting SQL queries
* Debugging failing tests
* Reviewing code quality
* Assisting with documentation and README creation

---

## My Contribution

All AI-generated code was manually reviewed, modified where necessary, and integrated into the project by me.

I verified:

* Business Logic
* API Behaviour
* Database Queries
* Authentication Flow
* Security Considerations
* Final Project Structure

The final implementation, debugging, integration, and validation remained my responsibility.

---

## Reflection

Using AI significantly improved development speed by reducing time spent writing repetitive boilerplate and helping design comprehensive test cases.

The most valuable workflow was using AI to generate failing tests first and then implementing only enough code to satisfy those tests, maintaining the TDD discipline throughout development.

AI accelerated development, but careful manual review was required to verify correctness, security, and maintainability.

---

# Git Workflow

Development followed small, incremental commits using Git.

Each feature was developed independently using the following process:

1. Write failing tests
2. Implement feature
3. Refactor
4. Commit changes

No code was pushed without manual review.

---



---

# License

This project was created as part of a technical assessment and is intended for educational and evaluation purposes.
