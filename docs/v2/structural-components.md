# Composants structurants (LCOD v2)

## 1. Rôle
Tous les composants ne sont pas purement algorithmiques : certains décrivent des structures (layout, pipeline, page). Les slots servent alors d'emplacements nommés pour organiser les enfants.

## 2. Slots catégorisés
- Un composant peut définir plusieurs slots (`header`, `body`, `footer`, `sidebar`, etc.).
- Chaque slot peut accepter zéro ou plusieurs enfants (cardinalité, optionnel, read-only...).
- Les enfants insérés dans ces slots peuvent eux-mêmes être structurants ou algorithmiques.

## 3. Introspection nécessaire
Pour naviguer dans ces structures (LLM ou humain), il faut pouvoir lister :
- Les slots disponibles et leur description.
- Les composants enfants réellement branchés dans chaque slot (via l’AST).
- Les liens hiérarchiques (graphes Mermaid, arbres). D'où l'importance du format `meta + ast` et des outils d'introspection (`tooling/component/introspect`, `tooling/component/graph`).

## 4. Exemples
- `layout/page@1` : slots `header`, `content`, `footer`.
- `pipeline/handler@1` : slots `before`, `after`, `error`.
- `tooling/testkit/unit@1` : slot `compose` qui encapsule un plan de test.

## 5. Implications
- Les kernels doivent traiter ces composants comme n'importe quel compose : exécuter chaque slot si présent.
- Les outils (docs, RAG, plan) doivent pouvoir extraire la structure pour générer des visualisations, faire de la recherche, etc.
- Les slots peuvent imposer des contraintes (type des enfants, cardinalité). Ces contraintes doivent être décrites dans `meta` (JSON Schema, validation).
