import React, { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import "/src/styles/Login.css";
export const Login = () => {
  const { handleLogin, loading, error } = useLogin();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  return (
    <>
      <div className="Content-login">
        <div className="Content-login-img">
          <img src="src/assets/Login.png" alt="login" />
        </div>

        <div className="Content-login-info">
          <h1>Iniciar Sesion</h1>
          <span>Ingresa tus credenciales para acceder</span>
          <form onSubmit={handleSubmit}>
            <div className="Content-inputs">
              <img src="src/assets/username.png" alt="username" />
              <input
                type="text"
                id="username"
                value={username}
                placeholder=" Nombre de usuario"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="Content-inputs">
              <img src="src/assets/password.png" alt="username" />
              <input
                type="password"
                id="password"
                value={password}
                placeholder=" Contraseña"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} id="input-login">
              {loading ? "Logging in..." : "Login"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
          </form>
        </div>
      </div>
    </>
  );
};
