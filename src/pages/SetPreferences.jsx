import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import toast from "react-hot-toast";
import moment from "moment-timezone";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

const tzOptions = moment.tz.names().map((name) => ({ value: name, label: name }));

const selectStyles = {
  control: (base) => ({
    ...base,
    borderRadius: "0.75rem",
    borderColor: "#e2e8f0",
    minHeight: "44px",
    boxShadow: "none",
    transition: "all 0.2s ease",
    "&:hover": { borderColor: "#cbd5e1" },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 10px" }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eef2ff" : "white",
    color: "#0f172a",
  }),
  menu: (base) => ({ ...base, zIndex: 50 }),
};

function defaultModules() {
  return {
    weather: true,
    news: true,
    calendar: false,
    crypto: false,
    quote: true,
  };
}

function ToggleRow({ label, checked, onChange, badge }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white px-4 py-3 transition hover:border-slate-300 hover:bg-slate-50">
      <span className="flex items-center gap-2 text-sm font-medium text-slate-800">
        {label}
        {badge}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
    </label>
  );
}

export default function SetPreferences() {
  const navigate = useNavigate();
  const { token, setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [briefingTime, setBriefingTime] = useState("08:00");
  const [timezone, setTimezone] = useState(() =>
    tzOptions.find((o) => o.value === "UTC") ?? tzOptions[0]
  );
  const [modules, setModules] = useState(defaultModules);

  useEffect(() => {
    if (!token) {
      navigate("/login", { replace: true });
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { data } = await api.get("/api/user/me");
        if (cancelled) return;
        setUser(data);
        if (data.briefingTime) setBriefingTime(data.briefingTime.slice(0, 5));
        if (data.timezone) {
          const opt = tzOptions.find((o) => o.value === data.timezone);
          if (opt) setTimezone(opt);
        }
        if (data.modules) {
          setModules({
            weather: !!data.modules.weather,
            news: !!data.modules.news,
            calendar: !!data.modules.calendar,
            crypto: !!data.modules.crypto,
            quote: !!data.modules.quote,
          });
        }
      } catch {
        toast.error("Could not load your profile");
        navigate("/login", { replace: true });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token, navigate, setUser]);

  const preview = useMemo(() => {
    const tz = timezone?.value ?? "UTC";
    return `Your briefing will arrive daily at ${briefingTime} (${tz})`;
  }, [briefingTime, timezone]);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/api/user/preferences", {
        briefingTime,
        timezone: timezone?.value ?? "UTC",
        modules,
      });
      setUser(data);
      toast.success("Preferences saved");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error ?? err.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="app-shell flex min-h-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-slate-200 border-t-brand-600" />
      </div>
    );
  }

  return (
    <div className="app-shell flex min-h-full items-center justify-center px-4 py-8">
      <Card className="w-full max-w-xl p-8 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tightest">Set your briefing</h1>
        <p className="mt-2 text-sm text-muted">{preview}</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <Input
            id="briefingTime"
            type="time"
            label="Daily briefing time"
            value={briefingTime}
            onChange={(e) => setBriefingTime(e.target.value)}
          />

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Timezone</label>
            <Select
              options={tzOptions}
              value={timezone}
              onChange={(v) => v && setTimezone(v)}
              styles={selectStyles}
              isSearchable
            />
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">Modules</p>
            <ToggleRow
              label="Weather"
              checked={modules.weather}
              onChange={(v) => setModules((m) => ({ ...m, weather: v }))}
            />
            <ToggleRow
              label="News"
              checked={modules.news}
              onChange={(v) => setModules((m) => ({ ...m, news: v }))}
            />
            <ToggleRow
              label="Calendar"
              checked={modules.calendar}
              onChange={(v) => setModules((m) => ({ ...m, calendar: v }))}
              badge={
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                  Phase 2
                </span>
              }
            />
            <ToggleRow
              label="Crypto"
              checked={modules.crypto}
              onChange={(v) => setModules((m) => ({ ...m, crypto: v }))}
            />
            <ToggleRow
              label="Quote"
              checked={modules.quote}
              onChange={(v) => setModules((m) => ({ ...m, quote: v }))}
            />
          </div>

          <Button type="submit" loading={saving} className="w-full" size="lg">
            {saving ? "Saving..." : "Save & go to dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
