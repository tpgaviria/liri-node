require("dotenv").config();

var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');

var command = process.argv[2];
var search = process.argv.slice(3).join(' ');



switch (command) {
    case 'concert':
        bandsInTown(search);
        break;
    case 'spotify':
        spotifySearch(search);
        break;
    default:
        console.log("I don't know that command. I have failed you. :(");
}

function bandsInTown(search) {
    var queryURL = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp/';

    axios.get(queryURL).then(
        function (res) {
            console.log('\nupcoming ' + search + ' tour dates:\n');
            for (var i = 0; i < res.data.length; i++) {
                var city = res.data[i].venue.city;
                var country = res.data[i].venue.country;
                var venue = res.data[i].venue.name;
                var date = res.data[i].datetime;

                console.log(city + ', ' + country + ' - ' + venue);
                console.log(date);
                console.log('\n---------\n');


            }
        }
    )
};

function spotifySearch(search) {

    var searchtype;

    if (!search) {
        search = 'The Sign Ace of Base';

        spotify.search({
            type: 'track',
            query: search,
            limit: 20
        }, function (err, data) {
            if (err) {
                return console.log('error occurred');
            } else {

                var track = data.tracks.items[0];
                var name = track.name;
                var album = track.album.name;
                var date = track.album.release_date;
                var artist = track.artists[0].name;
                var link = track.external_urls.spotify;

                console.log("\nYou didn't give me a song or artist, so here's one I like: ")
                console.log('\n"' + name + '"' + ' by ' + artist);
                console.log('From the album "' + album + '" released ' + date);
                console.log("Here's a link to the song on Spotify: " + link + "\n");

                inquirer.prompt([
                    {
                    type: 'list',
                    message: 'Would you like to do another search?',
                    choices: ['yes', 'no'],
                    name: 'another'
                    }
                ])
            }
        })
    } else {
        inquirer.prompt([
            {
                type: 'list',
                message: 'Is this:',
                choices: ['an Artist?', new inquirer.Separator('or'), 'a Song?'],
                name: 'searchtype'
            }]).then(function (inquirerResponse) {
                searchtype = inquirerResponse.searchtype;
                // console.log(searchtype);



                if (searchtype === 'an Artist?') {
                    spotify.search({
                        type: 'artist',
                        query: search,
                        limit: 20
                    }, function (err, data) {
                        if (err) {
                            return console.log('error occurred');
                        } else {
                            // console.log(data.artists.items[0]);
                            var artist = data.artists.items[0];
                            var name = artist.name;
                            var genres = artist.genres[0] + ', ' + artist.genres[1];
                            var link = artist.external_urls.spotify;

                            console.log('\n' + name);
                            console.log('Genre: ' + genres);
                            console.log("Here's a link to the artist on Spotify: " + link + "\n");

                            inquirer.prompt([
                                {
                                type: 'list',
                                message: 'Would you like to do another search?',
                                choices: ['yes', 'no'],
                                name: 'another'
                                }
                            ])
                        }
                    })
                }

                if (searchtype === 'a Song?') {
                    spotify.search({
                        type: 'track',
                        query: search,
                        limit: 20
                    }, function (err, data) {
                        if (err) {
                            return console.log('error occurred');
                        } else {

                            var track = data.tracks.items[0];
                            var name = track.name;
                            var album = track.album.name;
                            var date = track.album.release_date;
                            var artist = track.artists[0].name;
                            var link = track.external_urls.spotify;


                            console.log('\n"' + name + '"' + ' by ' + artist);
                            console.log('From the album "' + album + '" released ' + date);
                            console.log("Here's a link to the song on Spotify: " + link + "\n");

                            inquirer.prompt([
                                {
                                type: 'list',
                                message: 'Would you like to do another search?',
                                choices: ['yes', 'no'],
                                name: 'another'
                                }
                            ])
                        }
                    })
                }


            });
    }
}

