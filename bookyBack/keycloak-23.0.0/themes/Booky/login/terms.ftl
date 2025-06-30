<#import "template.ftl" as layout>
<#import "components/button/primary.ftl" as buttonPrimary>

<@layout.registrationLayout displayMessage=false; section>
    <#if section == "header">
        ${msg("termsTitle")}
    <#elseif section == "form">
        <div id="kc-terms-text" style="font-family: 'Arial', sans-serif; line-height: 1.6; padding: 20px; max-width: 800px; margin: 0 auto; max-height: 20rem; overflow-y: auto;">
            <h1 style="text-align: center; font-size: 2.5em; color: #333; font-weight: bold; margin-bottom: 30px;">
                Conditions Générales d’Utilisation (CGU)
            </h1>
            <p>&nbsp;</p>

            <!-- Article 1 - Object -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article premier - Objet :</strong><br />
                Les Conditions Générales d’Utilisation (CGU) de la plateforme Fixed App régissent l’utilisation des services offerts par la plateforme “Fixed App”.<br />
                L’accès à la plateforme requiert l’acceptation des CGU. L’accès à la plateforme “Fixed App” signifie l’acceptation des CGU susmentionnées.
            </p>

            <!-- Article 2 - Legal Mentions -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 2 - Mentions Légales :</strong><br />
                L’Édition de la plateforme est assurée par la Banque Centrale de Tunisie ou Néoledge (ajouter l’adresse de l’éditeur).<br />
                L’Hébergeur de la plateforme est la Banque Centrale de Tunisie, 25, Rue Hédi Nouira, Tunis Cedex...
            </p>

            <!-- Article 3 - Access to the Platform -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 3 - Accès à la Plateforme :</strong><br />
                La plateforme Fixed App permet d’accéder gratuitement aux services suivants :<br />
                &ndash; Transmission et suivi des statuts des demandes d’ouverture de comptes spéciaux,<br />
                &ndash; Transmission et suivi des statuts des demandes d’alimentation de comptes spéciaux,<br />
                &ndash; Transmission et suivi des statuts des demandes de paiement sur les comptes spéciaux,<br />
                &ndash; Transmission et suivi des statuts des demandes d’ouverture des lettres de crédit,<br />
                &ndash; Transmission et suivi des demandes de remboursement,<br />
                &ndash; Transmission et suivi des demandes de transfert,<br />
                &ndash; Édition des Avis de Débit,<br />
                &ndash; Édition des Extraits de compte,<br />
                &ndash; Édition des états statistiques sur les paiements réglés sur les comptes spéciaux.
            </p>

            <!-- Article 4 - Intellectual Property -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 4 - Propriété intellectuelle :</strong><br />
                Le logo et le contenu de la plateforme “Fixed App” sont protégés par la loi n° 2009/33...
            </p>

            <!-- Article 5 - Liability -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 5 - Responsabilité :</strong><br />
                La plateforme Fixed App s’engage à fournir des services de qualité, mais ne pourra être tenue responsable en cas d’interruption des services due à des raisons techniques...
            </p>

            <!-- Article 6 - Privacy Policy -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 6 - Politique de confidentialité :</strong><br />
                La plateforme Fixed App respecte la confidentialité des données personnelles de ses utilisateurs. Toutes les informations collectées sont utilisées conformément à la politique de confidentialité...
            </p>

            <!-- Article 7 - Termination -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 7 - Résiliation :</strong><br />
                Le non-respect des CGU par un utilisateur peut entraîner la suspension ou la résiliation de son accès à la plateforme, sans préavis...
            </p>

            <!-- Article 8 - Force Majeure -->
            <p style="font-size: 1.1em; margin-bottom: 20px;">
                <strong>Article 8 - Force Majeure :</strong><br />
                La plateforme Fixed App ne pourra être tenue responsable en cas de force majeure ou d’événements indépendants de sa volonté...
            </p>

            <!-- Article 9 - Jurisdiction and Applicable Law -->
            <p style="font-size: 1.1em; margin-bottom: 30px;">
                <strong>Article 9 - Juridiction compétente et droit applicable :</strong><br />
                L’absence de résolution amiable des cas de litige implique le recours aux tribunaux Tunisiens compétents pour régler les litiges.
            </p>

           
        </div>
         <!-- Form to accept terms -->
        <form class="form-actions" action="${url.loginAction}" method="POST" style="text-align: center; margin-top: 40px;">
            <@buttonPrimary.kw name="accept" type="submit" style="width: 100%; padding: 15px; font-size: 1.2em; background-color: #4CAF50; color: white; border: none; cursor: pointer;">
                Accepter les conditions
            </@buttonPrimary.kw>
        </form>
    </#if>
</@layout.registrationLayout>
