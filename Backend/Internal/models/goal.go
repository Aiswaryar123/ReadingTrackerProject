package models

import "time"

type ReadingGoal struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	User        User      `json:"-" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Year        int       `json:"year" gorm:"not null"`
	TargetBooks int       `json:"target_books" gorm:"not null"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}
