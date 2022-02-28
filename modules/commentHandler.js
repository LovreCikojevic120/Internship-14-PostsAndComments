async function getComments(post){
  const postId = post.querySelector('.postId').textContent;

	const comments = await fetch(`https://dummyapi.io/data/v1/post/${postId}/comment`,{
		headers:{
			'app-id': '621278657c4302234016b3af'
		}
	})
	.then(response => response.json());

  printComments(post, comments.data);
}

function listenComments(){
  document.querySelector('.comments').addEventListener('click', e => {
    if(e.target.tagName === 'BUTTON'){

      const post = e.target.parentElement.parentElement;

      switch(e.target.className){
        case 'delete':
          deleteComment(post);
          break;
        case 'edit':
          editComment();
          break;
      }
    }
  });
}

function printComments(post, commentData){
  let commentsDiv = post.querySelector('.comments');
  commentsDiv.textContent = 'Comments:';

  for(let entry of commentData){
    commentsDiv.innerHTML += `
    <li class="comment">
      <div class="comment__info">
        <p>${entry.message}</p>
        <p>${entry.owner.firstName} ${entry.owner.lastName}</p>
        <p>${entry.publishDate}</p>
      </div>
      <div class="comment__action">
        <div class="errorMsg"></div>
        <div class="commentId" style="display: none;">${entry.id}</div>
        <button class="delete">Izbrisi</button>
        <button class="edit">Uredi</button>
      </div>
    </li>
    `;
  }

  listenComments();
}

export {getComments};