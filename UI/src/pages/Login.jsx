import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi } from "../api/auth";
import toast from "react-hot-toast";
import "./Login.css";

export default function Login() {
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
      const { data } = await loginApi(username.trim(), password);
      if (!data.access_token) throw new Error("Máy chủ không trả về access token.");
      localStorage.setItem("accessToken", data.access_token);
      toast.success("Đăng nhập thành công");
      navigate("/notes", { replace: true });
    } catch (requestError) {
      const message =
        requestError.response?.data?.message ||
        requestError.message ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
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
          <h2>Đăng nhập</h2>
          <p>Tiếp tục viết nhật ký của bạn.</p>
        </header>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input
              id="login-username"
              type="text"
              autoComplete="username"
              placeholder="Nhập tên tài khoản của bạn"
              value={username}
              maxLength={100}
              onChange={(event) => setUsername(event.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="login-password">Mật khẩu</label>
            <input
              id="login-password"
              type="password"
              autoComplete="current-password"
              placeholder="Nhập mật khẩu"
              value={password}
              maxLength={72}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Đang đăng nhập..." : "Đăng nhập"}
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
