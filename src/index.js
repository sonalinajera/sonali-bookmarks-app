"use strict"; 

import $ from 'jquery';
import './index.css';
import './star.css';
import createFxs from './createView.js';

// ***** test to make sure js works ****  

let adding = false; 

function main () {
  handleAddBookmarkClick();
  handleCancelAddBookmarkClick();
}

function render() {
  if(adding) {
    return $('.js-mainMenu').after(createFxs.createAddBookmark);
 }   
}

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function (event) {
    event.preventDefault();
    // prevents add button from being spammed 
    if (adding) {
      return alert('finish adding your item before you add another');
    }
    adding = true; 
    render();
  });
}

function handleCancelAddBookmarkClick() {
  $('body').on('click', '#js-cancelButton', function(event) {
    event.preventDefault();
    // if we cancel add bookmark set adding to false
    adding = false;
    // remove create bookmarkk field
    $('div').remove('.addBookMarkWindowView');
  });
}

$(main);



