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
	progressHandler *handlers.ProgressHandler,
	reviewHandler *handlers.ReviewHandler,
	goalHandler *handlers.GoalHandler,
) {

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)

	protected := r.Group("/api")
	protected.Use(middleware.AuthMiddleware())
	{
		// book CRUD
		protected.POST("/books", bookHandler.AddBook)
		protected.GET("/books", bookHandler.ListBooks)
		protected.GET("/books/:id", bookHandler.GetBook)
		protected.PUT("/books/:id", bookHandler.UpdateBook)
		protected.DELETE("/books/:id", bookHandler.DeleteBook)

		// Reading Progress

		protected.GET("/books/:id/progress", progressHandler.GetProgress)
		protected.PUT("/books/:id/progress", progressHandler.UpdateProgress)
		//review
		protected.POST("/books/:id/reviews", reviewHandler.AddReview)
		protected.GET("/books/:id/reviews", reviewHandler.GetReviews)
		protected.POST("/goals", goalHandler.SetGoal)
		protected.GET("/goals/:year", goalHandler.GetGoalStatus)

	}
}
