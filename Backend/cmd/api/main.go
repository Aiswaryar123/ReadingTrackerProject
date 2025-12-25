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
	cfg := configs.LoadConfig()
	database.ConnectDB(cfg)

	// repositories
	userRepo := repository.NewUserRepository(database.DB)
	bookRepo := repository.NewBookRepository(database.DB)
	progressRepo := repository.NewProgressRepository(database.DB)

	// services
	userService := services.NewUserService(userRepo)
	bookService := services.NewBookService(bookRepo)
	// linking
	progressService := services.NewProgressService(progressRepo, bookRepo)

	// handlers
	userHandler := handlers.NewUserHandler(userService)
	bookHandler := handlers.NewBookHandler(bookService)
	progressHandler := handlers.NewProgressHandler(progressService)

	//  engine & routes
	r := gin.Default()
	routes.RegisterRoutes(r, userHandler, bookHandler, progressHandler)

	r.Run(":" + cfg.Port)
}
