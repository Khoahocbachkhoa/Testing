import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // note: ban đầu đơn giản chưa có token
  const token = localStorage.getItem("isLoggedIn");
  
  // require login
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;