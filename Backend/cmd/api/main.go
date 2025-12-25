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
	// 1. Load Configuration and Connect to Database
	cfg := configs.LoadConfig()
	database.ConnectDB(cfg)

	// 2. Repositories (The "Hands")
	// We create one for each table in our database
	userRepo := repository.NewUserRepository(database.DB)
	bookRepo := repository.NewBookRepository(database.DB)
	progressRepo := repository.NewProgressRepository(database.DB)
	reviewRepo := repository.NewReviewRepository(database.DB) // NEW: Review Repo

	// 3. Services (The "Brains")
	// Note: progressService and reviewService both need bookRepo to check ownership!
	userService := services.NewUserService(userRepo)
	bookService := services.NewBookService(bookRepo)
	progressService := services.NewProgressService(progressRepo, bookRepo)
	reviewService := services.NewReviewService(reviewRepo, bookRepo) // NEW: Review Service

	// 4. Handlers (The "Waiters")
	// These will receive the HTTP requests
	userHandler := handlers.NewUserHandler(userService)
	bookHandler := handlers.NewBookHandler(bookService)
	progressHandler := handlers.NewProgressHandler(progressService)
	reviewHandler := handlers.NewReviewHandler(reviewService) // NEW: Review Handler

	// 5. Engine & Routes
	r := gin.Default()

	// We pass all 4 handlers to the routes file to map them to URLs
	routes.RegisterRoutes(r, userHandler, bookHandler, progressHandler, reviewHandler)

	// 6. Run the Server
	r.Run(":" + cfg.Port)
}
