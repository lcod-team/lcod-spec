# Principes LCOD (version KISS)

1. **Composant = boîte noire lisible.** Le `lcp.toml` décrit inputs/outputs/slots ; le compose tient en un écran et reste auto-portant.
2. **Compose = fonction.** On nomme les étapes pour la compréhension, mais on garde l’esprit “j’implémente une fonction”, sans narration inutile.
3. **Implication évidente, pas de magie cachée.** Spread/déstructuration autorisés s’ils sont intuitifs ; toutes les dépendances restent déclarées.
4. **Slots = lambdas avec scope parent.** Un compose crée son scope, le slot hérite du scope appelant + ses variables locales et peut modifier le parent (objectif v2 formalisé).
5. **Factoriser dès que possible.** Dès qu’un pattern revient, on crée un helper `tooling/*` plutôt que d’injecter un script.
6. **Kernel minimal (RPython-like).** Exécution, slots, IO : rien d’autre. Toute logique portable vit dans des composés/contrats.
7. **Lookup déterministe : local → projet → workspace → user → cache → registry.** L’ordre est public et constant.
8. **Sanitizer strict mais flexible.** Seuls inputs/outputs déclarés circulent ; un paramètre peut être `any` pour transporter une structure libre.
9. **Resolver transparent.** Suit la même chaîne de lookup, warning clair dès qu’on sort du best-case.
10. **Testkit recommandé, pas imposé.** LCOD fonctionne sans, mais chaque package devrait fournir `tests/testkit/**` + plan d’exécution local.
11. **Docs inline uniques.** README/schémas générés depuis `lcp.toml` pour éviter les divergences.
12. **Logs dès le prototype.** `tooling/log` et ses contextes remplacent les `console.log` dès le premier jour.
13. **Pas de copies inutiles.** On réutilise les mêmes instances pour mémoire et perfs ; clone uniquement quand sécurité/parallélisme l’exigent.
14. **Exceptions > fallback lourds.** Le happy path doit rester fluide ; on laisse remonter l’exception et on la traite au niveau opportun.
15. **Scopes explicites.** Compose arrive avec son scope vierge (rempli des entrées). Sous-compose/slot garde une référence sur le scope parent + ses locales.
16. **Toujours KISS.** Modules courts, une responsabilité, composition explicite.
