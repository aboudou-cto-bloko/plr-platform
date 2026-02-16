import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bienvenue !
          </h1>
          <p className="text-muted-foreground">
            Quelques questions pour personnaliser votre expérience
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
