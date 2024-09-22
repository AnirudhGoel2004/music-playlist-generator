const clientId = "YOUR_SPOTIFY_CLIENT_ID"; // Replace with your Spotify Client ID
const clientSecret = "YOUR_SPOTIFY_CLIENT_SECRET"; // Replace with your Spotify Client Secret

const moodButtons = document.querySelectorAll(".mood-btn");
const playlistSection = document.getElementById("playlist-section");

// Get Spotify access token
async function getAccessToken() {
  const url = "https://accounts.spotify.com/api/token";
  const credentials = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

// Fetch playlist based on mood
async function fetchPlaylist(mood) {
  const token = await getAccessToken();
  const url = `https://api.spotify.com/v1/recommendations?seed_genres=${mood}&limit=10`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();
  displayPlaylist(data.tracks);
}

// Display playlist
function displayPlaylist(tracks) {
  playlistSection.innerHTML = "<ul></ul>";
  const ul = playlistSection.querySelector("ul");

  tracks.forEach((track) => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${track.external_urls.spotify}" target="_blank">${
      track.name
    } by ${track.artists.map((artist) => artist.name).join(", ")}</a>`;
    ul.appendChild(li);
  });

  playlistSection.style.display = "block";
}

// Event listeners for mood buttons
moodButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const mood = button.getAttribute("data-mood");
    fetchPlaylist(mood);
  });
});
