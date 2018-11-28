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

exports.hourly_job =
  functions.pubsub.topic('hourly-tick').onPublish((event) => {
    console.log("This job is run every hour!")
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 10);
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    let startTime = startDate.getTime()

    admin.database().ref(Constants.USERS_BY_EMAIL_TIME_BY_ORG_PATH + '/' + 18).once('value', snap => {
      let startDate = (Math.round(new Date().getTime() / (60*60*1000))) - (24 * 3600);
      snap.forEach(function(org) {
        if (org.key === '-LHjWm2WXiQpZXtYNBk6') {
        admin.database().ref(Constants.THREADS_BY_ORG_PATH + '/' + org.key)
        .orderByChild('lastModified')
        .startAt(startTime)
        .once('value', threadsSnap => {
          admin.database().ref(Constants.PROJECTS_BY_ORG_BY_USER_PATH + '/' + org.key).once('value', projectsSnap => {
            if (threadsSnap.exists() && threadsSnap.numChildren() > 0 && projectsSnap.exists()) {
              org.forEach(function(user) {
                let counter = 0;
                let threadArray = []
                if (user.key === 'puqKr2l42bS3lNMAGL9OpelAF122' || user.key === 'YbUBBVfof9YUM2DaC9SijrheTZ23') {
                  let itemsProcessed = 0;
                  threadsSnap.forEach(function(thread) {
                    // check thread is in project

                    if (thread.exists() && thread.val().projectId && projectsSnap.val()[user.key] 
                      && projectsSnap.val()[user.key][thread.val().projectId]) {                     
                      if (counter < 5) {
                        threadArray.push(Object.assign({}, thread.val(), {id: thread.key}))
                      }
                      counter++;

                      if (counter === threadsSnap.numChildren()) {
                        let extras = threadsSnap.numChildren() - 5
                        Helpers.sendDailyDigestEmail(user.key, org.key, threadArray, extras)
                      }
                    }
                    else {
                      counter++
                    }
                  })
                }
              })
            }
          })
        })
        }
      })
    })
  });

exports.daily_job =
  functions.pubsub.topic('daily-tick').onPublish((event) => {
    console.log("This job is run every day!")
  });

exports.weekly_job =
  functions.pubsub.topic('weekly-tick').onPublish((event) => {
    console.log("This job is run every week!")
  });
