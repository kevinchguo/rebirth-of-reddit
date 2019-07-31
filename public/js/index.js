var moment = require("moment");

let subredditArray = [
  [
    "https://www.reddit.com/r/tifu.json",
    "https://www.reddit.com/r/HighQualityGifs.json",
    "https://www.reddit.com/r/science.json",
    "https://www.reddit.com/r/gaming.json",
    "https://www.reddit.com/r/Showerthoughts.json",
    "https://www.reddit.com/r/MechanicalKeyboards.json",
    "https://www.reddit.com/r/NoStupidQuestions.json",
    "https://www.reddit.com/r/nonononoyes.json"
  ],
  "https://www.reddit.com/r/oddlysatisfying.json",
  "https://www.reddit.com/r/catloaf.json",
  "https://www.reddit.com/r/peoplefuckingdying.json"
];

//log down which subreddit was clicked
let currentSubreddit;

//current date in seconds
var date = new Date().getTime() / 1000;

//navbar
let findButtons = document.querySelectorAll(".subreddits");
//Post area
let postArea = document.getElementById("postArea");

//Click navbar to load
for (let i = 1; i < findButtons.length; i++) {
  findButtons[i].addEventListener("click", grabData);
  function grabData() {
    postArea.innerHTML = "";
    let subreddits = new XMLHttpRequest();
    subreddits.open("GET", subredditArray[i]);
    subreddits.send();
    subreddits.addEventListener("load", loadData);
  }
}

//Populate random posts
function generateRandom() {
  postArea.innerHTML = "";
  let subredditsOnScroll = new XMLHttpRequest();
  subredditsOnScroll.open(
    "GET",
    subredditArray[0][Math.floor(Math.random() * subredditArray[0].length)]
  );
  subredditsOnScroll.send();
  subredditsOnScroll.addEventListener("load", loadData);
}
generateRandom();

//Random button
findButtons[0].addEventListener("click", generateRandom);

//Populates reddit posts
function loadData() {
  let subredditData = JSON.parse(this.responseText).data.children;
  console.log(subredditData);
  currentSubreddit =
    "https://www.reddit.com/" + subredditData[0].data.subreddit + ".json";
  console.log(currentSubreddit);

  //Generate subreddit posts
  for (let j = 0; j < subredditData.length; j++) {
    let subredditPostData = subredditData[j].data;
    //Makes white boxes per post
    let createPosts = document.createElement("div");
    createPosts.className = "redditPosts";
    postArea.appendChild(createPosts);

    //Save pic URL and appends pic to createPost div
    let picBox = document.createElement("div");
    picBox.className = "picBox";
    createPosts.appendChild(picBox);
    let subredditPics;
    if (!subredditPostData.preview) {
      subredditPics = "https://placekitten.com/g/300/300";
    } else {
      if (!subredditPostData.preview.images[0].resolutions[1]) {
        subredditPics = subredditPostData.preview.images[0].resolutions[0].url.replace(
          /amp;/g,
          ""
        );
      } else {
        subredditPics = subredditPostData.preview.images[0].resolutions[1].url.replace(
          /amp;/g,
          ""
        );
      }
    }
    let createImgDiv = document.createElement("a");
    createImgDiv.className = "images";

    //Redirect to links of video/full images

    if (
      subredditPostData.media === null &&
      !subredditPostData.crosspost_parent_list
    ) {
      if (!subredditPostData.preview) {
        createImgDiv.setAttribute("href", subredditPostData.url);
      } else {
        createImgDiv.setAttribute(
          "href",
          subredditPostData.preview.images[0].source.url.replace(/amp;/g, "")
        );
      }
      //If it is a cross post
    } else if (subredditPostData.crosspost_parent_list) {
      if (subredditPostData.crosspost_parent_list[0].media === null) {
        createImgDiv.setAttribute("href", subredditPostData.url);
      } else if (
        !subredditPostData.crosspost_parent_list[0].media.reddit_video
      ) {
        createImgDiv.setAttribute(
          "href",
          subredditPostData.crosspost_parent_list[0].url
        );
      } else {
        createImgDiv.setAttribute(
          "href",
          subredditPostData.crosspost_parent_list[0].media.reddit_video
            .fallback_url
        );
      }
      //If is a video
    } else if (subredditPostData.media.reddit_video) {
      createImgDiv.setAttribute(
        "href",
        subredditPostData.media.reddit_video.fallback_url
      );
    } else if (subredditPostData.media.url) {
      createImgDiv.setAttribute("href", subredditPostData.media.url);
    } else if (!subredditPostData.preview.reddit_video_preview) {
      createImgDiv.setAttribute("href", subredditPostData.url);
    } else {
      createImgDiv.setAttribute(
        "href",
        subredditPostData.preview.reddit_video_preview.fallback_url
      );
    }

    createImgDiv.target = "_blank";
    picBox.appendChild(createImgDiv);
    let createImg = document.createElement("img");
    createImg.className = "subredditpics";
    createImg.setAttribute("src", subredditPics);
    createImgDiv.appendChild(createImg);

    //Open full pic

    //Title of post
    let titleDiv = document.createElement("div");
    titleDiv.id = "titlebox";
    createPosts.appendChild(titleDiv);
    let createTitle = document.createElement("div");
    createTitle.className = "title";
    createTitle.innerHTML = subredditPostData.title;
    titleDiv.appendChild(createTitle);

    //Info of posts
    let createInfo = document.createElement("div");
    createInfo.id = "info";
    createPosts.append(createInfo);

    //Author of post
    let createAuthor = document.createElement("div");
    createAuthor.className = "author";
    createAuthor.innerHTML = "Posted by u/" + subredditPostData.author;
    createInfo.appendChild(createAuthor);

    //Subreddit of post
    let createSubreddit = document.createElement("div");
    createSubreddit.className = "subreddit";
    createSubreddit.innerHTML =
      "from " + subredditPostData.subreddit_name_prefixed;
    createInfo.appendChild(createSubreddit);

    //Time of post
    let createTimePosted = document.createElement("div");
    createTimePosted.className = "timePosted";
    let postedWhen = moment(subredditPostData.created).fromNow();
    createTimePosted.innerHTML = postedWhen;
    createInfo.appendChild(createTimePosted);

    //Up/down votes of post
    let createVotes = document.createElement("div");
    createVotes.id = "votes";
    createPosts.appendChild(createVotes);
    let createUpbutton = document.createElement("button");
    createUpbutton.id = "up";
    let createUpvote = document.createElement("i");
    createUpvote.className = "far fa-thumbs-up";
    let createDownbutton = document.createElement("button");
    createDownbutton.id = "down";
    let createDownvote = document.createElement("i");
    createDownvote.className = "far fa-thumbs-down";
    let createUpvoteCounter = document.createElement("div");
    createUpvoteCounter.innerHTML = subredditPostData.ups;
    let createDownvoteCounter = document.createElement("div");
    createDownvoteCounter.innerHTML = subredditPostData.downs;
    createVotes.appendChild(createUpbutton);
    createUpbutton.appendChild(createUpvote);
    createVotes.appendChild(createUpvoteCounter);
    createVotes.appendChild(createDownbutton);
    createDownbutton.appendChild(createDownvote);
    createVotes.appendChild(createDownvoteCounter);

    //Short description of post
  }
}
setTimeout(window.addEventListener("scroll", loadMore), 1000);

function loadMore() {
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
    let subreddits = new XMLHttpRequest();
    subreddits.open("GET", currentSubreddit + "?limit=10&after=");
    subreddits.send();
    subreddits.addEventListener("load", loadData);
  }
}
