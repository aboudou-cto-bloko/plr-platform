import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales d&apos;Utilisation | PLR Library",
  description: "Conditions générales d&apos;utilisation de PLR Library",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Conditions Générales d&apos;Utilisation
        </h1>
        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : Février 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Objet</h2>
          <p>
            Les présentes Conditions Générales d&apos;Utilisation (CGU)
            régissent l&apos;utilisation de la plateforme PLR Library,
            accessible à l&apos;adresse plrlibrary.com (ci-après &quot;le
            Service&quot;). En utilisant notre Service, vous acceptez
            d&apos;être lié par ces conditions.
          </p>

          <h2>2. Description du Service</h2>
          <p>
            PLR Library est une plateforme d&apos;abonnement donnant accès à une
            bibliothèque de produits numériques avec droits de revente (Private
            Label Rights). Les abonnés peuvent télécharger, modifier et
            commercialiser ces produits selon les termes de la licence PLR.
          </p>

          <h2>3. Inscription et Compte</h2>
          <h3>3.1 Création de compte</h3>
          <p>
            Pour utiliser le Service, vous devez créer un compte en fournissant
            des informations exactes et complètes. Vous êtes responsable de la
            confidentialité de vos identifiants de connexion.
          </p>
          <h3>3.2 Compte personnel</h3>
          <p>
            Votre compte est strictement personnel et non transférable. Le
            partage de compte est interdit et peut entraîner la suspension
            immédiate de votre accès sans remboursement.
          </p>

          <h2>4. Abonnement et Paiement</h2>
          <h3>4.1 Tarification</h3>
          <p>
            L&apos;abonnement mensuel est facturé 15 000 FCFA. Ce montant donne
            accès à l&apos;intégralité de la bibliothèque de produits PLR.
          </p>
          <h3>4.2 Renouvellement</h3>
          <p>
            L&apos;abonnement se renouvelle automatiquement chaque mois à la
            date anniversaire de votre inscription. Vous serez notifié par email
            avant chaque renouvellement.
          </p>
          <h3>4.3 Moyens de paiement</h3>
          <p>
            Nous acceptons les paiements par Mobile Money (MTN, Moov, Orange,
            Wave) et par carte bancaire via notre prestataire de paiement
            sécurisé Moneroo.
          </p>
          <h3>4.4 Échec de paiement</h3>
          <p>
            En cas d&apos;échec de paiement, une période de grâce de 3 jours
            vous est accordée pour régulariser votre situation. Passé ce délai,
            votre accès sera suspendu jusqu&apos;au prochain paiement réussi.
          </p>

          <h2>5. Utilisation du Service</h2>
          <h3>5.1 Droits accordés</h3>
          <p>
            En tant qu&apos;abonné, vous bénéficiez d&apos;un droit d&apos;accès
            et de téléchargement des produits de la bibliothèque, dans la limite
            de 20 téléchargements par période de 24 heures.
          </p>
          <h3>5.2 Utilisations interdites</h3>
          <p>Il est strictement interdit de :</p>
          <ul>
            <li>Partager vos identifiants de connexion</li>
            <li>
              Utiliser des outils automatisés pour télécharger massivement
            </li>
            <li>Revendre ou distribuer l&apos;accès au Service</li>
            <li>Contourner les mesures de sécurité de la plateforme</li>
          </ul>

          <h2>6. Propriété Intellectuelle</h2>
          <p>
            Les droits sur les produits PLR sont définis dans notre Licence PLR
            séparée. La plateforme PLR Library, son design et son code restent
            la propriété exclusive de PLR Library.
          </p>

          <h2>7. Limitation de Responsabilité</h2>
          <p>
            PLR Library fournit les produits &quot;en l&apos;état&quot;. Nous ne
            garantissons pas que les produits conviendront à vos besoins
            spécifiques ou généreront des revenus particuliers. Vous utilisez
            les produits sous votre propre responsabilité commerciale.
          </p>

          <h2>8. Résiliation</h2>
          <h3>8.1 Résiliation par l&apos;utilisateur</h3>
          <p>
            Vous pouvez annuler votre abonnement à tout moment depuis les
            paramètres de votre compte. Votre accès restera actif jusqu&apos;à
            la fin de la période payée.
          </p>
          <h3>8.2 Résiliation par PLR Library</h3>
          <p>
            Nous nous réservons le droit de suspendre ou résilier votre compte
            en cas de violation des présentes CGU, sans préavis ni
            remboursement.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Nous pouvons modifier ces CGU à tout moment. Les modifications
            seront notifiées par email et/ou sur la plateforme. La poursuite de
            l&apos;utilisation du Service après modification vaut acceptation
            des nouvelles conditions.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question concernant ces CGU, contactez-nous à :{" "}
            <a href="mailto:support@plrlibrary.com">support@plrlibrary.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
