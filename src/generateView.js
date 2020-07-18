import $ from 'jquery';
import api from './api.js';
import data from './store.js';



// a good test to see what youre targeting 
// $(this).parents('section').prev().css( "background-color", "red" );

// *************** GENERATE VIEWS ***************


function generateAddBookmarkView() {
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

function generateBookmarkList(bookmarkList) {
  let bookmarksArray = bookmarkList.map((bookmark , i) => generateBookmarkItem(bookmark, i));
  return bookmarksArray.join('');
}

function generateBookmarkItem(bookmark, i) {
  let bookmarkViewDetailsButton = `<button class="js-viewMore" type="button">View More</button>`;
  let bookmarkDetailsSection = `<section id="js-toggleHide" class="bookmarkDetails hide">`;

  if (bookmark.hideDetails) {
    bookmarkViewDetailsButton = `<button class="js-viewLess" type="button">View Less</button>`;
    bookmarkDetailsSection = `<section id="js-toggleHide" class="bookmarkDetails">`;
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
              <p class="websiteDescription">
              ${bookmark.desc}
              </p>
            </section>
          </li>`;

}

function generateError(message) {
  return `<p>${message}</p>      
          <button id="cancel-error">X</button>`;
}

function render() {
  renderError();

  let bookmarkItems = [...data.store.bookmarks];
  if (bookmarkItems.length === 0) {
    $('#error-container').html(`<h4> nothing to show yet, add a bookmark</h4>`);
  } else {
    $('#error-container').html('');
  }
  if(data.store.adding) {
    $('#addBookmark-container').html(generateAddBookmarkView);
  } else {
    $('#addBookmark-container').empty();
  }
  if (data.store.filter > 0) {
    let filteredBookmarkListString = generateBookmarkList(data.returnBookmarksWithNRating());
    return $('ul').html(filteredBookmarkListString);
  }

  let bookmarkListString= generateBookmarkList(bookmarkItems);
  return $('ul').html(bookmarkListString);
}

function renderError() {
  if(data.store.error) {
    let errorString = generateError(data.store.error);
    $('#error-container').html(errorString);
  } else {
    $('#error-container').empty();
  }
}

// *************** EVENT LISTENERS ***************

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function () {
    if (data.store.adding) {
      return alert('finish adding your item before you add another');
    }
    data.store.adding = true; 
    render();
  });
}
  
function handleCancelAddBookmarkClick() {
  $('body').on('click', '#js-cancelAddButton', function(event) {
    event.preventDefault();
    data.store.adding = false;
    render();
  });
}

function handleSubmitBookmarkClick() {
  $('body').on('submit', '#js-formSubmit', function(event) {
    event.preventDefault();
    let userInputTitle = $('#addTitle').val();
    let userInputURL = $('#addURL').val();
    let userInputDesc = $('#addDescription').val();

    let newBookmark = {
      title: userInputTitle,
      url: userInputURL,
      desc: userInputDesc,
    };

    api.createNewBookmark(newBookmark)
      .then((newBookmark) => {
        data.updateLocalStore(newBookmark);
        data.store.adding = false;
        render();
      })
      .catch((e) => {
        data.store.error = e.message;
        renderError();
      });
  });
}

function handleRatingFilterSet(){
  $('select#dropdown').on('change', function (){
    let filterValue = $(this).val();
    data.updateFilterValue(filterValue);
    render();
  }); 
}


function handleRatingSubmission() {
  $('body').on('click', ':checked', function () {
    event.preventDefault();

    let radioValue = parseInt($(this).closest('fieldset').find(':checked').val());
    let targetId = $(this).closest('li').attr('data-id');
    let targetBookMarkIndex = data.getMatchingBookMarkIndex(targetId);
    let userRating = {
      rating: radioValue
    };

    api.updateBookmark(targetId, userRating).then(() => {
      data.updateItemRating(targetBookMarkIndex, userRating.rating);
      render();
    })
      .catch((e) => {
        data.store.error = e.message;
        renderError();
      });
  });
}

function handleViewMoreClick() {
  $('ul').on('click', '.js-viewMore', function () {
    let targetId = $(this).closest('li').attr('data-id');
    let targetBookMarkIndex = data.getMatchingBookMarkIndex(targetId);
    data.updateBookmarkHideDetails(targetBookMarkIndex, true);
    render();
  });
}

function handleViewLessClick() {
  $('ul').on('click', '.js-viewLess', function () {
    let targetId = $(this).closest('li').attr('data-id');
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
    let targetId = $(this).closest('li').attr('data-id');
    api.deleteBookmark(targetId)
      .then(() => {
        data.removeItemsFromLocalStore(targetId);
        render();
      })
      .catch((e) => {
        data.store.error = e.message;
        renderError();
      });
  });
}

function handleCloseError() {
  $('#error-container').on('click', '#cancel-error', () => {
    data.store.error = null;
    renderError();
  });
}

// putting all event listeners in a convenient function 

function bindEventListeners() {
  handleAddBookmarkClick();
  handleCancelAddBookmarkClick();
  handleSubmitBookmarkClick();
  handleViewMoreClick();
  handleViewLessClick();
  handleRatingFilterSet(),
  handleRatingSubmission();
  handleDeleteClick();
  handleCloseError();
}


// we export our event listeners so index can have access to them 
// we also export our render function which calls the generate view functions 

export default {
  render,
  bindEventListeners,
  generateBookmarkList
};