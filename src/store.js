const store = {
  items: [],
  adding: false,
  error: null,
  filter: 0,
};
  
function updateAddingBookmarkStoreState(bool) {
  this.store.adding = bool;
} 

function updateFilterValue(value) {
  this.store.filter = value;
  console.log('storevalue', store.filter);
}

function returnBookmarksWithNRating(){
  return store.items.filter(bookmark => bookmark.rating >= store.filter);
}

//rewrite to use ID rather than index- 
function updateItemRating(index, number){
  this.store.items[index].rating = number;
}

function updateBookmarkHideDetails(index, bool){
  this.store.items[index].hideDetails = bool;
}
  
function updateLocalStore(item) {
//this is part of object oriented programming
  this.store.items.push(item); 
}

function removeItemsFromLocalStore(id) {
  store.items = store.items.filter(bookmark => bookmark.id !== id);
}

function getMatchingBookMarkIndex(id) {
  let targetIndex = store.items.findIndex(function(currentItem) {
    return currentItem.id === id;
  });
  return targetIndex;
}

function getMatchingBookmark(id) {
  let targetBookmark = store.items.find(function(currentItem) {
    return currentItem.id === id;
  });
  return targetBookmark;
}

function getCurrentItemID(targetName) { 
  let targetBookmark = store.items.find(function(currentItem) {
    return currentItem.title === targetName;});
  return targetBookmark.id;
}


export default {
  store,
  updateLocalStore,
  removeItemsFromLocalStore,
  getCurrentItemID,
  getMatchingBookmark,
  getMatchingBookMarkIndex,
  updateAddingBookmarkStoreState,
  updateBookmarkHideDetails,
  updateItemRating,
  updateFilterValue,
  returnBookmarksWithNRating
};