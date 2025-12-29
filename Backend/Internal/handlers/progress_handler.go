package handlers

import (
	"net/http"
	"strconv"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/gin-gonic/gin"
)

type ProgressHandler struct {
	service services.ProgressService
}

func NewProgressHandler(service services.ProgressService) *ProgressHandler {
	return &ProgressHandler{service: service}
}

func (h *ProgressHandler) GetProgress(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)
	bookID, _ := strconv.Atoi(c.Param("id"))
	progress, err := h.service.GetProgress(userID, uint(bookID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, progress)
}

func (h *ProgressHandler) UpdateProgress(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)
	bookID, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.UpdateProgress(userID, uint(bookID), req)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Progress updated"})
}
