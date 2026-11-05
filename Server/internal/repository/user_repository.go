package repository

import (
	"context"
	"errors"

	"server/internal/apperror"
	"server/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	FindByUsername(ctx context.Context, username string) (*model.User, error)
}

type userRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) UserRepository {
	return &userRepository{pool: pool}
}

// Create a new user when register
func (r *userRepository) Create(ctx context.Context, user *model.User) error {
	query := `
		insert into users(username, password_raw, fullname)
		values ($1, $2, $3)
		returning id
	`

	err := r.pool.QueryRow(ctx, query, user.Username, user.Password, user.Fullname).Scan(&user.ID)
	if err != nil {
		var pgErr *pgconn.PgError
		// 23505 : đã có username rồi
		if errors.As(err, &pgErr) && pgErr.Code == "23505" {
			return apperror.ErrUsernameAlreadyExists
		}
		return err
	}

	return nil
}

func (r *userRepository) FindByUsername(ctx context.Context, username string) (*model.User, error) {
	query := `
		select id, username, password_raw, fullname
		from users
		where username = $1
	`

	user := &model.User{}
	err := r.pool.QueryRow(ctx, query, username).Scan(
		&user.ID,
		&user.Username,
		&user.Password,
		&user.Fullname,
	)

	if errors.Is(err, pgx.ErrNoRows) {
		return nil, apperror.ErrUsernameNotFound
	}
	if err != nil {
		return nil, err
	}

	return user, nil
}
