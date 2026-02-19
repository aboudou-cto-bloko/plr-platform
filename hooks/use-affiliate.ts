// hooks/use-affiliate.ts
"use client";

import { useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";

const STORAGE_KEY = "plr_affiliate_code";
const STORAGE_EXPIRY_KEY = "plr_affiliate_code_expiry";
const EXPIRY_DAYS = 30;

/**
 * Hook à utiliser dans le layout racine pour capturer le code affilié
 * dès l'arrivée sur le site (peu importe la page d'entrée)
 */
export function useAffiliateCaptureOnMount() {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const refCode = searchParams.get("ref");

    if (refCode) {
      const code = refCode.toLowerCase().trim();
      const expiryDate = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;

      localStorage.setItem(STORAGE_KEY, code);
      localStorage.setItem(STORAGE_EXPIRY_KEY, expiryDate.toString());

      console.log(`[Affiliate] Code captured: ${code}`);
    }
  }, [searchParams]);
}

/**
 * Récupère le code affilié stocké (avec vérification d'expiration)
 * @returns Le code affilié ou null si absent/expiré
 */
export function getStoredAffiliateCode(): string | null {
  if (typeof window === "undefined") return null;

  const code = localStorage.getItem(STORAGE_KEY);
  const expiryStr = localStorage.getItem(STORAGE_EXPIRY_KEY);

  if (!code) return null;

  // Si pas de date d'expiration, on considère le code comme valide
  // (rétrocompatibilité avec les codes stockés avant cette mise à jour)
  if (expiryStr) {
    const expiry = parseInt(expiryStr, 10);

    // Vérifier si expiré
    if (Date.now() > expiry) {
      clearAffiliateCode();
      console.log(`[Affiliate] Code expired: ${code}`);
      return null;
    }
  }

  return code;
}

/**
 * Stocke un code affilié manuellement (ex: saisi dans un input)
 * @param code Le code affilié à stocker
 */
export function setAffiliateCode(code: string): void {
  if (typeof window === "undefined") return;

  const cleanCode = code.toLowerCase().trim();
  const expiryDate = Date.now() + EXPIRY_DAYS * 24 * 60 * 60 * 1000;

  localStorage.setItem(STORAGE_KEY, cleanCode);
  localStorage.setItem(STORAGE_EXPIRY_KEY, expiryDate.toString());
}

/**
 * Supprime le code affilié du localStorage
 */
export function clearAffiliateCode(): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(STORAGE_EXPIRY_KEY);
}

/**
 * Hook complet pour gérer le code affilié dans un composant
 * Retourne le code actuel et des fonctions pour le manipuler
 */
export function useAffiliateCode() {
  const getCode = useCallback(() => {
    return getStoredAffiliateCode();
  }, []);

  const setCode = useCallback((code: string) => {
    setAffiliateCode(code);
  }, []);

  const clearCode = useCallback(() => {
    clearAffiliateCode();
  }, []);

  return {
    getCode,
    setCode,
    clearCode,
  };
}
