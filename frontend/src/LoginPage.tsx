import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

interface LoginErrorBody {
  error?: string;
  message?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = (await res.json().catch(() => ({}))) as LoginErrorBody;

      if (res.ok) {
        const name = (data as { username?: string }).username ?? username.trim();
        login(name);
        navigate("/board", { replace: true });
        return;
      }

      const message =
        typeof data.message === "string"
          ? data.message
          : data.error === "blank_username"
            ? "Username cannot be blank."
            : data.error === "blank_password"
              ? "Password cannot be blank."
              : data.error === "missing_credentials"
                ? "Please enter your username and password."
                : "Invalid username or password.";
      setError(message);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="text-2xl font-bold text-stone-800 text-center">
          BuggyBoard
        </h1>
        <p className="text-stone-600 text-center mt-1 mb-6">Log in</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-stone-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-stone-800 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-stone-800 py-2 px-4 font-medium text-white hover:bg-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in…" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
