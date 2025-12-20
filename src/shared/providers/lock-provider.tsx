"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/shared/db";
import {
  verifyPin,
  authenticateBiometric,
  isBiometricRegistered,
  isPlatformAuthenticatorAvailable,
  clearBiometricRegistration,
} from "@/shared/lib/auth";

export type AuthMethod = "biometric" | "pin";

interface LockContextValue {
  isLocked: boolean;
  lockEnabled: boolean;
  authMethod: AuthMethod | null;
  hasPin: boolean;
  hasBiometric: boolean;
  biometricAvailable: boolean;

  unlock: () => void;
  lock: () => void;
  authenticateWithPin: (pin: string) => Promise<boolean>;
  authenticateWithBiometric: () => Promise<boolean>;
  setLockEnabled: (enabled: boolean) => Promise<void>;
  setAuthMethod: (method: AuthMethod) => Promise<void>;
  setPinHash: (hash: string) => Promise<void>;
  clearPin: () => Promise<void>;
  setBiometricRegistered: (registered: boolean) => Promise<void>;
  clearAllCredentials: () => Promise<void>;
}

const LockContext = createContext<LockContextValue | null>(null);

export function useLock() {
  const context = useContext(LockContext);
  if (!context) {
    throw new Error("useLock must be used within a LockProvider");
  }
  return context;
}

interface LockProviderProps {
  children: ReactNode;
}

export function LockProvider({ children }: LockProviderProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [biometricAvailable, setBiometricAvailable] = useState(false);

  const settings = useLiveQuery(() => db.settings.toArray(), [], []);

  const lockEnabled = useMemo(() => {
    const setting = settings?.find((s) => s.id === "appLockEnabled");
    return (setting?.value as boolean) ?? false;
  }, [settings]);

  const authMethod = useMemo(() => {
    const setting = settings?.find((s) => s.id === "appLockAuthMethod");
    return (setting?.value as AuthMethod) ?? null;
  }, [settings]);

  const pinHash = useMemo(() => {
    const setting = settings?.find((s) => s.id === "appLockPinHash");
    return (setting?.value as string) ?? null;
  }, [settings]);

  const hasPin = !!pinHash;
  const hasBiometric = isBiometricRegistered();

  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setBiometricAvailable);
  }, []);

  // Reset
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsLocked(Boolean(lockEnabled));
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [lockEnabled]);

  const unlock = useCallback(() => {
    setIsLocked(false);
  }, []);

  const lock = useCallback(() => {
    if (lockEnabled) {
      setIsLocked(true);
    }
  }, [lockEnabled]);

  const authenticateWithPin = useCallback(
    async (pin: string): Promise<boolean> => {
      if (!pinHash) return false;

      const isValid = await verifyPin(pin, pinHash);
      if (isValid) {
        setIsLocked(false);
      }
      return isValid;
    },
    [pinHash]
  );

  const authenticateWithBiometric = useCallback(async (): Promise<boolean> => {
    const success = await authenticateBiometric();
    if (success) {
      setIsLocked(false);
    }
    return success;
  }, []);

  const setLockEnabled = useCallback(async (enabled: boolean) => {
    await db.settings.put({ id: "appLockEnabled", value: enabled });
    if (!enabled) {
      setIsLocked(false);
    }
  }, []);

  const setAuthMethod = useCallback(async (method: AuthMethod) => {
    await db.settings.put({ id: "appLockAuthMethod", value: method });
  }, []);

  const setPinHash = useCallback(async (hash: string) => {
    await db.settings.put({ id: "appLockPinHash", value: hash });
  }, []);

  const clearPin = useCallback(async () => {
    await db.settings.delete("appLockPinHash");
  }, []);

  const setBiometricRegistered = useCallback(async (registered: boolean) => {
    await db.settings.put({
      id: "appLockBiometricRegistered",
      value: registered,
    });
  }, []);

  const clearAllCredentials = useCallback(async () => {
    // Clear PIN hash from database
    await db.settings.delete("appLockPinHash");
    // Clear auth method preference
    await db.settings.delete("appLockAuthMethod");
    // Clear biometric registered flag
    await db.settings.delete("appLockBiometricRegistered");
    // Clear biometric credential from localStorage
    clearBiometricRegistration();
  }, []);

  const value = useMemo(
    () => ({
      isLocked: lockEnabled && isLocked,
      lockEnabled,
      authMethod,
      hasPin,
      hasBiometric,
      biometricAvailable,
      unlock,
      lock,
      authenticateWithPin,
      authenticateWithBiometric,
      setLockEnabled,
      setAuthMethod,
      setPinHash,
      clearPin,
      setBiometricRegistered,
      clearAllCredentials,
    }),
    [
      isLocked,
      lockEnabled,
      authMethod,
      hasPin,
      hasBiometric,
      biometricAvailable,
      unlock,
      lock,
      authenticateWithPin,
      authenticateWithBiometric,
      setLockEnabled,
      setAuthMethod,
      setPinHash,
      clearPin,
      setBiometricRegistered,
      clearAllCredentials,
    ]
  );

  return <LockContext.Provider value={value}>{children}</LockContext.Provider>;
}
