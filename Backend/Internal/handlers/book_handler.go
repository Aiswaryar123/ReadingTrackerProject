package handlers

import (
	"net/http"
	"strconv"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/services"
	"github.com/gin-gonic/gin"
)

type BookHandler struct {
	service services.BookService
}

func NewBookHandler(service services.BookService) *BookHandler {
	return &BookHandler{service: service}
}

func getIDFromContext(c *gin.Context) uint {
	val, _ := c.Get("user_id")
	return val.(uint)
}

func (h *BookHandler) AddBook(c *gin.Context) {
	userID := getIDFromContext(c)

	var req dto.CreateBookRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	book, err := h.service.CreateBook(userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add book"})
		return
	}
	c.JSON(http.StatusCreated, book)
}

func (h *BookHandler) ListBooks(c *gin.Context) {
	userID := getIDFromContext(c)
	books, err := h.service.FetchBooks(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch library"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"data": books})
}

func (h *BookHandler) UpdateBook(c *gin.Context) {
	userID := getIDFromContext(c)
	bookID, _ := strconv.Atoi(c.Param("id"))

	var req dto.UpdateBookRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.service.UpdateBook(uint(bookID), userID, req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update book"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Book updated successfully"})
}

func (h *BookHandler) DeleteBook(c *gin.Context) {
	userID := getIDFromContext(c)
	bookID, _ := strconv.Atoi(c.Param("id"))

	err := h.service.DeleteBook(uint(bookID), userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete book"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Book removed from library"})
}
func (h *BookHandler) GetBook(c *gin.Context) {
	userID := getIDFromContext(c)
	bookID, _ := strconv.Atoi(c.Param("id"))

	book, err := h.service.GetSingleBook(uint(bookID), userID)
	if err != nil {

		c.JSON(http.StatusNotFound, gin.H{"error": "book not found"})
		return
	}

	c.JSON(http.StatusOK, book)
}
