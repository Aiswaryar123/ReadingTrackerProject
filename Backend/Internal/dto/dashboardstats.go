package dto

type DashboardStats struct {
	TotalBooks       int64 `json:"total_books"`
	BooksFinished    int64 `json:"books_finished"`
	CurrentlyReading int64 `json:"currently_reading"`
	YearlyTarget     int   `json:"yearly_target"`
	MonthlyTarget    int   `json:"monthly_target"`
	MonthlyFinished  int64 `json:"monthly_finished"`

	GoalsSetCount int64 `json:"goals_set_count"`
}
