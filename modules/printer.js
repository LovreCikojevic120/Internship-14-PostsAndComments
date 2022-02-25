import { getPosts } from "./fetcher.js";

function printPosts(){
	
	const posts = getPosts().then(response => {
		for(let entry of response.data){
			document.querySelector('.posts').innerHTML += `
			<div class="post">
				<img src="${entry.image}">
				<div class="post__info">
					<h2>Description: ${entry.text}</h2>
					<h2>Likes: ${entry.likes}</h2>
					<h2>Tags: ${entry.tags}</h2>
				</div>
				<div class="post__action">
					<button>Komentiraj</button>
					<button>Lajkaj</button>
				</div>
  			</div>
			`;
		}	
	});
}

export {printPosts};