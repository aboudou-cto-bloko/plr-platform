interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressIndicator({
  currentStep,
  totalSteps,
}: ProgressIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full transition-colors ${
            index < currentStep
              ? "bg-primary"
              : index === currentStep
                ? "bg-primary/50"
                : "bg-muted"
          }`}
        />
      ))}
    </div>
  );
}
