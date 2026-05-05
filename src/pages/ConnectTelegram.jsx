import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

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
    <div className="min-h-full flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-slate-200">
        <div className="text-6xl mb-4" aria-hidden>
          📱
        </div>
        <h1 className="text-2xl font-semibold text-slate-900">Connect Telegram</h1>
        <p className="mt-4 text-slate-600">Open Telegram and send this to your bot:</p>
        <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 font-mono text-base text-blue-700 break-all">
          /start {user?.email ?? "…"}
        </div>
        <p className="mt-6 text-sm text-slate-500">
          Search Telegram for:{" "}
          <span className="font-semibold text-slate-800">{botUsername}</span>
        </p>
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-slate-500">
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-blue-600"
            aria-hidden
          />
          <span>Waiting for confirmation...</span>
        </div>
      </div>
    </div>
  );
}
