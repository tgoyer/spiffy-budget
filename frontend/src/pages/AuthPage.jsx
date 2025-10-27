import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import styles from "./AuthPage.module.css";

export default function AuthPage() {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [familyId, setFamilyId] = useState(1); // default family id
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setError("");
      if (isLogin) {
        await login({ email, password });
      } else {
        await signup({ email, password, name, family_id: familyId });
        await login({ email, password });
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          {!isLogin && (
            <>
              <input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className={styles.error}>{error}</div>}
          <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
        </form>
        <div className={styles.toggle}>
          {isLogin ? (
            <>
              Don't have an account?{" "}
              <button type="button" onClick={() => setIsLogin(false)}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsLogin(true)}>
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
