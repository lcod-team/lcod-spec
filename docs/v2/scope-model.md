# Modèle de scope (LCOD v2)

## 1. Compose vs Slot
- **Sous-compose (`call`)** : reçoit seulement ses `inputs`. Il crée son propre scope et n'accède pas au parent (comme une fonction).
- **Slot** : reçoit un scope local avec un pointeur vers le `parentScope`. Il peut lire/écrire selon les règles suivantes.

## 2. Lecture / écriture
- **Lecture** : on lit d'abord dans le scope local ; si la clé est absente, on remonte dans le parent. On retrouve le comportement d'une closure.
- **Écriture** : par défaut, on écrit dans le scope local. Pour modifier la valeur du parent, il faut le demander explicitement (via `out` ou helper). Cela autorise le shadowing tout en gardant la possibilité de propager vers le parent.

## 3. Slots read-only
- Certains slots (listeners, tâches parallèles) peuvent être marqués **read-only** : ils n'ont pas le droit d'écrire dans le parentScope, seulement dans leur scope local.
- Modificateurs possibles : `writeParent: true|false`, `isolate: true|false` selon les besoins d'exécution.

## 4. Propagation explicite
- Les slots qui doivent renvoyer des valeurs vers le parent utilisent `out` ou des helpers (`tooling/value/branch`, `tooling/object/apply`). Cela assure la traçabilité des mutations.

## 5. Implémentation kernel
- Chaque `scope` contient une référence vers son parent ; les getters/setters traversent la chaîne si besoin.
- Les mutations sont journalisées (utile pour `tooling/log`, testkit, debug).

## 6. Avantages
- Modèle mental aligné avec des lambdas/fonctions (closure + shadowing) -> plus intuitif pour les low-coders/IA.
- Permet de gérer aussi bien des slots structurants (layout, listeners) que des slots purement algorithmiques.
