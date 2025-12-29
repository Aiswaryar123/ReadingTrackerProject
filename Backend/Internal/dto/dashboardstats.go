package dto

type DashboardStats struct {
	TotalBooks       int64 `json:"total_books"`
	BooksFinished    int64 `json:"books_finished"`
	CurrentlyReading int64 `json:"currently_reading"`
	GoalTarget       int   `json:"goal_target"`
}
