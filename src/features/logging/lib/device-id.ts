const DEVICE_ID_KEY = "gutvault_device_id";

function generateDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  if (crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 15);
  return `${timestamp}-${random}`;
}

export function getDeviceId(): string {
  if (typeof window === "undefined") {
    return "server";
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY);

  if (!deviceId) {
    deviceId = generateDeviceId();
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  return deviceId;
}
