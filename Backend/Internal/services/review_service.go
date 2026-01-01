package services

import (
	"errors"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
)

type ReviewService interface {
	AddReview(userID uint, bookID uint, req dto.CreateReviewRequest) error
	GetBookReviews(userID uint, bookID uint) ([]models.Review, error)
}

type reviewService struct {
	repo     repository.ReviewRepository
	bookRepo repository.BookRepository
}

func NewReviewService(repo repository.ReviewRepository, bookRepo repository.BookRepository) ReviewService {
	return &reviewService{
		repo:     repo,
		bookRepo: bookRepo,
	}
}

func (s *reviewService) AddReview(userID uint, bookID uint, req dto.CreateReviewRequest) error {

	_, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return errors.New("access denied")
	}

	existing, _ := s.repo.GetReviewByBookID(bookID)
	if existing != nil {
		return errors.New("you have already reviewed this book")
	}

	review := &models.Review{
		BookID:  bookID,
		Rating:  req.Rating,
		Comment: req.Comment,
	}

	return s.repo.CreateReview(review)
}

func (s *reviewService) GetBookReviews(userID uint, bookID uint) ([]models.Review, error) {

	book, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return nil, errors.New("access denied")
	}

	if book.ISBN != "" {
		return s.repo.GetReviewsByISBN(book.ISBN)
	}

	return s.repo.GetReviewsByBookID(bookID)
}
