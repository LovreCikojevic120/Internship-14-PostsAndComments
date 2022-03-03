import { getComments } from './commentHandler.js';
import {getPosts} from './postHandler.js';

let helpArray = [];
let pageCounter = 1;
let isResourcePost = false;

function setHelpArray(newArray){
  helpArray = newArray;
}

function infiniteScroll(link, resetCounter, isPost){
  window.removeEventListener('scroll', addScroll);
  isResourcePost = isPost;

  if(resetCounter)
    pageCounter = 1;

  if(isResourcePost) getPosts(link, false);
  else getComments(link, false, null);

  window.addEventListener('scroll', () => addScroll(link, isResourcePost));
}

function addScroll(link, isResourcePost){
  const {scrollHeight,scrollTop,clientHeight} = document.documentElement;
  if(scrollTop + clientHeight > scrollHeight - 5){
    if(isResourcePost) getPosts(`${link}?page=${pageCounter}`, true);
    else getComments(`${link}?page=${pageCounter}`, true, null);
    pageCounter++;
  }
}

export {infiniteScroll, helpArray, setHelpArray };