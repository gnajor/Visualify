import { onSelectorChange } from "../../../components/header/selector/selector.js";
import { getGenreData } from "../../../../logic/utils.js";
import { BubbleChart } from "../../../../sharedComponents/bubbleChart/bubbleChart.js";

export function renderGenresPage(parent){
    const dataset = getGenreData(); 

    const diagramContainer = document.createElement("div");
    diagramContainer.className = "diagram-container";
    parent.appendChild(diagramContainer);

    const bubbleChart = new BubbleChart(diagramContainer, dataset["short_term"]);

    onSelectorChange((event) => {
        bubbleChart.changeData(dataset[event.target.value]);
    }); 
}

