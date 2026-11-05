package handler

import (
	"errors"
	"log"
	"net/http"
	"server/internal/apperror"
	"server/internal/model"
	"server/internal/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	userService service.UserService
}

func NewUserHandler(userService service.UserService) UserHandler {
	return UserHandler{userService: userService}
}

// register
func (h *UserHandler) Register(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Fullname string `json:"fullname"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	user := &model.User{
		Username: req.Username,
		Password: req.Password,
		Fullname: req.Fullname,
	}
	err := h.userService.Register(c.Request.Context(), user)
	if err != nil {
		// defined error
		if appErr, ok := errors.AsType[*apperror.AppError](err); ok {
			c.JSON(appErr.Code, gin.H{"error": appErr.Message})
			return
		}

		// else it's internal error
		log.Printf("Register: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "register successfully",
		"user":    user,
	})
}

func (h *UserHandler) Login(c *gin.Context) {
	var req struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request body"})
		return
	}

	user, err := h.userService.Login(c.Request.Context(), req.Username, req.Password)
	if err != nil {
		// defined error
		if appErr, ok := errors.AsType[*apperror.AppError](err); ok {
			c.JSON(appErr.Code, gin.H{"error": appErr.Message})
			return
		}

		log.Printf("Login: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "login successfully",
		"user":    user,
	})
}
