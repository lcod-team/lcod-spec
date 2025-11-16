# Fonctions de haut niveau (kernels LCOD)

## `runComponent(id, parentScope, inputState)`
1. `resolver(id)` → `{ meta, compose }` (ou axiom).
2. `scope := prepareScope(meta, parentScope, inputState)` : hydrate les inputs, initialise outputs/slots, attache logger/runtime info.
3. `runCompose(scope, compose)` (peut appeler `runSlot`).
4. `return extractOutputs(scope, meta.outputs)`.

## `runCompose(scope, steps)`
- Itère sur les étapes de l’AST.
- Pour chaque étape :
  - Résout les entrées (`evaluate(step.in, scope)`).
  - Appelle `runComponent(step.call, scope, inputs)` ou l’axiom correspondant.
  - Mappe les sorties (`applyOut(scope, step.out)`).
  - Exécute les slots via `runSlot` si présents.
- Gère `flow/try`, `flow/foreach`, etc.

## `runSlot(slotName, slotDefinition, parentScope)`
- Crée un `slotScope` (héritage du parent + locales `item`, `index`, etc.).
- Exécute `runCompose(slotScope, slotSteps)`.
- Propage explicitement les clés définies par `slotDefinition.out` vers `parentScope`.

## `prepareScope(meta, parentScope, inputState)`
- Valide/sanitise les inputs selon `meta.inputs`.
- Instancie outputs vides, slots, contexte (`logger`, `runtimeInfo`).
- Conserve un lien vers `parentScope` pour l’accès direct (principe v2).

## `extractOutputs(scope, outputsMeta)`
- Assemble l’objet de sortie (applique defaults, retire les champs non déclarés).

## `resolver(id)`
- Lookup deterministe (local → projet → workspace → user → cache → registry).
- Retourne `meta + compose` (ou stub axiom/contrat).

## Fonctions associées
- `runTry(scope, block)` : implémente `try/catch/finally` avec format `{name,message,payload}`.
- `runForeach(scope, items, slots)` : injecte `item/index`, délègue à `runSlot`.
- `runBranch(scope, cond, slots)` : helper ergonomique (scope partagé) pour les conditionnelles.
- `runInlineComponent(meta, compose, parentScope)` : exécute un composant défini inline sans passer par le resolver.
