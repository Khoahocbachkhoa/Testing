import { useState } from "react";
import Avatar from "../Avatar";
import Icon from "../Icon";
import { photos } from "../../data/diary";

const navItems = [
  ["home", "Trang chủ"],
  ["diary", "Nhật ký"],
  ["friends", "Bạn bè"],
  ["chat", "Tin nhắn"],
  ["memories", "Kỷ niệm"],
  ["bookmark", "Đã lưu"],
];

export default function Header({ active, setActive }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`topbar${searchOpen ? " topbar--search-open" : ""}`}>
      <div className="topbar__left">
        <button className="brand" aria-label="Zalo, về trang chủ" onClick={() => setActive("diary")}>
          <span className="brand__mark">Z</span>
          <span className="brand__word">Zalo</span>
        </button>
        <span className="topbar__divider" />
        <nav className="top-nav" aria-label="Điều hướng chính">
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={`top-nav__item${active === key ? " top-nav__item--active" : ""}`}
              onClick={() => setActive(key)}
              aria-label={label}
              title={label}
            >
              <Icon name={key} size={20} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className={`topbar__search${searchOpen ? " topbar__search--open" : ""}`}>
        <Icon name="search" size={18} />
        <input
          aria-label="Tìm kiếm"
          placeholder="Tìm kiếm bạn bè, bài viết..."
          onFocus={() => setSearchOpen(true)}
          onBlur={() => setSearchOpen(false)}
        />
        <kbd>⌘ K</kbd>
      </div>

      <div className="topbar__actions">
        <button
          className="icon-button topbar__mobile-search"
          aria-label="Tìm kiếm"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Icon name="search" />
        </button>
        <div className="popover-anchor">
          <button
            className={`icon-button${noticeOpen ? " icon-button--selected" : ""}`}
            aria-label="Thông báo"
            onClick={() => setNoticeOpen(!noticeOpen)}
          >
            <Icon name="bell" />
            <i className="notification-dot" />
          </button>
          {noticeOpen && (
            <div className="popover notice-popover">
              <strong>Thông báo</strong>
              <p>
                <Avatar src={photos.linh} name="Linh" size="tiny" />
                Linh và 5 người bạn thích nhật ký của bạn.
              </p>
              <p className="muted">Hôm nay · Chỉ bạn bè nhìn thấy</p>
            </div>
          )}
        </div>
        <div className="popover-anchor profile-anchor">
          <button
            className="profile-menu"
            aria-label="Tùy chọn tài khoản"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Avatar src={photos.me} name="Minh Anh" size="small" />
            <Icon name="chevron" size={15} />
          </button>
          {menuOpen && (
            <div className="popover account-popover">
              <strong>Minh Anh</strong>
              <span className="muted">minhanh.zalo.me</span>
              <hr />
              <button><Icon name="settings" size={16} /> Cài đặt tài khoản</button>
              <button><Icon name="lock" size={16} /> Quyền riêng tư</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
