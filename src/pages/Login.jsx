import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      login(data.token, { userId: data.userId, email: data.email });
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? "Login failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="Sign in to BriefAI"
      subtitle={
        <>
          New here?{" "}
          <Link to="/register" className="link-brand">
            Create an account
          </Link>
        </>
      }
    >
      <Card className="p-8 sm:p-10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" loading={loading} className="w-full" size="lg">
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </Card>
    </AuthShell>
  );
}
