package services

import (
	"errors"
	"testing"

	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
)

type FakeGoalRepo struct {
	Goal       *models.ReadingGoal
	Count      int64
	Err        error
	SaveCalled bool
}

func (f *FakeGoalRepo) SaveGoal(goal *models.ReadingGoal) error {
	f.SaveCalled = true
	f.Goal = goal
	return f.Err
}

func (f *FakeGoalRepo) GetGoal(userID uint, year int, month int) (*models.ReadingGoal, error) {
	if f.Err != nil {
		return nil, f.Err
	}
	return f.Goal, nil
}

func (f *FakeGoalRepo) CountFinishedBooks(userID uint, year int, month int) (int64, error) {
	return f.Count, nil
}

func (f *FakeGoalRepo) GetYearlyTotalTarget(userID uint, year int) (int, error) {
	if f.Goal != nil {
		return f.Goal.TargetBooks, nil
	}
	return 0, f.Err
}

func TestGetGoalProgress_NotCompleted(t *testing.T) {

	repo := &FakeGoalRepo{
		Goal:  &models.ReadingGoal{Year: 2026, Month: 1, TargetBooks: 5},
		Count: 2,
	}
	goalService := NewGoalService(repo)

	result, err := goalService.GetProgress(1, 2026, 1)

	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}
	if result.IsCompleted != false {
		t.Errorf("Goal should NOT be completed (2/5), but logic said true")
	}
}

func TestGetGoalProgress_Completed(t *testing.T) {

	repo := &FakeGoalRepo{
		Goal:  &models.ReadingGoal{Year: 2026, Month: 1, TargetBooks: 3},
		Count: 3,
	}
	goalService := NewGoalService(repo)

	result, err := goalService.GetProgress(1, 2026, 1)

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
	goalService := NewGoalService(repo)

	_, err := goalService.GetProgress(1, 2030, 1)

	if err == nil {
		t.Errorf("Expected an error for a missing goal, but got nil")
	}
}

func TestSetUserGoal_Success(t *testing.T) {
	repo := &FakeGoalRepo{}
	goalService := NewGoalService(repo)

	req := dto.SetGoalRequest{
		Year:        2026,
		Month:       1,
		TargetBooks: 10,
	}

	err := goalService.SetUserGoal(1, req)

	if err != nil {
		t.Errorf("Expected no error, but got %v", err)
	}

	if !repo.SaveCalled {
		t.Errorf("Expected repository SaveGoal to be called")
	}

	if repo.Goal.Month != 1 {
		t.Errorf("Expected month 1 to be saved, but got %d", repo.Goal.Month)
	}
}

func TestGetProgress_RepoError(t *testing.T) {
	repo := &FakeGoalRepo{
		Err: errors.New("database connection failed"),
	}
	goalService := NewGoalService(repo)

	_, err := goalService.GetProgress(1, 2026, 1)

	if err == nil {
		t.Errorf("Expected error from repository, but got nil")
	}
}
