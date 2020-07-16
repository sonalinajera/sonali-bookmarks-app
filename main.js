"use strict"; 

import createContent from './createView';

// ***** test to make sure js works ****  
function main () {
  handleAddBookmarkClick()
}

function render() {
 if(adding) {
     return createAddBookmark();
 }   
}

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function (event) {
    event.preventDefault();
    alert('Zoom Zoom');
  });

}

$(main)



