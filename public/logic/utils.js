import { apiCom } from "../apiCom/apiCom.js";
import { State } from "../index.js";

export async function getAllTopUserDataAndSetState(){
    const ranges = ["short_term", "medium_term", "long_term"];
    const types = ["artists", "tracks"];
    const promises = [];
    const offset = 50;
    const amount = 100;

    const fetchWithContext = async (range, type, offset) => {
        const resource = await apiCom("data:get-top-user-data", { range, type, offset });
        return { type, range, resource };
    };

    for(const type of types){
        for(const range of ranges){
            for(let i = 0; i < amount/offset; i++){
                promises.push(
                    fetchWithContext(range, type, offset * i)
                );   
            }
        }
    }

    const results = await Promise.all(promises);

    for(const result of results){
        if(State.userData[result.type][result.range] !== null){
            State.userData[result.type][result.range] = State.userData[result.type][result.range].concat(result.resource);
        }
        else{
            State.userData[result.type][result.range] = result.resource;
        }
    }
}

export async function loadDemoDataAndSetState(){
    const data = await apiCom("server:get-demo-data");

    const tracks = [];
    const artists = [];

    const artistSongCount = new Map();


    data.forEach(artist => {
        artistSongCount.set(artist.id, artist.song.length);

        artists.push({
            id: artist.id,
            name: artist.name,
            popularity: artist.popularity,
            genres: artist.artist_genres.map(g => g.genre_name),
            images: artist.image ? [{ url: artist.image }] : [],
            country: artist.country,
            external_urls: {
                spotify: artist.link
            },
        });

        artist.song.forEach(song => {
            tracks.push({
                id: song.id,
                name: song.title,
                popularity: song.popularity,
                explicit: song.explicit,
                duration_ms: song.duration,
                artists: [
                    {
                        id: artist.id,
                        name: artist.name
                    }
                ],
                album: {
                    id: song.album.id,
                    name: song.album.name,
                    release_date: `${song?.album?.release_year}-01-01`,
                    total_tracks: song.album.total_tracks,
                    images: [
                        {
                            url: song.album.image
                        }
                    ],
                    external_urls: {
                        spotify: song.album.link
                    }
                },
                moods: song.song_moods.map(mood => mood.mood_type),
                genres: artist.artist_genres.map(genre => genre.genre_name),
                external_urls: {
                    spotify: song.link
                }
            });

        });
    });

    artists.sort((a, b) =>
        (artistSongCount.get(b.id) || 0) - (artistSongCount.get(a.id) || 0)
    );

    const splitArtists = splitIntoThree(artists);
    const splitTracks = splitIntoThree(tracks);

    State.userData = {
        artists: splitArtists,
        tracks: splitTracks
    };
}

function splitIntoThree(arr) {
    const size = Math.ceil(arr.length / 3);

    return {
        short_term: arr.slice(0, size),
        medium_term: arr.slice(size, size * 2),
        long_term: arr.slice(size * 2)
    };
}

export async function setStateToServer(){
    const dataNeeded = {
        artists: [],
        tracks: []
    };

    for(const key in State.userData){
        for(const termKey in State.userData[key]){
            dataNeeded[key] = dataNeeded[key].concat(State.userData[key][termKey]);
        }
    }

    const resource = await apiCom("server:set-data", dataNeeded);
}

export function getDecadeData(){
    const decades = [2020, 2010, 2000, 1990, 1980, 1970, 1960, 1950];
    const timeTerms = Object.keys(State.userData.tracks);
    const formatted = {};

    timeTerms.forEach((timeTerm, i) => {
        const songData = State.userData.tracks[timeTerm];
        formatted[timeTerm] = [];

        for(const decade of decades){
            const decadefiltered = songData.filter(item => String(decade).slice(0, 3) === String(item.album.release_date).slice(0, 3));
            const obj = {
                decade,
                amount: decadefiltered.length,
                topArtist: false,
                image: false,
                songName: false,

            }
            if(decadefiltered.length !== 0){
                obj.topArtist = decadefiltered[0].artists[0].name;
                obj.image = decadefiltered[0].album.images[0].url;
                obj.songName = decadefiltered[0].name;
            }

            formatted[timeTerm].push(obj); 
        }
        //for the blank space in the decadeDiagram
        formatted[timeTerm].push({
            decade: false,
            amount: false,
        });

        const mostListenedDecade = formatted[timeTerm].toSorted((a, b) => b.amount - a.amount)[0].decade;
        State.setStateOverlayData("mostListenedDecade", timeTerm, mostListenedDecade);
    });
    return formatted;
}

export function getMostPlayedData(){
    const ranges = Object.keys(State.userData.artists);
    const formatted = {}

    formatted.artists = {};
    formatted.tracks = {};
        
    for(const range of ranges){
        let artistPopularitySum = 0;
        let trackPopularitySum = 0;

        formatted.artists[range] = State.userData.artists[range].map((artist, i) => {
            if(i === 0){
                State.setStateOverlayData("mostListenedArtist", range, {
                    image: artist?.images[0]?.url,
                    name: artist.name,
                });
            }

            artistPopularitySum += artist.popularity;

            return {
                name: artist.name,
                image: artist?.images[0]?.url,
                popularity: artist.popularity,
                ranking: i + 1
            }
        });

        formatted.tracks[range] = State.userData.tracks[range].map((track, i) => {
            if(i === 0){
                State.setStateOverlayData("mostListenedTrack", range, {
                    image: track.album.images[0].url,
                    name: track.name,
                });
            }

            trackPopularitySum += track.popularity;

            return {
                name: track.name,
                image: track.album.images[0].url,
                popularity: track.popularity,
                ranking: i + 1,
            }
        });

        const avgTrackPopularity = Number((trackPopularitySum / State.userData.tracks[range].length));
        const avgArtistPopularity = Number((artistPopularitySum / State.userData.artists[range].length));
        
        State.setStateOverlayData("avgTrackPopularity", range, avgTrackPopularity);
        State.setStateOverlayData("avgArtistPopularity", range, avgArtistPopularity);

        if(!State.demoPressed){
            formatted.artists[range].slice(0, 25);
            formatted.tracks[range].slice(0, 25);
        }
    }
    return formatted;
}

export function getGenreData(){
    const ranges = Object.keys(State.userData.artists);
    const formatted = {};

    for(const range of ranges){
        const genres = [];

        for(const artist of State.userData.artists[range]){
            artist.genres.forEach((genre) => {
                const exists = genres.find(genreItem => genreItem.genre === genre);

                if(exists){
                    exists.value++;
                }
                else{
                    genres.push({
                        genre,
                        "value": 1
                    });
                }
            });
        }

        let result = genres.sort((firstItem, secItem) => secItem.value - firstItem.value);

        State.setStateOverlayData("mostListenedGenre", range, result[0].genre);
        formatted[range] = result;
    }    
    return formatted;
}

export function getMapData(){
    const ranges = Object.keys(State.userData.artists);
    const formatted = {};

    for(const range of ranges){
        let data = [];

        for(const artist of State.userData.artists[range]){
            const mapData = {
                "image": artist?.images[0]?.url,
                "name": artist.name,
                "link": artist?.external_urls?.spotify,
                "country": artist?.country,
                "id": artist.id
            }

            data.push(mapData);
        }

        if(!State.demoPressed){
            formatted[range] = data.slice(0, 70);
        }

        formatted[range] = data;
    }
    
    return formatted;
}


export function getMoodsChartData(){
    const ranges = Object.keys(State.userData.tracks);
    const formatted = {};

    for(const range of ranges){
        let data = [];

        for(const track of State.userData.tracks[range]){
            const moodsData = {
                "id": track.id,
                "title": track.name,
                "artist": track.artists[0].name
            }

            if(State.demoPressed){
                moodsData.moods = track.moods;
            }

            data.push(moodsData);
        }
        

        if(!State.demoPressed){
            data = data.slice(0, 50);
        }

        formatted[range] = data;
    }
    return formatted;
}

export function formatSongs(songName){

    if(songName.includes("(")){
        songName = songName.split("(")[0];
    }

    if(songName.includes(" - ")){
        songName = songName.split(" -")[0];
    }
    
    return songName;
}

export function findArray(arr, func){
    for(let i = 0; i < arr.length; i++){
        if(func(arr[i])){
            return arr[i];
        }
    }
    return null;
}