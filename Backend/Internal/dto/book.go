package dto

type CreateBookRequest struct {
	Title           string `json:"title" binding:"required"`
	Author          string `json:"author" binding:"required"`
	ISBN            string `json:"isbn"`
	Genre           string `json:"genre"`
	PublicationYear int    `json:"publication_year"`
	TotalPages      int    `json:"total_pages"`
}

type UpdateBookRequest struct {
	Title      string `json:"title"`
	Author     string `json:"author"`
	TotalPages int    `json:"total_pages"`
}
