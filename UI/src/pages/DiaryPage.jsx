import { useState } from "react";
import Composer from "../components/diary/Composer";
import Header from "../components/diary/Header";
import PostCard from "../components/diary/PostCard";
import RightRail from "../components/diary/RightRail";
import Sidebar from "../components/diary/Sidebar";
import Icon from "../components/Icon";
import { initialPosts, photos } from "../data/diary";

const sectionLabels = {
  home: "Trang chủ",
  friends: "Bạn bè",
  chat: "Tin nhắn",
  memories: "Kỷ niệm",
  bookmark: "Đã lưu",
};

function EmptySection({ section, onReturn }) {
  return (
    <section className="placeholder-page card">
      <span className="placeholder-icon"><Icon name={section} size={27} /></span>
      <h1>{sectionLabels[section] || "Nhật ký"}</h1>
      <p>Không gian này đang được chuẩn bị. Nhật ký của bạn bè vẫn luôn riêng tư và chỉ dành cho bạn bè.</p>
      <button onClick={onReturn}>Quay lại Nhật ký</button>
    </section>
  );
}

function FeedHeading() {
  return (
    <div className="page-heading">
      <div>
        <div className="eyebrow"><span className="eyebrow-dot" /> KHÔNG GIAN RIÊNG TƯ</div>
        <h1>Nhật ký <span>của bạn bè</span></h1>
        <p>Những khoảnh khắc nhỏ, sẻ chia cùng nhau.</p>
      </div>
      <button
        className="heading-button"
        onClick={() => document.querySelector(".composer-input")?.click()}
      >
        <Icon name="plus" size={18} /> Đăng nhật ký
      </button>
    </div>
  );
}

function PrivacyNotice() {
  return (
    <div className="feed-notice">
      <span className="feed-notice__icon"><Icon name="lock" size={15} /></span>
      <span>
        Đây là không gian dành riêng cho <strong>bạn bè của bạn.</strong> Bài viết và bình luận chỉ hiển thị với bạn bè.
      </span>
      <button
        aria-label="Tìm hiểu thêm"
        title="Bài viết trong Nhật ký chỉ hiển thị với bạn bè của bạn."
      >
        <Icon name="shield" size={16} />
      </button>
    </div>
  );
}

function FeedToolbar({ count, sort, onSortChange }) {
  return (
    <div className="feed-toolbar">
      <div className="feed-toolbar__title">
        <h2>Bài viết mới</h2>
        <span className="feed-count">{count}</span>
      </div>
      <label className="sort-control">
        <span>Sắp xếp:</span>
        <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
          <option>Mới nhất</option>
          <option>Phổ biến</option>
        </select>
        <Icon name="chevron" size={14} />
      </label>
    </div>
  );
}

function MobileNavigation({ active, onSelect }) {
  const items = [
    ["home", "Trang chủ"],
    ["diary", "Nhật ký"],
    ["friends", "Bạn bè"],
    ["chat", "Tin nhắn"],
    ["memories", "Kỷ niệm"],
  ];

  return (
    <nav className="mobile-nav" aria-label="Điều hướng di động">
      {items.map(([key, label]) => (
        <button
          key={key}
          className={active === key ? "mobile-nav__active" : ""}
          onClick={() => onSelect(key)}
        >
          <Icon name={key} size={20} />
          <span>{label}</span>
          {key === "chat" && <i className="mobile-nav__badge">3</i>}
        </button>
      ))}
    </nav>
  );
}

export default function DiaryPage() {
  const [active, setActive] = useState("diary");
  const [posts, setPosts] = useState(initialPosts);
  const [sort, setSort] = useState("Mới nhất");
  const [toast, setToast] = useState("");
  const [emptyTab, setEmptyTab] = useState("");

  const setSection = (section) => {
    setActive(section);
    setEmptyTab(section === "diary" ? "" : section);
  };

  const likePost = (id) => {
    setPosts((items) => items.map((item) => (
      item.id === id ? { ...item, liked: !item.liked } : item
    )));
  };

  const commentPost = (id, text) => {
    setPosts((items) => items.map((item) => item.id === id
      ? {
          ...item,
          comments: item.comments + 1,
          commentPreview: [...item.commentPreview, { name: "Minh Anh", avatar: photos.me, text }],
        }
      : item,
    ));
  };

  const savePost = () => {
    setToast("Đã lưu vào mục Nhật ký đã lưu");
    window.setTimeout(() => setToast(""), 2200);
  };

  const createPost = (text) => {
    setPosts((items) => [
      {
        id: Date.now(),
        name: "Minh Anh",
        avatar: photos.me,
        time: "Vừa xong",
        text,
        image: "",
        likes: 0,
        comments: 0,
        liked: false,
        tag: "Bạn bè",
        reactions: [],
        commentPreview: [],
      },
      ...items,
    ]);
  };

  const sortedPosts = sort === "Phổ biến"
    ? [...posts].sort((a, b) => (b.likes + Number(b.liked)) - (a.likes + Number(a.liked)))
    : posts;

  return (
    <div className="app-shell">
      <Header active={active} setActive={setSection} />
      <div className="page-grid">
        <Sidebar active={active} setActive={setSection} />
        <main className="feed-column">
          {emptyTab ? (
            <EmptySection section={emptyTab} onReturn={() => setSection("diary")} />
          ) : (
            <>
              <FeedHeading />
              <PrivacyNotice />
              <Composer onPost={createPost} />
              <FeedToolbar count={posts.length} sort={sort} onSortChange={setSort} />
              {sortedPosts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={likePost}
                  onComment={commentPost}
                  onSave={savePost}
                />
              ))}
              <div className="feed-end">
                <span /> Bạn đã xem hết nhật ký mới <Icon name="heart" size={15} filled /> <span />
              </div>
            </>
          )}
        </main>
        <RightRail />
      </div>
      <MobileNavigation active={active} onSelect={setSection} />
      {toast && <div className="toast"><span>✓</span> {toast}</div>}
    </div>
  );
}
