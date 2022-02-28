import {currentUser} from './currentUserInformation.js';

async function register(){

  let firstName = document.querySelector('.firstName');
  let lastName = document.querySelector('.lastName');
  let email = document.querySelector('.email');

  let user = await fetch(`https://dummyapi.io/data/v1/user/create`,{
    method:'POST',
		headers:{
			'app-id': '621278657c4302234016b3af',
      'Content-Type': 'application/json'
		},
    body: JSON.stringify({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value
    })
	})
	.then(response => response.json());

  if(user){
    currentUser = user;
    printUser(user);
  }
}

async function signIn(){

  let firstName = document.querySelector('.firstName');
  let lastName = document.querySelector('.lastName');
  let email = document.querySelector('.email');
  
    let users = await fetch(`https://dummyapi.io/data/v1/user`,{
      headers:{
        'app-id': '621278657c4302234016b3af',
      }
    })
    .then(response => response.json());

    let user = users.data.find(u => u.firstName === firstName.value 
      && u.lastName === lastName.value && u.email === email.value);

    if(user){
      currentUser = user;
      printUser(user);
    }
  }

function printUser(user){
  let userInfoDiv = document.querySelector('.currentUser');

  userInfoDiv.innerHTML += `
  <img src="${user.picture}" alt="Insert image">
  <div class="user__info">
    <p>${user.firstName}</p>
    <p>${user.lastName}</p>
    <p>${user.id}</p>
  </div>
  <div class="user__action">
    <button class="viewPosts">Objave</button>
    <button class="viewComments">Komentari</button>
  </div>
  `;

  updateAccountWindow();
}

function updateAccountWindow(){
  let form = document.querySelector('.accountInput');
  
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
    
    currentUser = {};
  })
}

export {register, signIn};