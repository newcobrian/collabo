import * as Helpers from '../helpers'

export function getCreatedByUsername (createdBy) {
	return createdBy ? createdBy.username : null;
}

export function getCreatedByImage (createdBy) {
	return createdBy ? createdBy.image : null;
}

export function getFullItinerary(itinerary, createdBy) {
	return Object.assign({}, itinerary, {createdBy: createdBy});
}

export function getItineraryComments(commentsData, itineraryId) {
	return commentsData[itineraryId] ? [].concat(commentsData[itineraryId]) : [];
}

export function getIsLiked(likesData, id) {
	return likesData[id];
}

export function getTipList(createdByData, tipsData, reviewsData, subjectsData, likesData, commentsData, userImagesData, defaultImagesData) {
	let tipsList = [];
	let priority = 0;
	for (let key in tipsData) {
		if (tipsData[key]) {
			let tipItem = tipsData[key];
			let review = reviewsData[tipItem.reviewId];
			let subject = subjectsData[tipItem.subjectId];
			let defaultImage = defaultImagesData[tipItem.subjectId] ? defaultImagesData[tipItem.subjectId] : [];
			let images = userImagesData[tipItem.subjectId] ? userImagesData[tipItem.subjectId] : defaultImage;
			let reviewObject = Object.assign({}, subject, review, {id: tipItem.reviewId}, { priority: key || priority }, tipItem, 
				{createdBy: createdByData}, {isLiked: likesData[tipItem.reviewId]}, {comments: commentsData[tipItem.reviewId]}, {images: images} );
			tipsList = [reviewObject].concat(tipsList);
			priority++;
		}
	}

	tipsList.sort(Helpers.byPriority);
	return tipsList;
}