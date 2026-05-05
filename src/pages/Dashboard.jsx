import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CalendarClock,
  History,
  Loader2,
  LogOut,
  MessageCircle,
  Pause,
  Play,
  Send,
  Settings,
} from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function StatusBadge({ status }) {
  const base = "rounded-full px-2 py-0.5 text-xs font-medium";
  if (status === "sent") return <span className={`${base} bg-emerald-100 text-emerald-800`}>sent</span>;
  if (status === "failed") return <span className={`${base} bg-red-100 text-red-800`}>failed</span>;
  return <span className={`${base} bg-slate-100 text-slate-600`}>{status}</span>;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, setUser, logout } = useAuth();
  const [latestBriefing, setLatestBriefing] = useState(null);
  const [briefingHistory, setBriefingHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [meRes, latestRes, histRes] = await Promise.all([
        api.get("/api/user/me"),
        api.get("/api/briefing/latest"),
        api.get("/api/briefing/history", { params: { limit: 7 } }),
      ]);
      setUser(meRes.data);
      setLatestBriefing(latestRes.data);
      setBriefingHistory(Array.isArray(histRes.data) ? histRes.data : []);
    } catch {
      toast.error("Could not load dashboard");
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleToggleActive() {
    setToggleLoading(true);
    try {
      await api.put("/api/user/toggle-active");
      const { data } = await api.get("/api/user/me");
      setUser(data);
      toast.success(data.isActive ? "Briefings resumed" : "Briefings paused");
    } catch (err) {
      toast.error(err.response?.data?.error ?? err.message ?? "Update failed");
    } finally {
      setToggleLoading(false);
    }
  }

  async function handleSendNow() {
    if (!user.telegramChatId) {
      toast.error("Link Telegram first — open the banner below.");
      return;
    }
    setSendLoading(true);
    try {
      await api.post("/api/briefing/send-now");
      toast.success("Briefing sent! Check Telegram in ~10 seconds");
      const [latestRes, histRes] = await Promise.all([
        api.get("/api/briefing/latest"),
        api.get("/api/briefing/history", { params: { limit: 7 } }),
      ]);
      setLatestBriefing(latestRes.data);
      setBriefingHistory(Array.isArray(histRes.data) ? histRes.data : []);
    } catch (err) {
      const msg = err.response?.data?.error ?? err.message ?? "Send failed";
      if (msg.toLowerCase().includes("telegram")) {
        toast.error(
          "Telegram not linked yet. Use Link Telegram, send /start with your account email, and keep the API server online so the bot can reach Telegram."
        );
      } else {
        toast.error(msg);
      }
    } finally {
      setSendLoading(false);
    }
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  if (loading || !user) {
    return (
      <div className="min-h-full flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" aria-label="Loading" />
      </div>
    );
  }

  const active = !!user.isActive;
  const linked = !!user.telegramChatId;

  return (
    <div className="min-h-full bg-slate-50 pb-16 pt-8">
      <div className="mx-auto max-w-2xl px-4">
        {!linked && (
          <div className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 shadow-sm">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden />
            <div className="space-y-2">
              <p className="font-semibold">Telegram is not connected to this account</p>
              <p>
                “Send briefing” needs your <strong>telegramChatId</strong> in the database. That is set when{" "}
                <strong>your server bot</strong> receives this message (use the <strong>exact</strong> email you
                registered with):
              </p>
              <p className="rounded-lg bg-white/80 px-3 py-2 font-mono text-amber-900 ring-1 ring-amber-200">
                /start {user.email}
              </p>
              <ol className="list-decimal space-y-1 pl-4 text-amber-900/90">
                <li>Keep <code className="rounded bg-white/70 px-1">npm run dev</code> running in <code className="rounded bg-white/70 px-1">server/</code> so the bot can poll Telegram.</li>
                <li>
                  On your phone, open your bot in Telegram and send the line above. If the server cannot reach Telegram
                  (timeouts in the server terminal), try VPN / mobile hotspot or allow Node through the firewall — until
                  polling works, the link will not save.
                </li>
                <li>
                  Return here — this page will work after <code className="rounded bg-white/70 px-1">GET /api/user/me</code>{" "}
                  shows <code className="rounded bg-white/70 px-1">telegramChatId</code> (refresh or reopen the
                  dashboard).
                </li>
              </ol>
              <Link
                to="/connect-telegram"
                className="inline-flex items-center gap-2 font-medium text-blue-700 underline decoration-blue-400 hover:text-blue-900"
              >
                <MessageCircle className="h-4 w-4" aria-hidden />
                Open Link Telegram page
              </Link>
            </div>
          </div>
        )}

        {/* Header bar */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <CalendarClock className="mt-0.5 h-6 w-6 text-blue-600 shrink-0" aria-hidden />
            <div>
              <p className="text-sm text-slate-500">Next briefing</p>
              <p className="font-semibold text-slate-900">
                {user.briefingTime} — {user.timezone}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium ${
                active ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-red-500"}`} />
              {active ? "Active" : "Paused"}
            </span>
            <button
              type="button"
              onClick={handleToggleActive}
              disabled={toggleLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50 disabled:opacity-50"
            >
              {toggleLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : active ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {active ? "Pause" : "Resume"}
            </button>
          </div>
        </header>

        {/* Send now */}
        <section className="mb-8">
          <button
            type="button"
            onClick={handleSendNow}
            disabled={sendLoading || !linked}
            title={!linked ? "Connect Telegram first" : undefined}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 text-lg font-semibold text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendLoading ? (
              <Loader2 className="h-6 w-6 animate-spin" aria-hidden />
            ) : (
              <Send className="h-6 w-6" aria-hidden />
            )}
            {sendLoading ? "Sending…" : "Send briefing now"}
          </button>
        </section>

        {/* Latest briefing */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <History className="h-4 w-4" aria-hidden />
            Last briefing
          </h2>
          {latestBriefing?.content ? (
            <textarea
              readOnly
              value={latestBriefing.content}
              rows={10}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 font-sans text-sm text-slate-800 outline-none"
            />
          ) : (
            <p className="rounded-xl border border-dashed border-slate-200 bg-slate-50 py-8 text-center text-slate-500">
              No briefings yet
            </p>
          )}
        </section>

        {/* History */}
        <section className="mb-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
            <History className="h-4 w-4" aria-hidden />
            Recent history
          </h2>
          <ul className="space-y-3">
            {briefingHistory.length === 0 ? (
              <li className="text-sm text-slate-500">No history yet.</li>
            ) : (
              briefingHistory.map((b) => (
                <li
                  key={b._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2"
                >
                  <span className="text-sm text-slate-700">
                    {new Date(b.createdAt).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </span>
                  <StatusBadge status={b.status} />
                </li>
              ))
            )}
          </ul>
        </section>

        {/* Bottom links */}
        <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6 text-sm">
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-500"
          >
            <Settings className="h-4 w-4" aria-hidden />
            Edit preferences
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 font-medium text-slate-600 hover:text-slate-900"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Logout
          </button>
        </footer>
      </div>
    </div>
  );
}
