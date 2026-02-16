import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | PLR Library",
  description: "Politique de confidentialité de PLR Library",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-3xl py-12 px-4">
        <h1 className="text-3xl font-bold mb-2">
          Politique de Confidentialité
        </h1>
        <p className="text-muted-foreground mb-8">
          Dernière mise à jour : Février 2025
        </p>

        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>1. Introduction</h2>
          <p>
            PLR Library (&quot;nous&quot;, &quot;notre&quot;) s&apos;engage à
            protéger la vie privée de ses utilisateurs. Cette politique explique
            comment nous collectons, utilisons et protégeons vos données
            personnelles.
          </p>

          <h2>2. Données Collectées</h2>
          <h3>2.1 Données d&apos;inscription</h3>
          <ul>
            <li>Nom et prénom</li>
            <li>Adresse email</li>
            <li>Mot de passe (chiffré)</li>
          </ul>

          <h3>2.2 Données de paiement</h3>
          <ul>
            <li>Historique des transactions</li>
            <li>Méthode de paiement utilisée</li>
          </ul>
          <p>
            Note : Les informations de paiement complètes (numéros de carte,
            comptes Mobile Money) sont traitées directement par notre
            prestataire Moneroo et ne sont pas stockées sur nos serveurs.
          </p>

          <h3>2.3 Données d&apos;utilisation</h3>
          <ul>
            <li>Historique des téléchargements</li>
            <li>Adresse IP</li>
            <li>Type de navigateur et appareil</li>
            <li>Pays de connexion</li>
          </ul>

          <h2>3. Utilisation des Données</h2>
          <p>Nous utilisons vos données pour :</p>
          <ul>
            <li>Fournir et gérer votre accès au Service</li>
            <li>Traiter vos paiements et renouvellements</li>
            <li>
              Vous envoyer des notifications importantes (expiration, nouveaux
              produits)
            </li>
            <li>Détecter et prévenir les fraudes et abus</li>
            <li>Améliorer notre Service</li>
          </ul>

          <h2>4. Protection des Données</h2>
          <p>
            Nous mettons en œuvre des mesures de sécurité techniques et
            organisationnelles pour protéger vos données :
          </p>
          <ul>
            <li>Chiffrement des mots de passe</li>
            <li>Connexions sécurisées (HTTPS)</li>
            <li>Accès limité aux données personnelles</li>
            <li>Surveillance des activités suspectes</li>
          </ul>

          <h2>5. Partage des Données</h2>
          <p>
            Nous ne vendons pas vos données personnelles. Nous pouvons partager
            vos données uniquement avec :
          </p>
          <ul>
            <li>
              <strong>Moneroo</strong> : Notre prestataire de paiement, pour
              traiter vos transactions
            </li>
            <li>
              <strong>Services d&apos;hébergement</strong> : Pour stocker et
              délivrer le Service
            </li>
            <li>
              <strong>Autorités légales</strong> : Si requis par la loi
            </li>
          </ul>

          <h2>6. Cookies</h2>
          <p>Nous utilisons des cookies essentiels pour :</p>
          <ul>
            <li>Maintenir votre session de connexion</li>
            <li>Mémoriser vos préférences</li>
            <li>Assurer la sécurité du Service</li>
          </ul>

          <h2>7. Vos Droits</h2>
          <p>Vous avez le droit de :</p>
          <ul>
            <li>Accéder à vos données personnelles</li>
            <li>Rectifier des données inexactes</li>
            <li>Demander la suppression de vos données</li>
            <li>Vous opposer au traitement de vos données</li>
            <li>Exporter vos données (portabilité)</li>
          </ul>
          <p>
            Pour exercer ces droits, contactez-nous à{" "}
            <a href="mailto:support@plrlibrary.com">support@plrlibrary.com</a>.
          </p>

          <h2>8. Conservation des Données</h2>
          <p>
            Nous conservons vos données tant que votre compte est actif. Après
            suppression de votre compte, nous conservons certaines données
            pendant une durée limitée pour des raisons légales et comptables.
          </p>

          <h2>9. Modifications</h2>
          <p>
            Cette politique peut être mise à jour. Les modifications
            significatives vous seront notifiées par email.
          </p>

          <h2>10. Contact</h2>
          <p>
            Pour toute question sur cette politique :{" "}
            <a href="mailto:support@plrlibrary.com">support@plrlibrary.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
