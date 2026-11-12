package repository

import (
	"context"
	"fmt"
	"server/internal/model"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DiaryRepository interface {
	// Tạo mới một bài nhật ký
	Create(ctx context.Context, entry *model.DiaryEntry) error

	// Lấy danh sách nhật ký của một user cụ thể
	// Kèm phân trang
	GetByUserID(ctx context.Context, userID int, limit, offset int) ([]*model.DiaryEntry, error)

	// Cập nhật nội dung nhật ký
	Update(ctx context.Context, entry *model.DiaryEntry) error

	// Xóa bài nhật ký theo ID
	Delete(ctx context.Context, id, userID int) error
}

type diaryRepository struct {
	pool *pgxpool.Pool
}

func NewDiaryRepository(pool *pgxpool.Pool) DiaryRepository {
	return &diaryRepository{pool: pool}
}

func (r *diaryRepository) Create(ctx context.Context, entry *model.DiaryEntry) error {
	query := `
		INSERT INTO diary_entries (user_id, title, content, entry_date)
		VALUES ($1, $2, $3, COALESCE($4, CURRENT_DATE))
		RETURNING id, entry_date, created_at, updated_at
	`

	var entryDate any
	if !entry.EntryDate.IsZero() {
		entryDate = entry.EntryDate
	}
	err := r.pool.QueryRow(ctx, query,
		entry.UserID,
		entry.Title,
		entry.Content,
		entryDate,
	).Scan(&entry.ID, &entry.EntryDate, &entry.CreatedAt, &entry.UpdatedAt)

	if err != nil {
		return fmt.Errorf("failed to create diary entry: %w", err)
	}

	return nil
}

func (r *diaryRepository) GetByUserID(ctx context.Context, userID int, limit, offset int) ([]*model.DiaryEntry, error) {
	query := `
		SELECT id, user_id, title, content, entry_date, created_at, updated_at
		FROM diary_entries
		WHERE user_id = $1
		ORDER BY entry_date DESC, created_at DESC
		LIMIT $2 OFFSET $3
	`

	rows, err := r.pool.Query(ctx, query, userID, limit, offset)
	if err != nil {
		return nil, fmt.Errorf("failed to query diary entries: %w", err)
	}
	defer rows.Close()

	var entries []*model.DiaryEntry
	for rows.Next() {
		entry := &model.DiaryEntry{}
		err := rows.Scan(
			&entry.ID,
			&entry.UserID,
			&entry.Title,
			&entry.Content,
			&entry.EntryDate,
			&entry.CreatedAt,
			&entry.UpdatedAt,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan diary entry: %w", err)
		}
		entries = append(entries, entry)
	}

	if err = rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating diary entries: %w", err)
	}

	return entries, nil
}

func (r *diaryRepository) Update(ctx context.Context, entry *model.DiaryEntry) error {
	query := `
		UPDATE diary_entries
		SET title = $1, 
		    content = $2, 
		    entry_date = $3, 
		    updated_at = NOW()
		WHERE id = $4 AND user_id = $5
		RETURNING created_at, updated_at
	`

	err := r.pool.QueryRow(ctx, query,
		entry.Title,
		entry.Content,
		entry.EntryDate,
		entry.ID,
		entry.UserID,
	).Scan(&entry.CreatedAt, &entry.UpdatedAt)
	if err != nil {
		return fmt.Errorf("failed to update diary entry: %w", err)
	}

	return nil
}

func (r *diaryRepository) Delete(ctx context.Context, id, userID int) error {
	query := `DELETE FROM diary_entries WHERE id = $1 and user_id = $2`

	tag, err := r.pool.Exec(ctx, query, id, userID)
	if err != nil {
		return fmt.Errorf("failed to delete diary entry: %w", err)
	}

	if tag.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}

	return nil
}
