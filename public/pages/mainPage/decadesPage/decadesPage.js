import { onSelectorChange } from "../../../components/header/selector/selector.js";
import { formatSongs, getDecadeData } from "../../../logic/utils.js";
import { CircularBarChart } from "./shared.js";

export function renderDecadePage(parent){
    const parentId = "#" + parent.id;
    const dataset = getDecadeData();

    const diagramContainer = document.createElement("div");
    const songContainer = document.createElement("div");
    diagramContainer.className = "diagram-container";
    songContainer.className = "song-container";
    parent.appendChild(diagramContainer);
    parent.appendChild(songContainer);

    const circularChart = new CircularBarChart(`${parentId} .${diagramContainer.className}`, dataset["short_term"], 0.10);
    renderArtistDivs(`${parentId} .${songContainer.className}`, dataset["short_term"]);

    onSelectorChange((event) => {
        circularChart.changeData(dataset[event.target.value]);
        renderArtistDivs(`${parentId} .${songContainer.className}`, dataset[event.target.value]);
    }); 
}

function renderArtistDivs(parentSelector, songs){
    const parent = document.querySelector(parentSelector);
    parent.innerHTML = ``;

    for(const song of songs){
        if(song.image){
            const songContainer = document.createElement("div");
            parent.appendChild(songContainer)
            songContainer.id = `song-${song.decade}`;
            songContainer.className = "song";
            songContainer.style.backgroundImage = `url(${song.image})`;

            songContainer.innerHTML += `<div class="decade-title-container">
                                            <h3 class="decade-title">Top ${song.decade}s <br> song</h3>
                                        </div>
                                        <div class="song-info-container">
                                            <h3 class="song-name">${formatSongs(song.songName)}</h3>
                                            <h3 class="artist-name">By ${song.topArtist}</h3>
                                        </div>`;            
        }
    }
    updateArtistDivPosition();
}

export function updateArtistDivPosition(){
    const decadesPage = document.querySelector("#decades-page").getBoundingClientRect();
    const diagramContainer = document.querySelector("#decades-page .diagram-container").getBoundingClientRect();
    const songs = document.querySelector("#decades-page .song").getBoundingClientRect();
    const decadeContainer = document.querySelector("#decades-page .decade-title-container").getBoundingClientRect();

    document.querySelectorAll("#decades-page .song").forEach(element => {
        element.style.left = (((decadesPage.width - diagramContainer.width)/2) - songs.width + (decadeContainer.width / 2.5))/2 + "px";
    });
}