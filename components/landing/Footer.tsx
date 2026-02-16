import Link from "next/link";

const footerLinks = {
  product: {
    title: "Produit",
    links: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Tarif", href: "#pricing" },
      { name: "FAQ", href: "#faq" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "Contact", href: "mailto:support@plr-library.com" },
      { name: "Aide", href: "#faq" },
    ],
  },
  legal: {
    title: "Légal",
    links: [
      { name: "Conditions d'utilisation", href: "/terms" },
      { name: "Politique de confidentialité", href: "/privacy" },
      { name: "Licence PLR", href: "/license" },
    ],
  },
};

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-xs font-bold text-primary-foreground">
                  PLR
                </span>
              </div>
              <span className="text-lg font-semibold text-foreground">
                Library
              </span>
            </Link>
            <p className="text-muted-foreground mt-4 text-sm">
              Produits digitaux prêts à revendre avec licence PLR complète.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-foreground font-medium">
              {footerLinks.product.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-foreground font-medium">
              {footerLinks.support.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.support.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-foreground font-medium">
              {footerLinks.legal.title}
            </h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.links.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} PLR Library. Tous droits réservés.
          </p>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Link
              href="https://twitter.com/plrlibrary"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <svg
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="mailto:support@plr-library.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
