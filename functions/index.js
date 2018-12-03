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

const USERS_BY_EMAIL_TIME_BY_ORG_PATH = '/users-by-email-time-by-org'
const THREADS_BY_ORG_PATH = '/threads-by-org'
const PROJECTS_BY_ORG_BY_USER_PATH = '/projects-by-org-by-user'
const USERS_BY_ORG_PATH = '/users-by-org'
const ORGS_PATH = '/orgs'
const COLLABO_URL = 'https://joinkoi.com'
const INBOX_SEND_EMAIL_URL = 'https://myviews.io/mail/send'

const FormData = require('form-data');
const fetch = require('node-fetch');

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

const calcTimestamp = (timestamp) => {
  const shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const removeTime = datetime => {
    var startMonth = datetime.getMonth(),
      startYear = datetime.getFullYear(),
      startDate = datetime.getDate(),
      timeless = new Date(startYear, startMonth, startDate);
    return timeless;
  }

  const displayDate = secs => {
    var datetime = new Date(secs);
    var dd = datetime.getDate();
    var mm = months[datetime.getMonth()];
    return mm + ' ' + dd;
  }

  const displayTime = secs => {
    if (!secs) return 'No start time';

    var d = new Date(secs);
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  }

  const calc = timestamp => {
    // if timestamp is from today, show the time
    let today = new Date(),
      todayStart = removeTime(today).getTime(),
      lastWeek = removeTime(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)).getTime();


    if (!timestamp) {
      return null;
    }
    else if (removeTime(new Date(timestamp)).getTime() === todayStart) {
      return displayTime(timestamp);
    }
    // in the last week, show the day of the week + time
    else if (timestamp > lastWeek) {
      return shortDays[new Date(timestamp).getDay()] + ' ' + displayTime(timestamp);
    }
    // otherwise show the date + time
    else {
      return displayDate(timestamp) + ' ' + displayTime(timestamp);
    }
  }

  return calc(timestamp)
}

const sendContentManagerEmail = (templateId, recipientEmail, data) => {
  let params = {
    templateId: templateId,
    recipientEmail: recipientEmail
  }
  console.log('in send content manager email func with data = ' + JSON.stringify(data))
  let formData = new FormData();
  formData.append("template-id", templateId);
  formData.append("recipient", recipientEmail);
  formData.append("data", JSON.stringify(data));
    fetch(INBOX_SEND_EMAIL_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  })
  .catch(function(response) {
    console.log('in successful send response')
    console.log(response)
  })
  .catch(function(error) {
      console.log('Content Manager email send request failed', error)
  })
}

const sendDailyDigestEmail = (recipientId, orgId, threadsArray, extras) => {
  console.log('in sendddemail func')
  admin.database().ref(USERS_BY_ORG_PATH + '/' + orgId + '/' + recipientId).once('value', userSnap => {
    admin.database().ref(ORGS_PATH + '/' + orgId).once('value', orgSnap => {
      if (userSnap.exists() && orgSnap.exists()) {
        let data = {
          orgName: orgSnap.val().name,
          orgURL: orgSnap.val().url,
          link: COLLABO_URL + '/' + orgSnap.val().url
        }
        console.log('send DD function in if, data = ' + JSON.stringify(data))
        if (extras > 0) {
          data.extras = '... and ' + extras + ' more new posts.'
        }

        if (threadsArray[0]) {
          Object.assign(data, {
            title0: threadsArray[0].title,
            // poster0: threadsArray[0].name,
            timestamp0: calcTimestamp(threadsArray[0].lastModified),
            // body0: threadsArray[0].body,
            comments0: threadsArray[0].commentsCount + ' comments',
            // likes0: threadsArray[0].likes + ' likes',
            link0: COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[0].id
          })
        }
        if (threadsArray[1]) {
          Object.assign(data, {
            title1: threadsArray[1].title,
            // poster1: threadsArray[1].name,
            timestamp1: calcTimestamp(threadsArray[1].lastModified),
            // body1: threadsArray[1].body,
            comments1: threadsArray[1].commentsCount + ' comments',
            // likes1: threadsArray[1].likes + ' likes',
            link1: COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[1].id
          })
        }
        if (threadsArray[2]) {
          Object.assign(data, {
            title2: threadsArray[2].title,
            // poster2: threadsArray[2].name,
            timestamp2: calcTimestamp(threadsArray[2].lastModified),
            // body2: threadsArray[2].body,
            comments2: threadsArray[2].commentsCount + ' comments',
            // likes2: threadsArray[2].likes + ' likes',
            link2: COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[2].id
          })
        }
        if (threadsArray[3]) {
          Object.assign(data, {
            title3: threadsArray[3].title,
            // poster3: threadsArray[3].name,
            timestamp3: calcTimestamp(threadsArray[3].lastModified),
            // body3: threadsArray[3].body,
            comments3: threadsArray[3].commentsCount + ' comments',
            // likes3: threadsArray[3].likes + ' likes',
            link3: COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[3].id
          })
        }
        if (threadsArray[4]) {
          Object.assign(data, {
            title4: threadsArray[4].title,
            // poster4: threadsArray[4].name,
            timestamp4: calcTimestamp(threadsArray[4].lastModified),
            // body4: threadsArray[4].body,
            comments4: threadsArray[4].commentsCount + ' comments',
            // likes4: threadsArray[4].likes + ' likes',
            link4: COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[4].id
          })
        }
        sendContentManagerEmail("49c29d51-1415-4b20-9618-bf5a045366c9", userSnap.val().email, data);
      }
    })
  })
}

exports.hourly_job =
  functions.pubsub.topic('hourly-tick').onPublish((event) => {
    let startDate = new Date();
    let hour = startDate.getHours()

    console.log("This job is run every hour!! hour = " + hour)
    
    startDate.setDate(startDate.getDate() - 30);
    startDate.setMinutes(0)
    startDate.setSeconds(0)
    let startTime = startDate.getTime()

    admin.database().ref(USERS_BY_EMAIL_TIME_BY_ORG_PATH + '/' + 18).once('value', snap => {
      // let startDate = (Math.round(new Date().getTime() / (60*60*1000))) - (10 * 24 * 3600);
      snap.forEach(function(org) {
        if (org.key === '-LHjWm2WXiQpZXtYNBk6') {
          console.log('in in org key = ' + org.key)
        admin.database().ref(THREADS_BY_ORG_PATH + '/' + org.key)
        .orderByChild('lastModified')
        .startAt(startTime)
        .once('value', threadsSnap => {
          admin.database().ref(PROJECTS_BY_ORG_BY_USER_PATH + '/' + org.key).once('value', projectsSnap => {
            console.log('in 3rd firebase threads call threads = ' + JSON.stringify(threadsSnap.val()))
            if (threadsSnap.exists() && threadsSnap.numChildren() > 0 && projectsSnap.exists()) {
              console.log('in if - thread and projects snaps exist')
              org.forEach(function(user) {
                let counter = 0;
                let threadArray = []
                if (user.key === 'puqKr2l42bS3lNMAGL9OpelAF122' || user.key === 'YbUBBVfof9YUM2DaC9SijrheTZ23') {
                  console.log('in main func if user is me or jordan')
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
                        console.log('in send if main func threadarray = ' + JSON.stringify(threadArray))
                        sendDailyDigestEmail(user.key, org.key, threadArray, extras)
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
