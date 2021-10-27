Feature: Détails d'une reservation

  Je veux verifier les details d'une reservation

  Scenario: Je veux ouvrir le panneau de détail d'une réservation et vérifier la présence de données
    Given en tant que BO
    And Je vais sur la page des réservations
    And Je lance la recherche par ID "67"
    When J'ouvre le panneau de detail de la reservation
    Then Le panneau de detail s'est correctement ouvert et les donnees ID "#67" et nom du partenaire "LYRA NETWORK" sont presentes
