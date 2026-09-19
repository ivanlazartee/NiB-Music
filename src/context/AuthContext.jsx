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

  const registro = (datos) => {
    const usuarios = getItem(KEYS.usuarios) || [];

    const emailExiste = usuarios.some(
      (usuario) =>
        usuario.email.toLowerCase() === datos.email.toLowerCase()
    );

    if (emailExiste) {
      return {
        success: false,
        message: "Ya existe una cuenta registrada con ese email.",
      };
    }

    const nuevoUsuario = {
      id: crypto.randomUUID(),
      nombre: datos.nombre,
      email: datos.email,
      password: datos.password,
      rol: "premium",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        datos.nombre
      )}&background=059669&color=fff`,
      fechaRegistro: new Date().toISOString(),
      activo: true,
      fechaDesactivacion: null,
    };

    const usuariosActualizados = [...usuarios, nuevoUsuario];

    setItem(KEYS.usuarios, usuariosActualizados);

    return {
      success: true,
      user: nuevoUsuario,
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
        registro,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}