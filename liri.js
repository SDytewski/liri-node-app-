//loads information from a .env file 
require("dotenv").config();

//Spotify installation
var Spotify = require('node-spotify-api');
// Import the FS package for read/write.
var fs = require("fs");
//axios installation
var axios = require("axios");
//our  api keys
var keys = require("./keys.js");
//will be used for bands-in-town date formatting
var moment = require('moment')


var spotify = new Spotify(keys.spotify);
//storing our arguments depending on where the user types in the terminal.
var arg2 = process.argv[3];
var arg1 = process.argv[2];


startPlay(arg1, arg2);


//perform command depending on what the user types
function startPlay(arg1, arg2) {

  switch (arg1) {
    case "concert-this": getMyBand(arg2);
      break;
    case "spotify-this-song": getMeSpotify(arg2);
      break;
    case "movie-this": getMovie(arg2)
      break;
    case "do-what-it-says": doWhatItSays(
      
    );
      break;
    default: console.log("I dont know what your talking about");
  }
}

//default song if undefined
function getMeSpotify(songName) {
  if (songName === undefined) {

    songName = "The Sign Ace Of Base"

  }

// display song information on screen
  spotify.search({ type: 'track', query: songName }, function (err, data) {
    if (err) {
      return console.log('Error occurred: ' + err);
    }

    console.log(data.tracks.items[0].album.artists[0].name);
    var songs = data.tracks.items;
    
    for (var i = 0; i < songs.length; i++) {
      console.log(i);
      console.log("song name: " + songs[i].name);
      console.log("preview song: " + songs[i].preview_url);
      console.log("album: " + songs[i].album.name);
      console.log("-----------------------------------");
    }
  });

}

//if no movie is selected
function getMovie(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }

  //display movie information
  var url = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=fe8b3690";
  axios.get(url).then(
    function (response) {
      var data = response.data;
      console.log("title: " + data.Title);
      console.log("Year: " + data.Year);
      console.log("Imdb Rating: " + data.imdbRating);
      console.log("Rotten Rating: " + data.Ratings[2].Value);
      console.log("Country of origin: " + data.Country);
      console.log("Language of the movie: " + data.Language);
      console.log("Plot: " + data.Plot);
      console.log("Actors: " + data.Actors);

    }
  )


}

function getMyBand(artist) {


  axios.get("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp").then(
    function (response) {

      var events = response.data;
      // writeObj(response.data[0]);



      events.forEach(function (evt) {
        //    * Name of the venue
        //    * Venue location
        //    * Date of the Event (use moment to format this as "MM/DD/YYYY")

        var eventData = [
          'Venue: ' + evt.venue.name,
          'Location: ' + evt.venue.city + ' ' + evt.venue.country,
          'Date: ' + moment(evt.datetime).format('L') //MM/DD/YYYY
        ].join('\n');


        console.log(eventData);

      });

    })
}

//our function that reads the random.txt file and runs it.
function doWhatItSays(){


  fs.readFile("random.txt", "utf8", function (error, data) {

    // If the code experiences any errors it will log the error to the console.
    if (error) {
      return console.log(error);
    }
        //split it by commas (to make it more readable)
    var dataArr = data.split(',');
    // We will then re-display the content as an array for later use.
    
    startPlay(dataArr[0], dataArr[1]);

  });

}