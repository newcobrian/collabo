import Firebase from 'firebase';
import * as Constants from './constants';
import 'whatwg-fetch';

export function sendInboxMessage(senderId, recipientId, messageType, review) {
	const inboxObject = {
		senderId: senderId,
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};
	let emailMessage = '';

	if (review) {
		Firebase.database().ref(Constants.USERS_PATH + '/' + recipientId).once('value', recipientSnapshot => {
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', senderSnapshot => {
				inboxObject.reviewId = review.id;
				if (review.subject.images) inboxObject.reviewImage = review.subject.images[0];
				if (review.subject.title) inboxObject.reviewTitle = review.subject.title;

				switch(messageType) {
					case Constants.LIKE_MESSAGE:
						inboxObject.message = ' liked your review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' liked your review. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_REVIEW_MESSAGE:
						inboxObject.message = ' commented on your review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' commented on your review. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.COMMENT_ON_COMMENT_MESSAGE:
						inboxObject.message = ' also commented on the review: ';
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' also commented on a review you commented on. Click here to check it out: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.FOLLOW_MESSAGE:
						inboxObject.message = ' started following you.';
						inboxObject.link = '@' + senderSnapshot.val().username;
						emailMessage = senderSnapshot.val().username + 
							' followed you. Click here to see their profile: https://whatsgoooood.com/#/' + inboxObject.link;
						break;
					case Constants.DIRECT_MESSAGE:
						inboxObject.message = ' sent you a personal review.'
						inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
						emailMessage = senderSnapshot.val().username + 
							' sent you a personal review. Click here to see it: https://whatsgoooood.com/#/' + inboxObject.link;
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

export function getImagePath(imagesObject) {
  for (var key in imagesObject) {
    if (!imagesObject.hasOwnProperty(key)) continue;
    return imagesObject[key].url;
  }
}