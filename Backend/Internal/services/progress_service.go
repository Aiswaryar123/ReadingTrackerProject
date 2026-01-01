package services

import (
	"errors"
	"fmt"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
	"gorm.io/gorm"
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

	if req.Status == "Want to Read" {
		req.CurrentPage = 0
	}

	if req.CurrentPage > book.TotalPages {
		return fmt.Errorf("invalid page: this book only has %d pages", book.TotalPages)
	}

	if req.CurrentPage == book.TotalPages && book.TotalPages > 0 {
		req.Status = "Finished"
	}

	if req.Status == "Finished" && req.CurrentPage < book.TotalPages {
		return fmt.Errorf("to mark as Finished, you must reach the final page (%d)", book.TotalPages)
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

	progress, err := s.repo.GetByBookID(bookID)

	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) || err.Error() == "record not found" {
			return &models.ReadingProgress{
				BookID:      bookID,
				Status:      "Want to Read",
				CurrentPage: 0,
			}, nil
		}
		return nil, err
	}

	return progress, nil
}
