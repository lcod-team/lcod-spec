# Gestion des exceptions (LCOD v2)

## 1. Format standard
- Exception = `{ name, message, payload }`.
- `name` : identifiant (ex. `ValidationError`).
- `message` : texte court.
- `payload` : données structurées optionnelles.

## 2. Primitive `throw`
- Composant `lcod://tooling/exception/throw@1` : prend `name`, `message`, `payload`, arrête l’exécution et remonte l’exception au slot/pipeline supérieur.

## 3. `flow/try` (v2)
- Slots : `body`, `catch`, `finally`.
- Exécution :
  1. `body` s’exécute ; si aucune exception, on passe à `finally`.
  2. Si `body` lance une exception :
     - `catch` reçoit l’objet (accessible via `state.error`). Il peut traiter l’erreur (pas de rethrow) ou relancer via `throw`.
     - `finally` s’exécute ensuite, qu’il y ait eu traitement ou non.
- Si aucun `catch` défini, l’exception remonte immédiatement.

## 4. Propagation
- `runComponent` laisse remonter jusqu’au prochain `flow/try`. Sans catch, l’erreur atteint l’appelant (compose parent, puis CLI/host).
- Les kernels peuvent ajouter des métadonnées (stack trace) mais doivent préserver la forme `{ name, message, payload }`.

## 5. Helpers
- `tooling/exception/rethrow@1` : relance l’exception reçue (utile dans un catch conditionnel).
- `tooling/exception/match@1` : test sur `name`/`payload` pour router vers différents slots.
