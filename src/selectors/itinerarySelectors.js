import * as Helpers from '../helpers'

export function getCreatedBy (usersData, userId) {
	if (userId && usersData[userId]) return usersData[userId];
	else return { username: null, images: null };
}

export function getFullItinerary(itinerary, usersData) {
	return Object.assign({}, itinerary, {createdBy: usersData[itinerary.userId]});
}

export function getItineraryComments(commentsData, itineraryId) {
	return commentsData[itineraryId] ? [].concat(commentsData[itineraryId]) : [];
}

export function getIsLiked(likesData, id) {
	return likesData[id];
}

export function getTipList(usersData, tipsData, reviewsData, subjectsData, likesData, commentsData, userImagesData, defaultImagesData, itinerary) {
	let tipsList = [];
	let priority = 0;
	for (let key in tipsData) {
		if (tipsData[key]) {
			let tipItem = tipsData[key];
			let tipCreator = tipItem.userId ? tipItem.userId : itinerary.userId;
			let creatorData = Object.assign({}, getCreatedBy(usersData, tipCreator));
			let review = reviewsData[tipItem.reviewId];
			let subject = subjectsData[tipItem.subjectId];
			let defaultImage = defaultImagesData[tipItem.subjectId] ? defaultImagesData[tipItem.subjectId] : [];
			let images = userImagesData[tipItem.subjectId] ? userImagesData[tipItem.subjectId] : defaultImage;
			let reviewObject = Object.assign({}, subject, review, {id: tipItem.reviewId}, { priority: priority }, tipItem, 
				{createdBy: creatorData }, {isLiked: likesData[tipItem.reviewId]}, {comments: commentsData[tipItem.reviewId]}, {images: images} );
			tipsList = [reviewObject].concat(tipsList);
			priority++;
		}
	}

	tipsList.sort(Helpers.byPriority);
	return tipsList;
}