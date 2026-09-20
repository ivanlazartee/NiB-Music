import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function PublicRoute({ children }) {
  const { usuarioActual } = useAuth();

  if (usuarioActual) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PublicRoute;