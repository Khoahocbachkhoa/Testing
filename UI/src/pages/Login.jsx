import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import toast from "react-hot-toast";
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginApi(username, password);

      const { message } = res.data;

      toast.success(message);

      // testing only
      localStorage.setItem("isLoggedIn", "true");

      navigate('/notes');
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng nhập thất bại!");
      setError(err.response?.data?.message || "Đăng nhập thất bại! Vui lòng thử lại!");
    }
  };

  return (
    <div className="auth">
      <div className="card">
        <header className="header">
          <h2>Đăng nhập</h2>
        </header>

        {error && <div><div className="error-message">{error}</div> <br/><br/></div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              placeholder="Nhập tên tài khoản của bạn"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="label-row">
              <label htmlFor="login-password">Mật khẩu</label>
              <a href="#forgot" className="forgot-link">
                Quên?
              </a>
            </div>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="******"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit">
            Đăng nhập
          </button>
        </form>

        <footer className="footer">
          <span>Chưa có tài khoản?</span>
          <button
            type="button"
            className="switch-btn"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </footer>
      </div>
    </div>
  );
}
