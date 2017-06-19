import Firebase from 'firebase';
import * as Constants from './constants';
import 'whatwg-fetch';

export function getImagePath(imagesObject) {
	let imagesArray = [];
	for (var key in imagesObject) {
    	if (!imagesObject.hasOwnProperty(key)) continue;
    	imagesArray.push(imagesObject[key].url);
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

export function makeSubject(review, lastModified) {
	let subject = { title: review.title };
	if (review.address) subject.address = review.address;
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

export function makeItinerary(auth, itinerary, lastModified) {
	let itineraryObject = { 
		title: itinerary.title,
		geo: itinerary.geo,
		userId: auth
	};
	if (itinerary.description) itineraryObject.description = itinerary.description;
	return Object.assign(itineraryObject, lastModified);
}

export function incrementItineraryCount(counterType, itineraryId, geo, userId) {
	// increment count on reviews
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

    // increment count on reviews by subject
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + geo.placeId + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// incrememt count on reviews by user
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

	// increment count on subject
	Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/' + counterType).transaction(function (current_count) {
		return (current_count || 0) + 1;
    });

	// update subject timestamp
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).update({ lastModified: Firebase.database.ServerValue.TIMESTAMP })
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

	// decrement count on subject
	Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// update subject timestamp
    Firebase.database().ref(Constants.SUBJECTS_PATH + '/' + subjectId).update({ lastModified: Firebase.database.ServerValue.TIMESTAMP })
}

export function decrementItineraryCount(counterType, itineraryId, geo, userId) {
	// decrement count on reviews
	Firebase.database().ref(Constants.ITINERARIES_PATH + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

    // decrement count on reviews by subject
    Firebase.database().ref(Constants.ITINERARIES_BY_GEO_PATH + '/' + geo.placeId + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });

	// decrement count on reviews by user
	Firebase.database().ref(Constants.ITINERARIES_BY_USER_PATH + '/' + userId + '/' + itineraryId + '/' + counterType).transaction(function (current_count) {
		return (current_count - 1 > 0) ? (current_count - 1) : 0;
    });
}

export function sendInboxMessage(senderId, recipientId, messageType, sendObject) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';

	if (sendObject || messageType === Constants.FOLLOW_MESSAGE) {
		Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', senderSnapshot => {
				if (sendObject) inboxObject.reviewId = (sendObject.id ? sendObject.id : sendObject.reviewId);
				// if (sendObject.subject.images) inboxObject.reviewImage = getImagePath(sendObject.subject.images);
				// if (sendObject.subject.title) inboxObject.reviewTitle = sendObject.subject.title;
				// if (sendObject && sendObject.images) inboxObject.reviewImage = getImagePath(sendObject.images);
				if (sendObject && sendObject.images && sendObject.images[0]) inboxObject.reviewImage = sendObject.images[0];
				if (sendObject && sendObject.title) inboxObject.reviewTitle = sendObject.title;

				switch(messageType) {
					case Constants.LIKE_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your tip: ';
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your tip. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.LIKE_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your itinerary: ';
						inboxObject.link = 'itinerary/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your itinerary. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_REVIEW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your tip: ';
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' commented on your tip. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_REVIEW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' also commented on the tip: ';
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' also commented on a tip you commented on. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your itinerary: ';
						inboxObject.link = 'itinerary/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' commented on your itinerary. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_ITINERARY_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' also commented on the itinerary: ';
						inboxObject.link = 'itinerary/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' also commented on an itinerary you commented on. Click here to check it out: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.FOLLOW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' started following you.';
						inboxObject.link = senderSnapshot.val().username;
						emailMessage = senderSnapshot.val().username + 
							' followed you. Click here to see their profile: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.DIRECT_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' sent you a personal review.'
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' sent you a personal review. Click here to see it: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.FORWARD_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' forwared you a review.'
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = senderSnapshot.val().username + 
							' forwarded you a review. Click here to see it: https://whatsgoooood.com/' + inboxObject.link;
						break;
					case Constants.SAVE_MESSAGE:
						inboxObject.senderId = '';
						inboxObject.message = 'Can\'t tell you who, but somebody saved your review of ';
						inboxObject.link = 'review/' + sendObject.subjectId + '/' + sendObject.id;
						emailMessage = 'Somebody saved your review. Click here to go to your inbox: https://whatsgoooood.com/inbox';
						break;
				}
				if (senderId !== recipientId) {
					Firebase.database().ref(Constants.INBOX_PATH + '/' + recipientId).push().set(inboxObject);
					Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/messageCount').transaction(function (current_count) {
			            return (current_count || 0) + 1;
			        })
		        	if (recipientSnapshot.exists()) {
		        		let formData = new FormData();
		        		formData.append("template-id", "7691e888-4b30-40e2-9d78-df815d5b8453");
		        		formData.append("recipient", recipientSnapshot.val().email);
		        		formData.append("data", JSON.stringify({ message: emailMessage }));
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
				}
			})
		})
	}
}