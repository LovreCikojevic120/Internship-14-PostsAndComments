import {currentUser, setCurrentUser, appId} from './currentUserInformation.js';
import { infiniteScroll } from './utils.js';

async function register(){

  let firstName = document.querySelector('.firstName').value;
  let lastName = document.querySelector('.lastName').value;
  let email = document.querySelector('.email').value;
  const accountForm = document.querySelector('.accountInput');
  let error = accountForm.querySelector('.errorMsg');

  if(!firstName || !lastName || !email){
    error.textContent = 'Some fields are empty';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  await fetch(`https://dummyapi.io/data/v1/user/create`,{
    method:'POST',
		headers:{
			'app-id': appId,
      'Content-Type': 'application/json'
		},
    body: JSON.stringify({
      'firstName': firstName,
      'lastName': lastName,
      'email': email
    })
	})
	.then(response => response.json())
  .then(res => {
    if(!res.error){
      setCurrentUser(res);
      printUser(res);
    }
    else{
      error.textContent = 'User already exsists';
      setTimeout(() => error.textContent = '', 3000);
    }
  });
}

async function signIn(){
  let firstName = document.querySelector('.firstName').value;
  let lastName = document.querySelector('.lastName').value;
  let email = document.querySelector('.email').value;
  const accountForm = document.querySelector('.accountInput');
  let error = accountForm.querySelector('.errorMsg');

  if(!firstName || !lastName || !email){
    error.textContent = 'Some fields are empty';
    setTimeout(() => error.textContent = '', 3000);
    return;
  }

  let users = await getAllUsers();
  let user = users.find(u => u.firstName === firstName && u.lastName === lastName);
  
  if(user){
    await fetch(`https://dummyapi.io/data/v1/user/${user.id}`,{
      headers:{
        'app-id': appId,
      }
    })
    .then(response => response.json())
    .then(res => {
      if(res.email === email){
        setCurrentUser(res);
        printUser();
      }
    });
  }
}

async function getAllUsers(){
  let pages = 0,users = [];

  await fetch(`https://dummyapi.io/data/v1/user`,{
      headers:{
        'app-id': appId,
      }
    })
    .then(response => response.json())
    .then(res => {
      pages = parseInt(res.total / 20);
      res.data.forEach(e => users.push(e));
    });

    while(pages !== 0){
      await fetch(`https://dummyapi.io/data/v1/user?page=${pages}`,{
        headers:{
          'app-id': appId,
        }
      })
      .then(response => response.json())
      .then(res => {
        pages--;
        res.data.forEach(e => users.push(e));
      });
    }
    return users;
}

function printUser(){
  let userInfoDiv = document.querySelector('.currentUser');

  userInfoDiv.innerHTML = `
  <img src="${currentUser.picture}" alt="Insert image">
  <div class="user__info">
    <p>${currentUser.firstName}</p>
    <p>${currentUser.lastName}</p>
    <p>${currentUser.id}</p>
  </div>
  <div class="user__action">
    <button class="viewAllPosts">Sve objave</button>
    <button class="viewPosts">Moje objave</button>
    <button class="viewComments">Moji komentari</button>
  </div>
  `;

  updateAccountWindow();
}

async function navigator(){
  let allPosts = document.querySelector('.viewAllPosts');
  let myPosts = document.querySelector('.viewPosts');
  let myComments = document.querySelector('.viewComments');

  allPosts.addEventListener('click', e => {
    e.preventDefault();
    infiniteScroll('post', true, true);
  });

  myPosts.addEventListener('click', e => {
    e.preventDefault();
    infiniteScroll(`user/${currentUser.id}/post`, true, true);
  });
  
  myComments.addEventListener('click', e => {
    e.preventDefault();
    infiniteScroll(`user/${currentUser.id}/comment`, true, false);
  });
}

function updateAccountWindow(){
  let form = document.querySelector('.accountInput');
  navigator();

  for(let child of form)
    child.style.display = 'none';
  
  form.innerHTML += `<button class="sign-out">Odjava</button>`;

  const signOut = form.querySelector('.sign-out');
  signOut.addEventListener('click', e => {

    for(let child of form)
      child.style.display = 'unset';
    signOut.style.display = 'none';

    let user = document.querySelector('.currentUser');
    while (user.firstChild)
      user.removeChild(user.firstChild);
    
    setCurrentUser({});
  })
}

export {register, signIn};