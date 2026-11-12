import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi } from "../api/auth";
import toast from "react-hot-toast";
import "./Register.css";

export default function Register() {
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await registerApi(username.trim(), password, fullname.trim());
      toast.success("Tạo tài khoản thành công. Hãy đăng nhập.");
      navigate("/login", { replace: true });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(message);
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="card">
        <header className="header">
          <h2>Tạo tài khoản</h2>
          <p>Lưu lại những điều bạn muốn nhớ.</p>
        </header>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="register-fullname">Tên hiển thị</label>
            <input
              id="register-fullname"
              type="text"
              autoComplete="name"
              placeholder="Tên của bạn"
              value={fullname}
              maxLength={100}
              onChange={(event) => setFullname(event.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-username">Tên đăng nhập</label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              placeholder="Tên tài khoản mới"
              value={username}
              maxLength={100}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              type="password"
              autoComplete="new-password"
              placeholder="Ít nhất 8 ký tự"
              value={password}
              minLength={8}
              maxLength={72}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
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
