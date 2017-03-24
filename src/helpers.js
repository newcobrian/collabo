import Firebase from 'firebase';
import * as Constants from './constants';
import 'whatwg-fetch';

export function getImagePath(imagesObject) {
  for (var key in imagesObject) {
    if (!imagesObject.hasOwnProperty(key)) continue;
    return imagesObject[key].url;
  }
}

export function getTagsArray(tagsSnap) {
	let tagsArray = [];
	for (var key in tagsSnap) {
		if (!tagsSnap.hasOwnProperty(key)) continue;
		tagsArray.push(key);
	}
	return tagsArray;
}

export function incrementCount(counterType, reviewId, subjectId, userId) {
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
}

export function decrementCount(counterType, reviewId, subjectId, userId) {
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
}

export function sendInboxMessage(senderId, recipientId, messageType, review) {
	const inboxObject = {
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';

	if (review) {
		Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', senderSnapshot => {
				inboxObject.reviewId = review.id;
				if (review.subject.images) inboxObject.reviewImage = getImagePath(review.subject.images);
				if (review.subject.title) inboxObject.reviewTitle = review.subject.title;

				switch(messageType) {
					case Constants.LIKE_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' liked your review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your review. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_REVIEW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' commented on your review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' commented on your review. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' also commented on the review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' also commented on a review you commented on. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.FOLLOW_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' started following you.';
						inboxObject.link = '@' + senderSnapshot.val().username;
						emailMessage = senderSnapshot.val().username + 
							' followed you. Click here to see their profile: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.DIRECT_MESSAGE:
						inboxObject.senderId = senderId;
						inboxObject.message = ' sent you a personal review.'
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' sent you a personal review. Click here to see it: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.SAVE_MESSAGE:
						inboxObject.senderId = '';
						inboxObject.message = 'Can\'t tell you who, but somebody saved your review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = 'Somebody saved your review. Click here to go to your inbox: https://whatsgoooood.com/#/inbox';
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