import Firebase from 'firebase';
import * as Constants from './constants';
import { sendMixpanelEvent } from './actions/loggingActions'
import 'whatwg-fetch';
// import { convertToRaw, convertFromRaw, EditorState, ContentState, convertFromHTML } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';

export function calcTimestamp(timestamp) {
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

export function findThreadMentions(auth, threadBody, org, project, thread) {
	if (threadBody && threadBody.length > 0) {
		let sentArray = []
	  	let pattern = /\B@[a-z0-9_-]+/gi;
	  	let found = threadBody.match(pattern);
	  	if (found) {
		    for (let i = 0; i < found.length; i++) {
		      let username = found[i].substr(1);
		      Firebase.database().ref(Constants.USERNAMES_TO_USERIDS_PATH + '/' + username).once('value', snap => {
		        if (snap.exists()) {
		          if (snap.val().userId !== auth && sentArray.indexOf(snap.val().userId) === -1) {
		            // sendCollaboInboxMessage(auth, snap.val().userId, Constants.THREAD_MENTION_MESSAGE, org, project, thread, convertEditorStateToHTML(convertStoredToEditorState(threadBody)))
		            sendCollaboInboxMessage(auth, snap.val().userId, Constants.THREAD_MENTION_MESSAGE, org, project, thread, threadBody)
		            sentArray.push(snap.val().userId);
		          }
		        }
		      })
		    }
	  	}
	}
}

export function cleanEmailToFirebase(email) {
	return email.replace(/\./g, ',');
}

export function cleanEmailFromFirebase(email) {
	return email.replace(/\,/g, '.');
}

// export function updateAlgoliaUsersIndex(user) {
// 	let usernameSuffixes = [];
// 	if (user.username) {
// 		for(let i = 1; i < user.username.length - 1; i++) {
// 		  usernameSuffixes.push(user.username.substr(i))
// 		}
// 	}

// 	//update Algolia index
// 	var algoliasearch = require('algoliasearch');
// 	var client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
// 	var index = client.initIndex('collabo-users');
// 	index.saveObject(Object.assign({}, user, {suffixes: usernameSuffixes})
// 	  , function(err, content) {
// 	  if (err) {
// 	    console.error(err);
// 	    return;
// 	  }
// 	});
// }

export function addAlgoliaComment(objectId, body, commentId, user) {
	const algoliasearch = require('algoliasearch');
 	const client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
  	const index = client.initIndex('posts');

  	index.getObject(objectId, ['comments'], function(err, content) {
	    if (err) throw err;
	    let algoliaComments = content.comments || []
	    algoliaComments.push(Object.assign({}, {body: body}, {commentId: commentId}))
	    updateAlgoliaIndex(objectId, {comments: algoliaComments});
  	});
}

export function deleteAlgoliaComment(objectId, commentId) {
	const algoliasearch = require('algoliasearch');
 	const client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
  	const index = client.initIndex('posts');

  	index.getObject(objectId, ['comments'], function(err, content) {
	    if (err) throw err;
	    let algoliaComments = content.comments || []

	    for (let i = 0; i < algoliaComments.length; i++) {
          if (algoliaComments[i].commentId === commentId) {
            algoliaComments.splice(i, 1);
            break
          }
        }
	    updateAlgoliaIndex(objectId, {comments: algoliaComments});
  	});
}

// export function updateAlgoliaGeosIndex(geo) {
// 	//update Algolia index
// 	var algoliasearch = require('algoliasearch');
// 	var client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
// 	var index = client.initIndex('collabo-posts');
// 	index.saveObject({
// 	  objectID: geo.placeId,
// 	  label: geo.label,
// 	  fullCountry: geo.fullCountry
// 	}, function(err, content) {
// 	  if (err) {
// 	    console.error(err);
// 	    return;
// 	  }
// 	});
// }

export function updateAlgoliaAttachments(threadId) {
	setTimeout(function() {
	    Firebase.database().ref(Constants.ATTACHMENTS_BY_THREAD_PATH + '/' + threadId).once('value', snap => {
	      if (snap.exists()) {
	        let count = 0;
	        let algoliaArray = []
	        snap.forEach(function(attachment) {
	          count++;
	          algoliaArray.push(Object.assign({}, {name: attachment.val().name}, {attachmentId: attachment.key}))
	          if (count >= snap.numChildren()) {
	            updateAlgoliaIndex(threadId, {attachments: algoliaArray}, Constants.POSTS_INDEX)
	          }
	        })
	      }
	    })
  	},1000)
}

export function updateAlgoliaIndex(objectID, object, indexChoice) {
	const algoliasearch = require('algoliasearch');
	const client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
	indexChoice = indexChoice ? indexChoice : 'posts'
	const index = client.initIndex(indexChoice);

	Object.assign(object, {objectID: objectID}, {lastModified: new Date().getTime()})

	index.partialUpdateObject(
	  object
	, function(err, content) {
	  if (err) {
	    console.error(err);
	    return;
	  }
	});
}

export function deleteAlgoliaObject(objectID, indexChoice) {
	const algoliasearch = require('algoliasearch');
	const client = algoliasearch('NFI90PSOIY', '2bbae42da8376a35748f4817449e0b23', {protocol:'https:'});
	indexChoice = indexChoice ? indexChoice : 'posts'
	const index = client.initIndex(indexChoice);
	index.deleteObject(objectID, function(err, content) {
	  // if (err) throw err;
	  // console.log(content);
	});
}

export function byPopularity(a, b) {
  if (a.popularityScore > b.popularityScore)
    return -1;
  if (a.popularityScore < b.popularityScore)
    return 1;
  return 0;
}

export function byPriority(a, b) {
  if (a.priority < b.priority)
    return -1;
  if (a.priority > b.priority)
    return 1;
  return 0;
}

export function reviewsLastModifiedDesc(a, b) {
  if (a.review.lastModified > b.review.lastModified)
    return -1;
  if (a.review.lastModified < b.review.lastModified)
    return 1;
  return 0;
}

export function lastModifiedDesc(a, b) {
  if (a.lastModified > b.lastModified)
    return -1;
  if (a.lastModified < b.lastModified)
    return 1;
  return 0;
}

export function lastModifiedAsc(a, b) {
  if (a.lastModified < b.lastModified)
    return -1;
  if (a.lastModified > b.lastModified)
    return 1;
  return 0;
}

export function byUsername(a, b) {
  if (a.username < b.username)
    return -1;
  if (a.username > b.username)
    return 1;
  return 0;
}

export function byName(a, b) {
  if (a.name < b.name)
    return -1;
  if (a.name > b.name)
    return 1;
  return 0;
}

export function searchLikes(uid, likes) {
  for (var key in likes) {
    if (key === uid) {
      return true;
    }
  }
  return false;
}



export function getImagePath(imagesObject) {
	let imagesArray = [];
	for (var key in imagesObject) {
    	if (!imagesObject.hasOwnProperty(key)) continue;
    	imagesArray.push(imagesObject[key]);
  	}
  	return imagesArray;
}

export function getTagsArray(tagsSnap) {
	let tagsArray = [];
	for (var key in tagsSnap) {
		if (!tagsSnap.hasOwnProperty(key)) continue;
		tagsArray.push(key);
	}
	return tagsArray;
}

export function makeSubject(result, lastModified) {
	let subject = { title: result.title };
	if (result.address) subject.address = result.address;
	if (result.internationalPhoneNumber) subject.internationalPhoneNumber = result.formattedPhoneNumber;
	if (result.hours) subject.hours = result.hours;
	if (result.permanentlyClosed) subject.permanentlyClosed = result.permanentlyClosed;
	if (result.website) subject.website = result.website;
	return Object.assign(subject, lastModified);
}

export function makeReview(tip, subjectId, lastModified) {
	let reviewObject = { subjectId: subjectId };
	if (tip.rating) reviewObject.rating = tip.rating;
	if (tip.caption) reviewObject.caption = tip.caption;
	return Object.assign(reviewObject, lastModified);
}

export function makeReviewBySubject(tip, subjectId, lastModified) {
	let reviewObject = {};
	if (tip.reviewId) reviewObject.reviewId = tip.reviewId;
	if (tip.rating) reviewObject.rating = tip.rating;
	if (tip.caption) reviewObject.caption = tip.caption;
	return Object.assign(reviewObject, lastModified);
}

export function makeItineraryByUser(itinerary, lastModified) {
	let itineraryObject = { 
		title: itinerary.title,
		geo: itinerary.geo
	};
	if (itinerary.description) itineraryObject.description = itinerary.description;
	return Object.assign(itineraryObject, lastModified);
}

export function createItineraryObject(itineraryId, itineraryVal, creatorId, creatorSnap, likesData) {
  const key = { id: itineraryId };
  const createdBy = { createdBy: creatorSnap };
  createdBy.createdBy.userId = creatorId;
  let likes = {
    isLiked: likesData[itineraryId]
  }
  
  return Object.assign({}, itineraryVal, key, createdBy, likes);
}

export function findIndexByValue(arr, value, propertyName) {
	for (let i = 0; i < arr.length; i++) {
		if (arr[i].propertyName === value) return i;
	}
	return -1;
}

export function generateImageFileName(len)
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let length = len ? len : 15

    for( var i=0; i < length; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

export function incrementThreadCount(counterType, threadId, thread, userId) {
	// increment count on threads
	Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // increment count on threads by project
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// incrememt count on threads by user by org
	Firebase.database().ref(Constants.THREADS_BY_USER_BY_ORG_PATH + '/' + userId + '/' + thread.orgId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // incrememt count on threads by org
	Firebase.database().ref(Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });
}

export function decrementThreadCount(counterType, threadId, thread, userId) {
	// decrement count on threads
	Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on threads by project
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// decrement count on threads by user by org
	Firebase.database().ref(Constants.THREADS_BY_USER_BY_ORG_PATH + '/' + userId + '/' + thread.orgId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on threads by org
	Firebase.database().ref(Constants.THREADS_BY_ORG_PATH + '/' + thread.orgId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });
}

export function incrementItineraryCount(counterType, itineraryId, geo, userId) {
	// increment count on itineraries
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // increment count on itineraries by geo by user
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + geo.placeId + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // increment count on itineraries by geo
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + geo.placeId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// incrememt count on itineraries by user
	Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });
}

export function incrementReviewCount(counterType, reviewId, subjectId, userId) {
	// increment count on reviews
	Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // increment count on reviews by subject
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// incrememt count on reviews by user
	Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId + '/' + reviewId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// // increment count on subject
	// Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/' + counterType).transaction(function (current_count) {
	// 	return (current_count || 0) + 1;
 //    });

	// // update subject timestamp
 //    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).update({ lastModified: Firebase.database.ServerValue.TIMESTAMP })
}

export function decrementReviewCount(counterType, reviewId, subjectId, userId) {
	// decrement count on reviews
	Firebase.database().ref(Constants.REVIEWS_PATH + '/' + reviewId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on reviews by subject
    Firebase.database().ref(Constants.REVIEWS_BY_SUBJECT_PATH + '/' + subjectId + '/' + userId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// decrement count on reviews by user
	Firebase.database().ref(Constants.REVIEWS_BY_USER_PATH + '/' + userId + '/' + reviewId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// // decrement count on subject
	// Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/' + counterType).transaction(function (current_count) {
	// 	return (current_count - 1 > 0) ? (current_count - 1) : 0;
 //    });

	// // update subject timestamp
 //    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).update({ lastModified: Firebase.database.ServerValue.TIMESTAMP })
}

export function decrementItineraryCount(counterType, itineraryId, geo, userId) {
	// decrement count on itineraries
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on itienraries by geo by user
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_BY_USER_PATH + '/' + geo.placeId + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on itineraries by geo
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + geo.placeId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// decrement count on itineraries by user
	Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });
}

export function incrementGuideScore(itineraryId, score) {
	// update guide popularity scores
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', snap => {
		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/popularityScore').transaction(function (current_count) {
		  return (current_count || 0) + score;
		});
		Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + snap.val().geo.placeId + '/' + itineraryId + '/popularityScore').transaction(function (current_count) {
		  return (current_count || 0) + score;
		});
	})
}

export function decrementGuideScore(itineraryId, score) {
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId).once('value', snap => {
		Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/popularityScore').transaction(function (current_count) {
		  return (current_count - score > 0) ? current_count - score : 0;
		});
		Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + snap.val().geo.placeId + '/' + itineraryId + '/popularityScore').transaction(function (current_count) {
		  return (current_count - score > 0) ? current_count - score : 0;
		});
	})
}

export function fanOutToFollowersFeed(senderId, itineraryId, lastModified) {
	Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + senderId).once('value', snap => {
		let updates = {}
		snap.forEach(function(user) {
			updates[Constants.USERS_FEED_PATH + '/' + user.key + '/' + itineraryId] = lastModified
		})

		// console.log('in helpers = ' + JSON.stringify(updates))
		// also update for the sender's feed
		updates[Constants.USERS_FEED_PATH + '/' + senderId + '/' + itineraryId] = lastModified
		Firebase.database().ref().update(updates);
	})
}

export function fanOutFollowUser(isFollowing, theFollowed) {
	Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + theFollowed).once('value', snap => {
		let updates = {}
		snap.forEach(function(itin) {
			updates[Constants.USERS_FEED_PATH + '/' + isFollowing + '/' + itin.key] = itin.val().lastModified
		})

		// console.log(JSON.stringify(updates))
		Firebase.database().ref().update(updates)
	})
}

export function fanOutUnFollowUser(isFollowing, theFollowed) {
	Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + theFollowed).once('value', snap => {
		let updates = {}
		snap.forEach(function(itin) {
			updates[Constants.USERS_FEED_PATH + '/' + isFollowing + '/' + itin.key] = null
		})

		// console.log(JSON.stringify(updates))
		Firebase.database().ref().update(updates)
	})
}

export function sendContentManagerEmail(templateId, recipientEmail, data) {
	let params = {
		templateId: templateId,
		recipientEmail: recipientEmail
	}

	let formData = new FormData();
	formData.append("template-id", templateId);
	formData.append("recipient", recipientEmail);
	formData.append("data", JSON.stringify(data));
    fetch(Constants.INBOX_SEND_EMAIL_URL, {
	  method: 'POST',
	  mode: 'no-cors',
	  body: formData
	})
	.catch(function(response) {
		sendMixpanelEvent(Constants.MIXPANEL_EMAIL_SENT, params); 
		console.log(response)
	})
	.catch(function(error) {
		sendMixpanelEvent(Constants.MIXPANEL_EMAIL_FAILED, Object.assign({}, params, error)); 
	    console.log('Content Manager email send request failed', error)
	})
}

export function sendCollaboUpdateNotifs(senderId, messageType, org, project, thread, sendObject) {
	Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + org.id).once('value', orgSnapshot => {
		orgSnapshot.forEach(function(orgUser) {
			if (orgUser.key !== senderId ) {
				sendCollaboInboxMessage(senderId, orgUser.key, messageType, org, project, thread, sendObject);
			}
		})
	})
}

export function sendCollaboInboxMessage(senderId, recipientId, messageType, org, project, thread, sendObject) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';
	let emailData = { emailType: messageType };
	let emailTemplateID = "5d7dc9ce-f38d-47b9-b73c-09d3e187a6d9"

	let sendEmail = true;

	let orgId = thread ? thread.orgId : org.id

	Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
		Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + org.id + '/' + senderId).once('value', senderSnapshot => {
			switch(messageType) {
				case Constants.THREAD_MENTION_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' mentioned you in the post: ' + thread.title;
					inboxObject.link = '/' + project.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' mentioned you in a post on Koi'
					emailData.bodyMessage = senderSnapshot.val().username + ' mentioned you in the post: "' + thread.title + '":'
					emailData.bodyHighlight = sendObject
					emailData.buttonText = 'GO TO THREAD'
					emailData.buttonLink = Constants.COLLABO_URL + '/' + org.url + '/' + thread.projectId + '/' + thread.threadId
					emailData.senderLink = Constants.COLLABO_URL + '/' + org.url + '/users/' + senderSnapshot.val().username
					break;
				case Constants.LIKE_THREAD_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' upvoted your post "' + thread.title + '"';
					inboxObject.link = '/' + thread.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' liked your post on Koi'
					emailData.bodyMessage = senderSnapshot.val().username + ' liked your post:'
					emailData.bodyHighlight = thread.title
					emailData.buttonText = 'GO TO POST'
					emailData.buttonLink = Constants.COLLABO_URL + '/' + org.url + '/' + thread.projectId + '/' + thread.threadId
					break;
				case Constants.LIKE_COMMENT_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' upvoted your comment: "' + sendObject.body + '"';
					inboxObject.link = '/' + thread.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' liked your comment on Koi'
					emailData.bodyMessage = senderSnapshot.val().username + ' liked your comment in the post'
					emailData.bodyHighlight = thread.title
					emailData.buttonText = 'GO TO THREAD'
					emailData.buttonLink = Constants.COLLABO_URL + '/' + org.url + '/' + thread.projectId + '/' + thread.threadId
					break;
				case Constants.ACCEPT_ORG_INVITE_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' accepted your invite to the ' + org.name + ' team';
					inboxObject.link = '/user/' + senderSnapshot.val().username;
					inboxObject.type = Constants.INBOX_INVITE_TYPE
					emailData.emailSubject = senderSnapshot.val().username + ' accepted your invite on Koi'
					emailData.bodyMessage = senderSnapshot.val().username + ' joined your team:'
					emailData.bodyHighlight = org.name
					emailData.buttonText = 'GO TO TEAM'
					emailData.buttonLink = Constants.COLLABO_URL + '/' + org.url
					break;
				case Constants.ACCEPT_PROJECT_INVITE_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' accepted your invite to the \'' + project.name + '\' project.';
					inboxObject.link = '/' + project.projectId;
					inboxObject.type = Constants.INBOX_INVITE_TYPE
					sendEmail = false;
					// emailData.emailSubject = senderSnapshot.val().username + ' accepted your invite on Koi'
					// emailData.bodyMessage = senderSnapshot.val().username + ' joined your team:'
					// emailData.bodyHighlight = org.name
					// emailData.buttonText = 'GO TO TEAM'
					// emailData.buttonLink = Constants.COLLABO_URL + '/' + org.url
					break;
				case Constants.ORG_INVITE_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' invited you join their team: ' + org.url;
					inboxObject.link = '/invitation/' + sendObject;
					inboxObject.type = Constants.INBOX_INVITE_TYPE
					emailData.unitType = 'team'
					emailData.message = ' invited you to join the team: '
					emailData.name = org.name
					emailData.link = Constants.COLLABO_URL + '/invitation/' + sendObject;
					emailData.senderLink = Constants.COLLABO_URL + '/' + org.url + '/users/' + senderSnapshot.val().username
					emailTemplateID = "0a991f3c-3079-4d45-90d2-eff7c64f9cc5"
					break;
				case Constants.PROJECT_INVITE_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' invited you join the group: ' + project.name;
					inboxObject.link = '/joinproject/' + sendObject;
					inboxObject.type = Constants.INBOX_INVITE_TYPE
					emailData.unitType = 'group'
					emailData.message = ' invited you to join the group: ' + project.name + ' in the ' + org.name + ' team.'
					emailData.link = Constants.COLLABO_URL + '/invitation/' + sendObject;
					emailData.senderLink = Constants.COLLABO_URL + '/' + org.url + '/users/' + senderSnapshot.val().username
					emailTemplateID = "0a991f3c-3079-4d45-90d2-eff7c64f9cc5"
					break;
				// case Constants.NEW_THREAD_MESSAGE:
				// 	inboxObject.senderId = senderId;
				// 	inboxObject.message = org.name + ': ' + senderSnapshot.val().name + ' created a new thread "' + thread.title + '" in the ' + project.name + ' project';
				// 	inboxObject.link = '/' + org.url + '/' + project.projectId + '/' + thread.threadId;
				// 	inboxObject.type = Constants.INBOX_INVITE_TYPE
				// 	emailMessage = org.name + ' team: ' + senderSnapshot.val().username + 
				// 		' created a new thread in the ' + project.name + ' project. Click here to check it out: '+ Constants.COLLABO_URL + '/' + org.url + '/' + project.projectId + '/' + thread.threadId;
				// 	break;
			}
			if (senderId !== recipientId) {
				Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + recipientId + '/' + orgId).push().set(inboxObject);
				Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/' + orgId + '/messageCount').transaction(function (current_count) {
		            return (current_count || 0) + 1;
		        })
	        	if (sendEmail && recipientSnapshot.exists() && recipientSnapshot.val().email) {
	        		let data = Object.assign({}, emailData, {senderName: senderSnapshot.val().username});
	        		sendContentManagerEmail(emailTemplateID, recipientSnapshot.val().email, data);
			    }
			}
		})
	})
}

export function sendCommentInboxMessage(senderId, recipientId, messageType, org, project, thread, sendObject) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailData = {
		threadLink: Constants.COLLABO_URL + '/' + org.url + '/' + thread.projectId + '/' + thread.threadId,
		emailType: messageType
	};

	Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
		Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + org.id + '/' + senderId).once('value', senderSnapshot => {
			switch(messageType) {
				case Constants.COMMENT_IN_THREAD_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' commented on your post "' + thread.title + '": ' + sendObject.message;
					inboxObject.link = '/' + thread.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' commented on your post'
					emailData.threadTitle = '"' + thread.title + '"'
					emailData.commentBody = sendObject.message
					emailData.bodyText = ' commented on your post '
					break;
				case Constants.COMMENT_MENTION_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' mentioned you in a comment in the thread "' + thread.title + '": ' + sendObject.message;
					inboxObject.link = '/' + thread.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' mentioned you in a comment'
					emailData.threadTitle = '"' + thread.title + '"'
					emailData.commentBody = sendObject.message
					emailData.bodyText1 = ' mentioned you in a comment on the post '
					break;
				case Constants.ALSO_COMMENTED_MESSAGE:
					inboxObject.senderId = senderId;
					inboxObject.message = ' also commented in the post "' + thread.title + '": ' + sendObject.message;
					inboxObject.link = '/' + thread.projectId + '/' + thread.threadId;
					emailData.emailSubject = senderSnapshot.val().username + ' commented on the same post'
					emailData.threadTitle = '"' + thread.title + '"'
					emailData.commentBody = sendObject.message
					emailData.bodyText = ' commented also commented in the post '
					break;
			}
			if (senderId !== recipientId) {
				Firebase.database().ref(Constants.INBOX_BY_USER_BY_ORG_PATH + '/' + recipientId + '/' + thread.orgId).push().set(inboxObject);
				Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/' + thread.orgId + '/messageCount').transaction(function (current_count) {
		            return (current_count || 0) + 1;
		        })
	        	if (recipientSnapshot.exists() && recipientSnapshot.val().email) {
	        		let data = Object.assign({}, {senderName: senderSnapshot.val().username}, emailData);
	        		sendContentManagerEmail("15b9b758-e546-4998-91e9-7d33e4841968", recipientSnapshot.val().email, data);
			    }
			}
		})
	})
}

export function sendInviteEmail(auth, recipientEmail, org, inviteId) {
	Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + org.id + '/' + auth).once('value', senderSnap => {
		// let emailMessage = senderSnap.val().username + ' invited you to join their team "' + org.name + '" on Collabo.' +
		// 	' Click here to check it out: ' + Constants.COLLABO_URL + '/invitation/' + inviteId;
		let link = Constants.COLLABO_URL + '/invitation/' + inviteId

		let data = Object.assign({}, 
			{ name: org.name }, 
			{ url: org.url },
			{ senderName: senderSnap.val().username }, 
			{ link: link }, 
			{ unitType: 'team' },
			{ message: ' invited you to join the team: ' },
			{ emailType: Constants.ORG_INVITE_MESSAGE }
			);
		sendContentManagerEmail("0a991f3c-3079-4d45-90d2-eff7c64f9cc5", recipientEmail, data);
	})
}

export function sendVerifyEmail(recipientEmail, verifiyId) {
	let link = Constants.COLLABO_URL + '/verify/' + verifiyId

	let data = Object.assign({}, 
		{ clickthroughLink: link }, 
		{ emailType: Constants.VERIFY_EMAIL }
		);
	sendContentManagerEmail("23853246-d1de-4e0f-8d9c-657446db8adb", recipientEmail, data);
}

export function sendDailyDigestEmail(recipientId, orgId, threadsArray, extras) {
	Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + recipientId).once('value', userSnap => {
		Firebase.database().ref(Constants.ORGS_PATH + '/' + orgId).once('value', orgSnap => {
			if (userSnap.exists() && orgSnap.exists()) {
				let data = {
					orgName: orgSnap.val().name,
					orgURL: orgSnap.val().url,
					link: Constants.COLLABO_URL + '/' + orgSnap.val().url
				}
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
						link0: Constants.COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[0].projectId + '/' + threadsArray[0].id
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
						link1: Constants.COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[1].projectId + '/'  + threadsArray[1].id
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
						link2: Constants.COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[2].projectId + '/'  + threadsArray[2].id
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
						link3: Constants.COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[3].projectId + '/'  + threadsArray[3].id
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
						link4: Constants.COLLABO_URL + '/' + orgSnap.val().url + '/' + threadsArray[4].projectId + '/'  + threadsArray[4].id
					})
				}
				sendContentManagerEmail("49c29d51-1415-4b20-9618-bf5a045366c9", userSnap.val().email, data);
			}
		})
	})
}

export function incrementThreadLastUpdateTime(auth, orgId, projectId, threadId) {
	Firebase.database().ref(Constants.USERS_BY_ORG_PATH + '/' + orgId).once('value', orgUsersSnap => {
		let updates = {}
		orgUsersSnap.forEach(function(user) {
			// udpate the value for all 'read' actions, don't add an unread message for the user
			if (user.key !== auth) {
				updates[Constants.UNREAD_THREAD_COUNTERS_PATH + '/' + user.key + '/' + orgId + '/' + projectId + '/' + threadId] = true
			}
		})

		// updates[Constants.THREAD_LAST_UPDATED_BY_PROJECT_BY_ORG_PATH + '/' + orgId + '/' + projectId + '/' + threadId] = Firebase.database.ServerValue.TIMESTAMP
		// updates[Constants.THREAD_LAST_UPDATED_BY_ORG_PATH + '/' + orgId + '/' + threadId] = Firebase.database.ServerValue.TIMESTAMP

		Firebase.database().ref().update(updates);
	})
}

export function sendItineraryUpdateEmails(auth, itinerary, lastUpdate) {
	// if itinerary hasnt been updated in the last 24 hours, then send the email to all followers
	// let yesterday = new Date();
 //      yesterday.setMonth(yesterday.getDate() <= 1 ? yesterday.getMonth() - 1 : yesterday.getMonth());
 //      yesterday.setDate(yesterday.getDate() - 1);
	// if (!lastUpdate || !itinerary.reviewsCount || itinerary.reviewsCount === 0 || lastUpdate < yesterday) {
	// 	Firebase.database().ref(Constants.USERS_PATH + '/' + auth).once('value', senderSnap => {
	// 		let emailMessage = senderSnap.val().username + ' updated their guide "' + itinerary.title + 
	// 			'". Click here to check it out: https://myviews.io/guide/' + itinerary.id;

	// 		// first send to anyone following the user
	// 		Firebase.database().ref(Constants.HAS_FOLLOWERS_PATH + '/' + auth).once('value', followersSnap => {
	// 			Firebase.database().ref(Constants.FOLLOWED_ITINERARIES_PATH + '/' + itinerary.id).once('value', followedItinsSnap => {
	// 				let sendList = {};
	// 				followersSnap.forEach(function(user) {
	// 					Firebase.database().ref(Constants.USERS_PATH + '/' + user.key).once('value', recipientSnap => {
	// 						if (recipientSnap.exists() && recipientSnap.val().email) {
	// 							sendList[user.key] = true;
	// 							// && user.key === 'haO90mWZ07VgwiTnawGovd1RNbx1'
	// 							// for the sterlingtheshiba test account, only email leung.b@gmail.com
	// 							if (auth !== 'HZ1g4L39qnW3rdrhduUwUbGnUx82' || (auth === 'HZ1g4L39qnW3rdrhduUwUbGnUx82' && user.key === 'haO90mWZ07VgwiTnawGovd1RNbx1')) {
	// 								let data = Object.assign({}, {message: emailMessage}, {senderName: senderSnap.val().username });
	// 								sendContentManagerEmail("4cf0f88a-221c-4a1f-95ed-5a8543ba42a8", recipientSnap.val().email, data);
	// 							}
	// 						}
	// 					})
	// 				})

	// 				// then send to anyone following the guide but dont send duplicate emails
	// 				setTimeout(function() {
	// 					followedItinsSnap.forEach(function(user) {
	// 						if (!sendList[user.key]) {
	// 							Firebase.database().ref(Constants.USERS_PATH + '/' + user.key).once('value', recipientSnap => {
	// 								// for the sterlingtheshiba test account, only email leung.b@gmail.com
	// 								if (auth !== 'HZ1g4L39qnW3rdrhduUwUbGnUx82' || (auth === 'HZ1g4L39qnW3rdrhduUwUbGnUx82' && user.key === 'haO90mWZ07VgwiTnawGovd1RNbx1')) {
	// 									let data = Object.assign({}, {message: emailMessage}, {senderName: senderSnap.val().username });
	// 									sendContentManagerEmail("4cf0f88a-221c-4a1f-95ed-5a8543ba42a8", recipientSnap.val().email, data);
	// 								}
	// 							})
	// 						}
	// 					})
	// 				}, 2000)
	// 			})
	// 		})
	// 	})
	// }
}

export function stripHTML(content) {
	if (content && content.length > 0) {
		let noImages = content.replace(/<img .*?>/g,' ')
		return noImages.replace(/<\/?\w+[^>]*\/?>/g, ' ')
	}
	else return content
}

export function getLinks (content) {
	return (content || '').match(/((http|https):\/\/)?(\S+)\.([a-z]{2,}?)(.*?)( |\,|$|\.)/gim) || [];
}

export function isGoogleDocLink (link) {
	return link.indexOf("drive.google.com") !== -1 || link.indexOf("docs.google.com") !== -1;
}

export function getFileId (link) {
	if (!isGoogleDocLink(link)) {
		return;
	}
	if (link.indexOf("drive.google.com") !== -1 && link.indexOf("id=") !== -1) {
		return link.split("id=")[1].trim();
	}
	const segs = link.split("/");
	const domainIndex = segs.findIndex((seg) => seg.indexOf(".google.com") !== -1);
	return segs.length > domainIndex + 3 ? segs[domainIndex + 3] : null;
}

export function getFileIds (comments) {
	return Object.keys(comments).reduce((totalLinks, commentId) => {
		const links = getLinks(comments[commentId].body).filter((l) => isGoogleDocLink(l));
		if (!links || links.length < 1) {
			return totalLinks;
		}
		const ids = [];
		links.forEach(link => {
			const fileId = getFileId(link);
			if (fileId) {
				ids.push(fileId);
			}
		});
		return totalLinks.concat(ids);
	}, []);
}

export function addUserToOrg(auth, email, invite, inviteId, userData, imageFile) {
  let orgId = invite.orgId
  let role = invite.role ? invite.role : Constants.USER_ROLE
  Firebase.database().ref(Constants.PROJECTS_BY_ORG_PATH + '/' + orgId).once('value', projectsSnap => {
  	Firebase.database().ref(Constants.ORGS_PATH + '/' + orgId).once('value', orgSnap => {
  		let cleanedEmail = cleanEmailToFirebase(email)
	    let lowerCaseName = userData && userData.username ? userData.username.toLowerCase() : ''

	    // set hour for dailyDigest
	    let offset = (new Date()).getTimezoneOffset()
        let hr = 10 + offset/60
        userData.emailDigestHour = hr

	    let updates = {}
	    // add user to the org and orgs-by-user
	    updates[Constants.USERNAMES_BY_ORG_PATH + '/' + orgId + '/' + lowerCaseName] = auth
	    updates[Constants.ORGS_BY_USER_PATH + '/' + auth + '/' + orgId] = true

	    // add daily digest for user and org
	    updates[Constants.USERS_BY_EMAIL_TIME_BY_ORG_PATH + '/' + offset + '/' + orgId + '/' + auth] = true

	    // update user's preferred username and fullName if necessary
	    updates[Constants.USERS_PATH + '/' + auth + '/username/'] = userData.username
	    if (userData.fullName) {
	      updates[Constants.USERS_PATH + '/' + auth + '/fullName/'] = userData.fullName
	    }

	    // remove the invites
	    updates[Constants.INVITES_PATH + '/' + inviteId + '/status/'] = Constants.ACCEPTED_STATUS
	    updates[Constants.INVITED_USERS_BY_ORG_PATH + '/' + orgId + '/' + cleanedEmail] = null

	    // remove all invites to the org from dashboard
	    updates[Constants.INVITES_BY_EMAIL_BY_ORG_PATH + '/' + cleanedEmail + '/' + orgId] = null

		// if this is a guest, only add the projects they were added to    
	    if (role === Constants.GUEST_ROLE) {
	    	(invite.projects || []).forEach(function(projectId) {
		        updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgId}/${auth}/${projectId}/`] = role;
		        updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectId}/${auth}/`] = role
		    })
	    }
	    // else this is a member and add all public projects for the user
	    else {
	    	projectsSnap.forEach(function(projectItem) {
		      if (projectItem.val().isPublic) {
		        updates[`/${Constants.PROJECTS_BY_ORG_BY_USER_PATH}/${orgId}/${auth}/${projectItem.key}/`] = role;
		        updates[`/${Constants.USERS_BY_PROJECT_PATH}/${projectItem.key}/${auth}/`] = role
		      }
		    })
	    }

	    // if user uploaded an image, save it
	    if (imageFile) {
	      const storageRef = Firebase.storage().ref();
	      const metadata = {
	        contentType: 'image/jpeg'
	      }
	      let fileName = generateImageFileName();
	      const uploadTask = storageRef.child('images/' + fileName).put(imageFile, metadata);
	      uploadTask.on(Firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
	      function(snapshot) {
	        }, function(error) {
	          console.log(error.message)
	      }, function() {
	      	uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
		        // set user's image to the new downloadURL
		        userData.image = downloadURL

		        // save image in users-by-org
		        updates[Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth] = 
		          Object.assign({}, userData, {email: email}, {role: role}, {status: Constants.ACTIVE_STATUS})

		        // save image in users-path
		        updates[Constants.USERS_PATH + '/' + auth + '/image'] = downloadURL;

		        Firebase.database().ref().update(updates)
		    })
	      })
	    }
	    // else no image, just save the user
	    else {
	      updates[Constants.USERS_BY_ORG_PATH + '/' + orgId + '/' + auth] = 
	        Object.assign({}, userData, {email: email}, {role: role}, {status: Constants.ACTIVE_STATUS})

	      Firebase.database().ref().update(updates)
	    }
	    sendCollaboInboxMessage(auth, invite.senderId, Constants.ACCEPT_ORG_INVITE_MESSAGE, Object.assign({}, {id: orgId}, orgSnap.val()), projectsSnap.val(), null, null)
  	})
  })
}

export function deleteThreadData(threads) {
	if (threads) {
		let updates = {}
		let itemsProcessed = 0;
		for (var key in threads) {
		    if (threads.hasOwnProperty(key)) {
		        updates[Constants.THREADS_PATH + '/' + key] = null
				updates[Constants.THREADS_BY_ORG_PATH + '/' + threads[key].orgId + '/' + key] = null
				updates[Constants.THREADS_BY_USER_BY_ORG_PATH + '/' + threads[key].userId + '/' + threads[key].orgId + '/' + key] = null
		    }
		}	  
		  
		// delete comments too?

	    Firebase.database().ref().update(updates)
	}
}

export function generateAttachmentName(fileName, takenNames) {
  let cleanedName = cleanEmailToFirebase(fileName)

  if (!takenNames[cleanedName]) {
    return fileName
  }
  else {
    let n = fileName.indexOf('.')
    if (n < 1) n = fileName.length
    for (let i = 1; i < 100; i++) {
      let tempName = fileName.slice(0, n) + ' (' + i + ')' + fileName.slice(n)
      if (!takenNames[cleanEmailToFirebase(tempName)]) {
        return tempName
      }
    }
    return fileName.slice(0, n) + ' (' + generateImageFileName(10) + ')' + fileName.slice(n)
  }
}

export function checkAttachmentsCompleted (attachments) {
	if (attachments) {
		for (let i = 0; i < attachments.length; i++) {
			if (attachments[i].progress > -1 && attachments[i].progress < 100) {
				return false
			}
		}
		return true
	}
	else return true
}