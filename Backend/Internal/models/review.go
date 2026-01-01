package models

import "time"

type Review struct {
	ID     uint `json:"id" gorm:"primaryKey"`
	BookID uint `json:"book_id" gorm:"not null"`

	Book      Book      `json:"book" gorm:"foreignKey:BookID;constraint:OnDelete:CASCADE;"`
	Rating    int       `json:"rating"`
	Comment   string    `json:"comment"`
	CreatedAt time.Time `json:"created_at"`
}
