package main

import (
	"github.com/Aiswaryar123/ReadingTrackerProject/Internal/database"
	"github.com/Aiswaryar123/ReadingTrackerProject/configs"
)

func main() {
	// load secrets
	cfg := configs.LoadConfig()

	// connect to database
	database.ConnectDB(cfg)
}
