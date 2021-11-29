Feature: Exports du dashboard

  je veux tester les exports du Dashboard

  @get_report @export_history_conso @ignore
  #Erreur lors de la génération du fichier à télécharger
  Scenario: Je fais un export du graph (Historique de consommation)
    Given en tant que BO
    And Je vais sur la page du dashboard
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    And j'export l'historique de conso
    Then le fichier est bien téléchargé

  @get_report @export_history_conso @ignore
  #Erreur lors de la vérification du téléchargement
  Scenario: Je fais un export du graph (Statut du Parc)
    Given en tant que BO
    And Je vais sur la page du dashboard
    And je filtre par partenaire "lyra"
    When j'applique le filtre
    And j'export le statut du parc
    Then le fichier est bien téléchargé
