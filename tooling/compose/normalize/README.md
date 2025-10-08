# tooling/compose/normalize@1

Normalise un `compose` LCOD avant exécution afin de supporter une syntaxe abrégée (« sugar ») côté auteur, tout en exposant une structure canonique aux kernels.

## Entrée

```json
{
  "compose": [ { "call": "...", "in": { ... }, ... } ]
}
```

- `compose` : tableau de steps (forme abrégée acceptée). Les steps suivent la forme standard LCOD (`call`, `in`, `out`, `children`, `collectPath`, …).

## Sortie

```json
{
  "compose": [ { "call": "...", "in": { ... }, ... } ]
}
```

- `compose` : mêmes steps mais avec la syntaxe normalisée (tous les `in`/`out` explicitement résolus, sugar développé).

## Règles de normalisation

- Identité : `foo: "-"` dans `in` devient `foo: "$.foo"`; dans `out` devient `foo: "foo"`.
- Structures imbriquées : le sugar ne s’applique qu’au niveau racine des mappings (`depth === 0`). Les sous-objets/arrays sont laissés inchangés sauf appels récursifs.
- Compatibilité : les steps enfants (`children`) sont normalisés récursivement.

## Implémentations

- Référence initiale : JavaScript/TypeScript (réutilisable par Node et par le resolver CLI).
- Runtimes éventuels : ports Rust / autre langage alignés avec cette spécification.

Ce composant constitue la brique commune que les kernels peuvent appeler en amont (ou embarquer) pour éviter de dupliquer la logique de sugar parsing.
