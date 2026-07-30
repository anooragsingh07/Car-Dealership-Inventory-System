# PROMPTS.md

# AI Prompt History

This document records the major prompts used during development. AI was used as a development assistant for planning, frontend scaffolding, debugging, documentation, and occasional implementation guidance. All generated code was reviewed, modified, tested, and integrated manually.

---

# Development Workflow

The project followed a Test-Driven Development (TDD) workflow.

For each backend feature:

1. Write the failing test.
2. Implement the minimum code required.
3. Refactor while keeping all tests passing.

AI was mainly used to review the TDD workflow, suggest improvements, and provide implementation guidance when needed.

---

# Session 1 — Project Setup

## Initial Planning

**Prompt**

> Explain how to build a Car Dealership Inventory System using TDD. Keep the project MVP-focused using Node.js, Express, React, Tailwind CSS, and Neon PostgreSQL. Suggest a clean project structure and development order.

---

## Environment Setup

**Prompt**

> Create backend/.env.example, backend/schema.sql, database connection configuration, and suggest the initial folder structure for the project.

---

# Backend Development (TDD)

The backend business logic was developed using a Test-Driven Development workflow.

AI assistance was limited to:

* Reviewing API design
* Suggesting test scenarios
* Explaining implementation approaches
* Helping debug issues
* Reviewing SQL queries and Express middleware

The application logic, debugging, integration, and final implementation decisions were completed manually.

---

## User Registration

### Red

> Suggest test cases for POST /api/auth/register covering successful registration, validation failures, and duplicate email handling.

### Green

> Explain a clean implementation approach for user registration using Express, bcrypt, PostgreSQL, and JWT.

### Refactor

> Review the registration controller and suggest possible refactoring opportunities without changing functionality.

---

## User Login

### Red

> Suggest integration test cases for user login including valid login, invalid password, and unknown email.

### Green

> Explain a secure JWT login implementation using bcrypt and Express.

---

## Authentication Middleware

### Red

> Suggest test cases for authentication and role-based authorization middleware.

### Green

> Explain how requireAuth and requireAdmin middleware should be structured.

---

## Vehicle APIs

For the following features, AI was primarily used to review API design and discuss implementation approaches.

* Create Vehicle
* Get Vehicles
* Search Vehicles
* Update Vehicle
* Delete Vehicle
* Purchase Vehicle
* Restock Vehicle

Example prompts included:

> Review the API design for vehicle CRUD operations.

> Suggest test cases for purchase and restock endpoints.

> Explain how to prevent race conditions during vehicle purchase.

---

# Session 2 — Frontend Development

AI assistance was used much more extensively during frontend development to speed up UI creation and reduce repetitive work.

---

## Frontend Setup

**Prompt**

> Scaffold a Vite + React application with Tailwind CSS v4 and configure the project for development.

---

## React Components

Prompts included creating and refining:

* VehicleCard
* Login Form
* Register Form
* Dashboard
* Search Bar
* Filter Panel
* Admin Dashboard
* Navbar
* Protected Routes
* Auth Context
* API Client

Example prompt:

> Build a responsive React component for displaying a vehicle card with purchase functionality and disabled state when stock reaches zero.

---

## Routing

Prompt:

> Configure React Router with protected routes for login, dashboard, and admin pages.

---

## UI Improvements

AI assisted with:

* Responsive layouts
* Tailwind CSS styling
* Navbar improvements
* Loading states
* Empty states
* Form validation
* Mobile responsiveness
* Better component organization

---

## Debugging Assistance

AI was used to help investigate issues such as:

* JWT authentication problems
* React state management
* Route protection
* Database connection issues
* SQL query improvements
* Test failures
* API integration bugs

The fixes were reviewed and applied manually after understanding the underlying issue.

---

## Documentation

AI assisted with generating and improving:

* README.md
* Project documentation
* Setup instructions
* API documentation
* AI Usage documentation

---

# AI Tools Used

* **OpenCode** — Development interface
* **DeepSeek V4** — Primary coding assistant through OpenCode
* **ChatGPT** — Project planning, architecture discussions, debugging assistance, documentation, frontend guidance, and code review

---

# Reflection

AI was used as a productivity tool rather than a replacement for development.

Its biggest contribution was accelerating frontend development, improving documentation, providing architectural suggestions, and helping debug implementation issues. Backend business logic, database integration, API behaviour, testing, and final code integration were manually reviewed and completed to ensure the project met the assignment requirements and followed the intended TDD workflow.
