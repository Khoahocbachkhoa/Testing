package handler

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
	"unicode/utf8"

	"server/internal/apperror"
	"server/internal/model"
	"server/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

const (
	defaultDiaryPage  = 1
	defaultDiaryLimit = 10
	maxDiaryLimit     = 100
	diaryDateLayout   = "2006-01-02"
)

type DiaryHandler struct {
	diaryService service.DiaryService
}

func NewDiaryHandler(diaryService service.DiaryService) DiaryHandler {
	return DiaryHandler{diaryService: diaryService}
}

type diaryEntryRequest struct {
	UserID    int    `json:"user_id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	EntryDate string `json:"entry_date"`
}

type diaryEntryResponse struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	EntryDate string    `json:"entry_date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (h *DiaryHandler) CreateEntry(c *gin.Context) {
	var req diaryEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeError(c, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.UserID <= 0 {
		writeError(c, http.StatusBadRequest, "user_id must be a positive integer")
		return
	}
	if strings.TrimSpace(req.Content) == "" {
		writeError(c, http.StatusBadRequest, "content cannot be empty")
		return
	}
	if utf8.RuneCountInString(req.Title) > 200 {
		writeError(c, http.StatusBadRequest, "title must be 200 characters or fewer")
		return
	}

	entryDate, err := parseDiaryDate(req.EntryDate)
	if err != nil {
		writeError(c, http.StatusBadRequest, "entry_date must use YYYY-MM-DD format")
		return
	}

	entry := &model.DiaryEntry{
		UserID:    req.UserID,
		Title:     req.Title,
		Content:   req.Content,
		EntryDate: entryDate,
	}
	if err := h.diaryService.CreateEntry(c.Request.Context(), entry); err != nil {
		writeDiaryError(c, "CreateEntry", err)
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "diary entry created successfully",
		"entry":   toDiaryEntryResponse(entry),
	})
}

func (h *DiaryHandler) GetEntries(c *gin.Context) {
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil || userID <= 0 {
		writeError(c, http.StatusBadRequest, "user_id must be a positive integer")
		return
	}

	page, err := queryInt(c, "page", defaultDiaryPage)
	if err != nil || page < 1 {
		writeError(c, http.StatusBadRequest, "page must be a positive integer")
		return
	}
	limit, err := queryInt(c, "limit", defaultDiaryLimit)
	if err != nil || limit < 1 || limit > maxDiaryLimit {
		writeError(c, http.StatusBadRequest, "limit must be between 1 and 100")
		return
	}
	if page > int(^uint(0)>>1)/limit {
		writeError(c, http.StatusBadRequest, "page is too large")
		return
	}

	entries, err := h.diaryService.GetEntriesByUserID(c.Request.Context(), userID, page, limit)
	if err != nil {
		writeDiaryError(c, "GetEntries", err)
		return
	}

	responseEntries := make([]diaryEntryResponse, 0, len(entries))
	for _, entry := range entries {
		responseEntries = append(responseEntries, toDiaryEntryResponse(entry))
	}

	c.JSON(http.StatusOK, gin.H{
		"entries": responseEntries,
		"page":    page,
		"limit":   limit,
	})
}

func (h *DiaryHandler) UpdateEntry(c *gin.Context) {
	entryID, err := strconv.Atoi(c.Param("id"))
	if err != nil || entryID <= 0 {
		writeError(c, http.StatusBadRequest, "id must be a positive integer")
		return
	}

	var req diaryEntryRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		writeError(c, http.StatusBadRequest, "invalid request body")
		return
	}
	if req.UserID <= 0 {
		writeError(c, http.StatusBadRequest, "user_id must be a positive integer")
		return
	}
	if strings.TrimSpace(req.Content) == "" {
		writeError(c, http.StatusBadRequest, "content cannot be empty")
		return
	}
	if utf8.RuneCountInString(req.Title) > 200 {
		writeError(c, http.StatusBadRequest, "title must be 200 characters or fewer")
		return
	}
	if req.EntryDate == "" {
		writeError(c, http.StatusBadRequest, "entry_date is required")
		return
	}
	entryDate, err := parseDiaryDate(req.EntryDate)
	if err != nil {
		writeError(c, http.StatusBadRequest, "entry_date must use YYYY-MM-DD format")
		return
	}

	entry := &model.DiaryEntry{
		ID:        entryID,
		UserID:    req.UserID,
		Title:     req.Title,
		Content:   req.Content,
		EntryDate: entryDate,
	}
	if err := h.diaryService.UpdateEntry(c.Request.Context(), entry); err != nil {
		writeDiaryError(c, "UpdateEntry", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "diary entry updated successfully",
		"entry":   toDiaryEntryResponse(entry),
	})
}

func (h *DiaryHandler) DeleteEntry(c *gin.Context) {
	entryID, err := strconv.Atoi(c.Param("id"))
	if err != nil || entryID <= 0 {
		writeError(c, http.StatusBadRequest, "id must be a positive integer")
		return
	}
	userID, err := strconv.Atoi(c.Query("user_id"))
	if err != nil || userID <= 0 {
		writeError(c, http.StatusBadRequest, "user_id must be a positive integer")
		return
	}

	if err := h.diaryService.DeleteEntry(c.Request.Context(), entryID, userID); err != nil {
		writeDiaryError(c, "DeleteEntry", err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "diary entry deleted successfully"})
}

func queryInt(c *gin.Context, key string, defaultValue int) (int, error) {
	value := c.Query(key)
	if value == "" {
		return defaultValue, nil
	}
	return strconv.Atoi(value)
}

func parseDiaryDate(value string) (time.Time, error) {
	if value == "" {
		return time.Time{}, nil
	}
	return time.Parse(diaryDateLayout, value)
}

func toDiaryEntryResponse(entry *model.DiaryEntry) diaryEntryResponse {
	return diaryEntryResponse{
		ID:        entry.ID,
		UserID:    entry.UserID,
		Title:     entry.Title,
		Content:   entry.Content,
		EntryDate: entry.EntryDate.Format(diaryDateLayout),
		CreatedAt: entry.CreatedAt,
		UpdatedAt: entry.UpdatedAt,
	}
}

func writeDiaryError(c *gin.Context, operation string, err error) {
	if appErr, ok := errors.AsType[*apperror.AppError](err); ok {
		writeError(c, appErr.Code, appErr.Message)
		return
	}
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(c, http.StatusNotFound, "diary entry not found")
		return
	}

	log.Printf("%s: %v", operation, err)
	writeError(c, http.StatusInternalServerError, "internal server error")
}
