package service

import (
	"context"
	"errors"
	"strings"

	"server/internal/apperror"
	"server/internal/model"
	"server/internal/repository"
)

type UserService interface {
	Register(ctx context.Context, user *model.User) error
	Login(ctx context.Context, username, password string) (*model.User, error)
}

type userService struct {
	r repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{r: r}
}

// Note: hàm này chưa xác thực định dạng
// todo: validate username and password
func (s *userService) Register(ctx context.Context, user *model.User) error {
	user.Username = strings.TrimSpace(user.Username)
	user.Fullname = strings.TrimSpace(user.Fullname)

	if user.Fullname == "" {
		user.Fullname = user.Username
	}

	return s.r.Create(ctx, user)
}

func (s *userService) Login(ctx context.Context, username, password string) (*model.User, error) {
	user, err := s.r.FindByUsername(ctx, strings.TrimSpace(username))
	if err != nil {
		if errors.Is(err, apperror.ErrUsernameNotFound) {
			return nil, apperror.ErrInvalidCredentials
		}
		return nil, err
	}

	if user.Password != password {
		return nil, apperror.ErrInvalidCredentials
	}

	return user, nil
}
