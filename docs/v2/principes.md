# Principes LCOD (version KISS)

1. **Chaque composant est une boîte noire lisible.** Son `lcp.toml` décrit inputs/outputs/slots, et le compose reste assez court pour tenir sur un écran.
2. **Un compose raconte une histoire.** Les étapes sont nommées, les blocs sont ordonnés pour que n’importe qui comprenne le flux sans scripts.
3. **Pas de magie implicite.** Toute dépendance (contrat, helper, manifest) est déclarée explicitement.
4. **Les slots sont des fonctions.** Ils reçoivent un état, produisent un état, et n’éditent rien en douce.
5. **On préfère les helpers aux scripts.** Dès qu’un pattern revient, on factorise un composant `tooling/*` plutôt que d’injecter du JS.
6. **Les kernels restent minces.** Toute logique portable vit dans des composés/contrats ; le runtime ne gère que l’exécution.
7. **Les manifests locaux priment.** `LCOD_WORKSPACE_PATHS` et `SPEC_REPO_PATH` sont toujours respectés pour travailler hors réseau.
8. **Sanitizer strict.** Seuls les inputs/outputs déclarés circulent, aucun champ fantôme.
9. **Résolution déterministe.** Resolver lit d’abord les sources locales, puis les catalogues, sans heuristiques cachées.
10. **Testkit au même niveau que le code.** Chaque package fournit ses composes de tests (`tests/testkit/**`) et un plan pour les lancer en une commande.
11. **Docs embarquées.** Toute nouvelle primitive vient avec README, schéma, et exemple mermaid quand pertinent.
12. **Observabilité intégrée.** Loggers (`tooling/log`, contextes) sont présents dès le prototype pour éviter les “console.log”.
13. **Pas de copies inutiles.** Les contrats manipulent les mêmes instances sauf si la sécurité impose une duplication.
14. **Fallback prévisible.** Quand une ressource manque, la warning l’explique et indique la stratégie de repli.
15. **Toujours KISS.** Si une compose nécessite plusieurs écrans ou des centaines de lignes, on la fragmente.
