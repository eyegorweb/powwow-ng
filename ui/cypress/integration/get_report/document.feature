Feature: Gestion des documents

  Je veux tester la page de gestion des documents

  #Apparition des documents trop aléatoire pour des tests rapides
  #Les tests fonctionnent (testé manuellement en changeant les noms, etc...)

  @ignore
  Scenario: Je veux télécharger un document
    Given en tant que BO
    And Je cree le rapport "TestCypress" avec le partenaire "lyra"
    And Je filtre par partenaire "lyra"
    And Je filtre par modele de rapport "TestCypress"
    And Je rafraichis la recherche
    When Je clique sur le bouton "Télécharger"
    Then Le document a bien été téléchargé

  @ignore
  Scenario: Je veux supprimer un document
    Given en tant que BO
    And Je cree le rapport "TestCypressDelete" avec le partenaire "lyra"
    And Je filtre par partenaire "lyra"
    When Je rafraichis la recherche
    Then La table contient 0 résultat
