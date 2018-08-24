const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.watchFile = functions.https.onRequest((request, response) => {
  const fileId = request.get("X-Goog-Channel-ID");
  const state = request.get("X-Goog-Resource-State");
  const changed = request.get("X-Goog-Changed");
  const data = {
    fileId,
    state: state || "",
    changed: changed || "",
    stamp: (new Date()).toString()
  }
  admin.database().ref("updates/" + fileId).set(data);
  response.send("Detect Changes.");
});

exports.verify = functions.https.onRequest((request, response) => {
  response.status(200).send("google-site-verification: google48cc54664f2282f5.html");
});
