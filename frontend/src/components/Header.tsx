import { Calculator, Server, WifiOff } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

interface HeaderProps {
  isServerOnline?: boolean;
}

export function Header({ isServerOnline = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700/50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-700 shadow-md shadow-emerald-500/20 dark:shadow-emerald-900/40 text-white font-bold">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                Salaire Mada
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
                2026
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Calcul du salaire brut & net - Réglementation Malagasy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Badge de statut du serveur */}
          <div
            title={
              isServerOnline
                ? "Connecté au backend FastAPI"
                : "Mode hors-ligne - Calculateur local actif"
            }
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-colors ${
              isServerOnline
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50"
                : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/40"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isServerOnline ? "bg-emerald-400" : "bg-amber-400"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isServerOnline ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
            </span>
            {isServerOnline ? (
              <>
                <Server className="h-3.5 w-3.5 hidden sm:inline" />
                <span>Serveur API</span>
              </>
            ) : (
              <>
                <WifiOff className="h-3.5 w-3.5 hidden sm:inline" />
                <span>Mode Local</span>
              </>
            )}
          </div>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
