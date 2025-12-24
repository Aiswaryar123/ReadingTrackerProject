package services

import (
	"errors"
	"os"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"

	"golang.org/x/crypto/bcrypt"
)

type FakeUserRepo struct {
	Users []models.User
}

func (f *FakeUserRepo) CreateUser(user *models.User) error {
	f.Users = append(f.Users, *user)
	return nil
}

func (f *FakeUserRepo) FindByEmail(email string) (*models.User, error) {
	for _, u := range f.Users {
		if u.Email == email {
			return &u, nil
		}
	}
	return nil, errors.New("not found")
}

func (f *FakeUserRepo) FindByID(id uint) (*models.User, error) { return nil, nil }

func TestRegister_Success(t *testing.T) {
	repo := &FakeUserRepo{}
	service := NewUserService(repo)

	req := dto.RegisterRequest{
		Name:     "Test User",
		Email:    "test@example.com",
		Password: "password123",
	}

	user, err := service.Register(req)

	if err != nil {
		t.Errorf("Expected successful registration, but got error: %v", err)
	}
	if user.Email != "test@example.com" {
		t.Errorf("Expected email test@example.com, but got %s", user.Email)
	}

	if user.Password == "password123" {
		t.Errorf("Security error: Password was not hashed!")
	}
}

func TestRegister_DuplicateEmail(t *testing.T) {

	existingUser := models.User{Email: "existing@example.com"}
	repo := &FakeUserRepo{Users: []models.User{existingUser}}
	service := NewUserService(repo)

	req := dto.RegisterRequest{
		Name:     "New User",
		Email:    "existing@example.com",
		Password: "password123",
	}

	_, err := service.Register(req)

	if err == nil {
		t.Errorf("Expected error for duplicate email, but got nil")
	}
}

func TestLogin_Success(t *testing.T) {
	os.Setenv("JWT_SECRET", "test_secret")

	pass := "secret123"
	hashed, _ := bcrypt.GenerateFromPassword([]byte(pass), bcrypt.DefaultCost)
	repo := &FakeUserRepo{
		Users: []models.User{
			{ID: 1, Email: "login@example.com", Password: string(hashed)},
		},
	}
	service := NewUserService(repo)

	req := dto.LoginRequest{
		Email:    "login@example.com",
		Password: "secret123",
	}

	token, err := service.Login(req)

	if err != nil {
		t.Errorf("Expected successful login, but got error: %v", err)
	}

	if token == "" {
		t.Errorf("Expected a JWT token string, but got an empty string")
	}
}
func TestLogin_WrongPassword(t *testing.T) {

	hashed, _ := bcrypt.GenerateFromPassword([]byte("realpass"), bcrypt.DefaultCost)
	repo := &FakeUserRepo{
		Users: []models.User{{Email: "user@example.com", Password: string(hashed)}},
	}
	service := NewUserService(repo)

	req := dto.LoginRequest{
		Email:    "user@example.com",
		Password: "wrongpassword",
	}

	_, err := service.Login(req)

	if err == nil {
		t.Errorf("Expected error for wrong password, but got nil")
	}
}
