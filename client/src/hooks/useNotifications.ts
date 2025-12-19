import { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  getNotificationPermission,
} from "../services/notification";

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(
    getNotificationPermission()
  );
  const [requesting, setRequesting] = useState(false);

  useEffect(() => {
    setPermission(getNotificationPermission());
  }, []);

  const requestPermission = async () => {
    try {
      setRequesting(true);
      const result = await requestNotificationPermission();
      setPermission(result);
      return result === "granted";
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return false;
    } finally {
      setRequesting(false);
    }
  };

  return {
    permission,
    requesting,
    requestPermission,
    isGranted: permission === "granted",
    isDenied: permission === "denied",
    isDefault: permission === "default",
  };
}
