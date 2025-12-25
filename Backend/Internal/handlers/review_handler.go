package handlers

import (
	"net/http"
	"strconv"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/gin-gonic/gin"
)

type ReviewHandler struct {
	service services.ReviewService
}

func NewReviewHandler(service services.ReviewService) *ReviewHandler {
	return &ReviewHandler{service: service}
}

func (h *ReviewHandler) AddReview(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)
	bookID, _ := strconv.Atoi(c.Param("id"))

	var req dto.CreateReviewRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.AddReview(userID, uint(bookID), req)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Review added successfully"})
}

func (h *ReviewHandler) GetReviews(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)
	bookID, _ := strconv.Atoi(c.Param("id"))

	reviews, err := h.service.GetBookReviews(userID, uint(bookID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"data": reviews})
}
