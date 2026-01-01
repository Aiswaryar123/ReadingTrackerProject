package models

import "time"

type Book struct {
	ID uint `json:"id" gorm:"primaryKey"`
	// Keep the Title/Author unique index (this is usually fine)
	UserID uint   `json:"user_id" gorm:"not null;uniqueIndex:idx_user_title_author"`
	Title  string `json:"title" gorm:"not null;uniqueIndex:idx_user_title_author"`
	Author string `json:"author" gorm:"not null;uniqueIndex:idx_user_title_author"`

	// FIX: Remove the uniqueIndex tag here.
	// We will handle the ISBN logic in the Service layer instead.
	ISBN string `json:"isbn"`

	Genre           string           `json:"genre"`
	PublicationYear int              `json:"publication_year"`
	TotalPages      int              `json:"total_pages"`
	Progress        *ReadingProgress `json:"progress" gorm:"foreignKey:BookID"`
	CreatedAt       time.Time        `json:"created_at"`
	UpdatedAt       time.Time        `json:"updated_at"`
}
