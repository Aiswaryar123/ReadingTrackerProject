package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

type FakeGoalRepo struct {
	Goal  *models.ReadingGoal
	Count int64
	Err   error
}

func (f *FakeGoalRepo) SaveGoal(goal *models.ReadingGoal) error {
	return nil
}

func (f *FakeGoalRepo) GetGoal(userID uint, year int) (*models.ReadingGoal, error) {
	if f.Err != nil {
		return nil, f.Err
	}
	return f.Goal, nil
}

func (f *FakeGoalRepo) CountFinishedBooks(userID uint, year int) (int64, error) {
	return f.Count, nil
}

func (f *FakeGoalRepo) UpdateGoal(userID uint, year int, target int) error {
	return nil
}

func TestGetGoalProgress_NotCompleted(t *testing.T) {

	repo := &FakeGoalRepo{
		Goal:  &models.ReadingGoal{Year: 2025, TargetBooks: 5},
		Count: 2,
	}
	service := NewGoalService(repo)

	result, err := service.GetProgress(1, 2025)

	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}
	if result.IsCompleted != false {
		t.Errorf("Goal should NOT be completed (2/5), but logic said true")
	}
}

func TestGetGoalProgress_Completed(t *testing.T) {

	repo := &FakeGoalRepo{
		Goal:  &models.ReadingGoal{Year: 2025, TargetBooks: 3},
		Count: 3,
	}
	service := NewGoalService(repo)

	result, err := service.GetProgress(1, 2025)

	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}
	if result.IsCompleted != true {
		t.Errorf("Goal SHOULD be completed (3/3), but logic said false")
	}
}

func TestGetGoalProgress_NotFound(t *testing.T) {

	repo := &FakeGoalRepo{
		Err: errors.New("record not found"),
	}
	service := NewGoalService(repo)

	_, err := service.GetProgress(1, 2030)

	if err == nil {
		t.Errorf("Expected an error for a year with no goal, but got nil")
	}
}
