import { createPost } from "./modules/postHandler.js";
import {register, signIn} from './modules/accountHandler.js';
import { setAppId, currentUser } from './modules/currentUserInformation.js'
import { infiniteScroll } from "./modules/utils.js";
import { searchPosts } from "./modules/searchHandler.js";

let accountForm = document.querySelector('.accountInput');
let postForm = document.querySelector('.postInput');

setAppId(prompt('Unesi app id za dummy API:'));

accountForm.addEventListener('click', e => {
  e.preventDefault();

  switch(e.target.textContent){
    case 'Register':
      register();
      break;
    case 'Sign In':
      signIn();
      break;
    case 'Sign Out':
      signOut();
      break;
  }
});

postForm.addEventListener('click', e => {
  let description = postForm.querySelector('.newPostDesc').value;
  let tags = postForm.querySelector('.newPostTags').value;
  let error = postForm.querySelector('.errorMsg');
  const preview = postForm.querySelector('.newPostImg');
  const file = postForm.querySelector('.image_input');
  const reader = new FileReader();

  if(e.target.className === 'image_input'){
    file.addEventListener('change', function(){
      reader.addEventListener("load", function() {
        preview.src = reader.result;
      }, false);
  
      if(file)
        reader.readAsDataURL(file.files[0]);
    });
  }

  if(e.target.textContent === 'Post'){
    e.preventDefault();

    if(!currentUser.id){
      error.textContent = 'Not signed in';
      setTimeout(() => error.textContent = '', 3000);
      return;
    }
  
    if(!description || !tags || !preview.src){
      error.textContent = 'Some fields are empty';
      setTimeout(() => error.textContent = '', 3000);
      return;
    }

    createPost({
      'text': description,
      'image': file.files[0].name,
      'likes': '0',
      'tags': [tags],
      'owner': currentUser.id
    });
  }
})

infiniteScroll('post', false, true);
searchPosts();
