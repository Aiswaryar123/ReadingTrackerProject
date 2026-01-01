package repository

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"gorm.io/gorm"
)

type GoalRepository interface {
	SaveGoal(goal *models.ReadingGoal) error
	GetGoal(userID uint, year int, month int) (*models.ReadingGoal, error)
	CountFinishedBooks(userID uint, year int, month int) (int64, error)

	GetYearlyTotalTarget(userID uint, year int) (int, error)
}

type goalRepository struct {
	db *gorm.DB
}

func NewGoalRepository(db *gorm.DB) GoalRepository {
	return &goalRepository{db: db}
}

func (r *goalRepository) SaveGoal(goal *models.ReadingGoal) error {
	var existing models.ReadingGoal
	// only monthly goals
	err := r.db.Where("user_id = ? AND year = ? AND month = ?", goal.UserID, goal.Year, goal.Month).First(&existing).Error

	if err == nil {
		return r.db.Model(&existing).Update("target_books", goal.TargetBooks).Error
	}
	return r.db.Create(goal).Error
}

func (r *goalRepository) GetGoal(userID uint, year int, month int) (*models.ReadingGoal, error) {
	var goal models.ReadingGoal
	err := r.db.Where("user_id = ? AND year = ? AND month = ?", userID, year, month).First(&goal).Error
	return &goal, err
}

func (r *goalRepository) CountFinishedBooks(userID uint, year int, month int) (int64, error) {
	var count int64
	query := r.db.Table("reading_progresses").
		Joins("JOIN books ON books.id = reading_progresses.book_id").
		Where("books.user_id = ? AND reading_progresses.status = ?", userID, "Finished").
		Where("EXTRACT(YEAR FROM reading_progresses.last_updated) = ?", year)

	if month > 0 {
		query = query.Where("EXTRACT(MONTH FROM reading_progresses.last_updated) = ?", month)
	}

	err := query.Count(&count).Error
	return count, err
}

func (r *goalRepository) GetYearlyTotalTarget(userID uint, year int) (int, error) {
	var total int64

	err := r.db.Model(&models.ReadingGoal{}).
		Where("user_id = ? AND year = ?", userID, year).
		Select("COALESCE(SUM(target_books), 0)").
		Scan(&total).Error
	return int(total), err
}
