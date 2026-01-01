package handlers

import (
	"net/http"
	"strconv"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/gin-gonic/gin"
)

type GoalHandler struct {
	service services.GoalService
}

func NewGoalHandler(service services.GoalService) *GoalHandler {
	return &GoalHandler{service: service}
}

func (h *GoalHandler) SetGoal(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)
	var req dto.SetGoalRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := h.service.SetUserGoal(userID, req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to set goal"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Goal saved"})
}

func (h *GoalHandler) GetGoalStatus(c *gin.Context) {
	val, _ := c.Get("user_id")
	userID := val.(uint)

	year, _ := strconv.Atoi(c.Param("year"))
	month, _ := strconv.Atoi(c.Param("month"))

	status, err := h.service.GetProgress(userID, year, month)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "No goal found for this period"})
		return
	}
	c.JSON(http.StatusOK, status)
}
