package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

// fake repo
type FakeBookRepo struct {
	Books []models.Book
	Err   error
}

func (f *FakeBookRepo) GetDashboardStats(userID uint) (dto.DashboardStats, error) {

	return dto.DashboardStats{
		TotalBooks:    5,
		AverageRating: 4.0,
	}, nil
}
func (f *FakeBookRepo) CreateBook(b *models.Book) error {
	if f.Err != nil {
		return f.Err
	}
	f.Books = append(f.Books, *b)
	return nil
}

func (f *FakeBookRepo) GetBooksByUserID(uid uint) ([]models.Book, error) {
	if f.Err != nil {
		return nil, f.Err
	}
	return f.Books, nil
}

func (f *FakeBookRepo) GetBookByID(id uint, uid uint) (*models.Book, error) {
	if f.Err != nil {
		return nil, f.Err
	}
	return &models.Book{ID: id, UserID: uid}, nil
}

func (f *FakeBookRepo) UpdateBook(bid uint, uid uint, b *models.Book) error {
	return f.Err
}

func (f *FakeBookRepo) DeleteBook(bid uint, uid uint) error {
	return f.Err
}

// create book

func TestCreateBook_Success(t *testing.T) {
	repo := &FakeBookRepo{}
	service := NewBookService(repo)

	req := dto.CreateBookRequest{
		Title:  "TDD Book",
		Author: "Go Expert",
	}
	book, err := service.CreateBook(1, req)

	if err != nil {
		t.Fatalf("Expected no error, got %v", err)
	}
	if book.UserID != 1 {
		t.Errorf("Expected UserID 1, got %d", book.UserID)
	}
}

func TestCreateBook_Failure(t *testing.T) {
	repo := &FakeBookRepo{Err: errors.New("db error")}
	service := NewBookService(repo)

	_, err := service.CreateBook(1, dto.CreateBookRequest{})
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}

// fetch book

func TestFetchBooks_Success(t *testing.T) {
	repo := &FakeBookRepo{
		Books: []models.Book{{Title: "Book 1"}, {Title: "Book 2"}},
	}
	service := NewBookService(repo)
	books, err := service.FetchBooks(1)

	if err != nil {
		t.Fatalf("Expected success, got error")
	}
	if len(books) != 2 {
		t.Errorf("Expected 2 books, got %d", len(books))
	}
}

func TestFetchBooks_Failure(t *testing.T) {
	repo := &FakeBookRepo{Err: errors.New("fetch error")}
	service := NewBookService(repo)

	_, err := service.FetchBooks(1)
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}

// getsingle book

func TestGetSingleBook_Success(t *testing.T) {
	repo := &FakeBookRepo{}
	service := NewBookService(repo)

	book, err := service.GetSingleBook(1, 1)
	if err != nil {
		t.Fatalf("Expected success, got error")
	}
	if book.ID != 1 {
		t.Errorf("Expected Book ID 1, got %d", book.ID)
	}
}

func TestGetSingleBook_Failure(t *testing.T) {
	repo := &FakeBookRepo{Err: errors.New("not found")}
	service := NewBookService(repo)

	_, err := service.GetSingleBook(1, 1)
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}

// update book

func TestUpdateBook_Success(t *testing.T) {
	repo := &FakeBookRepo{}
	service := NewBookService(repo)

	req := dto.UpdateBookRequest{
		Title:  "Updated Title",
		Author: "Updated Author",
	}

	err := service.UpdateBook(1, 1, req)
	if err != nil {
		t.Errorf("Expected success, got error: %v", err)
	}
}

func TestUpdateBook_Failure(t *testing.T) {
	repo := &FakeBookRepo{Err: errors.New("update failed")}
	service := NewBookService(repo)

	err := service.UpdateBook(1, 1, dto.UpdateBookRequest{})
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}

// delete book

func TestDeleteBook_Success(t *testing.T) {
	repo := &FakeBookRepo{}
	service := NewBookService(repo)

	err := service.DeleteBook(1, 1)
	if err != nil {
		t.Errorf("Expected success, got error: %v", err)
	}
}

func TestDeleteBook_Failure(t *testing.T) {
	repo := &FakeBookRepo{Err: errors.New("delete failed")}
	service := NewBookService(repo)

	err := service.DeleteBook(1, 1)
	if err == nil {
		t.Errorf("Expected error, got nil")
	}
}
func TestGetDashboardStats_Success(t *testing.T) {

	repo := &FakeBookRepo{}
	service := NewBookService(repo)

	stats, err := service.GetDashboardStats(1)
	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}

	if stats.TotalBooks != 5 {
		t.Errorf("Expected 5 books (from FakeRepo), but got %d", stats.TotalBooks)
	}

	if stats.AverageRating != 4.0 {
		t.Errorf("Expected rating 4.0, but got %f", stats.AverageRating)
	}
}
