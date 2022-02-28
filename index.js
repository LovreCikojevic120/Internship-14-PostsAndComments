import { getPosts } from "./modules/postHandler.js";
import {register, signIn} from './modules/accountHandler.js';

let pageCounter = 0;
let currentUser = {};
let accountForm = document.querySelector('.accountInput');

accountForm.addEventListener('click', e => {
  e.preventDefault();

  switch(e.target.textContent){
    case 'Register':
      currentUser = register();
      break;
    case 'Sign In':
      currentUser = signIn();
      break;
    case 'Sign Out':
      signOut();
      break;
  }
});

getPosts(pageCounter);
pageCounter++;

window.addEventListener('scroll',()=>{
	const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
	if(scrollTop + clientHeight > scrollHeight - 5){
		getPosts(pageCounter);
    pageCounter++;
  }
});
