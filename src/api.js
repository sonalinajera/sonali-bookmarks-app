//Example: https://thinkful-list-api.herokuapp.com/sonali/bookmarks
const BASEURL = `https://thinkful-list-api.herokuapp.com/sonali`

function apiFetch(...args) {
  let error;
  return fetch(...args)
    .then(res => {
      if(!res.ok) {
        error = {
          code: res.status
        };
        if(!res.headers.get('content-type').includes('json')) {
          error.message = res.statusText;
          return Promise.reject(error);
        }
      }
      return res.json();
    })
    .then (data => {
      if (error) {
        error.message = data.message;
        return Promise.reject(error);
      }
      return data;
    });
}

function getBookmarks(){
  return apiFetch(`${BASEURL}/bookmarks`); 
}

function createNewBookmark(newBookmark) {
  const bookmarkDetails = JSON.stringify(newBookmark);
  return apiFetch(`${BASEURL}/bookmarks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookmarkDetails
  });
}

function updateBookmark(id, newEdit) {
  const bookmarkEdit = JSON.stringify(newEdit);
  return apiFetch(`${BASEURL}/bookmarks/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: bookmarkEdit
  }
  );
}
function deleteBookmark(id) {
  return apiFetch(`${BASEURL}/bookmarks/${id}`, {
    method: 'DELETE'
  });
}

export default {
  getBookmarks,
  createNewBookmark,
  updateBookmark,
  deleteBookmark
};