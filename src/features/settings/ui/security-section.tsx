"use client";

import {
  clearBiometricRegistration,
  hashPin,
  registerBiometric,
} from "@/shared/lib/auth";
import { useLock, type AuthMethod } from "@/shared/providers/lock-provider";
import { Button } from "@/shared/ui/button";
import { Card } from "@/shared/ui/card";
import { PinDots } from "@/shared/ui/pin-dots";
import { PinKeypad } from "@/shared/ui/pin-keypad";
import { PinModal } from "@/shared/ui/pin-modal";
import { Spinner } from "@/shared/ui/spinner";
import {
  AlertCircle,
  Check,
  Database,
  Fingerprint,
  KeyRound,
  Lock,
  Server,
  Shield,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PrivacyCard } from "./security-privacy-card";

export function SecuritySection() {
  const t = useTranslations("settings.security");
  const tCommon = useTranslations("common");
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
        toast.success(t("appLockEnabled"));
      }
    }
  }, [lockEnabled, hasPin, hasBiometric, setLockEnabled, t]);

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
        setPinError(t("pinMustBeFourDigits"));
        return;
      }
      setPinStep("confirm");
    } else {
      if (confirmPin !== pin) {
        setPinError(t("pinsDoNotMatch"));
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
        toast.success(t("pinSetSuccessfully"));
      } catch (error) {
        console.error("PIN setup error:", error);
        toast.error(t("failedToSetPin"));
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
    t,
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
      setDisableError(t("enterYourFourDigitPin"));
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
      toast.success(t("appLockDisabled"));
    } else {
      setDisableError(t("incorrectPin"));
      setDisablePin("");
    }
  }, [disablePin, authenticateWithPin, clearAllCredentials, setLockEnabled, t]);

  const handleDisableWithBiometric = useCallback(async () => {
    setIsVerifying(true);
    setDisableError(null);

    const success = await authenticateWithBiometric();
    setIsVerifying(false);

    if (success) {
      await clearAllCredentials();
      await setLockEnabled(false);
      setShowDisableVerification(false);
      toast.success(t("appLockDisabled"));
    } else {
      setDisableError(t("biometricVerificationFailed"));
    }
  }, [authenticateWithBiometric, clearAllCredentials, setLockEnabled, t]);

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
        toast.success(t("biometricEnabled"));
      } else {
        toast.error(t("biometricSetupFailed"));
      }
    } catch (error) {
      console.error("Biometric setup error:", error);
      toast.error(t("biometricSetupError"));
    }
    setIsSettingUp(false);
  }, [lockEnabled, setLockEnabled, setAuthMethod, setBiometricRegistered, t]);

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
      setRemoveError(t("enterYourFourDigitPin"));
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
        toast.success(t("biometricRemoved"));
      } else if (removeTarget === "pin") {
        await clearPin();
        if (authMethod === "pin") {
          if (hasBiometric) {
            await setAuthMethod("biometric");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success(t("pinRemoved"));
      }
      setShowRemoveVerification(false);
      setRemovePin("");
      setRemoveTarget(null);
    } else {
      setRemoveError(t("incorrectPin"));
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
    t,
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
        toast.success(t("biometricRemoved"));
      } else if (removeTarget === "pin") {
        await clearPin();
        if (authMethod === "pin") {
          if (hasBiometric) {
            await setAuthMethod("biometric");
          } else {
            await setLockEnabled(false);
          }
        }
        toast.success(t("pinRemoved"));
      }
      setShowRemoveVerification(false);
      setRemovePin("");
      setRemoveTarget(null);
    } else {
      setRemoveError(t("biometricVerificationFailed"));
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
    t,
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
        t("defaultAuthMethodSet", {
          method: method === "biometric" ? t("biometric") : t("pin"),
        })
      );
    },
    [setAuthMethod, t]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6 bg-white dark:bg-slate-900/80 rounded-3xl border-slate-200/50 dark:border-teal-500/30 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500 dark:text-amber-400" />
          {t("title")}
        </h2>

        <div className="space-y-4">
          {/* App Lock Toggle */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {t("pinLock")}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {t("pinLockDescription")}
                  </div>
                </div>
              </div>
              <button
                onClick={handleToggleLock}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                  lockEnabled
                    ? "bg-teal-500 dark:bg-teal-500"
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
                          {t("pinCode")}
                        </div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">
                          {hasPin ? t("pinIsSet") : t("pinNotConfigured")}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {hasPin && authMethod === "pin" && (
                        <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                          {t("active")}
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
                            {t("change")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRequestRemovePin}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            {t("remove")}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPinSetup(true)}
                          className="rounded-xl"
                        >
                          {t("setPin")}
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
                            {t("biometric")}
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {hasBiometric
                              ? t("biometricConfigured")
                              : t("biometricNotSetUp")}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {hasBiometric && authMethod === "biometric" && (
                          <span className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-1 rounded-full">
                            {t("biometricActive")}
                          </span>
                        )}
                        {hasBiometric ? (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRequestRemoveBiometric}
                            className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                          >
                            {t("remove")}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSetupBiometric}
                            disabled={isSettingUp}
                            className="rounded-xl"
                          >
                            {t("setUp")}
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
                      {t("defaultAuthMethod")}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSelectAuthMethod("pin")}
                        className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          authMethod === "pin"
                            ? "bg-teal-500 dark:bg-teal-500 text-white dark:text-slate-900"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        <KeyRound className="w-4 h-4" />
                        {t("pin")}
                      </button>
                      <button
                        onClick={() => handleSelectAuthMethod("biometric")}
                        className={`p-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                          authMethod === "biometric"
                            ? "bg-teal-500 dark:bg-teal-500 text-white dark:text-slate-900"
                            : "bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600"
                        }`}
                      >
                        <Fingerprint className="w-4 h-4" />
                        {t("biometric")}
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
            title={pinStep === "enter" ? t("setYourPin") : t("confirmPin")}
            subtitle={
              pinStep === "enter" ? t("enterFourDigitPin") : t("enterPinAgain")
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
                {tCommon("cancel")}
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
                  t("next")
                ) : (
                  <>
                    <Check className="w-4 h-4 mr-1" />
                    {tCommon("confirm")}
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
            title={t("disableAppLock")}
            subtitle={t("verifyToDisableLock")}
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
                  {t("useBiometric")}
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelDisable}
                className="flex-1 rounded-xl"
              >
                {tCommon("cancel")}
              </Button>
              {hasPin && (
                <Button
                  onClick={handleDisableWithPin}
                  disabled={isVerifying || disablePin.length !== 4}
                  className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                >
                  {isVerifying ? <Spinner size="md" /> : t("disableLock")}
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
            title={
              removeTarget === "pin"
                ? t("removePinTitle")
                : t("removeBiometricTitle")
            }
            subtitle={t("verifyToRemoveCredential")}
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
                  {t("useBiometric")}
                </Button>
              </div>
            )}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleCancelRemove}
                className="flex-1 rounded-xl"
              >
                {tCommon("cancel")}
              </Button>
              {hasPin && (
                <Button
                  onClick={handleRemoveWithPin}
                  disabled={isRemoving || removePin.length !== 4}
                  className="flex-1 rounded-xl bg-orange-500 hover:bg-orange-600 text-white"
                >
                  {isRemoving ? <Spinner size="md" /> : t("removeCredential")}
                </Button>
              )}
            </div>
          </PinModal>

          {/* Info sections */}
          <div className="space-y-3 pt-2">
            <div className="grid gap-3">
              <PrivacyCard
                icon={<Database className="h-4 w-4" />}
                title={t("localStorageTitle")}
                description={t("localStorageDescription")}
              />
              <PrivacyCard
                icon={<Server className="h-4 w-4" />}
                title={t("aiProcessingTitle")}
                description={t("aiProcessingDescription")}
              />
            </div>

            {/* Warning */}
            <div className="flex gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-400">
                  {t("backupDataTitle")}
                </p>
                <p className="text-xs text-amber-400/70 mt-1 leading-relaxed">
                  {t("backupDataDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
