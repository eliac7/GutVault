"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Fingerprint, Delete, Lock, AlertCircle } from "lucide-react";
import { useLock } from "@/shared/providers/lock-provider";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";

const KEYPAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"];

export function LockScreen() {
  const {
    isLocked,
    authMethod,
    hasPin,
    hasBiometric,
    biometricAvailable,
    authenticateWithPin,
    authenticateWithBiometric,
  } = useLock();

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [shake, setShake] = useState(false);

  const handleKeyPress = useCallback(
    async (key: string) => {
      if (key === "") return;

      if (key === "⌫") {
        setPin((prev) => prev.slice(0, -1));
        setError(null);
        return;
      }

      const newPin = pin + key;
      setPin(newPin);
      setError(null);

      // Auto-submit when 4 digits entered
      if (newPin.length === 4) {
        setIsAuthenticating(true);
        const success = await authenticateWithPin(newPin);
        setIsAuthenticating(false);

        if (!success) {
          setError("Incorrect PIN");
          setShake(true);
          setTimeout(() => {
            setPin("");
            setShake(false);
          }, 500);
        }
      }
    },
    [pin, authenticateWithPin]
  );

  const handleBiometric = useCallback(async () => {
    setIsAuthenticating(true);
    setError(null);

    const success = await authenticateWithBiometric();

    if (!success) {
      setError("Biometric authentication failed");
    }
    setIsAuthenticating(false);
  }, [authenticateWithBiometric]);

  const canUseBiometric = biometricAvailable && hasBiometric;
  const canUsePin = hasPin;

  if (!isLocked) return null;

  if (!canUsePin && !canUseBiometric) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <Lock className="w-16 h-16 text-slate-400 mx-auto" />
          <p className="text-slate-300">
            App lock is enabled but no authentication method is configured.
          </p>
          <p className="text-slate-500 text-sm">
            Please clear app data and reconfigure.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-linear-to-b from-slate-900 via-slate-950 to-slate-900 flex flex-col items-center justify-center p-6"
      >
        {/* Logo and title */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 text-center"
        >
          <div className="w-16 h-16 bg-linear-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/20">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-xl font-semibold text-white">GutVault Locked</h1>
          <p className="text-slate-400 text-sm mt-1">
            {authMethod === "biometric" && canUseBiometric
              ? "Use biometric or enter PIN"
              : "Enter your PIN to unlock"}
          </p>
        </motion.div>

        {/* PIN dots */}
        {canUsePin && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              x: shake ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 mb-8"
          >
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`pin-dot-${i}`}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  pin.length > i
                    ? "bg-emerald-400 shadow-lg shadow-emerald-400/50"
                    : "bg-slate-700"
                }`}
              />
            ))}
          </motion.div>
        )}

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-400 text-sm mb-4"
            >
              <AlertCircle className="w-4 h-4" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Keypad */}
        {canUsePin && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-4 max-w-xs w-full"
          >
            {KEYPAD_KEYS.map((key, index) => {
              if (key === "") return <div key={`keypad-${index}`} />;

              return (
                <motion.button
                  key={`keypad-${index}`}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleKeyPress(key)}
                  disabled={isAuthenticating}
                  className={`h-16 rounded-2xl font-semibold text-xl transition-colors duration-150 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    key === "⌫"
                      ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                      : "bg-slate-800/50 text-white hover:bg-slate-700/50"
                  }`}
                >
                  {key === "⌫" ? <Delete className="w-6 h-6" /> : key}
                </motion.button>
              );
            })}
          </motion.div>
        )}

        {/* Biometric button */}
        {canUseBiometric && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleBiometric}
              disabled={isAuthenticating}
              className="gap-2 bg-slate-800/50 border-slate-700 text-white hover:bg-slate-700/50 hover:text-white rounded-2xl px-6"
            >
              <Fingerprint className="w-5 h-5" />
              Use Biometric
            </Button>
          </motion.div>
        )}

        {/* Loading indicator */}
        {isAuthenticating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-950/50 flex items-center justify-center"
          >
            <Spinner
              size="lg"
              color="border-emerald-400 border-t-transparent"
            />
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
