import Firebase from 'firebase';
import * as Constants from './constants'

export function sendInboxMessage(senderId, recipientId, messageType, review) {
	const inboxObject = {
		senderId: senderId,
		lastModified: Firebase.database.ServerValue.TIMESTAMP
	};

	if (review) inboxObject.reviewId = review.id;
	if (review && review.subject.image) inboxObject.reviewImage = review.subject.image;
	if (review && review.subject.title) inboxObject.reviewTitle = review.subject.title;

	switch(messageType) {
		case Constants.LIKE_MESSAGE:
			inboxObject.message = ' liked your review: ';
			inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
			break;
		case Constants.COMMENT_ON_REVIEW_MESSAGE:
			inboxObject.message = ' commented on your review: ';
			inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
			break;
		case Constants.COMMENT_ON_COMMENT_MESSAGE:
			inboxObject.message = ' also commented on the review: ';
			inboxObject.link = 'review/' + review.subjectId + '/' + review.id;
			break;
		case Constants.FOLLOW_MESSAGE:
			inboxObject.message = ' started following you.';
			Firebase.database().ref(Constants.USERS_PATH + '/' + senderId).once('value', snapshot => {
				inboxObject.link = '@' + snapshot.val().username;
			})
			break;
	}
	if (senderId !== recipientId) {
		Firebase.database().ref(Constants.INBOX_PATH + '/' + recipientId).push().set(inboxObject);
		Firebase.database().ref(Constants.INBOX_COUNTER_PATH + '/' + recipientId + '/messageCount').transaction(function (current_count) {
            return (current_count || 0) + 1;
        })
	}
}