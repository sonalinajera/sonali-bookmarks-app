"use strict"; 


import $ from 'jquery';
import 'normalize.css';
import './index.css';
import './star.css';
import bookmarks from './generateView.js';
import api from './api.js';


// ***** test to make sure js works ****  
// test data 
// const store = {
//   bookmarks: [
//     {
//       id: 'x56w',
//       title: 'Title 1',
//       rating: 3,
//       url: 'http://www.title1.com',
//       description: 'lorem ipsum dolor sit',
//       expanded: false
//     },
//     {
//       id: '6ffw',
//       title: 'Title 2',
//       rating: 5,
//       url: 'http://www.title2.com',
//       description: 'dolorum tempore deserunt',
//       expanded: false
//     } 
//   ],
//   adding: false,
//   error: null,
//   filter: 0
// };



function main () {
  //call getBookmarks, that calls apiFetch, that returns JS objs
  api.getBookmarks()
    .then(items => {
    //   // once I set up proper append, this will be displayed below out main menu
      // if return obj === [] this means user is new so we want to set add item to false immediately
      if (items.length === 0) {
        return $('.js-mainMenu').after(`<h4> nothing to show yet, add a bookmark</h4>`);
      }
      // otherwise push each obj containing our info to our local store
      items.forEach((item) => bookmarks.updatesLocalStore(item));
    });
  bookmarks.bindEventListeners();
  bookmarks.render();
  console.log('current local store:', bookmarks.store)
}



$(main);



