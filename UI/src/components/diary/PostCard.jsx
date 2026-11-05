import { useState } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { photos } from "../../data/diary";
import PrivacyPill from "./PrivacyPill";

export default function PostCard({ post, onLike, onComment, onSave }) {
  const [comment, setComment] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const submitComment = () => {
    if (!comment.trim()) return;

    onComment(post.id, comment.trim());
    setComment("");
    setShowAll(true);
  };

  return (
    <article className="post-card card">
      <div className="post-head">
        <Avatar src={post.avatar} name={post.name} />
        <div className="post-head__info">
          <div className="post-head__name">
            {post.name}
            <span className="post-head__dot">·</span>
            <PrivacyPill small />
          </div>
          <div className="post-head__meta">
            <span>{post.time}</span>
            <span className="meta-dot">·</span>
            <Icon name="friends" size={13} />
            <span>Bạn bè</span>
          </div>
        </div>
        <div className="popover-anchor">
          <button
            className="more-button"
            aria-label="Tùy chọn bài viết"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name="more" />
          </button>
          {menuOpen && (
            <div className="popover post-popover">
              <button
                onClick={() => {
                  onSave(post.id);
                  setMenuOpen(false);
                }}
              >
                <Icon name="bookmark" size={16} /> Lưu nhật ký
              </button>
              <button onClick={() => setMenuOpen(false)}>
                <Icon name="lock" size={16} /> Tìm hiểu quyền riêng tư
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="post-text">{post.text}</p>
      {post.image && (
        <div className="post-image-wrap">
          <img
            className="post-image"
            src={post.image}
            alt="Khoảnh khắc trong nhật ký"
            loading="lazy"
          />
          <button className="image-count">Ảnh 1 / 1</button>
        </div>
      )}

      <div className="post-reactions">
        <div className="reaction-summary">
          <div className="reaction-avatars">
            {post.reactions.slice(0, 3).map((src, index) => (
              <Avatar
                key={`${post.id}-reaction-${index}`}
                src={src}
                name="Bạn bè"
                size="tiny"
              />
            ))}
          </div>
          <span>{post.likes + (post.liked ? 1 : 0)} lượt thích</span>
        </div>
        <button className="comment-count" onClick={() => setShowAll(!showAll)}>
          {post.comments} bình luận
        </button>
      </div>

      <div className="post-actions">
        <button
          className={`post-action${post.liked ? " post-action--liked" : ""}`}
          onClick={() => onLike(post.id)}
        >
          <Icon name="heart" size={19} filled={post.liked} />
          <span>{post.liked ? "Đã thích" : "Thích"}</span>
        </button>
        <button
          className="post-action"
          onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}
        >
          <Icon name="comment" size={18} /> <span>Bình luận</span>
        </button>
        <button className="post-action" onClick={() => onSave(post.id)}>
          <Icon name="share" size={18} /> <span>Chia sẻ</span>
        </button>
      </div>

      <div className="comments-area">
        {(showAll ? post.commentPreview : post.commentPreview.slice(0, 2)).map((item, index) => (
          <div className="comment-row" key={`${post.id}-comment-${index}`}>
            <Avatar src={item.avatar} name={item.name} size="tiny" />
            <div className="comment-bubble">
              <strong>{item.name}</strong>
              <span>{item.text}</span>
            </div>
          </div>
        ))}
        {showAll && post.commentPreview.length === 0 && (
          <p className="empty-comments">Hãy là người bình luận đầu tiên.</p>
        )}
        <div className="comment-input-row">
          <Avatar src={photos.me} name="Minh Anh" size="tiny" />
          <div className="comment-input-wrap">
            <input
              id={`comment-${post.id}`}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") submitComment();
              }}
              placeholder="Viết bình luận..."
              aria-label={`Bình luận bài viết của ${post.name}`}
            />
            <button
              className="comment-send"
              aria-label="Gửi bình luận"
              onClick={submitComment}
              disabled={!comment.trim()}
            >
              Gửi
            </button>
            <button
              className="comment-emoji"
              aria-label="Thêm cảm xúc"
              onClick={() => setComment((value) => `${value}😊`)}
            >
              <Icon name="smile" size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
