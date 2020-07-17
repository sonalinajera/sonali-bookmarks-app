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
function generateBookmarkItem(bookmark) {
  return `<li>
            <h3 class="flexListItems">${bookmark.title}</h3>
            <section class="flexListElements">
              <fieldset class="starability-heartbeat">
                <input type="radio" id="no-rate" class="input-no-rate" name="rating" value="0" checked aria-label="No rating." />
                <input type="radio" id="first-rate" name="rating" value="1" />
                <label for="first-rate1" title="Terrible">1 star</label>
                <input type="radio" id="first-rate" name="rating" value="2" />
                <label for="first-rate2" title="Not good">2 stars</label>
                <input type="radio" id="first-rate$" name="rating" value="3" />
                <label for="first-rate3" title="Average">3 stars</label>
                <input type="radio" id="first-rate" name="rating" value="4" />
                <label for="first-rate4" title="Very good">4 stars</label>
                <input type="radio" id="first-rate" name="rating" value="5" />
                <label for="first-rate5" title="Amazing">5 stars</label>
              </fieldset>
               
              <button id="" class="js-viewMore" type="button">View More</button>
              <button id="" class="js-viewLess hide" type="button">View Less</button>
              <button id="js-delete" type="button">Delete</button>
     
            </section>

            <section id="js-toggleHide" class="bookmarkDetails hide"> 
            <p><a href="${bookmark.url}">Visit Site</a></p>
            <p class="description">
            ${bookmark.desc}
            </p>
            </section>
          </li>`;

}

function generateBookmarkList() {
  // data.store.items.forEach((bookmark) => {
  // //   console.log(bookmark);
  //   return $('ul').append(generateBookmarkList(bookmark));
  // });

  let items = data.store.items.map((bookmark) => generateBookmarkItem(bookmark));
  return items.join('');
}

function render() {
  let items = [...data.store.items];
  if(data.store.adding) {
    $('section.js-mainMenu').after(generateAddBookmarkView);
  } 

  // if return response array === [] this means user is new so we want to set add item to false immediately
  if (items.length === 0) {
    $('#js-error-display').html(`<h4> nothing to show yet, add a bookmark</h4>`);
  } else {
    $('#js-error-display').html('');
  }

  let bookmarkListString = generateBookmarkList(items);

  return $('ul').html(bookmarkListString);
}




// *************** EVENT LISTENERS ***************

function handleAddBookmarkClick() {
  $('#addBookmark').on('click', function (event) {
    // prevents add button from being spammed 
    if (data.store.adding) {
      return alert('finish adding your item before you add another');
    }
    data.store.adding = true; 
    render();
  }) // need to add catch error functionality 
  ;
}
  
function handleCancelAddBookmarkClick() {
  $('body').on('click', '#js-cancelAddButton', function(event) {
    event.preventDefault();
    // if we cancel add bookmark set store.adding to false
    data.store.adding = false;
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
    let newSubmission = {
      title: userInputTitle,
      url: userInputURL,
      desc: userInputDesc,
    };

    // posts to the API :) 
    api.createNewBookmarks(newSubmission)
      .then((newBookmark) => {
        data.updatesLocalStore(newBookmark);
        $('div').remove('.addBookMarkWindowView');
        data.store.adding = false;
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
  $('body').on('click', '.starability-heartbeat input', function (event) {
    // event.target = <input type="radio" id="ID OF ITEM SELECTED" name="rating" value="VALUE OF RADIO BUTTON SELECTED">
    //event.target.value = value of input
    //parseInt since the value is string, convert to number to format the same as API 
    
    let bookmarkTitle = $('input:checked').parents('section').prev().text();
    let currentBookmarkId = data.getCurrentItemID(bookmarkTitle);
    let userRating = {
      rating: parseInt(event.target.value)
    };
    api.updateBookmarks(currentBookmarkId, userRating);
  }) // need to add catch for error cases 
  ;
}

function handleViewMoreClick() {
  $('ul').on('click', '.js-viewMore', function () {

    // the this in this code represents current event target! not part of building js obj
    $(this).parents('li').find('section#js-toggleHide').removeClass('hide');
    $(this).addClass('hide');
    $(this).next().removeClass('hide');
  })
}

function handleViewLessClick() {
  $('ul').on('click', '.js-viewLess', function () {
    $(this).parents('li').find('section#js-toggleHide').addClass('hide');
    $(this).addClass('hide');
    $(this).prev().removeClass('hide');
  });
}

// might be helpful to use 
// let targetTitle = $(this).parents('section').prev().text();
//     let targetId = data.getCurrentItemID(targetTitle);
function handleDeleteClick() {
  $('body').on('click', '#js-delete', function () {
    let targetTitle = $(this).parents('section').prev().text();
    let targetId = data.getCurrentItemID(targetTitle);
    api.deleteBookmarks(targetId)
      .then(() => {
        data.removesItemsFromLocalStore(targetId);
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