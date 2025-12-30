package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

type FakeProgressRepo struct {
	SavedData *models.ReadingProgress
	MockErr   error
}

func (f *FakeProgressRepo) GetByBookID(id uint) (*models.ReadingProgress, error) {

	if f.MockErr != nil {
		return nil, f.MockErr
	}
	if f.SavedData == nil {
		return nil, errors.New("record not found")
	}
	return f.SavedData, nil
}

func (f *FakeProgressRepo) Save(p *models.ReadingProgress) error {
	f.SavedData = p
	return f.MockErr
}

type FakeBookRepoForProgress struct {
	UserOwnsBook bool
}

func (f *FakeBookRepoForProgress) GetBookByID(id uint, uid uint) (*models.Book, error) {
	if !f.UserOwnsBook {
		return nil, errors.New("access denied")
	}

	return &models.Book{
		ID:         id,
		UserID:     uid,
		TotalPages: 300,
	}, nil
}

func (f *FakeBookRepoForProgress) CreateBook(b *models.Book) error                  { return nil }
func (f *FakeBookRepoForProgress) GetBooksByUserID(uid uint) ([]models.Book, error) { return nil, nil }
func (f *FakeBookRepoForProgress) UpdateBook(bid, uid uint, b *models.Book) error   { return nil }
func (f *FakeBookRepoForProgress) DeleteBook(id, uid uint) error                    { return nil }
func (f *FakeBookRepoForProgress) GetDashboardStats(userID uint) (dto.DashboardStats, error) {
	return dto.DashboardStats{}, nil
}

func TestUpdateProgress_PageOverflow(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	progressRepo := &FakeProgressRepo{}
	service := NewProgressService(progressRepo, bookRepo)

	req := dto.UpdateProgressRequest{CurrentPage: 350, Status: "Reading"}

	err := service.UpdateProgress(1, 10, req)

	if err == nil {
		t.Errorf("Expected error for page overflow, but got nil")
	}
}

func TestUpdateProgress_FinishedInvalidPage(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	progressRepo := &FakeProgressRepo{}
	service := NewProgressService(progressRepo, bookRepo)

	req := dto.UpdateProgressRequest{CurrentPage: 50, Status: "Finished"}

	err := service.UpdateProgress(1, 10, req)

	if err == nil {
		t.Errorf("Expected error when marking Finished without reaching last page, but got nil")
	}
}

func TestGetProgress_NotFoundDefault(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}

	progressRepo := &FakeProgressRepo{SavedData: nil}
	service := NewProgressService(progressRepo, bookRepo)

	result, err := service.GetProgress(1, 10)

	if err != nil {
		t.Errorf("Expected success (default state), but got error: %v", err)
	}
	if result.Status != "Want to Read" {
		t.Errorf("Expected default status 'Want to Read', but got %s", result.Status)
	}
}

func TestGetProgress_GeneralError(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}

	progressRepo := &FakeProgressRepo{MockErr: errors.New("database disk failure")}
	service := NewProgressService(progressRepo, bookRepo)

	_, err := service.GetProgress(1, 10)

	if err == nil {
		t.Errorf("Expected general DB error, but got nil")
	}
}

func TestUpdateProgress_NewEntry(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	progressRepo := &FakeProgressRepo{SavedData: nil}
	service := NewProgressService(progressRepo, bookRepo)
	req := dto.UpdateProgressRequest{CurrentPage: 50, Status: "Reading"}
	err := service.UpdateProgress(1, 10, req)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	if progressRepo.SavedData.CurrentPage != 50 {
		t.Errorf("Got %d", progressRepo.SavedData.CurrentPage)
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
		t.Fatalf("Error: %v", err)
	}
	if progressRepo.SavedData.CurrentPage != 75 {
		t.Errorf("Got %d", progressRepo.SavedData.CurrentPage)
	}
}

func TestGetProgress_Success(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: true}
	existing := &models.ReadingProgress{BookID: 10, CurrentPage: 100, Status: "Finished"}
	progressRepo := &FakeProgressRepo{SavedData: existing}
	service := NewProgressService(progressRepo, bookRepo)
	result, err := service.GetProgress(1, 10)
	if err != nil {
		t.Fatalf("Error: %v", err)
	}
	if result.Status != "Finished" {
		t.Errorf("Got %s", result.Status)
	}
}

func TestUpdateProgress_SecurityFailure(t *testing.T) {
	bookRepo := &FakeBookRepoForProgress{UserOwnsBook: false}
	progressRepo := &FakeProgressRepo{}
	service := NewProgressService(progressRepo, bookRepo)
	req := dto.UpdateProgressRequest{CurrentPage: 10, Status: "Reading"}
	err := service.UpdateProgress(1, 99, req)
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}
