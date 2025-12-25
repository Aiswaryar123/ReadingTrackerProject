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
	return &models.Book{ID: id, UserID: uid}, nil
}

func (f *FakeBookRepoForReview) CreateBook(b *models.Book) error                  { return nil }
func (f *FakeBookRepoForReview) GetBooksByUserID(uid uint) ([]models.Book, error) { return nil, nil }
func (f *FakeBookRepoForReview) UpdateBook(bid, uid uint, b *models.Book) error   { return nil }
func (f *FakeBookRepoForReview) DeleteBook(id, uid uint) error                    { return nil }

type FakeReviewRepo struct {
	SavedReview *models.Review
}

func (f *FakeReviewRepo) CreateReview(r *models.Review) error {
	f.SavedReview = r
	return nil
}

func (f *FakeReviewRepo) GetReviewsByBookID(bookID uint) ([]models.Review, error) {

	return []models.Review{
		{Rating: 5, Comment: "Great!"},
	}, nil
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
		t.Errorf("Expected saved rating to be 4, but got %d", reviewRepo.SavedReview.Rating)
	}
}

func TestGetBookReviews_Success(t *testing.T) {

	bookRepo := &FakeBookRepoForReview{UserOwnsBook: true}
	reviewRepo := &FakeReviewRepo{}
	service := NewReviewService(reviewRepo, bookRepo)

	reviews, err := service.GetBookReviews(1, 10)

	if err != nil {
		t.Errorf("Expected success, but got error: %v", err)
	}
	if len(reviews) == 0 {
		t.Errorf("Expected to get reviews, but got an empty list")
	}
}
