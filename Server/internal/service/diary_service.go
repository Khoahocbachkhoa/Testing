package service

import (
	"context"
	"fmt"
	"server/internal/model"
	"server/internal/repository"
)

type DiaryService interface {
	CreateEntry(ctx context.Context, entry *model.DiaryEntry) error
	GetEntriesByUserID(ctx context.Context, userID int, page, limit int) ([]*model.DiaryEntry, error)
	UpdateEntry(ctx context.Context, entry *model.DiaryEntry) error
	DeleteEntry(ctx context.Context, id, userID int) error
}

type diaryService struct {
	repo repository.DiaryRepository
}

func NewDiaryService(repo repository.DiaryRepository) DiaryService {
	return &diaryService{repo: repo}
}

func (s *diaryService) CreateEntry(ctx context.Context, entry *model.DiaryEntry) error {
	if entry.UserID <= 0 {
		return fmt.Errorf("invalid user id")
	}
	if entry.Content == "" {
		return fmt.Errorf("diary content cannot be empty")
	}

	if err := s.repo.Create(ctx, entry); err != nil {
		return fmt.Errorf("service failed to create entry: %w", err)
	}

	return nil
}

func (s *diaryService) GetEntriesByUserID(ctx context.Context, userID int, page, limit int) ([]*model.DiaryEntry, error) {
	if page < 1 {
		page = 1
	}
	if limit < 1 {
		limit = 10
	}

	offset := (page - 1) * limit

	entries, err := s.repo.GetByUserID(ctx, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("service failed to get entries: %w", err)
	}

	return entries, nil
}

func (s *diaryService) UpdateEntry(ctx context.Context, entry *model.DiaryEntry) error {
	if entry.ID <= 0 {
		return fmt.Errorf("invalid diary entry id")
	}
	if entry.UserID <= 0 {
		return fmt.Errorf("invalid user id")
	}

	if err := s.repo.Update(ctx, entry); err != nil {
		return fmt.Errorf("service failed to update entry: %w", err)
	}

	return nil
}

func (s *diaryService) DeleteEntry(ctx context.Context, id, userID int) error {
	if id <= 0 || userID <= 0 {
		return fmt.Errorf("invalid id or user id")
	}

	if err := s.repo.Delete(ctx, id, userID); err != nil {
		return fmt.Errorf("service failed to delete entry: %w", err)
	}

	return nil
}
