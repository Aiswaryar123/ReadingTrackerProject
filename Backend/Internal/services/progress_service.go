package services

import (
	"errors"

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

	_, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return errors.New("access denied: you do not own this book")
	}

	progress, err := s.repo.GetByBookID(bookID)
	if err != nil {

		progress = &models.ReadingProgress{BookID: bookID}
	}

	//  update data
	progress.CurrentPage = req.CurrentPage
	progress.Status = req.Status

	//  Save
	return s.repo.Save(progress)
}

func (s *progressService) GetProgress(userID uint, bookID uint) (*models.ReadingProgress, error) {
	// check ownership
	_, err := s.bookRepo.GetBookByID(bookID, userID)
	if err != nil {
		return nil, errors.New("access denied")
	}

	return s.repo.GetByBookID(bookID)
}
