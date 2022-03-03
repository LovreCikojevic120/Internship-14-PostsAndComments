import { printPosts } from "./postHandler.js";
import { helpArray } from "./utils.js";

function searchPosts(){
  const searchBar = document.querySelector('.search-bar');
  let keyWord = searchBar.querySelector('.search-bar__input');
  searchBar.addEventListener('change', () => {
    let searchResultArray = [];
    
    for(let post of helpArray){
      if(post.tags.some(t => t.includes(`${keyWord.value}`)))
        searchResultArray.push(post);
    }
    
    if(searchResultArray.length === 0){
      printPosts(helpArray);
      return;
    }
    printPosts(searchResultArray);
  })
}

export {searchPosts};