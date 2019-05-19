
var keys = require("./keys");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var moment = require("moment");

function logDashes() {
    console.log("----------------------------");
}

function parseSongData(err, data) {
    var item;
    if (data.tracks) {
        item = data.tracks.items[0];
    } else {
        item = data;
    }

    if (err) {
        console.log("Could not find song on Spotify. Error: " + err);
        return;
    }

    logDashes();
    console.log("Artist: " + item.artists[0].name);
    console.log("Song name: " + item.name);
    console.log("Preview link: " + item.preview_url);
    console.log("Album: " + item.album.name);
    logDashes();
}

var Search = function () {

    this.searchBands = function (artist) {
        if (!artist) return console.log("No artist/band provided");
        var url = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
        axios.get(url)
            .then(function (res) {
                res.data.forEach((event) => {
                    logDashes();
                    console.log("Venue Name: " + event.venue.name);
                    console.log("Venue Location: " + event.venue.city + ", " + event.venue.region);

                    var date = moment(event.datetime);
                    var dateStr = date.format("dddd, MMMM Do YYYY, h:mm a");

                    console.log("Date: " + dateStr);
                    logDashes();
                });
            })
            .catch(function (err) {
                console.log(err);
            });
    };

    this.searchSong = function (song) {
        var spotify = new Spotify(keys.spotify);

        if (!song) {
            spotify.request("https://api.spotify.com/v1/tracks/3DYVWvPh3kGwPasp7yjahc", parseSongData);
            return;
        }

        spotify.search({
            type: "track",
            query: song.replace(" ", "+"),
            limit: 1
        }, parseSongData);
    };

    this.searchMovie = function (movie) {
        if (!movie) movie = "Mr. Nobody";

        var url = "https://www.omdbapi.com/?t=" + movie.replace(" ", "+") + "&y=&plot=short&apikey=trilogy"
        axios
            .get(url)
            .then(function (res) {
                var data = res.data;

                var obj = {
                    Title: data.Title,
                    Year: data.Year,
                    IMDB_Rating: data.Ratings[0].Value,
                    Rotten_Tomatoes_Rating: data.Ratings[1].Value,
                    Country: data.Country,
                    Language: data.Language,
                    Plot: data.Plot,
                    Actors: data.Actors
                };

                console.log(JSON.stringify(obj, null, 2));
                logDashes();
            });
    };
};

module.exports = Search;