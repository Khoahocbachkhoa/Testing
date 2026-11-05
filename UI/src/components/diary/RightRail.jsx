import { useState } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { photos } from "../../data/diary";

const suggestions = [
  [photos.duy, "Duy Phạm", "5 bạn chung"],
  [photos.han, "Hà Nguyễn", "3 bạn chung"],
  [photos.linh, "Ngọc Linh", "2 bạn chung"],
];

export default function RightRail() {
  const [following, setFollowing] = useState([]);
  const [dismissed, setDismissed] = useState([]);

  const sendRequest = (index) => {
    setFollowing((current) => [...current, index]);
  };

  return (
    <aside className="right-rail">
      <section className="privacy-card card">
        <div className="privacy-card__icon"><Icon name="lock" size={19} /></div>
        <div>
          <strong>Nhật ký của bạn, không gian của bạn</strong>
          <p>Chỉ bạn bè mới xem được bài viết và bình luận của nhau.</p>
          <button>Xem cách hoạt động <span>→</span></button>
        </div>
      </section>

      <section className="rail-section">
        <div className="rail-section__head">
          <h2>Bạn bè mới</h2>
          <button onClick={() => setDismissed(suggestions.map((_, index) => index))}>Ẩn</button>
        </div>
        {suggestions.map(([src, name, mutual], index) => dismissed.includes(index) ? null : (
          <div className="suggestion-row" key={name}>
            <Avatar src={src} name={name} />
            <div className="suggestion-row__info">
              <strong>{name}</strong>
              <span>{mutual}</span>
              {following.includes(index) && <small>Lời mời đã gửi</small>}
            </div>
            <button
              className={`add-friend${following.includes(index) ? " add-friend--sent" : ""}`}
              aria-label={`Kết bạn với ${name}`}
              onClick={() => sendRequest(index)}
            >
              {following.includes(index) ? "✓" : <Icon name="plus" size={17} />}
            </button>
          </div>
        ))}
        <button className="rail-more">Tìm thêm bạn bè <span>→</span></button>
      </section>

      <section className="memory-card card">
        <div className="memory-card__top">
          <span className="memory-icon"><Icon name="spark" size={17} /></span>
          <span>KỶ NIỆM HÔM NAY</span>
          <button aria-label="Tùy chọn kỷ niệm"><Icon name="more" size={16} /></button>
        </div>
        <div className="memory-card__body">
          <div className="memory-photo">
            <img src={photos.flowers} alt="Một kỷ niệm từ những năm trước" />
            <span>1 năm trước</span>
          </div>
          <p>Thời gian trôi thật nhanh ✨</p>
          <span className="memory-meta">Bài viết của bạn · 5 tháng 11, 2025</span>
          <button className="memory-open">Xem kỷ niệm <span>→</span></button>
        </div>
      </section>

      <div className="rail-footer">
        <a href="#about">Giới thiệu</a><span>·</span>
        <a href="#privacy">Quyền riêng tư</a><span>·</span>
        <a href="#terms">Điều khoản</a>
        <br />
        <span>© 2026 Zalo · Kết nối bạn bè, sẻ chia khoảnh khắc.</span>
      </div>
    </aside>
  );
}
