import $ from 'jquery';
import api from './api.js';

const store = {
  adding: false,
  error: null,
  filter: 0,
};

function generateAddBookmarkView() {
  // might have to relocate this to the catch respond when an error occurs
  // <h2 class="hide">JSON returns an error!</h2>
  return `
    <div class="addBookMarkWindowView">
        <form>
            <input type="text" id="addTitle" name="addTitle" placeholder="Title" required>
            <br>
            <input type="url" id="addURL" name="addURL" placeholder="http(s)://example.com" pattern="https?://.*" required>
            <br>
            <textarea id="addDescription" name="addDescription" placeholder="description (optional)"></textarea>
            <br>
            <section class="addButtonFlex">	
                <input type="button" id="js-cancelAddButton" value="Cancel">
                <input type="submit" id="js-submitAddButton" value="Submit">
            <section>
        </form> 
    </div>`;
}

function generateBookmarkList() {
  
}

function render() {
  if(store.adding) {
    return $('.js-mainMenu').after(generateAddBookmarkView);
  }   
}
  
function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function (event) {
    event.preventDefault();
    // prevents add button from being spammed 
    if (store.adding) {
      return alert('finish adding your item before you add another');
    }
    store.adding = true; 
    render();
  });
}
  
function handleCancelAddBookmarkClick() {
  $('body').on('click', '#js-cancelAddButton', function(event) {
    event.preventDefault();
    // if we cancel add bookmark set store.adding to false
    store.adding = false;
    // remove create bookmarkk field
    $('div').remove('.addBookMarkWindowView');
  });
}

function handleSubmitBookmarkClick() {
  $('body').on('click', '#js-submitAddButton', function(event) {
    event.preventDefault();
    // if ()
    let userInputTitle = $('#addTitle').val();
    let userInputURL = $('#addURL').val();
    let userInputDesc = $('#addDescription').val()
    if (userInputTitle === '' || userInputURL === '' ) {
      return alert('Please provide a title and url');
    }
    store.adding = false;
    // createNewBookMarks will create a JSON obj 
    let newSubmission = {
      title: userInputTitle,
      url: userInputURL,
      desc: userInputDesc,
    };
    return api.createNewBookmarks(newSubmission);

  });
}


function bindEventListeners() {
  handleAddBookmarkClick();
  handleCancelAddBookmarkClick();
  handleSubmitBookmarkClick();
}


// we export our event listeners so index can have access to them 
// we also export our render function which calls the generate view functions 

export default {
  render,
  bindEventListeners,
  store
}