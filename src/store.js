//this file will export all functions to 

// ******* functions below are for need to be moved to store.js **********
const store = {
  items: [],
  adding: false,
  error: null,
  filter: 0,
};
  
  
  
function updatesLocalStore(item) {
//this is part of object oriented programming
  this.store.items.push(item); 
  console.log(store);
}
  
function getCurrentItemID(propertyToCompare) { 
  let bookmarkObj = store.items.find(function(bookmark) {
    return bookmark.title === propertyToCompare;
  });
  return bookmarkObj.id;
}


export default {
  store,
  updatesLocalStore,
  getCurrentItemID
};