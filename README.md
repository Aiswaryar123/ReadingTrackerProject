# Bookshelf & Reading Tracker

A full-stack web application to manage a personal digital library, track reading progress, and set yearly or monthly reading goals.  
Designed using clean architecture principles with secure authentication and real-time analytics.

---

## Features

### Secure Authentication

- Multi-user support
- JWT (JSON Web Tokens) based authentication
- Password hashing using Bcrypt

### Book Cataloging

- Manually add books with the following details:
  - Title
  - Author
  - ISBN
  - Genre
  - Publication Year
- Manual Lookup: Efficient backend search using PostgreSQL ILIKE for fuzzy title matching.

### Progress Tracking

- Interactive bookmarking system
- Logical validation to prevent invalid progress updates

### Ratings & Reviews

- 1–5 star rating system
- Personal comments for each book
- Community Hub: When users add books with matching ISBNs, they can see reviews and usernames from other readers across the platform.

### Reading Goals

- Monthly Targets: Set specific book goals for every month of the year.
- Yearly Aggregation: The system automatically calculates your Yearly Marathon progress by summing all your monthly targets.

### Analytics Dashboard

- Live Statistics: Total books, currently reading count, and yearly finished count.
- Planning Tracker: Displays Goals Planned(e.g., 2/12 months set) to encourage yearly planning.
- Dual Visuals: Separate progress bars for current Monthly and Yearly goals.

---

## Tech Stack

### Backend

- Go (Golang)
- Gin Web Framework
- GORM ORM

### Database

- PostgreSQL

### Frontend

- React.js (Vite)
- Tailwind CSS

### Testing

- Go standard testing package
- Test Driven Development (TDD) approach

---

## Architecture

This project follows a clean 3-layer architecture to ensure maintainability, scalability, and testability.

- **Handlers**: Manage HTTP requests and extract JWT user data
- **Services**: Contain business logic and validations
- **Repositories**: Handle database operations using GORM

---

## Configuration

Create a `.env` file in the root directory of the project.

### Example `.env` file

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=reading_tracker
DB_PORT=5432
PORT=8080
JWT_SECRET=my_super_secret_key_123
```

## Running the Project with Docker

This project is fully containerized and can be started using **Docker Compose**.

### Prerequisites

- Docker
- Docker Compose

### Steps to Run

1. Clone the repository:

```bash
git clone https://github.com/Aiswaryar123/ReadingTrackerProject
cd  ReadingTrackerProject
docker compose up --build -d
```
