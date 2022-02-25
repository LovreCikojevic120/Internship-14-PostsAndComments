async function getPosts(){

	const posts = await fetch('https://dummyapi.io/data/v1/post',{
		headers:{
			'app-id': '621278657c4302234016b3af'
		}
	})
	.then(response => response.json());

	return posts;
}

export {getPosts};