let currentUser = {};
let appId = '621f966f4448e407b601cc04';

function setCurrentUser(user){
  currentUser = user;
}

function setAppId(newId){
	appId = newId;
}

function isUserResource(ownerId){
  return ownerId === currentUser.id ? true : false;
}

export {currentUser, setCurrentUser, isUserResource, appId, setAppId};