import type { Earthquake } from "../types/earthquake";

const NOTIFIED_KEY = "notified_earthquakes";

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    throw new Error("This browser does not support notifications");
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
}

export function getNotificationPermission(): NotificationPermission {
  if (!("Notification" in window)) {
    return "denied";
  }
  return Notification.permission;
}

export function sendEarthquakeNotification(earthquake: Earthquake): void {
  if (Notification.permission !== "granted") {
    return;
  }

  // Check if already notified
  if (hasBeenNotified(earthquake.id)) {
    return;
  }

  const title = `🚨 Gempa M${earthquake.magnitude}`;
  const body = `${earthquake.region}\nKedalaman: ${earthquake.depth}km${
    earthquake.distance
      ? `\nJarak: ${earthquake.distance.toFixed(1)}km dari Anda`
      : ""
  }`;

  new Notification(title, {
    body,
    icon: "/vite.svg",
    tag: earthquake.id,
    requireInteraction: earthquake.magnitude >= 6,
  });

  markAsNotified(earthquake.id);
}

/**
 * Send a test notification to verify notifications are working
 */
export function sendTestNotification(): void {
  if (Notification.permission !== "granted") {
    alert("Notifikasi belum diaktifkan. Silakan aktifkan terlebih dahulu.");
    return;
  }

  const title = "🧪 Test Notifikasi Gempa";
  const body =
    "Notifikasi berhasil! Anda akan menerima peringatan gempa di area Anda.";

  new Notification(title, {
    body,
    icon: "/vite.svg",
    tag: "test-notification",
    requireInteraction: false,
  });
}

function markAsNotified(earthquakeId: string): void {
  const notified = getNotifiedEarthquakes();
  notified.push(earthquakeId);

  // Keep only last 100 notifications
  const recent = notified.slice(-100);
  localStorage.setItem(NOTIFIED_KEY, JSON.stringify(recent));
}

function hasBeenNotified(earthquakeId: string): boolean {
  const notified = getNotifiedEarthquakes();
  return notified.includes(earthquakeId);
}

function getNotifiedEarthquakes(): string[] {
  const stored = localStorage.getItem(NOTIFIED_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function checkIfNotified(earthquakeId: string): boolean {
  return hasBeenNotified(earthquakeId);
}
