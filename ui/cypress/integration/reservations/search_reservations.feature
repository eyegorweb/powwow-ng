Feature: Recherche de réservations

  Je veux chercher des reservations avec des filtres

  @reservations @search_reservations
  Scenario: Je fais une recherche avec tous les filtres activés
    Given en tant que BO
    And Je vais sur la page des réservations
    And Je filtre par "Partenaires" nommé "LYRA NETWORK"
    And Je filtre par quantité "Quantité" avec un minimum de "0" et un maximum de "3"
    And Je filtre par "Compte de facturation" nommé "6.42661 - LYRA"
    And Je filtre par "Type de carte SIM" nommé "ESIM CARTE 3 ESIMM2M003"
    And Je filtre par "Action" nommé "Pré-activé"
    And Je filtre par liste "Créateur de la réservation" en choississant la valeur "Admin"
    When Je lance la recherche
    Then La table contient plus de 0 resultat
