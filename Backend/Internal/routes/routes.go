package routes

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/handlers"
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, userHandler *handlers.UserHandler) {

	r.POST("/register", userHandler.Register)
	r.POST("/login", userHandler.Login)
}
