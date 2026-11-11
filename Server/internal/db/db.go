package db

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var Pool *pgxpool.Pool

func ConnectDatabase(dbURL string) {
	// Example Url
	// dbURL := "postgres://postgres:khoa2005@localhost:5432/app?sslmode=disable"

	ctx := context.Background()

	var err error
	Pool, err = pgxpool.New(ctx, dbURL)
	if err != nil {
		log.Fatal("Cannot create connection pool: ", err)
	}

	// test connect
	if err := Pool.Ping(ctx); err != nil {
		log.Fatal("Cannot connect to database: ", err)
	}

	log.Println("Database connection successful")
}

func CloseDB() {
	if Pool != nil {
		Pool.Close()
		log.Println("Disconnected from the database!")
	}
}
