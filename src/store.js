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


function updateItemRating(index, number){
  this.store.bookmarks[index].rating = number;
}

function updateBookmarkHideDetails(index, bool){
  this.store.bookmarks[index].hideDetails = bool;
}
  

function removeItemsFromLocalStore(id) {
  this.store.bookmarks = this.store.bookmarks.filter(bookmark => bookmark.id !== id);
}

function getBookmarkByIndex(id) {
  let targetIndex = this.store.bookmarks.findIndex(function(currentItem) {
    return currentItem.id === id;
  });
  return targetIndex;
}


export default {
  store,
  updateLocalStore,
  removeItemsFromLocalStore,
  getBookmarkByIndex,
  updateBookmarkHideDetails,
  updateItemRating,
  returnBookmarksWithNRating
};