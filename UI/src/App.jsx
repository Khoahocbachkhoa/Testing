import { BrowserRouter, Route, Routes } from "react-router-dom";
import DiaryPage from "./pages/DiaryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/diary" element={<PrivateRoute><DiaryPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
