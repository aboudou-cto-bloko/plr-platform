interface WelcomeHeaderProps {
  userName?: string;
  productCount: number;
  newProductCount: number;
}

export function WelcomeHeader({
  userName,
  productCount,
  newProductCount,
}: WelcomeHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-foreground">
        Bienvenue{userName ? `, ${userName}` : ""} 👋
      </h1>
      <p className="text-muted-foreground">
        Vous avez accès à {productCount} produits
        {newProductCount > 0 && (
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            {newProductCount} nouveau{newProductCount > 1 ? "x" : ""}
          </span>
        )}
      </p>
    </div>
  );
}
