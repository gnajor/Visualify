import { DonutChart } from "../../../components/donutChart/donutChart.js";
import { formatSongs } from "../../../logic/utils.js";

export function renderDataDetails(parent, dataset){
    parent.innerHTML = ``;

    for(const item of dataset){
        const itemContainer = document.createElement("div");
        parent.appendChild(itemContainer);
        itemContainer.id = `item-${item.ranking}`;
        itemContainer.className = "item-details";

        const newDataset = [
            {label: "filled", value: item.popularity},
            {label: "empty", value: 100 - item.popularity} 
        ]


        itemContainer.innerHTML += `<div class="item-name-ranking">
                                        <div class="item-ranking">${item.ranking}</div>
                                        <div class="item-name">${formatSongs(item.name)}</div>
                                    </div>
                                    <div class="item-popularity">
                                        <div class="donut-chart"></div>
                                        <div class="popularity-title">Spotify Popularity</div> 
                                    </div>`;
        
        new DonutChart(
            itemContainer.querySelector(".donut-chart"), 
            newDataset, ["var(--main-green-color)", "gray"], 
            100, 
            100
        );
    }
}