//Example: https://thinkful-list-api.herokuapp.com/sonali/bookmarks
const BASEURL = `https://thinkful-list-api.herokuapp.com`

let testUser = 'sonali';

//fetch to check if adding is there, if user is new add  adding as true; 

function apiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if(!res.ok) {
        error = {
          // if response is not 2xx's, start building error object
          code: res.status
        };
        // if response is not JSON type, some other issue place statusText in error object and
        // immediately reject promise
        if(!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      //if this is a json object, we parse data and we have a javascript object
      // this object might still be an error we will need to work with :) 
      return res.json();
    })
    //data is the JS obj
    .then (data => {
      if (error) {
        // always check how errors are thrown back to make sure you catch the right error 
        // place JSON message into error object and reject promise with the reject reason being the error obj
        error.message = data.message;
        return Promise.reject(error);
      }
      // otherwise, return the goodies! the data :) we still need to access the data object to get our the relevant information
      return data;
    });
}

function getBookmarks(){
  return apiFetch(`${BASEURL}/${testUser}/bookmarks`); // []
}

function createNewBookmarks(jsObject) {
  // we want to send new items through a json string STUFF TRAVELS AS STRINGS ACCROSS THE WEB!!! 
  const JSONObj = JSON.stringify(jsObject);
  // the post method requires that we provide the method, header which tells it we are sending a JSON obj
  // and the body, the thing that contains our important info
  return apiFetch(`${BASEURL}/${testUser}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSONObj
  });
}




function updateBookmarks(id, jsObject) {
  const JSONObj = JSON.stringify(jsObject);
  return apiFetch(`${BASEURL}/${testUser}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSONObj
  }
  );
}
// from documentation on api unclear if headers are needed- test later to see if it matters
function deleteBookmarks(id) {
  return apiFetch(`${BASEURL}/${testUser}/bookmarks/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });
}


export default {
  getBookmarks,
  createNewBookmarks,
  updateBookmarks,
  deleteBookmarks
}