package dto

type SetGoalRequest struct {
	Year        int `json:"year" binding:"required"`
	Month       int `json:"month" binding:"required,min=1,max=12"`
	TargetBooks int `json:"target_books" binding:"required,min=1"`
}

type GoalProgressResponse struct {
	Year        int  `json:"year"`
	Month       int  `json:"month"`
	Target      int  `json:"target"`
	Current     int  `json:"current"`
	IsCompleted bool `json:"is_completed"`
}
