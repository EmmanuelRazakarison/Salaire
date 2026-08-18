import { useState, useEffect, useCallback } from "react";

const PIN_ENABLED_KEY = "salaire-mada-pin-enabled";
const PIN_HASH_KEY = "salaire-mada-pin-hash";
const BIOMETRIC_ENABLED_KEY = "salaire-mada-biometric-enabled";

// Simple fast hash for PIN storage
function hashPin(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36) + pin.split("").reverse().join("");
}

export function useSecurityLock() {
  const [isPinEnabled, setIsPinEnabled] = useState<boolean>(() => {
    return localStorage.getItem(PIN_ENABLED_KEY) === "true";
  });

  const [isBiometricEnabled, setIsBiometricEnabled] = useState<boolean>(() => {
    return localStorage.getItem(BIOMETRIC_ENABLED_KEY) === "true";
  });

  const [isLocked, setIsLocked] = useState<boolean>(() => {
    return localStorage.getItem(PIN_ENABLED_KEY) === "true";
  });

  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(false);

  // Check WebAuthn / Biometric availability on mount
  useEffect(() => {
    if (window.PublicKeyCredential && typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === "function") {
      window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
        .then((available) => setBiometricAvailable(available))
        .catch(() => setBiometricAvailable(false));
    }
  }, []);

  const setPin = useCallback((pin: string, enableBiometric = false) => {
    if (pin.length === 4) {
      localStorage.setItem(PIN_ENABLED_KEY, "true");
      localStorage.setItem(PIN_HASH_KEY, hashPin(pin));
      localStorage.setItem(BIOMETRIC_ENABLED_KEY, enableBiometric ? "true" : "false");
      setIsPinEnabled(true);
      setIsBiometricEnabled(enableBiometric);
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const removePin = useCallback(() => {
    localStorage.removeItem(PIN_ENABLED_KEY);
    localStorage.removeItem(PIN_HASH_KEY);
    localStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    setIsPinEnabled(false);
    setIsBiometricEnabled(false);
    setIsLocked(false);
  }, []);

  const verifyPin = useCallback((pin: string): boolean => {
    const stored = localStorage.getItem(PIN_HASH_KEY);
    if (!stored) return false;
    const isValid = hashPin(pin) === stored;
    if (isValid) {
      setIsLocked(false);
    }
    return isValid;
  }, []);

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    if (!isBiometricEnabled) return false;
    try {
      if (window.PublicKeyCredential) {
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(30);
        setIsLocked(false);
        return true;
      }
    } catch {
      // Fallback
    }
    return false;
  }, [isBiometricEnabled]);

  const lockApp = useCallback(() => {
    if (isPinEnabled) {
      setIsLocked(true);
    }
  }, [isPinEnabled]);

  return {
    isPinEnabled,
    isBiometricEnabled,
    isLocked,
    biometricAvailable,
    setPin,
    removePin,
    verifyPin,
    unlockWithBiometric,
    lockApp,
  };
}
