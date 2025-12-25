package routes

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/handlers"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/middleware"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(
	r *gin.Engine,
	userHandler *handlers.UserHandler,
	bookHandler *handlers.BookHandler,
) {

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{

		protected.POST("/books", bookHandler.AddBook)
		protected.GET("/books", bookHandler.ListBooks)
		protected.PUT("/books/:id", bookHandler.UpdateBook)
		protected.DELETE("/books/:id", bookHandler.DeleteBook)
		protected.GET("/books/:id", bookHandler.GetBook)
	}
}
