Feature: Création de réservation

  Tests permettant de vérifier la création de réservation

  Scenario: Création d'une réservation sans appairage
    Given en tant que BO
    And Je suis sur la page des réservations
    And Je clique sur "Réserver des eSIM"
    And Je choisis le partenaire "lyra"
    And Je choisis le compte de facturation "6.42661"
    And Je passe à l'étape suivante
    And Je choisis le premier type de carte SIM avec une quantité de "10"
    And Je passe à l'étape suivante
    And Je choisis la préactivation et l'activation
    And Je choisis l'offre "LYRA_PARC2_FORFAIT"
    And Je passe à l'étape suivante
    And Je passe à l'étape suivante
    And J'accepte les conditions contractuelles
    When J'enregistre la réservation
    Then Je vérifie la création de la réservation