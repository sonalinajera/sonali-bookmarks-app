const store = {
  bookmarks: [],
  adding: false,
  error: null,
  filter: 0,
};

function updateLocalStore(item) {
  this.store.bookmarks.push(item); 
}

function returnBookmarksWithNRating(){
  return store.bookmarks.filter(bookmark => bookmark.rating >= store.filter);
}

function updateFilterValue(value) {
  this.store.filter = value;
}


function updateItemRating(index, number){
  this.store.bookmarks[index].rating = number;
}

function updateBookmarkHideDetails(index, bool){
  this.store.bookmarks[index].hideDetails = bool;
}
  

function removeItemsFromLocalStore(id) {
  this.store.bookmarks = this.store.bookmarks.filter(bookmark => bookmark.id !== id);
}

function getMatchingBookMarkIndex(id) {
  let targetIndex = this.store.bookmarks.findIndex(function(currentItem) {
    return currentItem.id === id;
  });
  return targetIndex;
}

function getMatchingBookmark(id) {
  let targetBookmark = store.bookmarks.find(function(currentItem) {
    return currentItem.id === id;
  });
  return targetBookmark;
}

// function getCurrentItemID(targetName) { 
//   let targetBookmark = store.bookmarks.find(function(currentItem) {
//     return currentItem.title === targetName;});
//   return targetBookmark.id;
// }


export default {
  store,
  updateLocalStore,
  removeItemsFromLocalStore,
  getMatchingBookmark,
  getMatchingBookMarkIndex,
  updateBookmarkHideDetails,
  updateItemRating,
  updateFilterValue,
  returnBookmarksWithNRating
};