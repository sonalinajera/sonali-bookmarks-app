import $ from 'jquery';
import api from './api.js';
import data from './store.js';


// a good test to see what youre targeting 
// $(this).parents('section').prev().css( "background-color", "red" );

// ******* functions below are for generateView.js **********

function generateAddBookmarkView() {
  // might have to relocate this to the catch respond when an error occurs
  // <h2 class="hide">JSON returns an error!</h2>
  return `
    <div class="addBookMarkWindowView">
        <form id="js-formSubmit">
            <input type="text" id="addTitle" name="addTitle" placeholder="Title" required>
            <br>
            <input type="url" id="addURL" name="addURL" placeholder="http(s)://example.com" pattern="https?://.*" required>
            <br>
            <textarea id="addDescription" name="addDescription" placeholder="short and sweet!" required maxlength="70"></textarea>
            <br>
            <section class="addButtonFlex">	
                <input type="button" id="js-cancelAddButton" value="Cancel">
                <input type="submit" id="js-submitAddButton" value="Submit">
            <section>
        </form> 
    </div>`;
}
// needs to render radio button selection if a rating exists in the API
//if rating !== undefined, then find value = rating and input:checked === true? 
function generateBookmarkItem(bookmark, i) {
  let bookmarkViewDetailsButton = `<button class="js-viewMore" type="button">View More</button>`
  let bookmarkDetailsSection = `<section id="js-toggleHide" class="bookmarkDetails hide">`;
  if (bookmark.hideDetails) {
    bookmarkViewDetailsButton = `<button class="js-viewLess" type="button">View Less</button>`
    bookmarkDetailsSection = `<section id="js-toggleHide" class="bookmarkDetails">`
  
  }
  return `<li data-id="${bookmark.id}">
            <h3 class="flexListItems">${bookmark.title}</h3>
            <section class="flexListElements">
            <fieldset class="starability-basic">
            <input type="radio" id="${bookmark.id}0" class="input-no-rate" name="rating${i}" value="0" checked aria-label="No rating." />
            <input ${bookmark.rating === 1 ? `checked` : ``} type="radio" id="${bookmark.id}1" name="rating${i}" value="1" />
            <label for="${bookmark.id}1" title="Terrible">1 star</label>
            <input ${bookmark.rating === 2 ? `checked` : ``} type="radio" id="${bookmark.id}2" name="rating${i}" value="2" />
            <label for="${bookmark.id}2" title="Not good">2 stars</label>
            <input ${bookmark.rating === 3 ? `checked` : ``} type="radio" id="${bookmark.id}3" name="rating${i}" value="3" />
            <label for="${bookmark.id}3" title="Average">3 stars</label>
            <input ${bookmark.rating === 4 ? `checked` : ``} type="radio" id="${bookmark.id}4" name="rating${i}" value="4" />
            <label for="${bookmark.id}4" title="Very good">4 stars</label>
            <input ${bookmark.rating === 5 ? `checked` : ``} type="radio" id="${bookmark.id}5" name="rating${i}" value="5" />
            <label for="${bookmark.id}5" title="Amazing">5 stars</label>
             <span class="starability-focus-ring"></span>
            </fieldset>
               
              ${bookmarkViewDetailsButton}
              <button id="js-delete" type="button">Delete</button>
     
            </section>

            ${bookmarkDetailsSection} 
            <p><a href="${bookmark.url}">Visit Site</a></p>
            <p class="description">
            ${bookmark.desc}
            </p>
            </section>
          </li>`;

}

function generateBookmarkList() {
  let bookmarksArray = data.store.items.map((bookmark , i) => generateBookmarkItem(bookmark, i));
  return bookmarksArray.join('');
}



function render() {
  let bookmarkItems = [...data.store.items];
 
  if(data.store.adding) {
    $('section.js-mainMenu').after(generateAddBookmarkView);
  }
  // if return response array === [] this means user is new so we want to set add item to false immediately
  if (bookmarkItems.length === 0) {
    $('#js-error-display').html(`<h4> nothing to show yet, add a bookmark</h4>`);
  } else {
    $('#js-error-display').html('');
  }

  let bookmarkListString = generateBookmarkList(bookmarkItems);
  return $('ul').html(bookmarkListString);
}




// *************** EVENT LISTENERS ***************

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function () {
    // prevents add button from being spammed 
    if (data.store.adding) {
      return alert('finish adding your item before you add another');
    }
    data.updateAddingBookmarkStoreState(true); 
    render();
  }) // need to add catch error functionality 
  ;
}
  
function handleCancelAddBookmarkClick() {
  $('body').on('click', '#js-cancelAddButton', function(event) {
    event.preventDefault();
    // if we cancel add bookmark set store.adding to false
    data.updateAddingBookmarkStoreState(false);
    // remove create bookmarkk field
    $('div').remove('.addBookMarkWindowView');
  });
}

function handleSubmitBookmarkClick() {
  $('body').on('submit', '#js-formSubmit', function(event) {
    event.preventDefault();
    // if ()
    let userInputTitle = $('#addTitle').val();
    let userInputURL = $('#addURL').val();
    let userInputDesc = $('#addDescription').val();

    // createNewBookMarks will create a JSON obj 
    let newBookmark = {
      title: userInputTitle,
      url: userInputURL,
      desc: userInputDesc,
    };

    // posts to the API :) 
    api.createNewBookmarks(newBookmark)
      .then((newBookmark) => {
        data.updateLocalStore(newBookmark);
        $('div').remove('.addBookMarkWindowView');
        data.updateAddingBookmarkStoreState(false);
        render();
      })
      .catch((e) => {
        console.log(e);
      });
  });
}


function handleRatingSubmission() {
  // listens for the form submit event for the ratings
  //.starability-heartbeat input listens for input element in on submit
  //
  $('body').on('click', ':checked', function () {
    event.preventDefault();

    let radioValue = parseInt($(this).closest('fieldset').find(':checked').val());
    let targetId = $(this).closest('li').attr('data-id');
    let targetBookMarkIndex = data.getMatchingBookMarkIndex(targetId);
    console.log(radioValue)
    let userRating = {
      rating: radioValue
    };

    api.updateBookmarks(targetId, userRating).then(() => {
      data.updateItemRating(targetBookMarkIndex, userRating.rating);
      render();
    })
      .catch((e) => {
        console.log(e);
      });
  });
}

function handleViewMoreClick() {
  $('ul').on('click', '.js-viewMore', function () {
    let targetTitle = $(this).closest('li').find('h3').text();
    let targetId = data.getCurrentItemID(targetTitle);
    let targetBookMarkIndex = data.getMatchingBookMarkIndex(targetId);
    data.updateBookmarkHideDetails(targetBookMarkIndex, true);
    render();
  });
}

function handleViewLessClick() {
  $('ul').on('click', '.js-viewLess', function () {
    console.log('viewless is being clicked');
    let targetTitle = $(this).closest('li').find('h3').text();
    let targetId = data.getCurrentItemID(targetTitle);
    let targetBookMarkIndex = data.getMatchingBookMarkIndex(targetId);
    data.updateBookmarkHideDetails(targetBookMarkIndex, false);
    render();
  });
}

// might be helpful to use 
// let targetTitle = $(this).parents('section').prev().text();
//     let targetId = data.getCurrentItemID(targetTitle);
function handleDeleteClick() {
  $('body').on('click', '#js-delete', function () {
    let targetTitle = $(this).closest('li').find('h3').text();
    let targetId = data.getCurrentItemID(targetTitle);
    api.deleteBookmarks(targetId)
      .then(() => {
        data.removeItemsFromLocalStore(targetId);
        render();
      })
      .catch((e) => {
        console.log(e);
      });
  });
}

// putting all event listeners in a convenient function 

function bindEventListeners() {
  handleAddBookmarkClick();
  handleCancelAddBookmarkClick();
  handleSubmitBookmarkClick();
  handleViewMoreClick();
  handleViewLessClick();
  handleRatingSubmission();
  handleDeleteClick();
}


// we export our event listeners so index can have access to them 
// we also export our render function which calls the generate view functions 

export default {
  render,
  bindEventListeners,
  generateBookmarkList
};