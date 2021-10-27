Feature: Recherche de réservations

  Je veux chercher des reservations avec des filtres

  Scenario: Je fais une recherche avec tous les filtres activés
    Given en tant que BO
    And Je vais sur la page des réservations
    #And J'ouvre tous les filtres
    And Je choisis le filtre partenaire "LYRA"
    And Je ferme le filtre partenaire
    And Je choisis le filtre quantite "0" a "3"
    And Je ferme le filtre quantite
    And Je choisis le filtre compte de facturation "6.42661"
    And Je ferme le filtre compte de facturation
    And Je choisis le filtre type de carte SIM "ESIM CARTE 3"
    And Je ferme le filtre type de carte SIM
    And Je choisis le filtre createur de reservation "admin"
    And Je ferme le filtre createur de reservation
    And Je choisis le filtre action Pre-active
    When Je lance la recherche
    Then La table contient plus de 0 resultat
