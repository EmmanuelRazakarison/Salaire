import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLiveExchangeRates,
  convertCurrency,
  type ExchangeRatesData,
} from "../services/currencyService";

const REFRESH_INTERVAL_MS = 30000; // 30 secondes exactement

export function useCurrencyRates() {
  const [countdown, setCountdown] = useState<number>(30);

  const {
    data: exchangeData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery<ExchangeRatesData>({
    queryKey: ["live-exchange-rates"],
    queryFn: fetchLiveExchangeRates,
    refetchInterval: REFRESH_INTERVAL_MS,
    staleTime: 25000,
    refetchOnWindowFocus: true,
  });

  // Gestion du décompte visuel de 30s
  useEffect(() => {
    setCountdown(30);
    const interval = setInterval(() => {
      setCountdown((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [exchangeData?.timestamp]);

  const refreshNow = useCallback(() => {
    setCountdown(30);
    refetch();
  }, [refetch]);

  const convert = useCallback(
    (amount: number, fromCode: string, toCode: string): number => {
      if (!exchangeData?.rates) return 0;
      return convertCurrency(amount, fromCode, toCode, exchangeData.rates);
    },
    [exchangeData?.rates]
  );

  return {
    exchangeData,
    rates: exchangeData?.rates || {},
    lastUpdated: exchangeData?.lastUpdated || "",
    source: exchangeData?.source || "Live API",
    isLoading,
    isFetching,
    countdown,
    refreshNow,
    convert,
  };
}
