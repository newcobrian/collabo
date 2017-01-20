import Firebase from 'firebase';
import * as Constants from './constants'

export function sendInboxMessage(senderId, recipientIds, messageType, review) {
	const inboxObject = {
		reviewId: review.id,
		senderId: senderId
	};

	switch(messageType) {
		case Constants.LIKE_MESSAGE:
			inboxObject.message = ' liked your review: ';
			inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
			break;
	}
	recipientIds.forEach(function(recipient) {
		if (senderId !== recipient) {
			Firebase.database().ref(Constants.INBOX_PATH + '/' + recipient).push().set(inboxObject);
		}
	})
}