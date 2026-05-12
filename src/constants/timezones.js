// Curated + full IANA list for timezone selects (labels include UTC offset for searchability).
import moment from "moment-timezone";

/** Current UTC offset for search-friendly labels (e.g. UTC+5, UTC+5:30). */
export function utcOffsetLabel(iana) {
  const offsetMin = moment.tz(iana).utcOffset();
  if (offsetMin === 0) return "UTC±0";
  const sign = offsetMin > 0 ? "+" : "-";
  const abs = Math.abs(offsetMin);
  const h = Math.floor(abs / 60);
  const mm = abs % 60;
  if (mm === 0) return `UTC${sign}${h}`;
  return `UTC${sign}${h}:${String(mm).padStart(2, "0")}`;
}

/** Major regions first; values must be valid IANA names for the scheduler. */
const MAJOR_IANA = [
  { value: "UTC", title: "Coordinated Universal Time" },
  { value: "Europe/London", title: "UK & Ireland" },
  { value: "Europe/Paris", title: "Western Europe (Paris, Madrid, Rome)" },
  { value: "Europe/Berlin", title: "Central Europe (Berlin, Warsaw)" },
  { value: "Europe/Athens", title: "Eastern Europe (Athens, Bucharest)" },
  { value: "Europe/Istanbul", title: "Turkey" },
  { value: "Europe/Moscow", title: "Moscow (MSK)" },
  { value: "Africa/Cairo", title: "Egypt & Eastern Africa" },
  { value: "Africa/Johannesburg", title: "South Africa" },
  { value: "Africa/Lagos", title: "West Africa (Nigeria)" },
  { value: "America/Sao_Paulo", title: "Brazil (São Paulo)" },
  { value: "America/Argentina/Buenos_Aires", title: "Argentina" },
  { value: "America/New_York", title: "US & Canada — Eastern" },
  { value: "America/Chicago", title: "US & Canada — Central" },
  { value: "America/Denver", title: "US & Canada — Mountain" },
  { value: "America/Phoenix", title: "US — Arizona (no DST)" },
  { value: "America/Los_Angeles", title: "US & Canada — Pacific" },
  { value: "America/Anchorage", title: "Alaska" },
  { value: "Pacific/Honolulu", title: "Hawaii" },
  { value: "America/Toronto", title: "Canada — Eastern" },
  { value: "America/Vancouver", title: "Canada — Pacific" },
  { value: "America/Mexico_City", title: "Mexico" },
  { value: "America/Bogota", title: "Colombia" },
  { value: "Asia/Karachi", title: "Pakistan (PKT)" },
  { value: "Asia/Kolkata", title: "India (IST)" },
  { value: "Asia/Dhaka", title: "Bangladesh" },
  { value: "Asia/Bangkok", title: "Thailand, Vietnam, Indonesia (western)" },
  { value: "Asia/Singapore", title: "Singapore & Malaysia" },
  { value: "Asia/Hong_Kong", title: "Hong Kong" },
  { value: "Asia/Shanghai", title: "China" },
  { value: "Asia/Tokyo", title: "Japan" },
  { value: "Asia/Seoul", title: "South Korea" },
  { value: "Asia/Dubai", title: "United Arab Emirates" },
  { value: "Asia/Riyadh", title: "Saudi Arabia" },
  { value: "Asia/Jerusalem", title: "Israel" },
  { value: "Asia/Manila", title: "Philippines" },
  { value: "Australia/Sydney", title: "Australia — Eastern (Sydney, Melbourne)" },
  { value: "Australia/Perth", title: "Australia — Western" },
  { value: "Pacific/Auckland", title: "New Zealand" },
];

const majorValues = new Set(MAJOR_IANA.map((m) => m.value));

function majorOptions() {
  return MAJOR_IANA.map(({ value, title }) => ({
    value,
    label: `${utcOffsetLabel(value)} — ${title} (${value})`,
  }));
}

function allOtherOptions() {
  return moment.tz
    .names()
    .filter((name) => !majorValues.has(name))
    .map((name) => ({
      value: name,
      label: `${utcOffsetLabel(name)} — ${name}`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Grouped options for react-select: popular first, then every IANA zone. */
export const timezoneSelectOptions = [
  { label: "Popular timezones", options: majorOptions() },
  { label: "All timezones", options: allOtherOptions() },
];

export function findTimezoneOption(value) {
  if (!value) return null;
  for (const group of timezoneSelectOptions) {
    const hit = group.options.find((o) => o.value === value);
    if (hit) return hit;
  }
  return {
    value,
    label: `${utcOffsetLabel(value)} — ${value}`,
  };
}
