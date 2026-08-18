import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-8 w-8 rounded-sm"
      aria-label="Basculer entre le mode clair (ivoire) et sombre (encre)"
      title={theme === "light" ? "Activer le mode sombre (encre)" : "Activer le mode clair (ivoire)"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-[#666159]" />
      ) : (
        <Sun className="h-4 w-4 text-[#EAE7E1]" />
      )}
    </Button>
  );
}

