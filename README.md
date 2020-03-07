# test-firestore-security-rule

## Setup

Set your Firebase project ID as environment variable.

```
export FIREBASE_PROJECT_ID=xxxxxxx
```

## Running the tests with the emulator

```
firebase emulators:exec --only firestore 'npm test'
```

## References

- https://firebase.google.com/docs/firestore/security/rules-structure
- https://firebase.google.com/docs/firestore/security/test-rules-emulator
- https://github.com/firebase/quickstart-nodejs/blob/master/firestore-emulator/javascript-quickstart/README.md
