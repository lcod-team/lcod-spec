# Représentation interne d’un composant LCOD

## 1. Métadonnées (`meta`)
- Identité : `id`, `name`, `version`, `namespace`, provenance (repo/commit/hash).
- Interfaces :
  - `inputs` : clé → { schema/jsonschema, required?, description, default }.
  - `outputs` : idem.
  - `slots` : nom → { description, inputs locaux, outputs, cardinalité, optionnel? }.
- Documentation : résumé, tags (palette), liens README/diagrammes.

## 2. Compose (`ast`)
- Liste ordonnée d’étapes `{ call, in, out, slots }`.
- Chaque `call` référence un composant/contrat/axiom ; les slots contiennent eux-mêmes des étapes (AST hiérarchique).
- Un slot partage le scope du parent mais peut déclarer des locales (`item`, `index`, etc.).
- Annotation possible (debug, labels, scope IDs) pour l’introspection.

## 3. Cas particuliers
- **Axioms** : seulement `meta` (pas d’AST) car implémentés côté kernel.
- **Inline components** : `meta` minimal + AST embarqué dans le parent (utilisé pour tests/registry scope).

## 4. Introspection
- Composant dédié : `tooling/component/introspect@0.1.0` devrait retourner :
  - `meta` complet.
  - AST normalisé.
  - Dépendances (liste des composants/contrats utilisés, profondeur, slots).
- Applications : docs automatiques, graphes mermaid, RAG (savoir quelles briques réutiliser), vérifications (inputs/outputs/slots).

## 5. Format canonique
- Sérialisation JSON/YAML `Component = { meta, ast }` (axiom : `ast = null`).
- Doit être kernel-agnostique pour que resolver/testkit puissent introspecter sans charger l’impl.
- Permet de générer les schémas, READMEs, graphes, diff.

## 6. Étapes suivantes
1. Définir le schema JSON officiel (`schemas/component.json`).
2. Implémenter `tooling/component/graph@0.1.0` qui produit un graphe mermaid à partir de l’AST.
3. Ajouter l’introspection dans le resolver/testkit pour afficher la hiérarchie avant exécution.
4. Étendre les bases RAG pour stocker `meta + ast` (facilite la recherche et la génération).
