package apperror

import (
	"net/http"
)

type AppError struct {
	Code    int
	Message string
}

func (e *AppError) Error() string {
	return e.Message
}

var (
	ErrNotFound              = &AppError{Code: http.StatusNotFound, Message: "data not fountd"}
	ErrUsernameNotFound      = &AppError{Code: http.StatusNotFound, Message: "username not found"}
	ErrUsernameAlreadyExists = &AppError{Code: http.StatusConflict, Message: "username already exists"}
	ErrInvalidUserData       = &AppError{Code: http.StatusBadRequest, Message: "invalid user data"}
	ErrInvalidCredentials    = &AppError{Code: http.StatusUnauthorized, Message: "invalid username or password"}
)
