import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { photos } from "../data/diary";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Submit:", { username, password });
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb--one" />
      <div className="auth-orb auth-orb--two" />
      <div className="auth-layout">
        <aside className="auth-story">
          <a className="auth-brand" href="/">
            <span className="auth-brand__mark">Z</span>
            <span className="auth-brand__name">Zalo</span>
            <span className="auth-brand__divider" />
            <span className="auth-brand__section">NHẬT KÝ</span>
          </a>
          <div className="auth-story__content">
            <span className="auth-kicker"><i /> GẦN NHAU QUA TỪNG KHOẢNH KHẮC</span>
            <h1>Những điều<br />nhỏ bé, <em>đáng nhớ.</em></h1>
            <p>Chia sẻ những câu chuyện thường ngày trong một không gian riêng tư dành cho bạn bè.</p>
            <div className="auth-memory-card">
              <div className="auth-memory-card__top">
                <span className="auth-memory-card__avatar"><img src={photos.linh} alt="" /></span>
                <div><strong>Ngọc Linh</strong><span>vừa chia sẻ một khoảnh khắc</span></div>
                <span className="auth-memory-card__lock"><Icon name="friends" size={14} /></span>
              </div>
              <img className="auth-memory-card__photo" src={photos.coffee} alt="Cảnh buổi sáng bên ly cà phê" />
              <div className="auth-memory-card__caption"><span>☀️ Một buổi sáng thật chậm...</span><span>♡　28</span></div>
            </div>
            <div className="auth-community">
              <div className="auth-community__avatars">
                {[photos.me, photos.minh, photos.han, photos.duy].map((src) => <img key={src} src={src} alt="" />)}
              </div>
              <div><strong>Khoảnh khắc riêng tư</strong><span>Chỉ bạn bè mới có thể nhìn thấy.</span></div>
              <span className="auth-community__check"><Icon name="shield" size={17} /></span>
            </div>
          </div>
          <div className="auth-story__footer"><span>✦</span> Chỉ bạn bè mới xem được nhật ký và bình luận.</div>
        </aside>

        <main className="auth-main">
          <div className="auth-mobile-brand">
            <span className="auth-brand__mark">Z</span><span className="auth-brand__name">Zalo</span>
          </div>
          <section className="auth-card">
            <div className="auth-card__eyebrow"><span className="auth-card__eyebrow-icon"><Icon name="lock" size={14} /></span> KHÔNG GIAN CỦA BẠN</div>
            <h2>Chào mừng trở lại</h2>
            <p className="auth-card__intro">Đăng nhập để tiếp tục kết nối cùng bạn bè.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label htmlFor="login-username">Tên đăng nhập</label>
              <div className="auth-input-wrap">
                <Icon name="friends" size={17} />
                <input
                  id="login-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Nhập tên đăng nhập của bạn"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <div className="auth-label-row">
                <label htmlFor="login-password">Mật khẩu</label>
                <a href="#forgot">Quên mật khẩu?</a>
              </div>
              <div className="auth-input-wrap">
                <Icon name="lock" size={17} />
                <input
                  id="login-password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <button className="auth-submit" type="submit">Đăng nhập <span>→</span></button>
            </form>

            <div className="auth-separator"><span>hoặc</span></div>
            <p className="auth-switch">Chưa có tài khoản? <button type="button" onClick={() => navigate("/register")}>Tạo tài khoản mới</button></p>
            <div className="auth-secure-note"><Icon name="shield" size={15} /><span>Thông tin của bạn được bảo vệ an toàn.</span></div>
          </section>
          <footer className="auth-footer"><span>© 2026 Zalo</span><a href="#privacy">Quyền riêng tư</a><a href="#terms">Điều khoản</a></footer>
        </main>
      </div>
    </div>
  );
}
