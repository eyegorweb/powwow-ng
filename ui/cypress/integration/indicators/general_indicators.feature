Feature: Indicateurs

  Je veux tester les indicateurs en fonction des partenaires

  # Gestion des commandes

  @indicators @ignore
  Scenario: GetSIM - Gestion des commandes : Je sélectionne trois partenaires A, B et C dans la barre de contexte, je visualise les indicateurs des partenaires A, B et C
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je selectionne le partenaire "lyra" dans la barre de contexte
    And Je selectionne le partenaire "timer bv" dans la barre de contexte
    And Je selectionne le partenaire "auchan" dans la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs commandes des trois partenaires

  @indicators @ignore
  Scenario: GetSIM - Gestion des commandes : Je sélectionne le partenaire A dans la barre des filtres, je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je selectionne le partenaire "lyra" dans les filtres
    When J'applique les filtres
    Then Je visualise les indicateurs commandes du partenaire A uniquement

  @indicators @ignore
  Scenario: GetSIM - Gestion des commandes : Je supprime le partenaire B dans la barre de contexte, les indicateurs ne changent pas,  je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des commandes
    And Je supprime le partenaire B de la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs commandes du partenaire A uniquement

  # Gestion des lignes

  @indicators @ignore
  Scenario: GetParc - Gestion des lignes : Je sélectionne trois partenaires A, B et C dans la barre de contexte, je visualise les indicateurs des partenaires A, B et C
    Given en tant que BO
    And Je vais sur la page des lignes
    And Je selectionne le partenaire "timer bv" dans la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs lignes des trois partenaires

  @indicators @ignore
  Scenario: GetParc - Gestion des lignes : Je sélectionne le partenaire A dans la barre des filtres, je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des lignes
    And Je selectionne le partenaire "lyra" dans les filtres
    When J'applique les filtres
    Then Je visualise les indicateurs lignes du partenaire A uniquement

  @indicators @ignore
  Scenario: GetParc - Gestion des lignes : Je supprime le partenaire B dans la barre de contexte, les indicateurs ne changent pas,  je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des lignes
    And Je supprime le partenaire B de la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs lignes du partenaire A uniquement

  # Suivi/pilotage des actes de gestion

  @indicators @ignore
  Scenario: GetParc - Suivi/pilotage des actes de gestion : Je sélectionne trois partenaires A, B et C dans la barre de contexte, je visualise les indicateurs des partenaires A, B et C
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je selectionne le partenaire "auchan" dans la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs actes de gestion des trois partenaires

  @indicators @ignore
  Scenario: GetParc - Suivi/pilotage des actes de gestion : Je sélectionne le partenaire A dans la barre des filtres, je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je selectionne le partenaire "lyra" dans les filtres
    When J'applique les filtres
    Then Je visualise les indicateurs actes de gestion du partenaire A uniquement

  @indicators @ignore
  Scenario: GetParc - Suivi/pilotage des actes de gestion : Je supprime le partenaire B dans la barre de contexte, les indicateurs ne changent pas,  je visualise les indicateurs du partenaire A
    Given en tant que BO
    And Je vais sur la page des actes de gestion
    And Je supprime le partenaire B de la barre de contexte
    When je clique sur le bouton "Appliquer"
    Then Je visualise les indicateurs actes de gestion du partenaire A uniquement
