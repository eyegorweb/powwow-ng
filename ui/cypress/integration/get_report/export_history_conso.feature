Feature: tests des exports du dashboard

je veux tester les exports du Dashboard

  @ignore
  #Erreur lors de la génération du fichier à télécharger
  Scenario: Je fais un export du graph (Historique de consommation)
    Given en tant que BO
    And je suis sur la page du dashboard getReport
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    And j'export l'historique de conso
    Then le fichier est bien téléchargé

  @ignore
  #Erreur lors de la vérification du téléchargement
  Scenario: Je fais un export du graph (Statut du Parc)
    Given en tant que BO
    And je suis sur la page du dashboard getReport
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    And j'export le statut du parc
    Then le fichier est bien téléchargé
