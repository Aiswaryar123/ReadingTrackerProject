package dto

type UpdateProgressRequest struct {
	CurrentPage int    `json:"current_page" binding:"min=0"`
	Status      string `json:"status" binding:"required"`
}
