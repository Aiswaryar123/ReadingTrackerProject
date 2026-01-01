package models

import "time"

type ReadingGoal struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID      uint      `json:"user_id" gorm:"not null;uniqueIndex:idx_user_year_month"`
	Year        int       `json:"year" gorm:"not null;uniqueIndex:idx_user_year_month"`
	Month       int       `json:"month" gorm:"not null;uniqueIndex:idx_user_year_month"`
	TargetBooks int       `json:"target_books" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
