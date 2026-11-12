package db

import (
	"context"
	"embed"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

//go:embed database_schema.sql
var schema embed.FS

var Pool *pgxpool.Pool

func ConnectDatabase(dbURL string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var err error
	Pool, err = pgxpool.New(ctx, dbURL)
	if err != nil {
		return fmt.Errorf("create database connection pool: %w", err)
	}

	if err := Pool.Ping(ctx); err != nil {
		Pool.Close()
		Pool = nil
		return fmt.Errorf("connect to database: %w", err)
	}

	if err := ensureSchema(ctx); err != nil {
		Pool.Close()
		Pool = nil
		return err
	}
	return nil
}

func ensureSchema(ctx context.Context) error {
	contents, err := schema.ReadFile("database_schema.sql")
	if err != nil {
		return fmt.Errorf("read database schema: %w", err)
	}
	for _, statement := range strings.Split(string(contents), ";") {
		statement = strings.TrimSpace(statement)
		if statement == "" {
			continue
		}
		if _, err := Pool.Exec(ctx, statement); err != nil {
			return fmt.Errorf("initialize database schema: %w", err)
		}
	}
	return nil
}

func CloseDB() {
	if Pool != nil {
		Pool.Close()
		Pool = nil
	}
}
