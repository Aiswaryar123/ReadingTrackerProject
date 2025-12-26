package main

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/database"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/handlers"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/routes"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/Aiswaryar123/ReadingTrackerProject/configs"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {

	cfg := configs.LoadConfig()

	database.ConnectDB(cfg)

	userRepo := repository.NewUserRepository(database.DB)
	bookRepo := repository.NewBookRepository(database.DB)
	progressRepo := repository.NewProgressRepository(database.DB)
	reviewRepo := repository.NewReviewRepository(database.DB)
	goalRepo := repository.NewGoalRepository(database.DB)

	userService := services.NewUserService(userRepo)
	bookService := services.NewBookService(bookRepo)
	progressService := services.NewProgressService(progressRepo, bookRepo)
	reviewService := services.NewReviewService(reviewRepo, bookRepo)
	goalService := services.NewGoalService(goalRepo)

	userHandler := handlers.NewUserHandler(userService)
	bookHandler := handlers.NewBookHandler(bookService)
	progressHandler := handlers.NewProgressHandler(progressService)
	reviewHandler := handlers.NewReviewHandler(reviewService)
	goalHandler := handlers.NewGoalHandler(goalService)

	r := gin.Default()

	r.Use(cors.Default())

	routes.RegisterRoutes(r, userHandler, bookHandler, progressHandler, reviewHandler, goalHandler)

	r.Run(":" + cfg.Port)
}
