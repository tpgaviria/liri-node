// required files and packages
require("dotenv").config();
var keys = require("./keys.js");
var axios = require('axios');
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var inquirer = require('inquirer');
var boxen = require('boxen');
var fs = require('fs');
var CFonts = require('cfonts');
var chalk = require('chalk');


// console.log(boxen(``, {padding: {top: 2, bottom: 2, left: 5, right: 5}, margin: {top: 1, bottom: 1}, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff'}));


// run initial prompt

console.log('\n')
CFonts.say('LIRI', { font: 'block', align: 'center', colors: ['white', 'blue'], letterSpacing: 2, space: false });
CFonts.say('Like SIRI but.... not as smart', { font: 'console', align: 'center', letterSpacing: 2, space: false });


prompt();

function prompt() {

    CFonts.say('Give me a command and what you would like to search!\n' +
        'Options: spotify, movie, concert', { font: 'console', align: 'center' });

    inquirer.prompt([{
        type: 'input',
        message: 'What can I do for you?',
        name: 'task'
    }]).then(function (inquirerResponse) {

        // splits input into array
        task = inquirerResponse.task.split(' ');

        // sets first word as command
        var command = task[0];

        //sets all other words as search
        var search = task.slice(1).join(' ');

        // sets what function is run based on command input
        switch (command) {
            case 'concert':
                bandsInTown(search);
                break;
            case 'spotify':
                spotifySearch(search);
                break;
            case 'movie':
                imdbSearch(search);
                break;
            case 'exit':
                process.exit();
            default:
                console.log("I don't know that command. I have failed you. :(");
                prompt();
        }


    })
};

var error = chalk.bgRed;
// searches artists tour dates and locations
function bandsInTown(search) {

    if (!search) {
        console.log(error('\nPlease enter a band or artist for results.'));
        prompt();
    } else {

        var queryURL = 'https://rest.bandsintown.com/artists/' + search + '/events?app_id=codingbootcamp/';

        axios.get(queryURL).then(
            function (res) {
                console.log(search);

                // 
                // } else {
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
                // }
                promptAgain();
            }
        )
    };
}


function imdbSearch(search) {
    if (!search) {

        search = 'Mr Nobody';
        console.log("\nYou didn't give me a movie title, so here's one I like.\n");

        // prompt();
    }

    var queryURL = 'http://www.omdbapi.com/?apikey=trilogy&t=' + search;

    axios.get(queryURL).then(
        function (res) {

            var movie = res.data;
            var title = movie.Title;
            var year = movie.Year;
            var imdbRate = movie.Ratings[0].Value;
            var rottenRate = movie.Ratings[1].Value;
            var country = movie.Country;
            var language = movie.Language;
            var plot = movie.Plot;
            var actors = movie.Actors;


            console.log(boxen(`${title}\n\n${year} - ${country} - ${language}\n\n${plot}\n\nStarring: ${actors}\n\nIMDB Rating: ${imdbRate} / Rotten Tomatoes Rating: ${rottenRate}`, {padding: {top: 2, bottom: 2, left: 5, right: 5}, margin: {top: 1, bottom: 1}, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff'}));

   
            promptAgain();
        }

    )

}




// searches artists or songs on spotify
function spotifySearch(search) {

    var searchtype;

    // if no artist or song is entered, default search result will show
    if (!search) {

        console.log(boxen("You didn't give me a song or artist, so here's one I like:\n\n" + '"' + 'The Sign" by Ace of Base\n\nFrom the album "The Sign (US Album) [Remastered]"\nReleased 1993\n\n' + "Here's a link to the song on Spotify:\n     https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE", { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));


        promptAgain();

    }


    else {
        inquirer.prompt([
            {
                type: 'list',
                message: 'Is this:',
                choices: ['an Artist?', new inquirer.Separator('or'), 'a Song?'],
                name: 'searchtype'
            }]).then(function (inquirerResponse) {
                searchtype = inquirerResponse.searchtype;

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
                            
                            console.log(boxen(`${name}\n\nGenre: ${genres}\n\nHere's a link to the artist on Spotify:\n     ${link}`, { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));

                            promptAgain();

                        }
                    })
                };


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


                            console.log(boxen(`"${name}" by ${artist}\n\nFrom the album "${album}"\n     Released ${date}\n\nHere's a link to the song on Spotify:\n     ${link}`, { padding: { top: 2, bottom: 2, left: 5, right: 5 }, margin: { top: 1, bottom: 1 }, borderColor: 'cyan', borderStyle: 'double', float: 'center', backgroundColor: '#111', color: '#fff' }));


                            promptAgain();

                        }
                    })
                }


            });
    }
}

function promptAgain() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Would you like to do another search?',
            choices: ['yes', 'no'],
            name: 'another'

        }]).then(function (inquirerResponse) {
            if (inquirerResponse.another === 'yes') {
                prompt();
            } else if (inquirerResponse.another === 'no') {
                console.log('\n')
                CFonts.say('goodbye', { font: 'shade', letterSpacing: 2, space: false, align: 'center' });
                CFonts.say('Have a great day! See you next time!', {font: 'console', align: 'center', space: false});
                process.exit();
            }
        })
};