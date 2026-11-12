package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"server/internal/auth"
	"server/internal/db"
	"server/internal/handler"
	"server/internal/repository"
	"server/internal/service"
	"strings"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	if err := loadDotEnv(".env"); err != nil {
		log.Fatalf("Cannot load .env: %v", err)
	}

	secret := []byte(os.Getenv("JWT_SECRET"))

	databaseURL := os.Getenv("DATABASE_URL")
	if err := db.ConnectDatabase(databaseURL); err != nil {
		log.Fatalf("Cannot start server: %v", err)
	}
	defer db.CloseDB()

	r := gin.New()
	r.Use(gin.Logger(), gin.Recovery())
	r.Use(cors.New(cors.Config{
		AllowOrigins:     splitOrigins(os.Getenv("CORS_ORIGINS")),
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
		AllowCredentials: false,
	}))

	userRepository := repository.NewUserRepository(db.Pool)
	userService := service.NewUserService(userRepository)
	userHandler := handler.NewUserHandler(userService, secret)

	diaryRepository := repository.NewDiaryRepository(db.Pool)
	diaryService := service.NewDiaryService(diaryRepository)
	diaryHandler := handler.NewDiaryHandler(diaryService)

	r.GET("/", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Hello!"})
	})

	r.GET("/health", func(c *gin.Context) {
		if err := db.Pool.Ping(c.Request.Context()); err != nil {
			c.JSON(http.StatusServiceUnavailable, gin.H{"status": "unavailable"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	authRoutes := r.Group("/api/auth")
	authRoutes.POST("/register", userHandler.Register)
	authRoutes.POST("/login", userHandler.Login)
	authRoutes.GET("/me", auth.Middleware(secret), userHandler.Me)

	diaryEntries := r.Group("/api/diary-entries")
	diaryEntries.Use(auth.Middleware(secret))
	diaryEntries.POST("", diaryHandler.CreateEntry)
	diaryEntries.GET("", diaryHandler.GetEntries)
	diaryEntries.PUT("/:id", diaryHandler.UpdateEntry)
	diaryEntries.DELETE("/:id", diaryHandler.DeleteEntry)

	address := os.Getenv("SERVER_ADDRESS")
	log.Printf("Diary API listening at http://%s", address)
	if err := r.Run(address); err != nil {
		log.Fatal("Cannot start server: ", err)
	}
}

func splitOrigins(value string) []string {
	var origins []string
	for _, origin := range strings.Split(value, ",") {
		if origin = strings.TrimSpace(origin); origin != "" {
			origins = append(origins, origin)
		}
	}
	return origins
}

// load .env file
func loadDotEnv(path string) error {
	file, err := os.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, value, found := strings.Cut(line, "=")
		if !found {
			continue
		}
		key = strings.TrimSpace(key)
		value = strings.TrimSpace(value)
		value = strings.Trim(value, "\"'")
		if key == "" {
			continue
		}
		if _, exists := os.LookupEnv(key); !exists {
			if err := os.Setenv(key, value); err != nil {
				return err
			}
		}
	}
	if err := scanner.Err(); err != nil {
		return err
	}
	return nil
}
