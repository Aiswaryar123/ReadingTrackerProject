package models

import "time"

type Book struct {
	ID uint `json:"id" gorm:"primaryKey"`

	UserID uint   `json:"user_id" gorm:"not null;uniqueIndex:idx_user_title_author"`
	Title  string `json:"title" gorm:"not null;uniqueIndex:idx_user_title_author"`
	Author string `json:"author" gorm:"not null;uniqueIndex:idx_user_title_author"`

	ISBN string `json:"isbn"`

	Genre           string           `json:"genre"`
	PublicationYear int              `json:"publication_year"`
	TotalPages      int              `json:"total_pages"`
	Progress        *ReadingProgress `json:"progress" gorm:"foreignKey:BookID"`
	CreatedAt       time.Time        `json:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at"`
}
