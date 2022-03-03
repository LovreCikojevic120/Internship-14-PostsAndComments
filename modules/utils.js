import { getComments } from './commentHandler.js';
import {getPosts} from './postHandler.js';

let helpArray = [];
let pageCounter = 0;
let isResourcePost = false;

function setHelpArray(newArray){
  helpArray = newArray;
}

function infiniteScroll(link, isPost){
  pageCounter = 0;
  window.removeEventListener('scroll', addScroll);
  isResourcePost = isPost;

  if(isResourcePost) getPosts(link, false);
  else getComments(link, false, null);

  window.addEventListener('scroll', addScroll(link, isResourcePost));
}

function addScroll(link, isResourcePost){
  if(window.scrollY + window.innerHeight >= document.documentElement.scrollHeight){
    if(isResourcePost) getPosts(`${link}?page=${pageCounter}`, true);
    else getComments(`${link}?page=${pageCounter}`, true, null);
    pageCounter++;
  }
}

export { infiniteScroll, helpArray, setHelpArray };