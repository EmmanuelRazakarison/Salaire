import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, X, Check, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { useMobileHardwareBack } from "../hooks/useMobileHardwareBack";

const REMINDER_DAY_KEY = "salaire-mada-reminder-day";
const REMINDER_ENABLED_KEY = "salaire-mada-reminder-enabled";

interface PayReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PayReminderModal({ isOpen, onClose }: PayReminderModalProps) {
  useMobileHardwareBack(isOpen, onClose, "pay_reminder");

  const [enabled, setEnabled] = useState<boolean>(() => {
    return localStorage.getItem(REMINDER_ENABLED_KEY) === "true";
  });

  const [reminderDay, setReminderDay] = useState<number>(() => {
    const stored = localStorage.getItem(REMINDER_DAY_KEY);
    return stored ? parseInt(stored, 10) : 25;
  });

  if (!isOpen) return null;

  const handleToggleReminder = async () => {
    if (!enabled) {
      if ("Notification" in window) {
        const perm = await Notification.requestPermission();
        if (perm === "granted") {
          setEnabled(true);
          localStorage.setItem(REMINDER_ENABLED_KEY, "true");
          localStorage.setItem(REMINDER_DAY_KEY, reminderDay.toString());
          // Trigger a discreet test confirmation notification
          try {
            new Notification("Salaire Mada — Rappel de Paie", {
              body: `Rappel de paie activé : notification programmée le ${reminderDay} de chaque mois.`,
              icon: "/favicon.svg",
            });
          } catch {
            // ignore
          }
        }
      } else {
        setEnabled(true);
        localStorage.setItem(REMINDER_ENABLED_KEY, "true");
        localStorage.setItem(REMINDER_DAY_KEY, reminderDay.toString());
      }
    } else {
      setEnabled(false);
      localStorage.setItem(REMINDER_ENABLED_KEY, "false");
    }
  };

  const handleSaveDay = (day: number) => {
    setReminderDay(day);
    localStorage.setItem(REMINDER_DAY_KEY, day.toString());
  };

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
              <Bell className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
              <h3 className="font-serif text-base font-bold">Rappel de Date de Paie</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-sm text-[#666159] dark:text-[#9E9A90] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs font-mono">
            <p className="text-[#666159] dark:text-[#9E9A90] font-sans leading-relaxed">
              Recevez une notification discrète chaque mois pour préparer vos bulletins de paie et effectuer vos décomptes salariaux.
            </p>

            <div className="p-3 rounded-sm bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] flex items-center justify-between">
              <div className="flex items-center gap-2">
                {enabled ? (
                  <Bell className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
                ) : (
                  <BellOff className="h-4 w-4 text-[#9E978C]" />
                )}
                <div>
                  <div className="font-bold">Notification mensuelle</div>
                  <div className="text-[11px] text-[#666159] dark:text-[#9E9A90]">
                    {enabled ? `Active (Chaque ${reminderDay} du mois)` : "Désactivée"}
                  </div>
                </div>
              </div>

              <Button
                variant={enabled ? "outline" : "default"}
                size="sm"
                onClick={handleToggleReminder}
                className="text-[11px] font-mono h-7"
              >
                {enabled ? "Désactiver" : "Activer"}
              </Button>
            </div>

            {enabled && (
              <div className="space-y-2 pt-1">
                <span className="text-[11px] font-bold text-[#666159] dark:text-[#9E9A90] flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#3F7D5C]" />
                  Choisir le jour du rappel :
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[20, 25, 28, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleSaveDay(d)}
                      className={`h-9 rounded-sm border font-mono font-bold text-xs transition-colors cursor-pointer ${
                        reminderDay === d
                          ? "bg-[#3F7D5C] text-white border-[#34694D] dark:bg-[#4E9B73] dark:border-[#3F7D5C]"
                          : "bg-[#FAF8F5] dark:bg-[#141C25] text-[#24221F] dark:text-[#EAE7E1] border-[#E2DDD5] dark:border-[#24303E] hover:border-[#3F7D5C]"
                      }`}
                    >
                      Le {d}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button size="sm" onClick={onClose} className="font-mono text-xs">
                <Check className="h-3.5 w-3.5 mr-1" /> Enregistrer & Fermer
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
