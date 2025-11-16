# Roadmap LCOD v2

## 1. Branches vides
- Créer des branches `spec-v2`, `kernel-rs-v2`, `kernel-js-v2`, `kernel-java-v2`, `resolver-v2`, etc. (répertoires minimalistes + outillage de base).
- Chaque branche n’hérite pas de `main` : on repart de zéro et on réintroduit les briques progressivement.

## 2. Priorités (ordre de construction)
1. **Runtime minimal** : `runComponent/runCompose/runSlot`, sanitizer strict, scope partagé + exceptions.
2. **Resolver v2** : chargement `meta+compose`, lookup deterministe, cache local, introspection.
3. **Tooling v2** : introspection (`meta+ast`), graphes, testkit minimal compatible v2.
4. **Pipeline top-down** : composés `extract/*`, `translate/*`, `assemble/*` décrits dans `approche-haut-niveau.md`.
5. **RAG v2** : stockage des fonctions/composants (YAML/JSON) + APIs de lookup/insert.
6. **UI/Docs** : génération Mermaid/UML pour visualiser les sous-systèmes.

## 3. Sous-systèmes à formaliser
- **Runtime** : doc dédiée (sequence diagram) montrant `runComponent → resolver → runCompose → runSlot → exceptions`.
- **Resolver** : diagramme de séquence (lookup local → workspace → registry, introspection, cache).
- **Tooling/Testkit** : graphes mermaid pour les plans, slot `compose`, reporting.
- **Pipeline top-down** : déjà esquissé mais ajouter un diagramme de séquence / UML par étape (`extract` → `translate` → `assemble`).
- **RAG** : structure des entrées (YAML schema), workflows d’enrichissement.

## 4. Illustrations recommandées
- Mermaid `flowchart` pour les flux, `sequenceDiagram` pour les interactions kernel/resolver, `classDiagram` pour formaliser `meta+compose`.
- Chaque doc `docs/v2/*` devrait inclure un diagramme et lister les contrats/composés correspondants.

## 5. Stratégie d’implémentation
- Travailler branche par branche, ajouter les tests dès qu’une brique est prête, réactiver les checks progressivement.
- Une fois les branches v2 stables, fusionner vers `main` (ou basculer `main` vers cette nouvelle base).
