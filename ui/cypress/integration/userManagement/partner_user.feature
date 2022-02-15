Feature: Vérifications sur les utilisateurs d'un partenaire

  Vérifications sur les utilisateurs d'un partenaire

  @users @partner_user
  Scenario: Vérification que les utilisateurs visible par un partenaire sont uniquement les siens
    Given en tant que BO
    And Je vais sur la page des partenaires
    And Je vais sur la page de detail du partenaire LYRA
    And Je vais sur l'onglet "GESTION DES UTILISATEURS" et vérifie l'URL "/users"
    And Je vais dans la section "Utilisateurs" et vérifie l'URL "/users/users"
    And Je récupère le nombre d'utilisateurs dans le partenaire
    And Je me déconnecte
    And Je me connecte en tant que partenaire lyra
    And Je vais sur la page des utilisateurs
    When Je récupère le nombre d'utilisateurs
    Then Les deux nombres correspondent
