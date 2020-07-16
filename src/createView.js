function createAddBookmark() {
  return `
    <div class="addBookMarkWindowView hide">
     <h2 class="hide">JSON returns an error!</h2>
     <!-- currently active hide class -->
        <form class="hide">
            <input type="text" id="addTitle" name="addTitle" placeholder="Title" required>
            <br>
            <input type="url" id="addURL" name="addURL" placeholder="https://example.com" pattern="https://.*" required>
            <br>
            <textarea id="addDescription" name="addDescription" placeholder="description (optional)"></textarea>
            <br>
            <section class="addButtonFlex">	
                <!-- the cancel button will clear form entry and hide add text box;  -->
                <input type="button" value="Cancel">
                <input type="submit" value="Submit">
            <section>
        </form> 
    </div>`;
}

export default {
  createAddBookMark();
};