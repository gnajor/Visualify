import { onSelectorChange } from "../../../components/header/selector/selector.js";
import { formatSongs, getDecadeData } from "../../../logic/utils.js";
import { CircularBarChart } from "./shared.js";

export function renderPhoneDecadePage(parent){
    const parentId = "#" + parent.id;
    const dataset = getDecadeData();

    const diagramContainer = document.createElement("div");
    const songContainer = document.createElement("div");
    diagramContainer.className = "diagram-container";
    songContainer.className = "song-container";
    parent.appendChild(diagramContainer);
    parent.appendChild(songContainer);

    const circularChart = new CircularBarChart(`${parentId} .${diagramContainer.className}`, dataset["short_term"], 0.17, true);
    circularChart.bindClickListeners();

    onSelectorChange((event) => {
        circularChart.changeData(dataset[event.target.value]);
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
}