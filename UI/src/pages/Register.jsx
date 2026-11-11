import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth.js";
import toast from "react-hot-toast";
import './Register.css';

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await registerApi(username, password);

      const { message } = res.data;

      toast.success(message);

      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || "Đăng ký thất bại!");
      setError(err.response?.data?.message || "Đăng ký thất bại! Vui lòng thử lại!");
    }
  };

  return (
    <div className="auth">
      <div className="card">
        <header className="header">
          <h2>Tạo tài khoản</h2>
        </header>

        {error && <div className="error-message">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="register-username">Tên đăng nhập</label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              placeholder="Tên tài khoản mới"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit">
            Tạo tài khoản
          </button>
        </form>

        <footer className="footer">
          <span>Đã có tài khoản?</span>
          <button
            type="button"
            className="switch-btn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>
        </footer>
      </div>
    </div>
  );
}