package services

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/dto"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/repository"
)

type GoalService interface {
	SetUserGoal(userID uint, req dto.SetGoalRequest) error
	GetProgress(userID uint, year int, month int) (*dto.GoalProgressResponse, error)
}

type goalService struct {
	repo repository.GoalRepository
}

func NewGoalService(repo repository.GoalRepository) GoalService {
	return &goalService{repo: repo}
}

func (s *goalService) SetUserGoal(userID uint, req dto.SetGoalRequest) error {
	goal := &models.ReadingGoal{
		UserID:      userID,
		Year:        req.Year,
		Month:       req.Month,
		TargetBooks: req.TargetBooks,
	}
	return s.repo.SaveGoal(goal)
}

func (s *goalService) GetProgress(userID uint, year int, month int) (*dto.GoalProgressResponse, error) {

	goal, err := s.repo.GetGoal(userID, year, month)
	if err != nil {
		return nil, err
	}

	finishedCount, err := s.repo.CountFinishedBooks(userID, year, month)
	if err != nil {
		return nil, err
	}

	return &dto.GoalProgressResponse{
		Year:        goal.Year,
		Target:      goal.TargetBooks,
		Current:     int(finishedCount),
		IsCompleted: int(finishedCount) >= goal.TargetBooks,
	}, nil
}
