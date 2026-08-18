import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Fingerprint, Delete, X, Lock, KeyRound } from "lucide-react";
import { Button } from "./ui/button";
import { useMobileHardwareBack } from "../hooks/useMobileHardwareBack";

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPinEnabled: boolean;
  isBiometricEnabled: boolean;
  biometricAvailable: boolean;
  onSavePin: (pin: string, enableBiometric: boolean) => void;
  onRemovePin: () => void;
}

export function SecurityModal({
  isOpen,
  onClose,
  isPinEnabled,
  isBiometricEnabled,
  biometricAvailable,
  onSavePin,
  onRemovePin,
}: SecurityModalProps) {
  useMobileHardwareBack(isOpen, onClose, "security_settings");

  const [step, setStep] = useState<"menu" | "enter_pin" | "confirm_pin">("menu");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [enableBio, setEnableBio] = useState(isBiometricEnabled);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (isOpen) {
      setStep("menu");
      setPin("");
      setConfirmPin("");
      setErrorMsg("");
      setEnableBio(isBiometricEnabled);
    }
  }, [isOpen, isBiometricEnabled]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setErrorMsg("");

    if (step === "enter_pin") {
      if (pin.length < 4) {
        const next = pin + num;
        setPin(next);
        if (next.length === 4) {
          setTimeout(() => setStep("confirm_pin"), 200);
        }
      }
    } else if (step === "confirm_pin") {
      if (confirmPin.length < 4) {
        const next = confirmPin + num;
        setConfirmPin(next);
        if (next.length === 4) {
          if (next === pin) {
            onSavePin(pin, enableBio);
            onClose();
          } else {
            if (navigator.vibrate) navigator.vibrate([40, 40, 40]);
            setErrorMsg("Les codes PIN ne correspondent pas");
            setConfirmPin("");
          }
        }
      }
    }
  };

  const handleDelete = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    if (step === "enter_pin") {
      setPin((prev) => prev.slice(0, -1));
    } else if (step === "confirm_pin") {
      setConfirmPin((prev) => prev.slice(0, -1));
    }
  };

  const currentPinLength = step === "enter_pin" ? pin.length : confirmPin.length;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-sm bg-[#FFFFFF] dark:bg-[#18202A] rounded-lg border border-[#E2DDD5] dark:border-[#24303E] p-5 space-y-4 text-[#24221F] dark:text-[#EAE7E1]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#E2DDD5] dark:border-[#24303E] pb-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
              <h3 className="font-serif text-base font-bold">Sécurité & Confidentialité</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-[#666159] dark:text-[#9E9A90] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {step === "menu" ? (
            <div className="space-y-4 text-xs font-mono">
              <p className="text-[#666159] dark:text-[#9E9A90] font-sans leading-relaxed">
                Protégez vos simulations salariales et l'historique des bulletins par un code PIN à 4 chiffres et le déverrouillage biométrique (empreinte / visage).
              </p>

              <div className="p-3 rounded-sm bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] flex items-center justify-between">
                <div>
                  <div className="font-bold">Verrouillage de l'application</div>
                  <div className="text-[11px] text-[#666159] dark:text-[#9E9A90]">
                    {isPinEnabled ? "Actif (Code PIN configuré)" : "Désactivé"}
                  </div>
                </div>
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    isPinEnabled ? "bg-[#3F7D5C] dark:bg-[#4E9B73]" : "bg-[#9E978C]"
                  }`}
                />
              </div>

              {biometricAvailable && (
                <label className="flex items-center justify-between p-2.5 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] cursor-pointer">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
                    <span>Déverrouillage biométrique</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableBio}
                    onChange={(e) => setEnableBio(e.target.checked)}
                    className="accent-[#3F7D5C] h-4 w-4 rounded-sm"
                  />
                </label>
              )}

              <div className="space-y-2 pt-2">
                <Button
                  onClick={() => setStep("enter_pin")}
                  className="w-full text-xs font-mono gap-1.5"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  {isPinEnabled ? "Modifier le code PIN" : "Activer le code PIN"}
                </Button>

                {isPinEnabled && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      onRemovePin();
                      onClose();
                    }}
                    className="w-full text-xs font-mono text-[#A3483C] dark:text-[#D96859]"
                  >
                    Désactiver le verrouillage
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <div className="space-y-1">
                <div className="font-serif text-sm font-bold">
                  {step === "enter_pin" ? "Définir un code PIN (4 chiffres)" : "Confirmez votre code PIN"}
                </div>
                <div className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                  {step === "enter_pin" ? "Entrez votre nouveau code de sécurité" : "Retapez les 4 chiffres pour valider"}
                </div>
              </div>

              {/* Dots */}
              <div className="flex justify-center items-center gap-3 py-2">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`h-3.5 w-3.5 rounded-full border border-[#E2DDD5] dark:border-[#24303E] transition-all duration-150 ${
                      idx < currentPinLength
                        ? "bg-[#3F7D5C] dark:bg-[#4E9B73] scale-110"
                        : "bg-[#FAF8F5] dark:bg-[#141C25]"
                    }`}
                  />
                ))}
              </div>

              {errorMsg && (
                <div className="text-[11px] font-mono text-[#A3483C] dark:text-[#D96859]">
                  {errorMsg}
                </div>
              )}

              {/* Keypad */}
              <div className="grid grid-cols-3 gap-2 max-w-[240px] mx-auto pt-2">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => handleKeyPress(num)}
                    className="h-11 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FAF8F5] dark:bg-[#141C25] hover:bg-[#EAE5DC] dark:hover:bg-[#1C2530] text-sm font-mono font-bold transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setStep("menu")}
                  className="h-11 rounded-sm text-[11px] font-mono text-[#666159] dark:text-[#9E9A90] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] flex items-center justify-center cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleKeyPress("0")}
                  className="h-11 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FAF8F5] dark:bg-[#141C25] hover:bg-[#EAE5DC] dark:hover:bg-[#1C2530] text-sm font-mono font-bold transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  0
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="h-11 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FAF8F5] dark:bg-[#141C25] hover:bg-[#EAE5DC] dark:hover:bg-[#1C2530] text-[#666159] dark:text-[#9E9A90] transition-colors cursor-pointer active:scale-95 flex items-center justify-center"
                >
                  <Delete className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

interface LockScreenProps {
  isLocked: boolean;
  isBiometricEnabled: boolean;
  biometricAvailable: boolean;
  onVerifyPin: (pin: string) => boolean;
  onUnlockBiometric: () => Promise<boolean>;
}

export function LockScreen({
  isLocked,
  isBiometricEnabled,
  biometricAvailable,
  onVerifyPin,
  onUnlockBiometric,
}: LockScreenProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isLocked && isBiometricEnabled) {
      onUnlockBiometric();
    }
  }, [isLocked, isBiometricEnabled, onUnlockBiometric]);

  if (!isLocked) return null;

  const handleKeyPress = (num: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setError(false);
    if (pin.length < 4) {
      const next = pin + num;
      setPin(next);
      if (next.length === 4) {
        const isValid = onVerifyPin(next);
        if (!isValid) {
          if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
          setError(true);
          setPin("");
        }
      }
    }
  };

  const handleDelete = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F7F5F0] dark:bg-[#12181F] text-[#24221F] dark:text-[#EAE7E1] flex flex-col items-center justify-center p-4 select-none">
      <div className="max-w-xs w-full text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-sm bg-[#18202A] dark:bg-[#EAE7E1] text-[#F7F5F0] dark:text-[#12181F] mb-1">
            <Lock className="h-6 w-6" />
          </div>
          <h2 className="font-serif text-lg font-bold">Salaire Mada</h2>
          <p className="text-xs font-mono text-[#666159] dark:text-[#9E9A90]">
            Entrez votre code PIN pour déverrouiller le registre
          </p>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-3">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`h-3.5 w-3.5 rounded-full border border-[#E2DDD5] dark:border-[#24303E] transition-all duration-150 ${
                idx < pin.length
                  ? "bg-[#3F7D5C] dark:bg-[#4E9B73] scale-110"
                  : "bg-[#FFFFFF] dark:bg-[#18202A]"
              }`}
            />
          ))}
        </div>

        {error && (
          <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859]">
            Code PIN erroné. Veuillez réessayer.
          </p>
        )}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto pt-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeyPress(num)}
              className="h-12 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] text-base font-mono font-bold transition-colors cursor-pointer active:scale-95 flex items-center justify-center shadow-xs"
            >
              {num}
            </button>
          ))}
          {isBiometricEnabled && biometricAvailable ? (
            <button
              type="button"
              onClick={onUnlockBiometric}
              className="h-12 rounded-sm border border-[#3F7D5C]/30 bg-[#EBF4EF] dark:bg-[#162B21] text-[#2F6347] dark:text-[#62BD8F] flex items-center justify-center cursor-pointer active:scale-95"
              title="Déverrouiller par biométrie"
            >
              <Fingerprint className="h-5 w-5" />
            </button>
          ) : (
            <div className="h-12" />
          )}
          <button
            type="button"
            onClick={() => handleKeyPress("0")}
            className="h-12 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] text-base font-mono font-bold transition-colors cursor-pointer active:scale-95 flex items-center justify-center shadow-xs"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-12 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] text-[#666159] dark:text-[#9E9A90] transition-colors cursor-pointer active:scale-95 flex items-center justify-center shadow-xs"
          >
            <Delete className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
