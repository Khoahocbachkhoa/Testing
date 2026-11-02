package main

import (
	"context"
	"net/http"
	"server/db"

	"github.com/gin-gonic/gin"
)

func main() {
	dbURL := "postgres://postgres:khoa2005@localhost:5432/app?sslmode=disable"
	ctx := context.Background()
	// Kết nối tới database
	db.ConnectDatabase(dbURL)

	// Khởi tạo router mặc định của Gin (đã bao gồm Logger và Recovery middleware)
	r := gin.Default()

	// Định nghĩa route GET "/"
	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello, Gin!",
		})
	})

	// Định nghĩa route GET có tham số "/ping"
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"status": "pong",
		})
	})

	//
	r.GET("/check-db-health", func(c *gin.Context) {
		// Ping to database!
		health_status := "OKE"

		if err := db.Pool.Ping(ctx); err != nil {
			health_status = "NOT OKE"
		}

		c.JSON(http.StatusOK, gin.H{
			"health": health_status,
		})
	})

	// Chạy server ở cổng 8080 (mặc định)
	r.Run(":8080")
}
