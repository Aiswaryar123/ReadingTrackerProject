package repository

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"gorm.io/gorm"
)

type BookRepository interface {
	CreateBook(book *models.Book) error
	GetBooksByUserID(userID uint) ([]models.Book, error)
	GetBookByID(bookID uint, userID uint) (*models.Book, error)
	UpdateBook(bookID uint, userID uint, book *models.Book) error
	DeleteBook(bookID uint, userID uint) error
}

type bookRepository struct {
	db *gorm.DB
}

func NewBookRepository(db *gorm.DB) BookRepository {
	return &bookRepository{db: db}
}

func (r *bookRepository) CreateBook(book *models.Book) error {
	return r.db.Create(book).Error
}

func (r *bookRepository) GetBooksByUserID(userID uint) ([]models.Book, error) {
	var books []models.Book

	err := r.db.Where("user_id = ?", userID).Find(&books).Error
	return books, err
}

func (r *bookRepository) GetBookByID(bookID uint, userID uint) (*models.Book, error) {
	var book models.Book

	err := r.db.Where("id = ? AND user_id = ?", bookID, userID).First(&book).Error
	return &book, err
}

func (r *bookRepository) UpdateBook(bookID uint, userID uint, book *models.Book) error {

	return r.db.Model(&models.Book{}).Where("id = ? AND user_id = ?", bookID, userID).Updates(book).Error
}

func (r *bookRepository) DeleteBook(bookID uint, userID uint) error {

	return r.db.Where("id = ? AND user_id = ?", bookID, userID).Delete(&models.Book{}).Error
}
