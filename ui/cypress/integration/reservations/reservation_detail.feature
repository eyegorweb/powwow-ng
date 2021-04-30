Feature: Detail d'une reservation

  Je veux verifier les details d'une reservation

  Scenario: Verification de l'ouverture du panneau de detail d'une reservation et de la presence de donnees
    Given en tant que BO
    And Je suis sur la page des reservations
    And Je lance la recherche par ID "67"
    When J'ouvre le panneau de detail de la reservation
    Then Le panneau de detail s'est correctement ouvert et les donnees ID "#67" et nom du partenaire "LYRA NETWORK" sont presentes
