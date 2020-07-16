import $ from 'jquery';

function createAddBookmark() {
  // might have to relocate this to the catch respond when an error occurs
  // <h2 class="hide">JSON returns an error!</h2>
  return `
    <div class="addBookMarkWindowView">
        <form>
            <input type="text" id="addTitle" name="addTitle" placeholder="Title" required>
            <br>
            <input type="url" id="addURL" name="addURL" placeholder="https://example.com" pattern="https://.*" required>
            <br>
            <textarea id="addDescription" name="addDescription" placeholder="description (optional)"></textarea>
            <br>
            <section class="addButtonFlex">	
                <input type="button" id="js-cancelButton" value="Cancel">
                <input type="submit" value="Submit">
            <section>
        </form> 
    </div>`;
}

export default {
  createAddBookmark,
};