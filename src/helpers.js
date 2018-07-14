import Firebase from 'firebase';
import * as Constants from './constants';
import 'whatwg-fetch';

export function updateAlgloiaUsersIndex(username, userId) {
	let usernameSuffixes = [];
	for(let i = 1; i < username.length - 1; i++) {
	  usernameSuffixes.push(username.substr(i))
	}

	//update Algolia index
	var algoliasearch = require('algoliasearch');
	var client = algoliasearch('2OEMW8KEZS', '62e17a3113351343399fad062d3cbca5', {protocol:'https:'});
	var index = client.initIndex('views-users');
	index.saveObject({
	  username: username,
	  objectID: userId,
	  suffixes: usernameSuffixes
	}, function(err, content) {
	  if (err) {
	    console.error(err);
	    return;
	  }
	});
}

export function updateAlgloiaGeosIndex(geo) {
	//update Algolia index
	var algoliasearch = require('algoliasearch');
	var client = algoliasearch('2OEMW8KEZS', '62e17a3113351343399fad062d3cbca5', {protocol:'https:'});
	var index = client.initIndex('views-geos');
	index.saveObject({
	  objectID: geo.placeId,
	  label: geo.label,
	  fullCountry: geo.fullCountry
	}, function(err, content) {
	  if (err) {
	    console.error(err);
	    return;
	  }
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

export function generateImageFileName()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 15; i++ )
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

	// incrememt count on threads by user
	Firebase.database().ref(Constants.THREADS_BY_USER_PATH + '/' + userId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });
}

export function decrementThreadCount(counterType, threadId, thread, userId) {
	// decrement count on itineraries
	Firebase.database().ref(Constants.THREADS_PATH + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on threads by project
    Firebase.database().ref(Constants.THREADS_BY_PROJECT_PATH + '/' + thread.projectId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// decrement count on threads by user
	Firebase.database().ref(Constants.THREADS_BY_USER_PATH + '/' + userId + '/' + threadId + '/' + counterType).transaction(function (current_count) {
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
	let formData = new FormData();
	formData.append("template-id", templateId);
	formData.append("recipient", recipientEmail);
	formData.append("data", JSON.stringify(data));
    fetch(Constants.INBOX_SEND_EMAIL_URL, {
	  method: 'POST',
	  body: formData
	})
	.catch(function(response) {
		console.log(response)
	})
	.catch(function(error) {
	    console.log('Content Manager email send request failed', error)
	})
}

export function sendInboxMessage(senderId, recipientId, messageType, sendObject, itineraryId, commentObject) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';
console.log('recip ID = ' + recipientId)
	if (sendObject || messageType === Constants.FOLLOW_MESSAGE) {
		Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', senderSnapshot => {
				if (sendObject) inboxObject.reviewId = (sendObject.id ? sendObject.id : sendObject.reviewId);
				// if (sendObject.subject.images) inboxObject.reviewImage = getImagePath(sendObject.subject.images);
				// if (sendObject.subject.title) inboxObject.reviewTitle = sendObject.subject.title;
				// if (sendObject && sendObject.images) inboxObject.reviewImage = getImagePath(sendObject.images);
				if (sendObject && sendObject.images && sendObject.images[0] && sendObject.images[0].url) {
					inboxObject.reviewImage = sendObject.images[0].url;
				}
				else if (sendObject && sendObject.images && sendObject.images.url) {
					inboxObject.reviewImage = sendObject.images.url;
				}
				// get itinerary title or subject title
				if (sendObject && sendObject.title) {
					inboxObject.reviewTitle = sendObject.title;
				}
				else if (sendObject && sendObject.subject && sendObject.subject.title) {
					inboxObject.reviewTitle = sendObject.subject.title;
				}

				switch(messageType) {
					case Constants.LIKE_TIP_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your tip: ';
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#tip' + sendObject.key : '/review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your tip. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.LIKE_REC_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your recommendation: ';
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#tip' + sendObject.key : '/review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your recommendation. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.LIKE_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your guide: ';
						inboxObject.link = '/guide/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your guide. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_REVIEW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your tip: ' + commentObject.message;
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#comment' + commentObject.commentId : 
							'/review/' + sendObject.subjectId + '/' + sendObject.id;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' commented on your tip. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_REVIEW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' also commented: ' + commentObject.message;
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#comment' + commentObject.commentId : 
							'/review/' + sendObject.subjectId + '/' + sendObject.id;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' also commented on a tip you commented on. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your guide: ' + commentObject.message;
						inboxObject.link = '/guide/' + sendObject.id + '#comment' + commentObject.commentId;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' commented on your guide. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.reviewTitle = '';
						inboxObject.message = ' also commented on the guide: ' + commentObject.message;
						inboxObject.link = '/guide/' + sendObject.id + '#comment' + commentObject.commentId;
						emailMessage = senderSnapshot.val().username + 
							' also commented on an guide you commented on. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_REC_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your recommendation: ' + commentObject.message;
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#comment' + commentObject.commentId : 
							'/review/' + sendObject.subjectId + '/' + sendObject.id;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' commented on your recommendation. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_REC_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' also commented: ' + commentObject.message;
						inboxObject.link = itineraryId ? '/guide/' + itineraryId + '#comment' + commentObject.commentId : 
							'/review/' + sendObject.subjectId + '/' + sendObject.id;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' also commented on a recommendation you commented on. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.ADD_REC_TO_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' send you a recommendation for your guide: ';
						inboxObject.link = '/guide/' + itineraryId + '#tip' + sendObject.key;
						emailMessage = senderSnapshot.val().username + 
							' sent you a recommendation. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					case Constants.FOLLOW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' started following you.';
						inboxObject.link = '/' + senderSnapshot.val().username;
						inboxObject.reviewTitle = '';
						emailMessage = senderSnapshot.val().username + 
							' started following you. Click here to see their profile: https://myviews.io' + inboxObject.link;
						break;
					// case Constants.DIRECT_MESSAGE:
					// 	inboxObject.senderId = senderId;
					// 	inboxObject.message = ' sent you a personal review.'
					// 	inboxObject.link = '/review/' + sendObject.subjectId + '/' + sendObject.id;
					// 	emailMessage = senderSnapshot.val().username + 
					// 		' sent you a personal review. Click here to see it: https://myviews.io' + inboxObject.link;
					// 	break;
					// case Constants.FORWARD_MESSAGE:
					// 	inboxObject.senderId = senderId;
					// 	inboxObject.message = ' forwared you a review.'
					// 	inboxObject.link = '/review/' + sendObject.subjectId + '/' + sendObject.id;
					// 	emailMessage = senderSnapshot.val().username + 
					// 		' forwarded you a review. Click here to see it: https://myviews.io' + inboxObject.link;
					// 	break;
					case Constants.SAVE_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' saved your tip to their guide: ';
						inboxObject.link = '/guide/' + itineraryId;
						emailMessage = senderSnapshot.val().username + ' saved your tip to their guide. Click here to see it: https://myviews.io' + inboxObject.link;
						break;
					case Constants.USER_MENTIONED_TYPE:
						inboxObject.senderId = senderId;
						inboxObject.reviewTitle = '';
						inboxObject.message = ' mentioned you in a comment: ' + commentObject.message;
						inboxObject.link = '/guide/' + itineraryId + '#comment' + commentObject.commentId;
						emailMessage = senderSnapshot.val().username + ' mentioned you in a comment. Click here to see it: https://myviews.io' + inboxObject.link;
						break;
					case Constants.FOLLOW_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' started following your guide: ';
						inboxObject.link = '/guide/' + itineraryId;
						emailMessage = senderSnapshot.val().username + ' followed your guide "' + sendObject.title + '." Click here to see it: https://myviews.io' + inboxObject.link;
						break;
				}
				if (senderId !== recipientId) {
					Firebase.database().ref(Constants.INBOX_PATH + '/' + recipientId).push().set(inboxObject);
					Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/messageCount').transaction(function (current_count) {
			            return (current_count || 0) + 1;
			        })
		        	if (recipientSnapshot.exists() && recipientSnapshot.val().email) {
		        		let data = Object.assign({}, {message: emailMessage});
		        		sendContentManagerEmail("7691e888-4b30-40e2-9d78-df815d5b8453", recipientSnapshot.val().email, data);
				    }
				}
			})
		})
	}
}

export function sendCollaboInboxMessage(senderId, recipientId, messageType, thread, threadId, commentObject) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';

	if (thread) {
		Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', senderSnapshot => {
				switch(messageType) {
					case Constants.COMMENT_IN_THREAD_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented in the thread: ' + thread.title;
						inboxObject.link = '/thread/' + threadId + '#comment' + commentObject.commentId;
						emailMessage = senderSnapshot.val().username + 
							' commented in the same thread. Click here to check it out: https://myviews.io' + inboxObject.link;
						break;
					// case Constants.COMMENT_ON_COMMENT_REVIEW_MESSAGE:
					// 	inboxObject.senderId = senderId;
					// 	inboxObject.message = ' also commented: ' + commentObject.message;
					// 	inboxObject.link = threadId ? '/guide/' + itineraryId + '#comment' + commentObject.commentId : 
					// 		'/review/' + sendObject.subjectId + '/' + sendObject.id;
					// 	inboxObject.reviewTitle = '';
					// 	emailMessage = senderSnapshot.val().username + 
					// 		' also commented on a tip you commented on. Click here to check it out: https://myviews.io' + inboxObject.link;
					// 	break;
				}
				if (senderId !== recipientId) {
					Firebase.database().ref(Constants.INBOX_PATH + '/' + recipientId).push().set(inboxObject);
					Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/messageCount').transaction(function (current_count) {
			            return (current_count || 0) + 1;
			        })
		        	if (recipientSnapshot.exists() && recipientSnapshot.val().email) {
		        		let data = Object.assign({}, {message: emailMessage});
		        		sendContentManagerEmail("7691e888-4b30-40e2-9d78-df815d5b8453", recipientSnapshot.val().email, data);
				    }
				}
			})
		})
	}
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