import { appId, currentUser, isUserResource } from "./currentUserInformation.js";
import { helpArray, setHelpArray } from "./utils.js";

async function getComments(link, savePreviousData, postTarget){
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
        if(savePreviousData)
          res.data.forEach(element => helpArray.push(element));
        else setHelpArray(res.data);
      }).then(() => printComments(postTarget, helpArray));
}

async function postComment(post, comment){
  let error = comment.querySelector('.errorMsg');
  const postId = post.querySelector('.postId').textContent;
  const commentText = post.querySelector('.newComment').value;

  if(!currentUser.id || commentText === ''){
    error.textContent = 'Not signed in';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

	const newComment = await fetch(`https://dummyapi.io/data/v1/comment/create`,{
    method: 'POST',
		headers:{
			'app-id': appId,
      'Content-Type': 'application/json'
		},
    body: JSON.stringify({
      'message': commentText,
      'owner': currentUser.id,
      'post': postId
    })
	})
	.then(response => response.json());

  post.querySelector('.comments').innerHTML += `
    <li class="comment">
    <div class="comment__info">
      <p class="desc">${newComment.message}</p>
      <p>Autor:</p>
      <p>${newComment.owner.firstName} ${newComment.owner.lastName}</p>
      <p>Objavljeno:</p>
      <p>${newComment.publishDate}</p>
    </div>
    <div class="comment__action">
      <div class="errorMsg"></div>
      <div class="commentId" style="display: none;">${newComment.id}</div>
      <div class="commentOwnerId" style="display: none;">${newComment.owner.id}</div>
      <button class="delete-comment">Izbrisi</button>
      <button class="edit-comment">Uredi</button>
    </div>
  </li>
  `;
}

function listenComments(commentsDiv){
  commentsDiv.addEventListener('click', e => {

    const comment = e.target.parentElement.parentElement;

    switch(e.target.className){
      case 'postComment':
        console.log(comment);
        postComment(comment.parentElement, comment)
        break;
      case 'delete-comment':
        deleteComment(comment);
        break;
      case 'edit-comment':
        awakeCommentEditor(comment);
        break;
    }
  });
}

function printComments(post, commentData){
  let commentsDiv;

  if(!post){
    commentsDiv = document.querySelector('.posts');
    commentsDiv.innerHTML = '';
  }
  else{
    commentsDiv = post.querySelector('.comments');
    commentsDiv.innerHTML = `
        <div class="new-comment-form">
          <input type="text" placeholder="Komentiraj..." class="newComment">
          <div class="errorMsg"></div>
          <button class="postComment">Pošalji</button>
        </div>
      `;
  }

  if(commentData){
    for(let entry of commentData){
      commentsDiv.innerHTML += `
      <li class="comment">
        <div class="comment__info">
          <p class="desc">${entry.message}</p>
          <p>Autor:</p>
          <p>${entry.owner.firstName} ${entry.owner.lastName}</p>
          <p>Objavljeno:</p>
          <p>${entry.publishDate}</p>
        </div>
        <div class="comment__action">
          <div class="errorMsg"></div>
          <div class="commentId" style="display: none;">${entry.id}</div>
          <div class="commentOwnerId" style="display: none;">${entry.owner.id}</div>
          <button class="delete-comment">Izbrisi</button>
          <button class="edit-comment">Uredi</button>
        </div>
      </li>
      `;
    }
  }

  listenComments(commentsDiv);
}

async function deleteComment(comment){
  const commentId = comment.querySelector('.commentId').textContent;
  const ownerId = comment.querySelector('.commentOwnerId').textContent;
  let error = comment.querySelector('.errorMsg');

  if(!isUserResource(ownerId) || !currentUser.id){
    error.textContent = 'Not signed in or not your comment';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  await fetch(`https://dummyapi.io/data/v1/comment/${commentId}`,{
    method: 'DELETE',
		headers:{
			'app-id': appId,
      'Content-Type': 'application/json'
		}
	})
	.then(response => response.json())
  .then(()=>comment.remove());
}

function awakeCommentEditor(comment){
  const commentId = comment.querySelector('.commentId').textContent;
  let description = comment.querySelector('.desc').textContent;
  let commentData = comment.innerHTML;

  comment.innerHTML = `
  <form class="accountInput">
    <input type="text" class="newDesc" value="${description}">
    <button type="submit" class="edit-comment-btn">Edit</button>
    <button type="submit" class="cancel-edit-comment-btn">Cancel</button>
  </form>
  `;

  comment.addEventListener('click', e => {
    if(e.target.className === 'edit-comment-btn'){
      e.preventDefault();

      let text = comment.querySelector('.newDesc');

      editComment(commentId, {
        'message': text.value
      }).then(res => {
        comment.innerHTML = commentData;
        console.log(res);
        comment.querySelector('.desc').textContent = text.value;
      });
    }
    if(e.target.className === 'cancel-edit-comment-btn'){
      e.preventDefault();
      comment.innerHTML = commentData;
    };
  });
}

async function editComment(commentId, dataObject){
  const updatedComment = await fetch(`https://dummyapi.io/data/v1/comment/${commentId}`,{
    method: 'PUT',
		headers:{
			'app-id': appId,
      'Content-Type': 'application/json'
		},
    body: JSON.stringify(dataObject)
	})
	.then(response => response.json());
  console.log(updatedComment);
  return updatedComment;
}

export { printComments, getComments };