// app/(marketing)/license/page.tsx
import { Metadata } from "next";
import { IconCheck, IconX } from "@tabler/icons-react";

export const metadata: Metadata = {
  title: "Licence PLR | PLR Library",
  description: "Termes de la licence Private Label Rights de PLR Library",
};

export default function LicensePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">Licence PLR</h1>
        <p className="text-muted-foreground mb-8">
          Conditions d&apos;utilisation des produits à droits de label privé
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Qu&apos;est-ce que la licence PLR ?</h2>
          <p>
            PLR signifie &quot;Private Label Rights&quot; (Droits de Label
            Privé). Cette licence vous accorde des droits étendus sur les
            produits que vous téléchargez, vous permettant de les utiliser,
            modifier et commercialiser comme s&apos;ils étaient vos propres
            créations.
          </p>

          <div className="not-prose my-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Ce que vous POUVEZ faire */}
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-green-600 mb-4">
                  <IconCheck className="h-5 w-5" />
                  Ce que vous POUVEZ faire
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Utiliser personnellement</strong> — Pour votre
                      propre usage, apprentissage ou business
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Modifier le contenu</strong> — Adapter, réécrire,
                      traduire, ajouter ou supprimer du contenu
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Ajouter votre branding</strong> — Mettre votre
                      nom, logo et identité visuelle
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Vendre comme votre produit</strong> —
                      Commercialiser sous votre propre marque
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Offrir en bonus</strong> — Utiliser comme cadeau
                      ou bonus pour vos offres
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Créer des formations</strong> — Baser vos cours et
                      formations sur le contenu
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Publier sur vos sites</strong> — Utiliser le
                      contenu sur vos blogs et réseaux sociaux
                    </span>
                  </li>
                </ul>
              </div>

              {/* Ce que vous NE POUVEZ PAS faire */}
              <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6">
                <h3 className="flex items-center gap-2 text-lg font-semibold text-red-600 mb-4">
                  <IconX className="h-5 w-5" />
                  Ce que vous NE POUVEZ PAS faire
                </h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <IconX className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Revendre les droits PLR</strong> — Vous ne pouvez
                      pas vendre la licence elle-même
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconX className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Distribuer gratuitement en masse</strong> — Pas de
                      distribution gratuite à grande échelle
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconX className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Partager sur des sites de téléchargement</strong>{" "}
                      — Interdit sur torrent, file-sharing, etc.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconX className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Réclamer le copyright original</strong> — Vous ne
                      pouvez pas prétendre avoir créé l&apos;œuvre originale
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <IconX className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                    <span>
                      <strong>Utiliser de façon illégale</strong> — Toute
                      utilisation contraire à la loi est interdite
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <h2>Questions Fréquentes sur la Licence</h2>

          <h3>Puis-je vendre les produits plus cher que l&apos;abonnement ?</h3>
          <p>
            Absolument ! Vous êtes libre de fixer vos propres prix. Beaucoup de
            nos membres vendent des ebooks PLR pour 5 000 à 25 000 FCFA ou plus
            après les avoir personnalisés.
          </p>

          <h3>Dois-je créditer PLR Library ?</h3>
          <p>
            Non, ce n&apos;est pas nécessaire. Vous pouvez présenter les
            produits comme vos propres créations après modification.
          </p>

          <h3>Combien de fois puis-je vendre un même produit ?</h3>
          <p>
            Il n&apos;y a pas de limite. Vous pouvez vendre le même produit à un
            nombre illimité de clients.
          </p>

          <h3>Les produits sont-ils exclusifs ?</h3>
          <p>
            Non, les produits PLR sont non-exclusifs. D&apos;autres abonnés
            peuvent également les utiliser. C&apos;est pourquoi nous
            recommandons de personnaliser les produits pour vous démarquer.
          </p>

          <h3>Que se passe-t-il si j&apos;annule mon abonnement ?</h3>
          <p>
            Vous conservez les droits d&apos;utilisation sur tous les produits
            que vous avez téléchargés pendant votre abonnement. Cependant, vous
            ne pourrez plus télécharger de nouveaux produits.
          </p>

          <h2>Clause de Non-Responsabilité</h2>
          <p>
            PLR Library fournit les produits &quot;tels quels&quot;. Nous ne
            garantissons pas de résultats commerciaux spécifiques. Le succès de
            vos ventes dépend de nombreux facteurs incluant votre marketing,
            votre audience, et la qualité de vos personnalisations.
          </p>

          <h2>Contact</h2>
          <p>
            Pour toute question concernant cette licence :{" "}
            <a href="mailto:support@plrlibrary.com">support@plrlibrary.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
