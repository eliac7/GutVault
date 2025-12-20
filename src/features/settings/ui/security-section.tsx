"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Shield,
  AlertTriangle,
  Lock,
  Fingerprint,
  KeyRound,
  Check,
} from "lucide-react";
import { Card } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { PinDots } from "@/shared/ui/pin-dots";
import { PinKeypad } from "@/shared/ui/pin-keypad";
import { PinModal } from "@/shared/ui/pin-modal";
import { Spinner } from "@/shared/ui/spinner";
import { useLock, type AuthMethod } from "@/shared/providers/lock-provider";
import {
  hashPin,
  registerBiometric,
  clearBiometricRegistration,
} from "@/shared/lib/auth";
import { toast } from "sonner";

export function SecuritySection() {
  const {
    lockEnabled,
    authMethod,
    hasPin,
    hasBiometric,
    biometricAvailable,
    setLockEnabled,
    setAuthMethod,
    setPinHash,
    clearPin,
    setBiometricRegistered,
    authenticateWithPin,
    authenticateWithBiometric,
    clearAllCredentials,
  } = useLock();

  // PIN setup state
  const [showPinSetup, setShowPinSetup] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [pinStep, setPinStep] = useState<"enter" | "confirm">("enter");
  const [pinError, setPinError] = useState<string | null>(null);
  const [isSettingUp, setIsSettingUp] = useState(false);

  // Disable verification state
  const [showDisableVerification, setShowDisableVerification] = useState(false);
  const [disablePin, setDisablePin] = useState("");
  const [disableError, setDisableError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Remove credential verification state
  const [showRemoveVerification, setShowRemoveVerification] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<"pin" | "biometric" | null>(
    null
  );
  const [removePin, setRemovePin] = useState("");
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Common PIN key handler
  const handlePinKey = useCallback(
    (
      key: string,
      currentValue: string,
      setValue: React.Dispatch<React.SetStateAction<string>>,
      setError: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
      if (key === "⌫") {
        setValue((prev) => prev.slice(0, -1));
      } else if (currentValue.length < 4) {
        setValue((prev) => prev + key);
      }
      setError(null);
    },
    []
  );

  const handleToggleLock = useCallback(async () => {
    if (lockEnabled) {
      setShowDisableVerification(true);
      setDisablePin("");
      setDisableError(null);
    } else {
      if (!hasPin && !hasBiometric) {
        setShowPinSetup(true);
        setPinStep("enter");
        setPin("");
        setConfirmPin("");
        setPinError(null);
      } else {
        await setLockEnabled(true);
        toast.success("App lock enabled");
      }
    }
  }, [lockEnabled, hasPin, hasBiometric, setLockEnabled]);

  // PIN setup handlers
  const handlePinKeyPress = useCallback(
    (key: string) => {
      if (pinStep === "enter") {
        handlePinKey(key, pin, setPin, setPinError);
      } else {
        handlePinKey(key, confirmPin, setConfirmPin, setPinError);
      }
    },
    [pinStep, pin, confirmPin, handlePinKey]
  );

  const handlePinSubmit = useCallback(async () => {
    if (pinStep === "enter") {
      if (pin.length !== 4) {
        setPinError("PIN must be 4 digits");
        return;
      }
      setPinStep("confirm");
    } else {
      if (confirmPin !== pin) {
        setPinError("PINs do not match");
        setConfirmPin("");
        return;
      }

      setIsSettingUp(true);
      try {
        const hash = await hashPin(pin);
        await setPinHash(hash);
        await setAuthMethod("pin");
        if (!lockEnabled) {
          await setLockEnabled(true);
        }
        setShowPinSetup(false);
        setPin("");
        setConfirmPin("");
        setPinStep("enter");
        toast.success("PIN set successfully");
      } catch (error) {
        console.error("PIN setup error:", error);
        toast.error("Failed to set PIN");
      }
      setIsSettingUp(false);
    }
  }, [
    pinStep,
    pin,
    confirmPin,
    lockEnabled,
    setPinHash,
    setAuthMethod,
    setLockEnabled,
  ]);

  const handleCancelPinSetup = useCallback(() => {
    setShowPinSetup(false);
    setPin("");
    setConfirmPin("");
    setPinStep("enter");
    setPinError(null);
  }, []);

  // Disable verification handlers
  const handleDisablePinKeyPress = useCallback(
    (key: string) => {
      handlePinKey(key, disablePin, setDisablePin, setDisableError);
    },
    [disablePin, handlePinKey]
  );

  const handleDisableWithPin = useCallback(async () => {
    if (disablePin.length !== 4) {
      setDisableError("Enter your 4-digit PIN");
      return;
    }

    setIsVerifying(true);
    const success = await authenticateWithPin(disablePin);
    setIsVerifying(false);

    if (success) {
      await clearAllCredentials();
      await setLockEnabled(false);
      setShowDisableVerification(false);
      setDisablePin("");
      toast.success("App lock disabled and credentials cleared");
    } else {
      setDisableError("Incorrect PIN");
      setDisablePin("");
    }
  }, [disablePin, authenticateWithPin, clearAllCredentials, setLockEnabled]);

  const handleDisableWithBiometric = useCallback(async () => {
    setIsVerifying(true);
    setDisableError(null);

    const success = await authenticateWithBiometric();
    setIsVerifying(false);

    if (success) {
      await clearAllCredentials();
      await setLockEnabled(false);
      setShowDisableVerification(false);
      toast.success("App lock disabled and credentials cleared");
    } else {
      setDisableError("Biometric verification failed");
    }
  }, [authenticateWithBiometric, clearAllCredentials, setLockEnabled]);

  const handleCancelDisable = useCallback(() => {
    setShowDisableVerification(false);
    setDisablePin("");
    setDisableError(null);
  }, []);

  // Biometric handlers
  const handleSetupBiometric = useCallback(async () => {
    setIsSettingUp(true);
    try {
      const success = await registerBiometric();
      if (success) {
        await setBiometricRegistered(true);
        await setAuthMethod("biometric");
        if (!lockEnabled) {
          await setLockEnabled(true);
        }
        toast.success("Biometric authentication enabled");
      } else {
        toast.error("Failed to set up biometric authentication");
      }
    } catch (error) {
      console.error("Biometric setup error:", error);
      toast.error("Biometric setup failed");
    }
    setIsSettingUp(false);
  }, [lockEnabled, setLockEnabled, setAuthMethod, setBiometricRegistered]);

  // Request verification before removing biometric
  const handleRequestRemoveBiometric = useCallback(() => {
    setRemoveTarget("biometric");
    setShowRemoveVerification(true);
    setRemovePin("");
    setRemoveError(null);
  }, []);

  // Request verification before removing PIN
  const handleRequestRemovePin = useCallback(() => {
    setRemoveTarget("pin");
    setShowRemoveVerification(true);
    setRemovePin("");
    setRemoveError(null);
  }, []);

  // Remove credential verification handlers
  const handleRemovePinKeyPress = useCallback(
    (key: string) => {
      handlePinKey(key, removePin, setRemovePin, setRemoveError);
    },
    [removePin, handlePinKey]
  );

  const handleRemoveWithPin = useCallback(async () => {
    if (removePin.length !== 4) {
      setRemoveError("Enter your 4-digit PIN");
      return;
    }

    setIsRemoving(true);
    const success = await authenticateWithPin(removePin);
    setIsRemoving(false);

    if (success) {
      if (removeTarget === "biometric") {
        clearBiometricRegistration();
        await setBiometricRegistered(false);
        if (authMethod === "biometric") {
          if (hasPin) {
            await setAuthMethod("pin");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success("Biometric authentication removed");
      } else if (removeTarget === "pin") {
        await clearPin();
        if (authMethod === "pin") {
          if (hasBiometric) {
            await setAuthMethod("biometric");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success("PIN removed");
      }
      setShowRemoveVerification(false);
      setRemovePin("");
      setRemoveTarget(null);
    } else {
      setRemoveError("Incorrect PIN");
      setRemovePin("");
    }
  }, [
    removePin,
    removeTarget,
    authenticateWithPin,
    authMethod,
    hasPin,
    hasBiometric,
    clearPin,
    setAuthMethod,
    setLockEnabled,
    setBiometricRegistered,
  ]);

  const handleRemoveWithBiometric = useCallback(async () => {
    setIsRemoving(true);
    setRemoveError(null);

    const success = await authenticateWithBiometric();
    setIsRemoving(false);

    if (success) {
      if (removeTarget === "biometric") {
        clearBiometricRegistration();
        await setBiometricRegistered(false);
        if (authMethod === "biometric") {
          if (hasPin) {
            await setAuthMethod("pin");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success("Biometric authentication removed");
      } else if (removeTarget === "pin") {
        await clearPin();
        if (authMethod === "pin") {
          if (hasBiometric) {
            await setAuthMethod("biometric");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success("PIN removed");
      }
      setShowRemoveVerification(false);
      setRemovePin("");
      setRemoveTarget(null);
    } else {
      setRemoveError("Biometric verification failed");
    }
  }, [
    removeTarget,
    authenticateWithBiometric,
    authMethod,
    hasPin,
    hasBiometric,
    clearPin,
    setAuthMethod,
    setLockEnabled,
    setBiometricRegistered,
  ]);

  const handleCancelRemove = useCallback(() => {
    setShowRemoveVerification(false);
    setRemovePin("");
    setRemoveError(null);
    setRemoveTarget(null);
  }, []);

  const handleSelectAuthMethod = useCallback(
    async (method: AuthMethod) => {
      await setAuthMethod(method);
      toast.success(
        `Default authentication method set to ${
          method === "biometric" ? "Biometric" : "PIN"
        }`
      );
    },
    [setAuthMethod]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900 rounded-3xl border-slate-200/50 dark:border-slate-800/50 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          {/* App Lock Toggle */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    App Lock
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Require authentication to access
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleLock}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  lockEnabled
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                <span
                  className={`${
                    lockEnabled ? "translate-x-6" : "translate-x-1"
                  } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </button>
            </div>
          </div>

          {/* Authentication Methods */}
          <AnimatePresence>
            {lockEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                {/* PIN Setup */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <KeyRound className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900 dark:text-slate-100">
                          PIN Code
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {hasPin ? "PIN is set" : "Not configured"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPin && authMethod === "pin" && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                          Active
                        </span>
                      )}
                      {hasPin ? (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setShowPinSetup(true);
                              setPinStep("enter");
                            }}
                            className="text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          >
                            Change
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRequestRemovePin}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPinSetup(true)}
                          className="rounded-xl"
                        >
                          Set PIN
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Biometric Setup */}
                {biometricAvailable && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                          <Fingerprint className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <div className="font-medium text-slate-900 dark:text-slate-100">
                            Biometric
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {hasBiometric ? "Configured" : "Not set up"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasBiometric && authMethod === "biometric" && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                            Active
                          </span>
                        )}
                        {hasBiometric ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRequestRemoveBiometric}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSetupBiometric}
                            disabled={isSettingUp}
                            className="rounded-xl"
                          >
                            Set Up
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Default Auth Method Selection */}
                {hasPin && hasBiometric && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Default Authentication Method
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelectAuthMethod("pin")}
                        className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          authMethod === "pin"
                            ? "bg-emerald-500 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        <KeyRound className="w-4 h-4" />
                        PIN
                      </button>
                      <button
                        onClick={() => handleSelectAuthMethod("biometric")}
                        className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          authMethod === "biometric"
                            ? "bg-emerald-500 text-white"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        <Fingerprint className="w-4 h-4" />
                        Biometric
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* PIN Setup Modal */}
          <PinModal
            show={showPinSetup}
            onClose={handleCancelPinSetup}
            icon={KeyRound}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            title={pinStep === "enter" ? "Set Your PIN" : "Confirm PIN"}
            subtitle={
              pinStep === "enter"
                ? "Enter a 4-digit PIN"
                : "Enter the PIN again to confirm"
            }
          >
            <PinDots
              length={pinStep === "enter" ? pin.length : confirmPin.length}
              activeColor="bg-blue-500"
              className="mb-6"
            />
            {pinError && (
              <div className="text-center text-red-500 text-sm mb-4">
                {pinError}
              </div>
            )}
            <PinKeypad
              onKeyPress={handlePinKeyPress}
              disabled={isSettingUp}
              className="mb-6"
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelPinSetup}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handlePinSubmit}
                disabled={
                  isSettingUp ||
                  (pinStep === "enter" && pin.length !== 4) ||
                  (pinStep === "confirm" && confirmPin.length !== 4)
                }
                className="flex-1 rounded-xl bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isSettingUp ? (
                  <Spinner size="md" />
                ) : pinStep === "enter" ? (
                  "Next"
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    Confirm
                  </>
                )}
              </Button>
            </div>
          </PinModal>

          {/* Disable Verification Modal */}
          <PinModal
            show={showDisableVerification}
            onClose={handleCancelDisable}
            icon={Lock}
            iconBg="bg-red-100 dark:bg-red-900/30"
            iconColor="text-red-600 dark:text-red-400"
            title="Disable App Lock"
            subtitle="Verify your identity to disable lock"
          >
            {hasPin && (
              <>
                <PinDots
                  length={disablePin.length}
                  activeColor="bg-red-500"
                  className="mb-6"
                />
                <PinKeypad
                  onKeyPress={handleDisablePinKeyPress}
                  disabled={isVerifying}
                  className="mb-6"
                />
              </>
            )}
            {disableError && (
              <div className="text-center text-red-500 text-sm mb-4">
                {disableError}
              </div>
            )}
            {hasBiometric && biometricAvailable && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleDisableWithBiometric}
                  disabled={isVerifying}
                  className="w-full gap-2 rounded-xl"
                >
                  <Fingerprint className="w-5 h-5" />
                  Use Biometric
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelDisable}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              {hasPin && (
                <Button
                  onClick={handleDisableWithPin}
                  disabled={isVerifying || disablePin.length !== 4}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  {isVerifying ? <Spinner size="md" /> : "Disable Lock"}
                </Button>
              )}
            </div>
          </PinModal>

          {/* Remove Credential Verification Modal */}
          <PinModal
            show={showRemoveVerification}
            onClose={handleCancelRemove}
            icon={removeTarget === "pin" ? KeyRound : Fingerprint}
            iconBg="bg-orange-100 dark:bg-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
            title={removeTarget === "pin" ? "Remove PIN" : "Remove Biometric"}
            subtitle="Verify your identity to remove this credential"
          >
            {hasPin && (
              <>
                <PinDots
                  length={removePin.length}
                  activeColor="bg-orange-500"
                  className="mb-6"
                />
                <PinKeypad
                  onKeyPress={handleRemovePinKeyPress}
                  disabled={isRemoving}
                  className="mb-6"
                />
              </>
            )}
            {removeError && (
              <div className="text-center text-red-500 text-sm mb-4">
                {removeError}
              </div>
            )}
            {hasBiometric && biometricAvailable && (
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={handleRemoveWithBiometric}
                  disabled={isRemoving}
                  className="w-full gap-2 rounded-xl"
                >
                  <Fingerprint className="w-5 h-5" />
                  Use Biometric
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelRemove}
                className="flex-1 rounded-xl"
              >
                Cancel
              </Button>
              {hasPin && (
                <Button
                  onClick={handleRemoveWithPin}
                  disabled={isRemoving || removePin.length !== 4}
                  className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isRemoving ? <Spinner size="md" /> : "Remove"}
                </Button>
              )}
            </div>
          </PinModal>

          {/* Info sections */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl">
            <p className="text-sm text-emerald-800 dark:text-emerald-300">
              <strong>🔒 100% Local Storage</strong>
              <br />
              All your health data is stored locally on your device using
              IndexedDB. We never send your logs to any server.
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>🤖 AI Processing</strong>
              <br />
              Voice transcripts are sent to OpenRouter AI models only for
              parsing, then immediately discarded. Your raw audio never leaves
              your device.
            </p>
          </div>

          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-2xl">
            <p className="text-sm text-amber-800 dark:text-amber-300 flex gap-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>
                <strong>Backup Your Data</strong>
                <br />
                Since everything is local, clearing browser data will delete
                your logs. Export regularly!
              </span>
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
