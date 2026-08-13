Feature: Browse the public portfolio
  The public portfolio must make verified work and transparent editorial content easy to inspect.

  Scenario: A recruiter opens the portfolio overview
    Given the portfolio API is available
    When I request the portfolio overview
    Then the overview identifies Naser Rouhi as a Senior Software Engineer
    And the overview publishes the complete six-role career timeline
    And the overview provides the resume contact details
    And the overview features the public Daveslist repository

  Scenario: A Persian reader opens the 2026 portfolio case study
    Given the portfolio API is available
    When I request the portfolio case study in Persian
    Then the article is returned in Persian
    And the article says it documents the 2026 portfolio build

  Scenario: A visitor requests an unknown article
    Given the portfolio API is available
    When I request an article that has not been published
    Then the API reports that the article was not found
