console.clear();

require("dotenv").config();

var fs = require("fs");

var Search = require("./search");
var search = new Search();

var subject = process.argv.slice(3).join(" ");

function readRandom() {
    fs.readFile("random.txt", "utf8", function (err, data) {
        if (err) return console.log("Could not read file. " + err);

        var strs = data.split(",");

        subject = strs[1];

        findCommand(strs[0]);
    })
}

function findCommand(command) {
    switch (command) {
        case "concert-this":
            search.searchBands(subject);
            break;
        case "spotify-this-song":
            search.searchSong(subject);
            break;
        case "movie-this":
            search.searchMovie(subject);
            break;
        case "do-what-it-says":
            readRandom();
            break;
        default:
            console.log("Invalid command");
            break;
    }
}

findCommand(process.argv[2]);

