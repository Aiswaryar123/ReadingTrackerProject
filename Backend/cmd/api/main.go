package main

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/database"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/handlers"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/routes"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/Aiswaryar123/ReadingTrackerProject/configs"
	"github.com/gin-gonic/gin"
)

func main() {
	// 1. Load Configuration (Secrets from .env)
	cfg := configs.LoadConfig()

	// 2. Connect to Database (Create tables)
	database.ConnectDB(cfg)

	// 3. Initialize Repositories (The "Hands")
	// These handle direct SQL/GORM communication with the database
	userRepo := repository.NewUserRepository(database.DB)
	bookRepo := repository.NewBookRepository(database.DB)
	progressRepo := repository.NewProgressRepository(database.DB)
	reviewRepo := repository.NewReviewRepository(database.DB)
	goalRepo := repository.NewGoalRepository(database.DB) // NEW: Goal Repo

	// 4. Initialize Services (The "Brains")
	// These handle the logic and check security rules
	userService := services.NewUserService(userRepo)
	bookService := services.NewBookService(bookRepo)

	// Note: Progress and Review services need bookRepo to check ownership!
	progressService := services.NewProgressService(progressRepo, bookRepo)
	reviewService := services.NewReviewService(reviewRepo, bookRepo)

	goalService := services.NewGoalService(goalRepo) // NEW: Goal Service

	// 5. Initialize Handlers (The "Waiters")
	// These receive the web requests and send back JSON responses
	userHandler := handlers.NewUserHandler(userService)
	bookHandler := handlers.NewBookHandler(bookService)
	progressHandler := handlers.NewProgressHandler(progressService)
	reviewHandler := handlers.NewReviewHandler(reviewService)
	goalHandler := handlers.NewGoalHandler(goalService) // NEW: Goal Handler

	// 6. Initialize Gin Web Engine
	r := gin.Default()

	// 7. Register All Routes
	// We pass all 5 handlers so the Map (routes.go) can connect them to URLs
	routes.RegisterRoutes(r, userHandler, bookHandler, progressHandler, reviewHandler, goalHandler)

	// 8. Start the Server
	r.Run(":" + cfg.Port)
}
