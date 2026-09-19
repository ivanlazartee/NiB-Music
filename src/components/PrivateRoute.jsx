import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, role }) {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  if (role && usuarioActual.rol !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;