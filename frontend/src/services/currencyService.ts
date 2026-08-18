export interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateInMGA: number; // Combien d'Ariary pour 1 unité de cette devise
  rateInFMG: number; // Combien de FMG pour 1 unité (rateInMGA * 5)
}

export interface ExchangeRatesData {
  lastUpdated: string;
  timestamp: number;
  base: string;
  rates: Record<string, CurrencyRate>;
  source: string;
}

const STORAGE_KEY = "salaire-mada-exchange-rates";

// Taux de secours réalistes au cas où l'appareil est 100% hors-ligne au premier lancement
const FALLBACK_RATES: Record<string, { name: string; symbol: string; flag: string; rateInMGA: number }> = {
  USD: { name: "Dollar américain", symbol: "$", flag: "🇺🇸", rateInMGA: 4322.5 },
  EUR: { name: "Euro", symbol: "€", flag: "🇪🇺", rateInMGA: 5008.2 },
  CNY: { name: "Yuan chinois", symbol: "¥", flag: "🇨🇳", rateInMGA: 639.8 },
  GBP: { name: "Livre sterling", symbol: "£", flag: "🇬🇧", rateInMGA: 5770.0 },
  CAD: { name: "Dollar canadien", symbol: "CA$", flag: "🇨🇦", rateInMGA: 3166.4 },
  CHF: { name: "Franc suisse", symbol: "CHF", flag: "🇨🇭", rateInMGA: 5120.3 },
  JPY: { name: "Yen japonais (x100)", symbol: "¥", flag: "🇯🇵", rateInMGA: 2985.0 },
  FMG: { name: "Franc Malgache", symbol: "FMG", flag: "🇲🇬", rateInMGA: 0.2 },
  MGA: { name: "Ariary Malagasy", symbol: "Ar", flag: "🇲🇬", rateInMGA: 1.0 },
};

export async function fetchLiveExchangeRates(): Promise<ExchangeRatesData> {
  const now = new Date();
  
  try {
    // 1ère tentative : open.er-api.com (très fiable, temps réel, sans clé API)
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.rates && data.rates.MGA) {
        const usdInMga = data.rates.MGA;
        return parseRatesResponse(data.rates, usdInMga, "open.er-api.com", data.time_last_update_utc || now.toISOString());
      }
    }
  } catch {
    /* Tenter le fallback */
  }

  try {
    // 2ème tentative de secours : api.exchangerate-api.com
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD", {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (data.rates && data.rates.MGA) {
        const usdInMga = data.rates.MGA;
        return parseRatesResponse(data.rates, usdInMga, "api.exchangerate-api.com", data.date || now.toISOString());
      }
    }
  } catch {
    /* Utiliser le cache ou le fallback */
  }

  // 3ème niveau : Récupérer du cache local
  const cached = getCachedExchangeRates();
  if (cached) {
    return cached;
  }

  // 4ème niveau : Taux de secours hardcodés
  return buildFallbackData();
}

function parseRatesResponse(
  rawRates: Record<string, number>,
  usdInMga: number,
  source: string,
  lastUpdatedStr: string
): ExchangeRatesData {
  const rates: Record<string, CurrencyRate> = {};

  // 1 USD = usdInMga
  rates.USD = {
    code: "USD",
    name: "Dollar américain",
    symbol: "$",
    flag: "🇺🇸",
    rateInMGA: usdInMga,
    rateInFMG: usdInMga * 5,
  };

  // EUR: 1 EUR = (1 / rawRates.EUR) * usdInMga
  if (rawRates.EUR) {
    const eurInMga = (1 / rawRates.EUR) * usdInMga;
    rates.EUR = {
      code: "EUR",
      name: "Euro",
      symbol: "€",
      flag: "🇪🇺",
      rateInMGA: eurInMga,
      rateInFMG: eurInMga * 5,
    };
  }

  // CNY (Yuan chinois): 1 CNY = (1 / rawRates.CNY) * usdInMga
  if (rawRates.CNY) {
    const cnyInMga = (1 / rawRates.CNY) * usdInMga;
    rates.CNY = {
      code: "CNY",
      name: "Yuan chinois",
      symbol: "¥",
      flag: "🇨🇳",
      rateInMGA: cnyInMga,
      rateInFMG: cnyInMga * 5,
    };
  }

  // GBP: 1 GBP = (1 / rawRates.GBP) * usdInMga
  if (rawRates.GBP) {
    const gbpInMga = (1 / rawRates.GBP) * usdInMga;
    rates.GBP = {
      code: "GBP",
      name: "Livre sterling",
      symbol: "£",
      flag: "🇬🇧",
      rateInMGA: gbpInMga,
      rateInFMG: gbpInMga * 5,
    };
  }

  // CAD: 1 CAD = (1 / rawRates.CAD) * usdInMga
  if (rawRates.CAD) {
    const cadInMga = (1 / rawRates.CAD) * usdInMga;
    rates.CAD = {
      code: "CAD",
      name: "Dollar canadien",
      symbol: "CA$",
      flag: "🇨🇦",
      rateInMGA: cadInMga,
      rateInFMG: cadInMga * 5,
    };
  }

  // CHF: 1 CHF = (1 / rawRates.CHF) * usdInMga
  if (rawRates.CHF) {
    const chfInMga = (1 / rawRates.CHF) * usdInMga;
    rates.CHF = {
      code: "CHF",
      name: "Franc suisse",
      symbol: "CHF",
      flag: "🇨🇭",
      rateInMGA: chfInMga,
      rateInFMG: chfInMga * 5,
    };
  }

  // FMG
  rates.FMG = {
    code: "FMG",
    name: "Franc Malgache",
    symbol: "FMG",
    flag: "🇲🇬",
    rateInMGA: 0.2, // 1 FMG = 0.2 MGA (1 MGA = 5 FMG)
    rateInFMG: 1.0,
  };

  // MGA
  rates.MGA = {
    code: "MGA",
    name: "Ariary Malagasy",
    symbol: "Ar",
    flag: "🇲🇬",
    rateInMGA: 1.0,
    rateInFMG: 5.0,
  };

  const exchangeData: ExchangeRatesData = {
    lastUpdated: lastUpdatedStr || new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    timestamp: Date.now(),
    base: "USD",
    rates,
    source,
  };

  saveToCache(exchangeData);
  return exchangeData;
}

function buildFallbackData(): ExchangeRatesData {
  const rates: Record<string, CurrencyRate> = {};
  for (const [code, info] of Object.entries(FALLBACK_RATES)) {
    rates[code] = {
      code,
      name: info.name,
      symbol: info.symbol,
      flag: info.flag,
      rateInMGA: info.rateInMGA,
      rateInFMG: info.rateInMGA * 5,
    };
  }

  return {
    lastUpdated: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
    timestamp: Date.now(),
    base: "USD",
    rates,
    source: "Taux indicatifs hors-ligne",
  };
}

function saveToCache(data: ExchangeRatesData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* Ignorer */
  }
}

export function getCachedExchangeRates(): ExchangeRatesData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Convertit un montant d'une devise à une autre
 */
export function convertCurrency(
  amount: number,
  fromCode: string,
  toCode: string,
  rates: Record<string, CurrencyRate>
): number {
  if (amount <= 0 || !rates[fromCode] || !rates[toCode]) return 0;
  if (fromCode === toCode) return amount;

  // 1. Convertir le montant d'origine en Ariary (MGA)
  const amountInMga = amount * rates[fromCode].rateInMGA;

  // 2. Convertir l'Ariary vers la devise cible
  if (toCode === "MGA") {
    return amountInMga;
  }
  if (toCode === "FMG") {
    return amountInMga * 5;
  }

  return amountInMga / rates[toCode].rateInMGA;
}
