package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// 1. Get the Authorization header
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// 2. Check for "Bearer <token>" format
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		tokenString := parts[1]

		// 3. Parse the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// We pull the secret from environment variables
			secret := os.Getenv("JWT_SECRET")
			return []byte(secret), nil
		})

		// 4. CHECK FOR ERRORS (This is where the debug prints are helpful)
		if err != nil {
			fmt.Println("--- JWT DEBUG ERROR ---")
			fmt.Printf("Message: %v\n", err)
			fmt.Printf("Secret Key used by Middleware: '%s'\n", os.Getenv("JWT_SECRET"))
			fmt.Println("-----------------------")

			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// 5. If the token is valid, extract the user_id
		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// user_id is stored as a float64 by the JWT library, so we convert it to uint
			userID := uint(claims["user_id"].(float64))

			// Save the ID in the Context so handlers can use it
			c.Set("user_id", userID)
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token claims"})
			c.Abort()
			return
		}

		c.Next()
	}
}
