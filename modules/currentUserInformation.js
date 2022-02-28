const currentUser = {};

async function getUserResource(resourceType ,resourceId){
  const resource = await fetch(`https://dummyapi.io/data/v1/${resourceType}/${resourceId}`,{
		headers:{
			'app-id': '621278657c4302234016b3af'
		}
	})
	.then(response => response.json());

  return resource.owner.email === currentUser.email ? true : false;
}

export {currentUser, getUserPost};