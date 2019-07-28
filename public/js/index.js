let subredditArray = [
  [],
  "https://www.reddit.com/r/oddlysatisfying.json",
  "https://www.reddit.com/r/catloaf.json",
  "https://www.reddit.com/r/peoplefuckingdying.json"
];
//navbar
let findButtons = document.querySelectorAll(".subreddits");
//Post area
let postArea = document.getElementById("postArea");

//Menu items
for (let i = 1; i < findButtons.length; i++) {
  findButtons[i].addEventListener("click", function() {
    //clears as new subreddit is clicked
    postArea.innerHTML = "";
    let subreddits = new XMLHttpRequest();
    subreddits.addEventListener("load", function() {
      let subredditData = JSON.parse(this.responseText).data.children;
      //   console.log(JSON.parse(this.responseText));
      console.log(subredditData);
      //Generate subreddit posts
      for (let j = 0; j < subredditData.length; j++) {
        let subredditPostData = subredditData[j].data;
        //Makes white boxes per post
        let createPosts = document.createElement("div");
        createPosts.className = "redditPosts";
        postArea.appendChild(createPosts);

        //Save pic URL and appends pic to createPost div
        let subredditPics = subredditPostData.preview.images[0].resolutions[1].url.replace(
          /amp;/g,
          ""
        );
        let createImg = document.createElement("img");
        createImg.setAttribute("src", subredditPics);
        createPosts.appendChild(createImg);
      }
    });
    subreddits.open("GET", subredditArray[i]);
    subreddits.send();
  });
}
