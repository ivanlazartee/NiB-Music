import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PrivateRoute({ children, role }) {
  const { usuarioActual } = useAuth();

  if (!usuarioActual) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const rolesPermitidos = Array.isArray(role) ? role : [role];

    if (!rolesPermitidos.includes(usuarioActual.rol)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default PrivateRoute;