package services

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
)

type BookService interface {
	CreateBook(userID uint, req dto.CreateBookRequest) (*models.Book, error)
	FetchBooks(userID uint) ([]models.Book, error)
	UpdateBook(bookID uint, userID uint, req dto.UpdateBookRequest) error
	DeleteBook(bookID uint, userID uint) error
	GetSingleBook(bookID uint, userID uint) (*models.Book, error)
}

type bookService struct {
	repo repository.BookRepository
}

func NewBookService(repo repository.BookRepository) BookService {
	return &bookService{repo: repo}
}

func (s *bookService) CreateBook(userID uint, req dto.CreateBookRequest) (*models.Book, error) {

	book := &models.Book{
		UserID:          userID,
		Title:           req.Title,
		Author:          req.Author,
		ISBN:            req.ISBN,
		Genre:           req.Genre,
		PublicationYear: req.PublicationYear,
		TotalPages:      req.TotalPages,
	}

	err := s.repo.CreateBook(book)
	return book, err
}

func (s *bookService) FetchBooks(userID uint) ([]models.Book, error) {
	return s.repo.GetBooksByUserID(userID)
}

func (s *bookService) UpdateBook(bookID uint, userID uint, req dto.UpdateBookRequest) error {
	book := &models.Book{
		Title:  req.Title,
		Author: req.Author,
	}
	return s.repo.UpdateBook(bookID, userID, book)
}

func (s *bookService) DeleteBook(bookID uint, userID uint) error {
	return s.repo.DeleteBook(bookID, userID)
}
func (s *bookService) GetSingleBook(bookID uint, userID uint) (*models.Book, error) {
	return s.repo.GetBookByID(bookID, userID)
}
