# LIRI
### LIRI - Node.js App (Language Interpretation and Recognition Interface)

Runs in a terminal - Give LIRI a command of Spotify, Movie, or Concert, along with a search query and receive data from Spotify's API, OMBD, or BandsInTown.

NPM packages used: axios, node-spotify-api, inquirer, boxen, cfronts, wordwrap, moment, cli-table.

DEMO:
![](liri.gif)

## Code Explanation
- Declaration of required npm packages and other files.
- Inquirer used to take in user input, then assigned as command and search.
- Switch function used to determine which function to run.
- Concert command uses axios to perform HTTP request from BandsinTown - results styled using cli-table.
- Movie command uses axios to return promise from omdb (open movie database) - results styled using boxen.
- Spotify command uses inquirer to prompt if search input is a song or artist - then returns data from spotify's api.
- Spotify API keys saved in process.env file, which is accessed by the keys.js file.

> API keys not included, must be in separate process.env file with the following format:
>
> `SPOTIFY_ID=<ID HERE>`
> `SPOTIFY_SECRET=<SECRET KEY HERE>`

- 'Do What It Says' uses fs.readFile to access random.txt file that contains a command and a search. This text can be changed and will function and give data as if entered as initial user input.
- Inquirer runs after every response prompting if user would like to perform another search.
- Default responses are provided for each instance of either missing command or search.
