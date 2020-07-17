"use strict"; 


import $ from 'jquery';
import 'normalize.css';
import './index.css';
import './star.css';
import data from './store.js'
import api from './api.js';
import generateView from './generateView.js';


function main () {
  //call getBookmarks, that calls apiFetch, that returns JS objs if any, we deal with a JS obj because our api fetch parses and catches errors
  api.getBookmarks()
    .then(items => {
      console.log('GETS response', items);
      
      // otherwise push each obj containing our info to our local store
      // generateView.generateBookmarkListItem(items);
      items.forEach((bookmark) => data.updatesLocalStore(bookmark));
      console.log('store view', data.store.items);
      // then call on render to see updates from actions:)
      generateView.render();
    });
  // this primes our listners! 
  generateView.bindEventListeners();
  //renders initial view when user loads app! 
  // generateView.render();
}



$(main);



