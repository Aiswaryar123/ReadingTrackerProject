package repository

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/models"
	"gorm.io/gorm"
)

type ProgressRepository interface {
	GetByBookID(bookID uint) (*models.ReadingProgress, error)
	Save(progress *models.ReadingProgress) error
}

type progressRepository struct {
	db *gorm.DB
}

func NewProgressRepository(db *gorm.DB) ProgressRepository {
	return &progressRepository{db: db}
}

func (r *progressRepository) GetByBookID(bookID uint) (*models.ReadingProgress, error) {
	var progress models.ReadingProgress
	err := r.db.Where("book_id = ?", bookID).First(&progress).Error
	return &progress, err
}

func (r *progressRepository) Save(p *models.ReadingProgress) error {
	return r.db.Save(p).Error
}
