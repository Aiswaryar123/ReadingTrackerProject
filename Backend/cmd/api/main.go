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

	userRepo := repository.NewUserRepository(database.DB)
	userService := services.NewUserService(userRepo)
	userHandler := handlers.NewUserHandler(userService)

	bookRepo := repository.NewBookRepository(database.DB)
	bookService := services.NewBookService(bookRepo)
	bookHandler := handlers.NewBookHandler(bookService)

	r := gin.Default()

	routes.RegisterRoutes(r, userHandler, bookHandler)

	r.Run(":" + cfg.Port)
}
