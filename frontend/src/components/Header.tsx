import { BookOpen, Shield, Bell, Coins } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

interface HeaderProps {
  isServerOnline?: boolean;
  isPinEnabled?: boolean;
  onOpenSecurity?: () => void;
  onOpenPayReminder?: () => void;
  onOpenCurrencyConverter?: () => void;
}

export function Header({
  isServerOnline = false,
  isPinEnabled = false,
  onOpenSecurity,
  onOpenPayReminder,
  onOpenCurrencyConverter,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#E2DDD5] dark:border-[#24303E] bg-[#F7F5F0]/95 dark:bg-[#12181F]/95 backdrop-blur-md transition-colors">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-14 sm:h-15 flex items-center justify-between">
        {/* Titre & Logo Institutionnel */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-sm bg-[#18202A] dark:bg-[#EAE7E1] text-[#F7F5F0] dark:text-[#12181F] border border-[#24303E] dark:border-[#E2DDD5]">
            <BookOpen className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="font-serif text-sm sm:text-lg font-bold tracking-tight text-[#24221F] dark:text-[#EAE7E1]">
                SALAIRE MADA
              </h1>
              <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-sm bg-[#EBF4EF] dark:bg-[#162B21] text-[#2F6347] dark:text-[#62BD8F] border border-[#3F7D5C]/30">
                2026 · MGA
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] font-medium text-[#666159] dark:text-[#9E9A90] hidden md:block">
              Registre de calcul salarial conforme au Code du Travail & Barème IRSA
            </p>
          </div>
        </div>

        {/* Contrôles & Statut */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bouton Convertisseur Devises / FMG */}
          {onOpenCurrencyConverter && (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCurrencyConverter}
              className="h-8 px-2 sm:px-2.5 rounded-sm text-[#2F6347] dark:text-[#62BD8F] bg-[#EBF4EF] dark:bg-[#162B21] border-[#3F7D5C]/30 hover:border-[#3F7D5C] gap-1.5 text-xs font-mono font-semibold"
              title="Convertisseur de devises en direct (MGA, FMG, USD, EUR, CNY)"
            >
              <Coins className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Devises</span>
            </Button>
          )}

          {/* Bouton Rappel de Paie */}
          {onOpenPayReminder && (
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenPayReminder}
              className="h-8 w-8 rounded-sm text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F]"
              title="Configurer un rappel de paie mensuel"
            >
              <Bell className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Bouton Sécurité PIN */}
          {onOpenSecurity && (
            <Button
              variant="outline"
              size="icon"
              onClick={onOpenSecurity}
              className={`h-8 w-8 rounded-sm ${
                isPinEnabled
                  ? "text-[#3F7D5C] dark:text-[#4E9B73] border-[#3F7D5C]/40"
                  : "text-[#666159] dark:text-[#9E9A90]"
              }`}
              title={isPinEnabled ? "Verrouillage PIN actif" : "Configurer le code PIN de sécurité"}
            >
              <Shield className="h-3.5 w-3.5" />
            </Button>
          )}

          {/* Indicateur de serveur / mode local */}
          <div
            title={
              isServerOnline
                ? "Connecté au moteur backend FastAPI (SQLite)"
                : "Moteur de calcul autonome local actif"
            }
            className={`flex items-center gap-1 text-[10px] sm:text-[11px] font-mono font-medium px-1.5 sm:px-2 py-1 rounded-sm border transition-colors ${
              isServerOnline
                ? "bg-[#EBF4EF] dark:bg-[#162B21] text-[#2F6347] dark:text-[#62BD8F] border-[#3F7D5C]/30"
                : "bg-[#F4F1EA] dark:bg-[#141C25] text-[#666159] dark:text-[#9E9A90] border-[#E2DDD5] dark:border-[#24303E]"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                isServerOnline ? "bg-[#3F7D5C] dark:bg-[#4E9B73]" : "bg-[#9E978C] dark:bg-[#67635A]"
              }`}
            />
            <span className="hidden xs:inline">{isServerOnline ? "API" : "Local"}</span>
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
