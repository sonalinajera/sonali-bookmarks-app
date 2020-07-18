"use strict"; 


import $ from 'jquery';
import 'normalize.css';
import './index.css';
import './star.css';
import data from './store.js'
import api from './api.js';
import generateView from './generateView.js';


function main () {
  //function getBookmarks, calls apiFetch, that returns JS objs if any, we deal with a JS obj because our api fetch parses JSON obj and returns JS obj
  api.getBookmarks()
    .then(bookmarkList => { 
      //push each obj containing our info to our local store
      bookmarkList.forEach((bookmark) => {
        bookmark.hideDetails = false;
        return data.updateLocalStore(bookmark);
      });
      // then call on render to see updates from actions:)
      generateView.render();
    });
  // this primes our listners! 
  generateView.bindEventListeners();
  //renders initial view when user loads app! 
  generateView.render();
}



$(main);



