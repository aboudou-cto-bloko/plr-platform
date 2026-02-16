"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { OnboardingStep } from "./OnboardingStep";
import { ProgressIndicator } from "./ProgressIndicator";

const GOALS = [
  { id: "revenue", label: "Générer des revenus rapidement" },
  { id: "enrich", label: "Enrichir mon offre existante" },
  { id: "learn", label: "Apprendre à vendre des produits digitaux" },
  { id: "other", label: "Autre" },
];

const PRODUCT_TYPES = [
  { id: "ebook", label: "Ebooks / Guides" },
  { id: "template", label: "Templates (Canva, Notion, etc.)" },
  { id: "formation", label: "Mini-formations" },
  { id: "kit", label: "Kits marketing" },
  { id: "script", label: "Scripts / Emails" },
];

const EXPERIENCE_LEVELS = [
  { id: "beginner", label: "Jamais (débutant)" },
  { id: "some", label: "Quelques fois" },
  { id: "regular", label: "Régulièrement" },
];

export function OnboardingForm() {
  const router = useRouter();
  const saveAnswers = useMutation(api.onboarding.saveAnswers);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [goal, setGoal] = useState("");
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [experience, setExperience] = useState("");

  const handleProductTypeToggle = (typeId: string) => {
    setProductTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((t) => t !== typeId)
        : [...prev, typeId],
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return goal !== "";
      case 1:
        return productTypes.length > 0;
      case 2:
        return experience !== "";
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsSubmitting(true);
      try {
        await saveAnswers({
          goal,
          productTypes,
          experience,
        });
        router.push("/dashboard");
      } catch (error) {
        console.error("Failed to save onboarding:", error);
        setIsSubmitting(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-8">
      <ProgressIndicator currentStep={currentStep} totalSteps={3} />

      {currentStep === 0 && (
        <OnboardingStep
          title="Votre objectif"
          description="Pourquoi rejoignez-vous cette plateforme ?"
        >
          <div className="space-y-3">
            {GOALS.map((item) => (
              <button
                key={item.id}
                onClick={() => setGoal(item.id)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  goal === item.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </OnboardingStep>
      )}

      {currentStep === 1 && (
        <OnboardingStep
          title="Type de produits recherchés"
          description="Quels types de produits vous intéressent le plus ? (plusieurs choix possibles)"
        >
          <div className="space-y-3">
            {PRODUCT_TYPES.map((item) => (
              <button
                key={item.id}
                onClick={() => handleProductTypeToggle(item.id)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  productTypes.includes(item.id)
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  {productTypes.includes(item.id) && (
                    <span className="text-primary">✓</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </OnboardingStep>
      )}

      {currentStep === 2 && (
        <OnboardingStep
          title="Expérience"
          description="Avez-vous déjà vendu des produits digitaux ?"
        >
          <div className="space-y-3">
            {EXPERIENCE_LEVELS.map((item) => (
              <button
                key={item.id}
                onClick={() => setExperience(item.id)}
                className={`w-full p-4 text-left rounded-lg border transition-colors ${
                  experience === item.id
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </OnboardingStep>
      )}

      <div className="flex gap-4">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="flex-1 py-3 px-6 rounded-lg border border-border text-foreground hover:bg-accent transition-colors"
          >
            Retour
          </button>
        )}
        <button
          onClick={handleNext}
          disabled={!canProceed() || isSubmitting}
          className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${
            canProceed() && !isSubmitting
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-muted text-muted-foreground cursor-not-allowed"
          }`}
        >
          {isSubmitting
            ? "Chargement..."
            : currentStep === 2
              ? "Accéder à la bibliothèque"
              : "Suivant"}
        </button>
      </div>
    </div>
  );
}
