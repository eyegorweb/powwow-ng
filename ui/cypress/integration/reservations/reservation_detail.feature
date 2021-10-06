Feature: Detail d'une reservation

  Je veux verifier les details d'une reservation

  Scenario: Je vérifie l'ouverture du panneau de détail d'une réservation et de la présence de données
    Given en tant que BO
    And Je suis sur la page des reservations
    And Je lance la recherche par ID "67"
    When J'ouvre le panneau de detail de la reservation
    Then Le panneau de detail s'est correctement ouvert et les donnees ID "#67" et nom du partenaire "LYRA NETWORK" sont presentes
