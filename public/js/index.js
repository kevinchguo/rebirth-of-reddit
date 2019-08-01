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
let redditJSONLimitAfter;
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

//Scroll down load
setTimeout(window.addEventListener("scroll", loadMore), 1000);

function loadMore() {
  if (window.scrollY + window.innerHeight >= document.body.offsetHeight) {
    const subreddits = new XMLHttpRequest();
    console.log(currentSubreddit + "?limit=10&after=" + redditJSONLimitAfter);
    subreddits.addEventListener("load", loadData);
    subreddits.open(
      "GET",
      currentSubreddit + "?limit=10&after=" + redditJSONLimitAfter
    );
    subreddits.send();
  }
}

//Populate random posts
function generateRandom() {
  postArea.innerHTML = "";
  let randomSubreddits = new XMLHttpRequest();
  randomSubreddits.open(
    "GET",
    subredditArray[0][Math.floor(Math.random() * subredditArray[0].length)]
  );
  randomSubreddits.send();
  randomSubreddits.addEventListener("load", loadData);
}
generateRandom();

//Random button
findButtons[0].addEventListener("click", generateRandom);

//Populates reddit posts
function loadData() {
  console.log(this);
  let subredditData = JSON.parse(this.responseText).data.children;
  currentSubreddit =
    "https://www.reddit.com/r/" + subredditData[0].data.subreddit + ".json";
  redditJSONLimitAfter = JSON.parse(this.responseText).data.after;
  console.log(currentSubreddit, redditJSONLimitAfter);
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
      subredditPics =
        "https://i.kym-cdn.com/photos/images/original/001/337/786/426.png";
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
    let createTitle = document.createElement("a");
    createTitle.className = "title";
    createTitle.innerHTML = subredditPostData.title;
    titleDiv.appendChild(createTitle);
    createTitle.setAttribute(
      "href",
      "https://www.reddit.com/" + subredditPostData.permalink
    );
    createTitle.target = "_blank";

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

    createVotes.appendChild(createUpbutton);
    createUpbutton.appendChild(createUpvote);
    createVotes.appendChild(createUpvoteCounter);
    createVotes.appendChild(createDownbutton);
    createDownbutton.appendChild(createDownvote);

    //Info of posts
    let createInfo = document.createElement("div");
    createInfo.id = "info";
    createPosts.append(createInfo);

    //Subreddit of post
    let createSubreddit = document.createElement("a");
    createSubreddit.className = "subreddit";
    createSubreddit.innerHTML = subredditPostData.subreddit_name_prefixed;
    createInfo.appendChild(createSubreddit);
    createSubreddit.setAttribute(
      "href",
      "https://www.reddit.com/r/" + subredditPostData.subreddit
    );
    createSubreddit.target = "_blank";

    //Author of post
    let createAuthor = document.createElement("a");
    createAuthor.className = "author";
    createAuthor.innerHTML = subredditPostData.author;
    createInfo.appendChild(createAuthor);
    createAuthor.setAttribute(
      "href",
      "https://www.reddit.com/user/" + subredditPostData.author
    );
    createAuthor.target = "_blank";

    //Time of post
    let createTimePosted = document.createElement("div");
    createTimePosted.className = "timePosted";
    let postedWhen = moment(
      Math.abs(Math.floor(date - subredditPostData.created))
    ).fromNow();

    createTimePosted.innerHTML = postedWhen;
    createInfo.appendChild(createTimePosted);

    //Short description of post
    let selfTextBox = document.createElement("div");
    selfTextBox.className = "descriptionBox";
    let selfTextDiv = document.createElement("div");
    selfTextDiv.className = "selftext";
    selfTextDiv.innerHTML = subredditPostData.selftext;
    createPosts.appendChild(selfTextBox);
    selfTextBox.appendChild(selfTextDiv);
  }
}

//To top button
window.onscroll = function() {
  scrollToTop();
};

function scrollToTop() {
  if (
    document.body.scrollTop > 130 ||
    document.documentElement.scrollTop > 130
  ) {
    document.getElementById("topBtn").style.display = "block";
  } else {
    document.getElementById("topBtn").style.display = "none";
  }
}

let topBtn = document.getElementById("topBtn");
topBtn.addEventListener("click", topFunction);
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
