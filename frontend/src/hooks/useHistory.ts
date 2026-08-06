import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SalaryResult, SalaryInput, HistoryEntry } from "../types";
import {
  fetchHistoryApi,
  saveCalculationApi,
  deleteHistoryItemApi,
  clearHistoryApi,
} from "../services/api";

const HISTORY_KEY = "salaire-mada-history";
const MAX_HISTORY_ITEMS = 30;

export function useHistory(isServerOnline: boolean = false) {
  const queryClient = useQueryClient();
  const [localHistory, setLocalHistory] = useState<HistoryEntry[]>([]);

  // Charger depuis localStorage au démarrage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(HISTORY_KEY);
      if (stored) {
        setLocalHistory(JSON.parse(stored));
      }
    } catch {
      /* Ignorer les erreurs de parsing */
    }
  }, []);

  const persistLocal = useCallback((items: HistoryEntry[]) => {
    try {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(items));
    } catch {
      /* Ignorer */
    }
  }, []);

  // Requête API si le serveur est en ligne
  const { data: serverHistory } = useQuery({
    queryKey: ["history"],
    queryFn: fetchHistoryApi,
    enabled: isServerOnline,
    staleTime: 10000,
  });

  // Fusion de l'historique
  const history = isServerOnline && serverHistory ? serverHistory : localHistory;

  // Mutation pour sauvegarder un calcul
  const saveMutation = useMutation({
    mutationFn: async (params: { input?: SalaryInput; result: SalaryResult; isNetToGross: boolean }) => {
      if (isServerOnline && params.input) {
        return await saveCalculationApi(params.input);
      }
      return params.result;
    },
    onSuccess: (_, variables) => {
      if (isServerOnline) {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }

      // Toujours conserver en localStorage pour fallback
      const entry: HistoryEntry = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        result: variables.result,
        isNetToGross: variables.isNetToGross,
        timestamp: new Date().toISOString(),
      };

      setLocalHistory((prev) => {
        const updated = [entry, ...prev.filter((h) => h.result.netPay !== variables.result.netPay)].slice(0, MAX_HISTORY_ITEMS);
        persistLocal(updated);
        return updated;
      });
    },
  });

  // Mutation pour supprimer un élément
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (isServerOnline && !isNaN(Number(id))) {
        await deleteHistoryItemApi(id);
      }
    },
    onSuccess: (_, id) => {
      if (isServerOnline) {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
      setLocalHistory((prev) => {
        const updated = prev.filter((item) => item.id !== id);
        persistLocal(updated);
        return updated;
      });
    },
  });

  // Mutation pour tout effacer
  const clearMutation = useMutation({
    mutationFn: async () => {
      if (isServerOnline) {
        await clearHistoryApi();
      }
    },
    onSuccess: () => {
      if (isServerOnline) {
        queryClient.invalidateQueries({ queryKey: ["history"] });
        queryClient.invalidateQueries({ queryKey: ["stats"] });
      }
      setLocalHistory([]);
      persistLocal([]);
    },
  });

  const addToHistory = useCallback(
    (result: SalaryResult, isNetToGross: boolean, input?: SalaryInput) => {
      saveMutation.mutate({ input, result, isNetToGross });
    },
    [saveMutation]
  );

  const removeFromHistory = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const clearHistory = useCallback(() => {
    clearMutation.mutate();
  }, [clearMutation]);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
    isSaving: saveMutation.isPending,
  };
}
