import Firebase from 'firebase';
import * as Constants from './constants'

export function sendInboxMessage(senderId, recipientId, messageType, review) {
	const inboxObject = {
		reviewId: review.id,
		senderId: senderId,
		link: 'review/' + review.subjectId + '/' + review.id,
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};

	if (review.subject.image) inboxObject.reviewImage = review.subject.image;
	if (review.subject.title) inboxObject.reviewTitle = review.subject.title;

	switch(messageType) {
		case Constants.LIKE_MESSAGE:
			inboxObject.message = ' liked your review: ';
			break;
		case Constants.COMMENT_ON_REVIEW_MESSAGE:
			inboxObject.message = ' commented on your review: '
			break;
		case Constants.COMMENT_ON_COMMENT_MESSAGE:
			inboxObject.message = ' also commented on the review: '
			break;
	}
	if (senderId !== recipientId) {
		Firebase.database().ref(Constants.INBOX_PATH + '/' + recipientId).push().set(inboxObject);
		Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/messageCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
        })
	}
}