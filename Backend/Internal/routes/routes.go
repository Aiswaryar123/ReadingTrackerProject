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

	api := r.Group("/api")
	{

		api.POST("/register", userHandler.Register)
		api.POST("/login", userHandler.Login)

		protected := api.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			protected.POST("/books", bookHandler.AddBook)
			protected.GET("/books", bookHandler.ListBooks)
			protected.GET("/books/:id", bookHandler.GetBook)
			protected.PUT("/books/:id", bookHandler.UpdateBook)
			protected.DELETE("/books/:id", bookHandler.DeleteBook)
			protected.GET("/books/:id/progress", progressHandler.GetProgress)
			protected.PUT("/books/:id/progress", progressHandler.UpdateProgress)
			protected.POST("/books/:id/reviews", reviewHandler.AddReview)
			protected.GET("/books/:id/reviews", reviewHandler.GetReviews)

			protected.GET("/dashboard", bookHandler.GetDashboard)
			protected.GET("/books/search", bookHandler.SearchBooks)

			protected.POST("/goals", goalHandler.SetGoal)

			protected.GET("/goals/:year/:month", goalHandler.GetGoalStatus)
		}
	}
}
