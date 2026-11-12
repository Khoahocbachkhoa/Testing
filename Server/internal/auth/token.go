package auth

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

const (
	contextUserID   = "authenticatedUserID"
	contextUsername = "authenticatedUsername"
	contextFullname = "authenticatedFullname"
	tokenIssuer     = "diary-app"
)

var (
	ErrInvalidToken = errors.New("invalid access token")
	ErrExpiredToken = errors.New("access token has expired")
)

type CustomClaims struct {
	UserID   int    `json:"user_id"`
	Username string `json:"username"`
	Fullname string `json:"fullname"`
	jwt.RegisteredClaims
}

// GenerateToken tạo JWT mới
func GenerateToken(userID int, username, fullname string, secret []byte, lifetime time.Duration) (string, error) {
	if userID <= 0 || username == "" || len(secret) < 32 || lifetime <= 0 {
		return "", fmt.Errorf("invalid token configuration")
	}

	claims := CustomClaims{
		UserID:   userID,
		Username: username,
		Fullname: fullname,
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    tokenIssuer,
			IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
			ExpiresAt: jwt.NewNumericDate(time.Now().UTC().Add(lifetime)),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(secret)
}

// Middleware bảo vệ các API route
func Middleware(secret []byte) gin.HandlerFunc {
	return func(c *gin.Context) {
		tokenStr, err := extractBearerToken(c.GetHeader("Authorization"))
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "authorization token is required", "message": "authorization token is required"})
			return
		}

		claims, err := parseToken(tokenStr, secret)
		if err != nil {
			message := "invalid access token"
			if errors.Is(err, ErrExpiredToken) {
				message = "access token has expired"
			}
			c.AbortWithStatusJSON(401, gin.H{"error": message, "message": message})
			return
		}

		c.Set(contextUserID, claims.UserID)
		c.Set(contextUsername, claims.Username)
		c.Set(contextFullname, claims.Fullname)
		c.Next()
	}
}

func UserID(c *gin.Context) int {
	value, _ := c.Get(contextUserID)
	userID, _ := value.(int)
	return userID
}

func Username(c *gin.Context) string {
	value, _ := c.Get(contextUsername)
	username, _ := value.(string)
	return username
}

func Fullname(c *gin.Context) string {
	value, _ := c.Get(contextFullname)
	fullname, _ := value.(string)
	return fullname
}

func extractBearerToken(authHeader string) (string, error) {
	if authHeader == "" {
		return "", errors.New("empty auth header")
	}
	parts := strings.Fields(authHeader)
	if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
		return "", errors.New("invalid auth format")
	}
	return parts[1], nil
}

func parseToken(tokenStr string, secret []byte) (*CustomClaims, error) {
	token, err := jwt.ParseWithClaims(tokenStr, &CustomClaims{}, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})

	if err != nil {
		if errors.Is(err, jwt.ErrTokenExpired) {
			return nil, ErrExpiredToken
		}
		return nil, ErrInvalidToken
	}

	claims, ok := token.Claims.(*CustomClaims)
	if !ok || !token.Valid {
		return nil, ErrInvalidToken
	}

	if claims.Issuer != tokenIssuer {
		return nil, ErrInvalidToken
	}

	return claims, nil
}
