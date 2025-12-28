Bookshelf & Reading Tracker
A full-stack application built to manage a personal digital library, track reading progress, and set yearly reading goals.

Features

Secure Authentication: Multi-user support using JWT (JSON Web Tokens) and password hashing with Bcrypt.
Book Cataloging: Manually add books with details like Title, Author, ISBN, Genre, and Publication Year.
Progress Tracking: Interactive bookmarking system with logic validation
Ratings & Reviews: 1-5 star rating system with personal comments and dynamic star visualization.
Reading Goals: Set yearly targets and track progress via a dynamic visual progress bar.
Analytics Dashboard: Real-time statistics including total books, average ratings, and active reading counts.

Tech Stack

Backend: Go with the Gin Web Framework.
Database: PostgreSQL with GORM .
Frontend: React.js (Vite) styled with Tailwind CSS .
Testing: Standard Go testing package following the TDD approach.

Architecture (Handler-Service-Repository)

This project follows a clean 3-layer architecture to ensure the code is maintainable and testable:
Handlers : Manages HTTP requests/responses and extracts user data from JWT.
Services : Contains the core business logic
Repositories: Handles all direct database queries using GORM and ensures data isolation.
