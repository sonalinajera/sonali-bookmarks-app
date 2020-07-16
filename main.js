"use strict"; 


// ***** test to make sure js works ****  
function main () {
  handleAddBookmarkClick()
}

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function (event) {
    event.preventDefault();
    alert('Zoom Zoom');
  });

}

$(main)



