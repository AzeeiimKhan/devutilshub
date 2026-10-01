export type TimestampUnit = "seconds" | "milliseconds";
export type DateInputTimezone = "local" | "utc";

export type TimestampConversion = {
  date: Date;
  iso: string;
  milliseconds: number;
  seconds: number;
};

export type ConversionResult =
  { ok: true; value: TimestampConversion } | { ok: false; error: string };

const DATE_TIME_PATTERN =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/;
const NUMERIC_TIMESTAMP_PATTERN =
  /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i;

export function timestampToDate(
  input: string,
  unit: TimestampUnit,
): ConversionResult {
  const trimmed = input.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter a Unix timestamp to convert." };
  }

  const timestamp = Number(trimmed);
  if (!NUMERIC_TIMESTAMP_PATTERN.test(trimmed) || !Number.isFinite(timestamp)) {
    return {
      ok: false,
      error: "Enter a finite numeric timestamp, then choose its unit.",
    };
  }

  const milliseconds = unit === "seconds" ? timestamp * 1_000 : timestamp;
  if (!Number.isFinite(milliseconds)) {
    return {
      ok: false,
      error:
        "This timestamp is outside the range supported by JavaScript Date.",
    };
  }

  if (!Number.isInteger(milliseconds)) {
    return {
      ok: false,
      error:
        "This value is more precise than one millisecond, which JavaScript Date cannot preserve.",
    };
  }

  const date = new Date(milliseconds);
  if (Number.isNaN(date.getTime())) {
    return {
      ok: false,
      error:
        "This timestamp is outside the range supported by JavaScript Date.",
    };
  }

  return createConversion(date);
}

export function dateInputToTimestamp(
  input: string,
  timezone: DateInputTimezone,
): ConversionResult {
  const trimmed = input.trim();
  if (!trimmed) {
    return { ok: false, error: "Choose a date and time to convert." };
  }

  const match = DATE_TIME_PATTERN.exec(trimmed);
  if (!match) {
    return {
      ok: false,
      error: "Enter a complete date and time using the browser control.",
    };
  }

  const [
    ,
    yearText,
    monthText,
    dayText,
    hourText,
    minuteText,
    secondText,
    msText,
  ] = match;
  const parts = {
    year: Number(yearText),
    month: Number(monthText),
    day: Number(dayText),
    hour: Number(hourText),
    minute: Number(minuteText),
    second: Number(secondText ?? "0"),
    millisecond: Number((msText ?? "0").padEnd(3, "0")),
  };

  const date = new Date(0);
  if (timezone === "utc") {
    date.setUTCFullYear(parts.year, parts.month - 1, parts.day);
    date.setUTCHours(parts.hour, parts.minute, parts.second, parts.millisecond);
  } else {
    date.setFullYear(parts.year, parts.month - 1, parts.day);
    date.setHours(parts.hour, parts.minute, parts.second, parts.millisecond);
  }

  if (
    Number.isNaN(date.getTime()) ||
    !dateMatchesParts(date, parts, timezone)
  ) {
    return {
      ok: false,
      error:
        timezone === "local"
          ? "That local date and time is invalid or does not exist in your timezone."
          : "That UTC date and time is invalid.",
    };
  }

  return createConversion(date);
}

export function toDateTimeInputValue(
  date: Date,
  timezone: DateInputTimezone,
): string {
  const get = (local: () => number, utc: () => number) =>
    timezone === "utc" ? utc() : local();
  const year = get(
    () => date.getFullYear(),
    () => date.getUTCFullYear(),
  );
  const month = get(
    () => date.getMonth() + 1,
    () => date.getUTCMonth() + 1,
  );
  const day = get(
    () => date.getDate(),
    () => date.getUTCDate(),
  );
  const hour = get(
    () => date.getHours(),
    () => date.getUTCHours(),
  );
  const minute = get(
    () => date.getMinutes(),
    () => date.getUTCMinutes(),
  );
  const second = get(
    () => date.getSeconds(),
    () => date.getUTCSeconds(),
  );
  const millisecond = get(
    () => date.getMilliseconds(),
    () => date.getUTCMilliseconds(),
  );

  return `${pad(year, 4)}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:${pad(second)}.${pad(millisecond, 3)}`;
}

export function formatUtcDate(date: Date): string {
  return `${date.toISOString().slice(0, 10)} ${date.toISOString().slice(11, 19)} UTC`;
}

export function formatLocalDate(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    timeZoneName: "short",
    hourCycle: "h23",
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${value("year")}-${value("month")}-${value("day")} ${value("hour")}:${value("minute")}:${value("second")}.${value("fractionalSecond")} ${value("timeZoneName")}`.trim();
}

export function getBrowserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "Local timezone";
}

function createConversion(date: Date): ConversionResult {
  const milliseconds = date.getTime();
  return {
    ok: true,
    value: {
      date,
      iso: date.toISOString(),
      milliseconds,
      seconds: milliseconds / 1_000,
    },
  };
}

function dateMatchesParts(
  date: Date,
  parts: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
    millisecond: number;
  },
  timezone: DateInputTimezone,
) {
  const prefix = timezone === "utc" ? "getUTC" : "get";
  const read = (name: string) =>
    (date as unknown as Record<string, () => number>)[`${prefix}${name}`]();

  return (
    read("FullYear") === parts.year &&
    read("Month") + 1 === parts.month &&
    read("Date") === parts.day &&
    read("Hours") === parts.hour &&
    read("Minutes") === parts.minute &&
    read("Seconds") === parts.second &&
    read("Milliseconds") === parts.millisecond
  );
}

function pad(value: number, length = 2) {
  return String(value).padStart(length, "0");
}
