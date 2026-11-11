package service

import (
	"context"
	"errors"
	"strings"
	"unicode/utf8"

	"server/internal/apperror"
	"server/internal/model"
	"server/internal/repository"

	"golang.org/x/crypto/bcrypt"
)

type UserService interface {
	Register(ctx context.Context, user *model.User, password string) error
	Login(ctx context.Context, username, password string) (*model.User, error)
}

type userService struct {
	r repository.UserRepository
}

func NewUserService(r repository.UserRepository) UserService {
	return &userService{r: r}
}

func (s *userService) Register(ctx context.Context, user *model.User, password string) error {
	user.Username = strings.TrimSpace(user.Username)
	user.Fullname = strings.TrimSpace(user.Fullname)

	if user.Username == "" || utf8.RuneCountInString(user.Username) > 100 ||
		utf8.RuneCountInString(user.Fullname) > 100 || password == "" || len(password) > 72 {
		return apperror.ErrInvalidUserData
	}

	if user.Fullname == "" {
		user.Fullname = user.Username
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.PasswordHash = string(hash)

	return s.r.Create(ctx, user)
}

func (s *userService) Login(ctx context.Context, username, password string) (*model.User, error) {
	username = strings.TrimSpace(username)
	if username == "" || password == "" || len(password) > 72 {
		return nil, apperror.ErrInvalidCredentials
	}

	user, err := s.r.FindByUsername(ctx, username)
	if err != nil {
		if errors.Is(err, apperror.ErrUsernameNotFound) {
			return nil, apperror.ErrInvalidCredentials
		}
		return nil, err
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)) != nil {
		return nil, apperror.ErrInvalidCredentials
	}

	return user, nil
}
