require("dotenv").config();

var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');

var command = process.argv[2];
var search = process.argv.slice(2).join(" ");
console.log(process.argv);

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

    inquirer.prompt([
        {
            type: 'list',
            message: 'Is this:',
            choices: ['an Artist?', new inquirer.Separator('or'), 'a Song?'],
            name: 'searchtype'
        }]).then(function (inquirerResponse) {
            searchtype = inquirerResponse.searchtype;
            console.log(searchtype);



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
                        console.log(data.artists.items[0].name);
                        console.log(data.artists.items[0].genres[0]);
                        console.log(data.artists.items[0].external_urls.spotify);
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
                        console.log(data.tracks.items);
                        // console.log(data.artists.items[0].name);
                        // console.log(data.artists.items[0].genres[0]);
                        // console.log(data.artists.items[0].external_urls.spotify);
                    }
                })
            }

        });
}