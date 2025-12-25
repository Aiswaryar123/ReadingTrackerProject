package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

type FakeProgressRepo struct {
	SavedData *models.ReadingProgress
}

func (f *FakeProgressRepo) GetByBookID(id uint) (*models.ReadingProgress, error) {
	if f.SavedData == nil {
		return nil, errors.New("record not found")
	}
	return f.SavedData, nil
}

func (f *FakeProgressRepo) Save(p *models.ReadingProgress) error {
	f.SavedData = p
	return nil
}

type FakeBookRepoForProgress struct {
	UserOwnsBook bool
}

func (f *FakeBookRepoForProgress) GetBookByID(id uint, uid uint) (*models.Book, error) {
	if !f.UserOwnsBook {
		return nil, errors.New("access denied")
	}
	return &models.Book{ID: id, UserID: uid}, nil
}

func (f *FakeBookRepoForProgress) CreateBook(b *models.Book) error                  { return nil }
func (f *FakeBookRepoForProgress) GetBooksByUserID(uid uint) ([]models.Book, error) { return nil, nil }
func (f *FakeBookRepoForProgress) UpdateBook(bid, uid uint, b *models.Book) error   { return nil }
func (f *FakeBookRepoForProgress) DeleteBook(id, uid uint) error                    { return nil }

func TestUpdateProgress_NewEntry(t *testing.T) {

	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	progressRepo := &FakeProgressRepo{SavedData: nil}
	service := NewProgressService(progressRepo, bookRepo)

	req := dto.UpdateProgressRequest{CurrentPage: 50, Status: "Reading"}

	err := service.UpdateProgress(1, 10, req)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if progressRepo.SavedData.CurrentPage != 50 {
		t.Errorf("Expected page 50, but got %d", progressRepo.SavedData.CurrentPage)
	}
}

func TestUpdateProgress_ExistingEntry(t *testing.T) {

	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	existing := &models.ReadingProgress{BookID: 10, CurrentPage: 10, Status: "Reading"}
	progressRepo := &FakeProgressRepo{SavedData: existing}
	service := NewProgressService(progressRepo, bookRepo)

	req := dto.UpdateProgressRequest{CurrentPage: 75, Status: "Reading"}

	err := service.UpdateProgress(1, 10, req)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if progressRepo.SavedData.CurrentPage != 75 {
		t.Errorf("Expected page 75, but got %d", progressRepo.SavedData.CurrentPage)
	}
}

func TestGetProgress_Success(t *testing.T) {

	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	existing := &models.ReadingProgress{BookID: 10, CurrentPage: 100, Status: "Completed"}
	progressRepo := &FakeProgressRepo{SavedData: existing}
	service := NewProgressService(progressRepo, bookRepo)

	result, err := service.GetProgress(1, 10)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if result.Status != "Completed" {
		t.Errorf("Expected status 'Completed', but got %s", result.Status)
	}
}

func TestUpdateProgress_SecurityFailure(t *testing.T) {

	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: false}
	progressRepo := &FakeProgressRepo{}
	service := NewProgressService(progressRepo, bookRepo)

	req := dto.UpdateProgressRequest{CurrentPage: 10, Status: "Reading"}

	err := service.UpdateProgress(1, 99, req)

	if err == nil {
		t.Errorf("Expected security error (access denied), but got nil")
	}
}
