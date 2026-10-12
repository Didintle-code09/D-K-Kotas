import { useEffect, useState } from "react";
import { config, copy, hours, type DayHours, type DayName } from "../config";

const DAYS: readonly DayName[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const SLOT_STEP = 30; // minutes between pickup slots
const SLOT_LEAD = 20; // a slot must be at least this many minutes away
const LAST_SLOT_BEFORE_CLOSE = 30; // last pickup slot is this long before closing

export interface ShopTime {
  /** 0 = Monday … 6 = Sunday, in the shop's timezone */
  dayIndex: number;
  /** minutes since midnight, in the shop's timezone */
  minutes: number;
}

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: config.timezone,
  weekday: "short",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function shopTime(date: Date = new Date()): ShopTime {
  const parts = formatter.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "0";
  const dayIndex = Math.max(0, DAYS.indexOf(get("weekday") as DayName));
  return { dayIndex, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export const toHHMM = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export function isOpenAt(day: DayHours, minutes: number) {
  if (!day.open || !day.close) return false;
  return minutes >= toMinutes(day.open) && minutes < toMinutes(day.close);
}

export function isOpenNow(now: ShopTime) {
  return isOpenAt(hours[now.dayIndex], now.minutes);
}

function slotsFor(day: DayHours, earliest: number): string[] {
  if (!day.open || !day.close) return [];
  const slots: string[] = [];
  const last = toMinutes(day.close) - LAST_SLOT_BEFORE_CLOSE;
  for (let t = toMinutes(day.open); t <= last; t += SLOT_STEP) {
    if (t >= earliest) slots.push(toHHMM(t));
  }
  return slots;
}

export interface PickupPlan {
  openNow: boolean;
  /** Days from today the slots are for (0 = today). */
  dayOffset: number;
  dayName: DayName;
  slots: string[];
}

/** Pickup slots: today's if we're open, otherwise the next opening day's. */
export function pickupPlan(now: ShopTime): PickupPlan {
  const today = hours[now.dayIndex];
  if (isOpenAt(today, now.minutes)) {
    return { openNow: true, dayOffset: 0, dayName: today.day, slots: slotsFor(today, now.minutes + SLOT_LEAD) };
  }
  for (let offset = 0; offset < 8; offset++) {
    const day = hours[(now.dayIndex + offset) % 7];
    const slots = slotsFor(day, offset === 0 ? now.minutes + SLOT_LEAD : 0);
    if (slots.length) return { openNow: false, dayOffset: offset, dayName: day.day, slots };
  }
  return { openNow: false, dayOffset: 0, dayName: today.day, slots: [] };
}

export function dayLabel(offset: number, day: DayName) {
  if (offset === 0) return copy.todayWord;
  if (offset === 1) return copy.tomorrowWord;
  return copy.dayNames[day];
}

/** Group consecutive days with identical hours, e.g. "Mon–Fri 12:00–19:00". */
export function groupedHours() {
  const groups: { from: DayName; to: DayName; text: string }[] = [];
  for (const d of hours) {
    const text = d.open && d.close ? `${d.open}–${d.close}` : copy.findUs.closedDay;
    const last = groups[groups.length - 1];
    if (last && last.text === text) last.to = d.day;
    else groups.push({ from: d.day, to: d.day, text });
  }
  return groups.map((g) => ({ label: g.from === g.to ? g.from : `${g.from}–${g.to}`, text: g.text }));
}

/** Current shop time, refreshed every 30 seconds. */
export function useShopTime(): ShopTime {
  const [now, setNow] = useState(() => shopTime());
  useEffect(() => {
    const id = window.setInterval(() => setNow(shopTime()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
