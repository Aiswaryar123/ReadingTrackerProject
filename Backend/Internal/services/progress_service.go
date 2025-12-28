package services

import (
	"errors"
	"fmt"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
)

type ProgressService interface {
	UpdateProgress(userID uint, bookID uint, req dto.UpdateProgressRequest) error
	GetProgress(userID uint, bookID uint) (*models.ReadingProgress, error)
}

type progressService struct {
	repo     repository.ProgressRepository
	bookRepo repository.BookRepository
}

func NewProgressService(repo repository.ProgressRepository, bookRepo repository.BookRepository) ProgressService {
	return &progressService{
		repo:     repo,
		bookRepo: bookRepo,
	}
}

func (s *progressService) UpdateProgress(userID uint, bookID uint, req dto.UpdateProgressRequest) error {

	book, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return errors.New("access denied: you do not own this book")
	}

	if req.CurrentPage > book.TotalPages {
		return fmt.Errorf("invalid page: this book only has %d pages", book.TotalPages)
	}

	if req.Status == "Finished" && req.CurrentPage < book.TotalPages {
		return fmt.Errorf("to mark as Finished, you must be on page %d", book.TotalPages)
	}

	progress, err := s.repo.GetByBookID(bookID)
	if err != nil {
		progress = &models.ReadingProgress{BookID: bookID}
	}

	progress.CurrentPage = req.CurrentPage
	progress.Status = req.Status

	return s.repo.Save(progress)
}

func (s *progressService) GetProgress(userID uint, bookID uint) (*models.ReadingProgress, error) {
	_, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return nil, errors.New("access denied")
	}
	return s.repo.GetByBookID(bookID)
}
