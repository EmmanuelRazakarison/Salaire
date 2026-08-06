import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";
import { Button } from "./ui/button";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-xl"
      aria-label="Changer le thème"
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5 text-gray-600" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-400" />
      )}
    </Button>
  );
}
