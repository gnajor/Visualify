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

    const circularChart = new CircularBarChart(`${parentId} .${diagramContainer.className}`, dataset["short_term"], 0.15);
    circularChart.bindClickListeners();

    onSelectorChange((event) => {
        circularChart.changeData(dataset[event.target.value]);
    }); 
}