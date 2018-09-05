const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { google } = require('googleapis');
admin.initializeApp(functions.config().firebase);
const drive = google.drive({
  version: "v3",
  auth: "AIzaSyBPeQELFRtLqr90PQhpgOeZolFMNUeLR4Q"
});
const INTERVAL = 1000; // 1s
const changeTimers = {};

const getChange = (data) => {
  clearTimeout(changeTimers[data.fileId + data.threadId]);
  changeTimers[data.fileId + data.threadId] = setTimeout(() => {
    drive.files.get({ fileId: data.fileId, fields: "*" })
      .then((res) => {
        const saveData = {
          fileId: data.fileId,
          state: data.state,
          changed: data.changed,
          stamp: data.stamp,
          name: res.data.name
        };
        if (res.data.lastModifyingUser) {
          saveData.lastModifyingUser = res.data.lastModifyingUser;
        }
        admin.database().ref("updates/" + data.threadId)
          .once("value")
          .then((snapshot) => {
            const updates = snapshot.val() || [];
            updates.push(saveData);
            admin.database().ref("updates/" + data.threadId).set(updates);
          })
      })
  }, INTERVAL);
}
exports.watchFile = functions.https.onRequest((request, response) => {
  const id = request.get("X-Goog-Channel-ID");
  const state = request.get("X-Goog-Resource-State");
  const changed = request.get("X-Goog-Changed");
  const fileId = id.split('///')[0];
  const threadId = id.split('///')[1];
  if (state !== "sync") {
    const data = {
      fileId,
      threadId,
      state: state || "",
      changed: changed || "",
      stamp: (new Date()).toString()
    };
    getChange(data);
  }
  response.send("Detect Changes.");
});

exports.verify = functions.https.onRequest((request, response) => {
  response.status(200).send("google-site-verification: google48cc54664f2282f5.html");
});
