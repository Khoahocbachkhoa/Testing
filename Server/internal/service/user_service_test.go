package service

import (
	"context"
	"testing"

	"server/internal/apperror"
	"server/internal/model"
)

type memoryUserRepository struct {
	user *model.User
}

func (r *memoryUserRepository) Create(_ context.Context, user *model.User) error {
	if r.user != nil && r.user.Username == user.Username {
		return apperror.ErrUsernameAlreadyExists
	}
	copy := *user
	copy.ID = 1
	r.user = &copy
	user.ID = copy.ID
	return nil
}

func (r *memoryUserRepository) FindByUsername(_ context.Context, username string) (*model.User, error) {
	if r.user == nil || r.user.Username != username {
		return nil, apperror.ErrUsernameNotFound
	}
	copy := *r.user
	return &copy, nil
}

func TestRegisterStoresPasswordHashAndLoginVerifiesIt(t *testing.T) {
	repo := &memoryUserRepository{}
	svc := NewUserService(repo)
	password := "correct horse battery staple"
	user := &model.User{Username: "  alice  "}

	if err := svc.Register(context.Background(), user, password); err != nil {
		t.Fatalf("Register() error = %v", err)
	}
	if user.Username != "alice" {
		t.Fatalf("Register() username = %q, want trimmed username", user.Username)
	}
	if user.PasswordHash == "" || user.PasswordHash == password {
		t.Fatal("Register() did not store a password hash")
	}
	if user.Fullname != user.Username {
		t.Fatalf("Register() fullname = %q, want %q", user.Fullname, user.Username)
	}

	loggedIn, err := svc.Login(context.Background(), " alice ", password)
	if err != nil {
		t.Fatalf("Login() with registered password error = %v", err)
	}
	if loggedIn.ID != user.ID || loggedIn.Username != user.Username {
		t.Fatalf("Login() user = %#v, want registered user", loggedIn)
	}

	if _, err := svc.Login(context.Background(), "alice", "wrong password"); err != apperror.ErrInvalidCredentials {
		t.Fatalf("Login() with wrong password error = %v, want invalid credentials", err)
	}
}

func TestRegisterRejectsInvalidCredentials(t *testing.T) {
	tests := []struct {
		name     string
		username string
		password string
	}{
		{name: "empty username", username: " ", password: "password"},
		{name: "empty password", username: "alice", password: ""},
		{name: "password exceeds bcrypt limit", username: "alice", password: string(make([]byte, 73))},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			svc := NewUserService(&memoryUserRepository{})
			err := svc.Register(context.Background(), &model.User{Username: tt.username}, tt.password)
			if err != apperror.ErrInvalidUserData {
				t.Fatalf("Register() error = %v, want invalid user data", err)
			}
		})
	}
}
