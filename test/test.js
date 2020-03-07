const firebase = require("@firebase/testing");
const fs = require("fs");

const projectId = process.env.FIREBASE_PROJECT_ID;
const rules = fs.readFileSync("./firestore.rules", "utf8");

function authedApp(uid) {
  return firebase.initializeTestApp({projectId, auth: {uid}}).firestore();
}

function getFavoriteItemDocument(db, userId) {
  return db.collection("favorites")
    .doc(userId)
    .collection("items")
    .doc("abc");
}

beforeEach(async () => {
  await firebase.clearFirestoreData({projectId});
});

before(async () => {
  await firebase.loadFirestoreRules({projectId, rules});
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
});

describe("My app", () => {
  it("should not be permitted to access user document", async () => {
    const db = authedApp("alice");
    const userDocument = db.collection("favorites").doc("alice");

    await firebase.assertFails(userDocument.get());
    await firebase.assertFails(userDocument.set({id: "alice"}));
    await firebase.assertFails(userDocument.delete());
  });

  it("should only let users access their own favorite item", async () => {
    const db = authedApp("alice");
    await firebase.assertSucceeds(getFavoriteItemDocument(db, "alice").set({id: "abc"}));
    await firebase.assertSucceeds(getFavoriteItemDocument(db, "alice").get());
    await firebase.assertSucceeds(getFavoriteItemDocument(db, "alice").delete());

    await firebase.assertFails(getFavoriteItemDocument(db, "bob").set({id: "abc"}));
    await firebase.assertFails(getFavoriteItemDocument(db, "bob").get());
    await firebase.assertFails(getFavoriteItemDocument(db, "bob").delete());
  });
});
