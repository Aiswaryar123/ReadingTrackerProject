package models

import "time"

type ReadingProgress struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	BookID      uint      `json:"book_id" gorm:"not null"`
	Book        Book      `json:"-" gorm:"foreignKey:BookID;constraint:OnDelete:CASCADE;"`
	CurrentPage int       `json:"current_page" gorm:"default:0"`
	Status      string    `json:"status" gorm:"default:'Want to Read'"`
	LastUpdated time.Time `json:"last_updated" gorm:"autoUpdateTime"`
}
