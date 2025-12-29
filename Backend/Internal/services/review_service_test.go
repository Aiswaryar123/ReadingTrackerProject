package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

type FakeBookRepoForReview struct {
	UserOwnsBook bool
}

func (f *FakeBookRepoForReview) GetBookByID(id uint, uid uint) (*models.Book, error) {
	if !f.UserOwnsBook {
		return nil, errors.New("book not found")
	}
	return &models.Book{ID: id, UserID: uid, TotalPages: 300}, nil
}

func (f *FakeBookRepoForReview) CreateBook(b *models.Book) error                  { return nil }
func (f *FakeBookRepoForReview) GetBooksByUserID(uid uint) ([]models.Book, error) { return nil, nil }
func (f *FakeBookRepoForReview) UpdateBook(bid, uid uint, b *models.Book) error   { return nil }
func (f *FakeBookRepoForReview) DeleteBook(id, uid uint) error                    { return nil }
func (f *FakeBookRepoForReview) GetDashboardStats(userID uint) (dto.DashboardStats, error) {
	return dto.DashboardStats{}, nil
}

type FakeReviewRepo struct {
	Reviews     []models.Review
	SavedReview *models.Review
}

func (f *FakeReviewRepo) CreateReview(r *models.Review) error {
	f.SavedReview = r
	f.Reviews = append(f.Reviews, *r)
	return nil
}

func (f *FakeReviewRepo) GetReviewsByBookID(bookID uint) ([]models.Review, error) {
	return f.Reviews, nil
}

func (f *FakeReviewRepo) GetReviewByBookID(bookID uint) (*models.Review, error) {

	for _, r := range f.Reviews {
		if r.BookID == bookID {
			return &r, nil
		}
	}
	return nil, nil
}

func TestAddReview_BookNotFound(t *testing.T) {
	bookRepo := &FakeBookRepoForReview{UserOwnsBook: false}
	reviewRepo := &FakeReviewRepo{}
	service := NewReviewService(reviewRepo, bookRepo)

	req := dto.CreateReviewRequest{Rating: 5, Comment: "Great!"}
	err := service.AddReview(1, 99, req)

	if err == nil {
		t.Errorf("Expected 'book not found' error, but got nil")
	}
}

func TestAddReview_Success(t *testing.T) {
	bookRepo := &FakeBookRepoForReview{UserOwnsBook: true}
	reviewRepo := &FakeReviewRepo{}
	service := NewReviewService(reviewRepo, bookRepo)

	req := dto.CreateReviewRequest{Rating: 4, Comment: "Good read"}
	err := service.AddReview(1, 10, req)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if reviewRepo.SavedReview.Rating != 4 {
		t.Errorf("Expected saved rating 4, but got %d", reviewRepo.SavedReview.Rating)
	}
}

func TestGetBookReviews_Success(t *testing.T) {
	bookRepo := &FakeBookRepoForReview{UserOwnsBook: true}

	reviewRepo := &FakeReviewRepo{
		Reviews: []models.Review{{Rating: 5, Comment: "Great!"}},
	}
	service := NewReviewService(reviewRepo, bookRepo)

	reviews, err := service.GetBookReviews(1, 10)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if len(reviews) == 0 {
		t.Errorf("Expected to get reviews, but list was empty")
	}
}

func TestAddReview_DuplicateCheck(t *testing.T) {
	bookRepo := &FakeBookRepoForReview{UserOwnsBook: true}

	existingReview := models.Review{BookID: 10, Rating: 5, Comment: "Already exists"}
	reviewRepo := &FakeReviewRepo{
		Reviews: []models.Review{existingReview},
	}
	service := NewReviewService(reviewRepo, bookRepo)

	req := dto.CreateReviewRequest{Rating: 1, Comment: "Spam review"}

	err := service.AddReview(1, 10, req)

	if err == nil {
		t.Errorf("Expected error for duplicate review, but got nil")
	}
	if err != nil && err.Error() != "you have already reviewed this book" {
		t.Errorf("Expected duplicate error message, but got: %v", err)
	}
}
