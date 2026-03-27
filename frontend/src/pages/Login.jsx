import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast("Welcome back, " + res.data.user.name + "!", "success");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || "Login failed. Check your credentials.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand-icon">📚</div>
          <span className="auth-brand-name">ResHub</span>
        </div>

        <h2 className="auth-heading">Welcome back</h2>
        <p className="auth-sub">Sign in to your account to continue.</p>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit} className="form-stack">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </div>

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner" style={{ width: 16, height: 16, borderTopColor: "#fff" }} />
                Signing in…
              </>
            ) : "Sign in"}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: "center", fontSize: "0.9rem" }}>
          Don&apos;t have an account?{" "}
          <button className="btn-link" type="button" onClick={() => navigate("/register")}>
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
