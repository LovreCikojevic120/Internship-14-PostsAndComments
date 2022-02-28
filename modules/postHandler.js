import {getComments} from './commentHandler.js';
import {currentUser, getUserResource} from './currentUserInformation.js';

async function getPosts(pageCounter){

	const posts = await fetch(`https://dummyapi.io/data/v1/post?page=${pageCounter}`,{
		headers:{
			'app-id': '621278657c4302234016b3af'
		}
	})
	.then(response => response.json());

  printPosts(posts.data);
}

function printPosts(postData){
  for(let entry of postData){
    document.querySelector('.posts').innerHTML += `
    <li class="post">
      <img src="${entry.image}">
      <div class="post__info">
        <p>${entry.text}</p>
        <p class="likeCounter">${entry.likes}</p>
        <p>${entry.tags}</p>
        <div class="postId" style="display: none;">${entry.id}</div>
        <div class="errorMsg"></div>
      </div>
      <div class="post__action">
        <button class="like">Lajkaj</button>
        <button class="viewComments">Vidi komentare</button>
        <button class="delete">Izbrisi</button>
        <button class="edit">Uredi</button>
      </div>
      <ul class="comments"></ul>
    </li>
    `;
  }	

  listenPosts();
}

function listenPosts(){
  document.querySelector('.posts').addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){

      const post = e.target.parentElement.parentElement;

      switch(e.target.className){
        case 'viewComments':
          getComments(post);
          break;
        case 'like':
          likePost(post);
          break;
        case 'delete':
          deletePost(post);
          break;
        case 'edit':
          editPost();
          break;
      }
    }
  });
}

function likePost(post){
  const postId = post.querySelector('.postId').textContent;
  let error = post.querySelector('.errorMsg').textContent;
  if(getUserResource('post', postId)){
    error = 'Not signed in';
    return;
  }

  let likes = post.querySelector('.likeCounter').textContent;

  let likeArray = JSON.parse(localStorage.getItem('likedPosts'));

  if(likeArray){
    if(likeArray.includes(postId)){
      error = 'Post vec lajkan';
      return;
    }

    likeArray.push(postId);
    localStorage.setItem('likedPosts', JSON.stringify(likeArray));
    post.querySelector('.likeCounter').textContent++;
    editPost(postId, {'likes': ++likes});
    return;
  }

  likeArray = [postId];
  localStorage.setItem('likedPosts', JSON.stringify(likeArray));
  post.querySelector('.likeCounter').textContent++;
  editPost(postId, {'likes': ++likes});
}

async function deletePost(post){
  const postId = post.querySelector('.postId').textContent;

  if(getUserResource('post', postId)){
    error = 'Not signed in';
    return;
  }

  await fetch(`https://dummyapi.io/data/v1/post/${postId}`,{
    method: 'DELETE',
		headers:{
			'app-id': '621278657c4302234016b3af',
      'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
  .then(()=>post.remove());

}

async function editPost(postId, dataObject){
  const updatedPost = await fetch(`https://dummyapi.io/data/v1/post/${postId}`,{
    method: 'PUT',
		headers:{
			'app-id': '621278657c4302234016b3af',
      'Content-Type': 'application/json'
		},
    body: JSON.stringify(dataObject)
	})
	.then(response => response.json());

  return updatedPost;
}

export {getPosts};