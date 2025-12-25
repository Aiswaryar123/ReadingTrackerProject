package dto

type SetGoalRequest struct {
	Year        int `json:"year" binding:"required"`
	TargetBooks int `json:"target_books" binding:"required,min=1"`
}

type GoalProgressResponse struct {
	Year        int  `json:"year"`
	Target      int  `json:"target"`
	Current     int  `json:"current"`
	IsCompleted bool `json:"is_completed"`
}
