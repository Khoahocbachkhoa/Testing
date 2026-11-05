import Avatar from "../Avatar";
import Icon from "../Icon";
import { photos } from "../../data/diary";

const navItems = [
  ["home", "Trang chủ"],
  ["diary", "Nhật ký"],
  ["friends", "Bạn bè"],
  ["chat", "Tin nhắn", "3"],
  ["memories", "Kỷ niệm"],
  ["bookmark", "Đã lưu"],
];

const friends = [
  [photos.linh, "Ngọc Linh", true],
  [photos.minh, "Minh Quân", true],
  [photos.han, "Hà Nguyễn", false],
  [photos.duy, "Duy Phạm", true],
];

export default function Sidebar({ active, setActive }) {
  return (
    <aside className="left-sidebar">
      <button className="sidebar-profile" onClick={() => setActive("diary")}>
        <Avatar src={photos.me} name="Minh Anh" size="large" />
        <span className="sidebar-profile__text">
          <strong>Minh Anh</strong>
          <span>Xem trang cá nhân</span>
        </span>
        <span className="profile-chevron">›</span>
      </button>

      <div className="sidebar-label">KHÔNG GIAN CỦA BẠN</div>
      <nav className="side-nav" aria-label="Điều hướng">
        {navItems.map(([key, label, badge]) => (
          <button
            key={key}
            className={`side-nav__item${active === key ? " side-nav__item--active" : ""}`}
            onClick={() => setActive(key)}
          >
            <span className="side-nav__icon"><Icon name={key} size={19} /></span>
            <span>{label}</span>
            {badge && <span className="nav-badge">{badge}</span>}
          </button>
        ))}
      </nav>

      <div className="sidebar-divider" />
      <div className="sidebar-label">
        BẠN BÈ THÂN THIẾT
        <button aria-label="Chỉnh sửa"><Icon name="more" size={16} /></button>
      </div>
      <div className="friend-list">
        {friends.map(([src, name, online]) => (
          <button className="friend-row" key={name}>
            <Avatar src={src} name={name} size="small" online={online} />
            <span>{name}</span>
            {online && <i className="online-dot" />}
          </button>
        ))}
      </div>
      <button className="sidebar-see-all" onClick={() => setActive("friends")}>
        Xem tất cả bạn bè <span>→</span>
      </button>
      <div className="left-sidebar__footer">
        <Icon name="shield" size={15} /> Nhật ký chỉ bạn bè có thể xem
      </div>
    </aside>
  );
}
