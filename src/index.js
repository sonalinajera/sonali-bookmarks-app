"use strict"; 

import $ from 'jquery';
import 'normalize.css';
import './index.css';
import './star.css';
import data from './store.js';
import api from './api.js';
import generateView from './generateView.js';

function main () {
  api.getBookmarks()
    .then(bookmarkList => { 
      bookmarkList.forEach((bookmark) => {
        bookmark.hideDetails = false;
        return data.updateLocalStore(bookmark);
      });
      generateView.render();
    });
  generateView.bindEventListeners();
  generateView.render();
}

$(main);



