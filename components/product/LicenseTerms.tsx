import { CheckCircle2, XCircle } from "lucide-react";

export function LicenseTerms() {
  const allowed = [
    "Vous pouvez revendre ce produit à vos clients",
    "Vous pouvez l'utiliser comme bonus",
    "Vous pouvez le modifier et le personnaliser",
  ];

  const notAllowed = [
    "Vous ne pouvez pas partager l'accès à la bibliothèque",
    "Vous ne pouvez pas revendre les droits PLR",
  ];

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-foreground">Termes de licence PLR</h3>

      <div className="space-y-2">
        {allowed.map((term, index) => (
          <div key={index} className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-chart-2 mt-0.5 shrink-0" />
            <span className="text-sm text-foreground">{term}</span>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {notAllowed.map((term, index) => (
          <div key={index} className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
            <span className="text-sm text-muted-foreground">{term}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
