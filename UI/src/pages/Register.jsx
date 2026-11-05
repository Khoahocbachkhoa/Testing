import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../components/Icon";
import { photos } from "../data/diary";

export default function Register() {
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
            <h1>Mỗi ngày<br />thêm một <em>kỷ niệm.</em></h1>
            <p>Tạo tài khoản để lưu giữ những khoảnh khắc và chia sẻ chúng cùng bạn bè.</p>
            <div className="auth-memory-card">
              <div className="auth-memory-card__top">
                <span className="auth-memory-card__avatar"><img src={photos.han} alt="" /></span>
                <div><strong>Hà Nguyễn</strong><span>đã lưu giữ một khoảnh khắc</span></div>
                <span className="auth-memory-card__lock"><Icon name="friends" size={14} /></span>
              </div>
              <img className="auth-memory-card__photo" src={photos.flowers} alt="Bó hoa trong một khoảnh khắc đáng nhớ" />
              <div className="auth-memory-card__caption"><span>💐 Nhặt một chút dịu dàng...</span><span>♡　19</span></div>
            </div>
            <div className="auth-community">
              <div className="auth-community__avatars">
                {[photos.me, photos.linh, photos.minh, photos.duy].map((src) => <img key={src} src={src} alt="" />)}
              </div>
              <div><strong>Nhật ký chỉ dành cho bạn bè</strong><span>Bạn luôn chọn ai có thể xem bài viết.</span></div>
              <span className="auth-community__check"><Icon name="shield" size={17} /></span>
            </div>
          </div>
          <div className="auth-story__footer"><span>✦</span> Chia sẻ những điều ý nghĩa theo cách của bạn.</div>
        </aside>

        <main className="auth-main">
          <div className="auth-mobile-brand">
            <span className="auth-brand__mark">Z</span><span className="auth-brand__name">Zalo</span>
          </div>
          <section className="auth-card auth-card--register">
            <div className="auth-card__eyebrow"><span className="auth-card__eyebrow-icon"><Icon name="spark" size={14} /></span> BẮT ĐẦU HÀNH TRÌNH</div>
            <h2>Tạo tài khoản</h2>
            <p className="auth-card__intro">Kết nối với bạn bè và chia sẻ điều bạn yêu thích.</p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <label htmlFor="register-username">Tên đăng nhập</label>
              <div className="auth-input-wrap">
                <Icon name="friends" size={17} />
                <input
                  id="register-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Chọn tên đăng nhập"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </div>
              <label htmlFor="register-password">Mật khẩu</label>
              <div className="auth-input-wrap">
                <Icon name="lock" size={17} />
                <input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Tạo mật khẩu của bạn"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
              <p className="auth-form-hint"><Icon name="shield" size={14} /> Nhật ký của bạn chỉ hiển thị với bạn bè.</p>
              <button className="auth-submit" type="submit">Tạo tài khoản <span>→</span></button>
            </form>

            <div className="auth-separator"><span>hoặc</span></div>
            <p className="auth-switch">Đã có tài khoản? <button type="button" onClick={() => navigate("/login")}>Đăng nhập</button></p>
            <div className="auth-secure-note"><Icon name="shield" size={15} /><span>Bằng việc tiếp tục, bạn đồng ý với Điều khoản sử dụng.</span></div>
          </section>
          <footer className="auth-footer"><span>© 2026 Zalo</span><a href="#privacy">Quyền riêng tư</a><a href="#terms">Điều khoản</a></footer>
        </main>
      </div>
    </div>
  );
}
