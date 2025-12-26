package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// CORSMiddleware sets the rules for who can talk to our API
func CORSMiddleware() gin.HandlerFunc {
	return cors.New(cors.Config{
		// Allow your React app's address
		AllowOrigins: []string{"http://localhost:5173"},
		// Allow standard HTTP methods
		AllowMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		// Allow the headers we use (especially Authorization for JWT)
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	})
}
