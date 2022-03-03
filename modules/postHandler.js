import { appId, isUserResource, currentUser } from './currentUserInformation.js';
import { helpArray, setHelpArray } from './utils.js';
import {getComments} from './commentHandler.js';

async function getPosts(link, savePreviousData){
  await fetch(`https://dummyapi.io/data/v1/${link}`,{
        headers:{
          'app-id': appId,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(res => {
        if(!res.data){
          setHelpArray([]);
          return;
        }
        if(savePreviousData){
          res.data.forEach(element => helpArray.push(element));
          printPosts(helpArray);
        }
        else {
          setHelpArray(res.data);
          printPosts(helpArray);
        }
      });
}

function printPosts(postData){
  let postsDiv = document.querySelector('.posts');
  postsDiv.innerHTML = '';
  
  for(let entry of postData){
    postsDiv.innerHTML += `
    <li class="post">
      <div class="post__owner">
        <img src="${entry.owner.picture}" width="50px" height="50px" class="post__owner-image"/>
        <p class="post__owner-info">${entry.owner.firstName} ${entry.owner.lastName}</p>
      </div>
      <img src="${entry.image}" class="post__image">
      <div class="post__info">
        <h3>Description: </h3>
        <p class="desc">${entry.text}</p>
        <h3>Likes: </h3>
        <p class="likeCounter">${entry.likes}</p>
        <h3>Tags: </h3>
        <p class="tags">${entry.tags}</p>
        <div class="postId" style="display: none;">${entry.id}</div>
        <div class="ownerId" style="display: none;">${entry.owner.id}</div>
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

  listenPosts(postsDiv);
}

function listenPosts(postsDiv){
  postsDiv.addEventListener('click', e => {
      let postId;

      const post = e.target.parentElement.parentElement;
      if(post)
        postId = post.querySelector('.postId').textContent;

      switch(e.target.className){
        case 'viewComments':
          if(e.target.textContent === 'Vidi komentare'){
            e.target.textContent = 'Sakrij komentare';
            getComments(`post/${postId}/comment`, false, post);
            break;
          }
          removePostComments(post, e.target);
          break;
        case 'like':
          likePost(post);
          break;
        case 'delete':
          deletePost(post);
          break;
        case 'edit':
          awakePostEditor(post);
          break;
        default:
          break;
      }
  });
}

function removePostComments(post, button){
  button.textContent = 'Vidi komentare';
  let comments = post.querySelector('.comments');
  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
}
}

function awakePostEditor(post){
  const postId = post.querySelector('.postId').textContent;
  const ownerId = post.querySelector('.ownerId').textContent;
  let description = post.querySelector('.desc').textContent;
  let tags = post.querySelector('.tags').textContent;
  let error = post.querySelector('.errorMsg');
  let postData = post.innerHTML;

  if(!isUserResource(ownerId)){
    error.textContent = 'Not signed in or not your post';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  post.innerHTML = `
  <form class="post-editor">
    <input type="file" accept="image/png, image/jpg" class="image_input">
    <img src="" width="50px" height="50px" class="newPostImg">
    <input type="text" class="newDesc" value="${description}">
    <input type="text" class="newTags" value="${tags}">
    <button type="submit" class="post-edit">Edit</button>
    <button type="submit" class="post-edit-cancel">Cancel</button>
  </form>
  `;

  const preview = post.querySelector('.newPostImg');
  const file = post.querySelector('.image_input');
  const reader = new FileReader();

  file.addEventListener('change', function(){
    reader.addEventListener("load", function() {
      preview.src = reader.result;
    }, false);

    if(file)
      reader.readAsDataURL(file.files[0]);
  });

  post.addEventListener('click', e => {
    e.preventDefault();
    if(e.target.className === 'post-edit'){
      let text = post.querySelector('.newDesc').value;
      let newTags = post.querySelector('.newTags').value;

      editPost(postId, {
        'text': text,
        'tags': [newTags]
      }).then(res => {
        post.innerHTML = postData;
        post.querySelector('.post__image').src = res.image;
        post.querySelector('.desc').textContent = res.text;
        post.querySelector('.tags').textContent = res.tags;
      });
    }
    if(e.target.className === 'post-edit-cancel'){
      post.innerHTML = postData;
    }
  });
}

function likePost(post){
  const postId = post.querySelector('.postId').textContent;
  const userId = currentUser.id;
  let error = post.querySelector('.errorMsg');
  let likes = post.querySelector('.likeCounter');

  if(!userId){
    error.textContent = 'Not signed in';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  let likeArray = JSON.parse(localStorage.getItem('likedPosts'));

  if(likeArray){
    if(likeArray.some(e => e.userId === userId && e.postId === postId)){
      error.textContent = 'Post vec lajkan';
      setTimeout(() => error.textContent = '', 3000);
      return;
    }

    likeArray.push({userId, postId});
    localStorage.setItem('likedPosts', JSON.stringify(likeArray));
    likes.textContent++;
    editPost(postId, {'likes': likes.textContent});
    return;
  }

  likeArray = [{userId, postId}];
  localStorage.setItem('likedPosts', JSON.stringify(likeArray));
  likes.textContent++;
  editPost(postId, {'likes': likes.textContent});
}

async function deletePost(post){
  const postId = post.querySelector('.postId').textContent;
  const ownerId = post.querySelector('.ownerId').textContent;
  let error = post.querySelector('.errorMsg');

  if(!isUserResource(ownerId)){
    error.textContent = 'Not signed in or not your post';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  await fetch(`https://dummyapi.io/data/v1/post/${postId}`,{
    method: 'DELETE',
		headers:{
			'app-id': appId,
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
			'app-id': appId,
      'Content-Type': 'application/json'
		},
    body: JSON.stringify(dataObject)
	})
	.then(response => response.json());

  return updatedPost;
}

async function createPost(dataObject){
  const newPost = await fetch(`https://dummyapi.io/data/v1/post/create`,{
    method: 'POST',
		headers:{
			'app-id': appId,
      'Content-Type': 'application/json'
		},
    body: JSON.stringify(dataObject)
	})
	.then(response => response.json());

  helpArray.unshift(newPost);
  printPosts(helpArray);
}

export { createPost, printPosts, getPosts};