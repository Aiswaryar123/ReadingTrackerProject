package models

import "time"

type Book struct {
	ID              uint   `json:"id" gorm:"primaryKey"`
	UserID          uint   `json:"user_id" gorm:"not null"`
	User            User   `json:"-" gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;"`
	Title           string `json:"title" gorm:"not null"`
	Author          string `json:"author" gorm:"not null"`
	ISBN            string `json:"isbn"`
	Genre           string `json:"genre"`
	PublicationYear int    `json:"publication_year"`
	TotalPages      int    `json:"total_pages"`

	Progress *ReadingProgress `json:"progress" gorm:"foreignKey:BookID"`

	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
