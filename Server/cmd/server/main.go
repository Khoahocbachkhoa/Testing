package main

import (
	"context"
	"log"
	"net/http"
	"server/internal/db"
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	dbURL := "postgres://postgres:khoa2005@localhost:5432/app?sslmode=disable"

	ctx := context.Background()
	db.ConnectDatabase(dbURL)
	defer db.CloseDB()

	r := gin.Default()
	userRepository := repository.NewUserRepository(db.Pool)
	userService := service.NewUserService(userRepository)
	userHandler := handler.NewUserHandler(userService)

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello, Gin!"})
	})

	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "pong"})
	})

	r.GET("/check-db-health", func(c *gin.Context) {
		healthStatus := "OKE"
		if err := db.Pool.Ping(ctx); err != nil {
			healthStatus = "NOT OKE"
		}

		c.JSON(http.StatusOK, gin.H{"health": healthStatus})
	})

	auth := r.Group("/api/auth")
	auth.POST("/register", userHandler.Register)
	auth.POST("/login", userHandler.Login)

	if err := r.Run(":8080"); err != nil {
		log.Fatal("Cannot start server: ", err)
	}
}
