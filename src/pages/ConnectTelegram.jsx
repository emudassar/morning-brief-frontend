import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";

const botUsername =
  import.meta.env.VITE_TELEGRAM_BOT_USERNAME || "@YourBotUsername";

export default function ConnectTelegram() {
  const { token, user, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;

    let intervalId;

    const poll = async () => {
      try {
        const { data } = await api.get("/api/user/me");
        setUser(data);
        if (data.telegramChatId) {
          if (intervalId) clearInterval(intervalId);
          navigate("/setup");
        }
      } catch {
        /* ignore polling errors */
      }
    };

    poll();
    intervalId = setInterval(poll, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [token, navigate, setUser]);

  return (
    <div className="app-shell flex min-h-full items-center justify-center px-4 py-8">
      <Card className="w-full max-w-md p-8 text-center sm:p-10">
        <div className="text-6xl mb-4" aria-hidden>
          📱
        </div>
        <h1 className="text-3xl font-bold tracking-tightest">Connect Telegram</h1>
        <p className="mt-4 text-muted">Open Telegram and send this command to your bot:</p>
        <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3 font-mono text-base text-brand-700 break-all ring-1 ring-brand-100">
          /start {user?.email ?? "…"}
        </div>
        <p className="mt-6 text-sm text-muted">
          Search Telegram for:{" "}
          <span className="font-semibold text-slate-800">{botUsername}</span>
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600"
            aria-hidden
          />
          <span>Waiting for confirmation...</span>
        </div>
      </Card>
    </div>
  );
}
