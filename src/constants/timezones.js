// Curated + full IANA list for timezone selects (explicit GMT/UTC offsets for quick pick).
import moment from "moment-timezone";

/** Same numeric offset as both GMT and UTC style (search: "gmt+5", "utc+5", "pakistan"). */
export function gmtUtcPairLabel(iana) {
  const offsetMin = moment.tz(iana).utcOffset();
  if (offsetMin === 0) return "GMT+0 / UTC±0";
  const sign = offsetMin > 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  const core = mm === 0 ? `${sign}${h}` : `${sign}${h}:${String(mm).padStart(2, "0")}`;
  return `GMT${core} / UTC${core}`;
}

/** Loose match so "gmt+5", "utc 5", "pakistan" all find rows. */
export function timezoneFilterOption(option, rawInput) {
  if (!rawInput) return true;
  const norm = (s) => String(s).toLowerCase().replace(/\s+/g, "");
  return norm(`${option.label ?? ""} ${option.value ?? ""}`).includes(norm(rawInput));
}

/**
 * First group in the dropdown: every row starts with "GMT±… / UTC±…" so Pakistan users
 * can pick GMT+5 / UTC+5 → Asia/Karachi (PKT). Values stay IANA for the scheduler.
 */
const OFFSET_QUICK = [
  { value: "UTC", title: "Coordinated Universal Time" },
  { value: "Asia/Karachi", title: "Pakistan (PKT)" },
  { value: "Europe/London", title: "United Kingdom & Ireland" },
  { value: "Europe/Paris", title: "Western Europe (Paris, Madrid, Rome)" },
  { value: "Europe/Berlin", title: "Central Europe (Berlin, Warsaw)" },
  { value: "Europe/Athens", title: "Eastern Europe (Athens, Bucharest)" },
  { value: "Europe/Moscow", title: "Russia — Moscow (MSK)" },
  { value: "Africa/Cairo", title: "Egypt" },
  { value: "Africa/Johannesburg", title: "South Africa" },
  { value: "America/Sao_Paulo", title: "Brazil (São Paulo)" },
  { value: "America/New_York", title: "US & Canada — Eastern" },
  { value: "America/Chicago", title: "US & Canada — Central" },
  { value: "America/Denver", title: "US & Canada — Mountain" },
  { value: "America/Los_Angeles", title: "US & Canada — Pacific" },
  { value: "Pacific/Honolulu", title: "Hawaii" },
  { value: "Asia/Dubai", title: "United Arab Emirates" },
  { value: "Asia/Riyadh", title: "Saudi Arabia" },
  { value: "Asia/Kolkata", title: "India (IST)" },
  { value: "Asia/Bangkok", title: "Thailand, Vietnam" },
  { value: "Asia/Singapore", title: "Singapore & Malaysia" },
  { value: "Asia/Shanghai", title: "China" },
  { value: "Asia/Tokyo", title: "Japan" },
  { value: "Asia/Seoul", title: "South Korea" },
  { value: "Australia/Sydney", title: "Australia — Eastern" },
  { value: "Pacific/Auckland", title: "New Zealand" },
];

const offsetQuickValues = new Set(OFFSET_QUICK.map((r) => r.value));

function offsetQuickOptions() {
  return OFFSET_QUICK.map(({ value, title }) => ({
    value,
    label: `${gmtUtcPairLabel(value)} — ${title} (${value})`,
  }));
}

function allOtherOptions() {
  return moment.tz
    .names()
    .filter((name) => !offsetQuickValues.has(name))
    .map((name) => ({
      value: name,
      label: `${gmtUtcPairLabel(name)} — ${name}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Grouped for react-select: explicit GMT/UTC first, then every other IANA zone. */
export const timezoneSelectOptions = [
  { label: "GMT / UTC offset (quick pick)", options: offsetQuickOptions() },
  { label: "All other timezones", options: allOtherOptions() },
];

export function findTimezoneOption(value) {
  if (!value) return null;
  for (const group of timezoneSelectOptions) {
    const hit = group.options.find((o) => o.value === value);
    if (hit) return hit;
  }
  return {
    value,
    label: `${gmtUtcPairLabel(value)} — ${value}`,
  };
}
