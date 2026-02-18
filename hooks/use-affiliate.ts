"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const STORAGE_KEY = "plr_affiliate_code";

export function useAffiliate() {
  const searchParams = useSearchParams();

  const affiliateCode = useMemo(() => {
    if (typeof window === "undefined") return null;

    const urlCode = searchParams.get("ref");

    if (urlCode) {
      const normalized = urlCode.toLowerCase();
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored !== normalized) {
        localStorage.setItem(STORAGE_KEY, normalized);
      }

      return normalized;
    }

    return localStorage.getItem(STORAGE_KEY);
  }, [searchParams]);

  // Queries
  const affiliateInfo = useQuery(
    api.affiliates.getByCode,
    affiliateCode ? { code: affiliateCode } : "skip",
  );

  const priceInfo = useQuery(
    api.affiliates.calculatePrice,
    affiliateCode ? { code: affiliateCode } : { code: undefined },
  );

  // Clear code
  const clearAffiliateCode = () => {
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    affiliateCode,
    affiliateInfo,
    priceInfo,
    isLoading: affiliateInfo === undefined || priceInfo === undefined,
    isValidAffiliate: !!affiliateInfo,
    clearAffiliateCode,
  };
}
