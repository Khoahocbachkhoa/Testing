import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submit:", { username, password });
  };

  return (
    <div>
      <h2>Đăng ký</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            placeholder="Tên đăng nhập mới"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Đăng ký</button>
      </form>

      <div>
        <span>hoặc</span>
      </div>

      <button type="button" onClick={() => navigate("/login")}>
        Đăng nhập
      </button>
    </div>
  );
}

export default Register;
