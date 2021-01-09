async function searchShows(query) {
  // Make an ajax request to the searchShows api and return show id, name, summary and image URL
  let response = await axios.get(`https://api.tvmaze.com/search/shows?q=${query}`);
  let shows = response.data.map(result => {
    let show = result.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.medium : "https://tinyurl.com/tv-missing",
    };
  });
  return shows;
}


// given list of shows, add shows to DOM
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
         <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="get-episodes btn btn-primary">Episodes</button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($item);
  }
}


// Handle search form submission:
// hide episodes area
// get list of matching shows and show in shows list
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();
  let query = $("#search-query").val();
  if (!query) return;
  $("#episodes-area").hide();
  let shows = await searchShows(query);
  populateShows(shows);
});


// Given a show ID, return list of episodes:
async function getEpisodes(id) {
  let response = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));
  return episodes;
}


// Get list of episodes and add them to the DOM
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  for (let episode of episodes) {
    let $item = $(
      `
        <li>
          ${episode.name} 
          (season ${episode.season} - episode ${episode.number})
        </li>
      `);
    $episodesList.append($item);
  }
  $("#episodes-area").show();
}


// Handle the button click to get the episodes
$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});