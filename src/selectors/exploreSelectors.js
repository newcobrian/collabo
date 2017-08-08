import * as Helpers from '../helpers';

export function getAllUsers (usersData, followingData) {
	let userArray = [];
	for (let key in usersData) {
		if (usersData[key]) {
			let userObject = Object.assign({}, usersData[key], {userId: key}, {isFollowing: followingData[key]});
			userArray = [userObject].concat(userArray);
		}
	}
	userArray.sort(Helpers.byUsername);
	return userArray;
}