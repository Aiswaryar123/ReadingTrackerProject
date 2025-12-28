package repository

import (
	"time"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"gorm.io/gorm"
)

type BookRepository interface {
	CreateBook(book *models.Book) error
	GetBooksByUserID(userID uint) ([]models.Book, error)
	GetBookByID(bookID uint, userID uint) (*models.Book, error)
	UpdateBook(bookID uint, userID uint, book *models.Book) error
	DeleteBook(bookID uint, userID uint) error
	GetDashboardStats(userID uint) (dto.DashboardStats, error)
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

func (r *bookRepository) DeleteBook(id uint, userID uint) error {
	return r.db.Where("id = ? AND user_id = ?", id, userID).Delete(&models.Book{}).Error
}

func (r *bookRepository) GetDashboardStats(userID uint) (dto.DashboardStats, error) {
	var stats dto.DashboardStats

	currentYear := time.Now().Year()

	r.db.Model(&models.Book{}).Where("user_id = ?", userID).Count(&stats.TotalBooks)

	r.db.Table("reading_progresses").
		Joins("JOIN books ON books.id = reading_progresses.book_id").
		Where("books.user_id = ? AND reading_progresses.status = ?", userID, "Finished").
		Count(&stats.BooksFinished)

	r.db.Table("reading_progresses").
		Joins("JOIN books ON books.id = reading_progresses.book_id").
		Where("books.user_id = ? AND reading_progresses.status = ?", userID, "Currently Reading").
		Count(&stats.CurrentlyReading)

	r.db.Table("reviews").
		Joins("JOIN books ON books.id = reviews.book_id").
		Where("books.user_id = ?", userID).
		Select("COALESCE(AVG(rating), 0)").Scan(&stats.AverageRating)

	var goal models.ReadingGoal
	r.db.Where("user_id = ? AND year = ?", userID, currentYear).First(&goal)
	stats.GoalTarget = goal.TargetBooks

	return stats, nil
}
