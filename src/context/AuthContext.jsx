import { createContext, useContext, useEffect, useState } from "react";
import { getItem, setItem, removeItem, KEYS } from "../utils/localStorage";

export const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuarioActual, setUsuarioActual] = useState(() =>
    getItem(KEYS.usuarioActual)
  );

  useEffect(() => {
    const usuarioGuardado = getItem(KEYS.usuarioActual);

    if (usuarioGuardado) {
      setUsuarioActual(usuarioGuardado);
    }
  }, []);

  const login = (email, password) => {
    const usuarios = getItem(KEYS.usuarios) || [];

    const usuario = usuarios.find(
      (usuario) =>
        usuario.email.toLowerCase() === email.toLowerCase() &&
        usuario.password === password
    );

    if (!usuario) {
      return {
        success: false,
        message: "El email o la contraseña son incorrectos.",
      };
    }

    if (usuario.activo === false) {
      return {
        success: false,
        message: "Tu cuenta se encuentra desactivada.",
      };
    }

    setUsuarioActual(usuario);
    setItem(KEYS.usuarioActual, usuario);

    return {
      success: true,
      user: usuario,
    };
  };

  const logout = () => {
    setUsuarioActual(null);
    removeItem(KEYS.usuarioActual);
  };

  return (
    <AuthContext.Provider
      value={{
        usuarioActual,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}