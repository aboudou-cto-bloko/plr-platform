"use client";

import { useState, useEffect, useCallback } from "react";

interface DeviceInfo {
  userAgent: string;
  ipAddress?: string;
  ipCountry?: string;
  deviceFingerprint?: string;
  isReady: boolean;
}

const STORAGE_KEY = "plr_device_fingerprint";

function generateSimpleFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    navigator.hardwareConcurrency?.toString() || "unknown",
    navigator.platform,
  ];

  // Simple hash
  const str = components.join("|");
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(36) + Date.now().toString(36).slice(-4);
}

export function useDeviceInfo() {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    userAgent: "",
    isReady: false,
  });

  useEffect(() => {
    async function collectDeviceInfo() {
      try {
        // 1. UserAgent - toujours disponible
        const userAgent = navigator.userAgent;

        // 2. Device Fingerprint - générer ou récupérer du localStorage
        let deviceFingerprint: string | undefined;
        try {
          // Vérifier si on a déjà un fingerprint stocké
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            deviceFingerprint = stored;
          } else {
            // Générer un nouveau fingerprint
            deviceFingerprint = generateSimpleFingerprint();
            localStorage.setItem(STORAGE_KEY, deviceFingerprint);
          }
        } catch (e) {
          // localStorage peut être bloqué en navigation privée
          deviceFingerprint = generateSimpleFingerprint();
        }

        // 3. IP & Country via API externe (avec timeout)
        let ipAddress: string | undefined;
        let ipCountry: string | undefined;

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);

          const ipResponse = await fetch("https://ipapi.co/json/", {
            signal: controller.signal,
            cache: "no-store",
          });

          clearTimeout(timeoutId);

          if (ipResponse.ok) {
            const ipData = await ipResponse.json();
            ipAddress = ipData.ip;
            ipCountry = ipData.country_code;
          }
        } catch (e) {
          // Silently fail - IP tracking is optional
          console.debug("Could not fetch IP info:", e);
        }

        setDeviceInfo({
          userAgent,
          ipAddress,
          ipCountry,
          deviceFingerprint,
          isReady: true,
        });
      } catch (error) {
        console.error("Error collecting device info:", error);
        // Set minimal info even on error
        setDeviceInfo({
          userAgent: navigator.userAgent || "unknown",
          isReady: true,
        });
      }
    }

    collectDeviceInfo();
  }, []);

  // Fonction pour rafraîchir les infos (utile si l'IP change)
  const refresh = useCallback(async () => {
    setDeviceInfo((prev) => ({ ...prev, isReady: false }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const ipResponse = await fetch("https://ipapi.co/json/", {
        signal: controller.signal,
        cache: "no-store",
      });

      clearTimeout(timeoutId);

      if (ipResponse.ok) {
        const ipData = await ipResponse.json();
        setDeviceInfo((prev) => ({
          ...prev,
          ipAddress: ipData.ip,
          ipCountry: ipData.country_code,
          isReady: true,
        }));
      }
    } catch (e) {
      setDeviceInfo((prev) => ({ ...prev, isReady: true }));
    }
  }, []);

  return { deviceInfo, refresh };
}
