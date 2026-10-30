package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
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

	// Chạy server ở cổng 8080 (mặc định)
	r.Run(":8080")
}
