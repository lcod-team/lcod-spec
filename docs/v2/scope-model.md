# Modèle de scope (LCOD v2)

## 1. Compose vs Slot
- **Sous-compose (`call`)** : reçoit seulement ses `inputs`. Il crée son propre scope et n'accède pas au parent (comme une fonction).
- **Slot** : reçoit un scope local avec un pointeur vers le `parentScope`. Il peut lire/écrire selon les règles suivantes.

## 2. Lecture / écriture
- **Lecture** : on lit d'abord dans le scope local ; si la clé est absente, on remonte dans le parent. Comportement type closure.
- **Écriture** :
  1. Si la clé existe dans le scope local → on la met à jour localement (shadowing classique).
  2. Sinon, si elle existe dans le parent → on met à jour le parent (mutation directe).
  3. Sinon → on crée la clé dans le scope local.
  Cette règle évite de devoir “déclarer” explicitement la remontée tout en conservant la possibilité de masquer une valeur.

## 3. Slots read-only
- Certains slots (listeners, tâches parallèles) peuvent être marqués **read-only** : ils n'ont pas le droit d'écrire dans le parentScope, seulement dans leur scope local.
- Modificateurs possibles : `writeParent: true|false`, `isolate: true|false` selon les besoins d'exécution.

## 4. Propagation / `out`
- Le champ `out` appartient au parent (celui qui exécute le slot). Il indique quelles clés du slot doivent être recopiées vers le parent une fois le slot exécuté (ex. un composant `filter` attend un slot `predicate` qui renvoie `true/false`).
- Les helpers (`tooling/value/branch`, `tooling/object/apply`) encapsulent cette logique pour simplifier l’écriture côté auteur de compose.

## 5. Implémentation kernel
- Chaque `scope` contient une référence vers son parent ; les getters/setters traversent la chaîne si besoin.
- Les mutations sont journalisées (utile pour `tooling/log`, testkit, debug).

## 6. Avantages
- Modèle mental aligné avec des lambdas/fonctions (closure + shadowing) -> plus intuitif pour les low-coders/IA.
- Permet de gérer aussi bien des slots structurants (layout, listeners) que des slots purement algorithmiques.
