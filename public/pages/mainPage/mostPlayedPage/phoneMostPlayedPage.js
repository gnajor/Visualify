import { onSelectorChange, getSelectorValue } from "../../../components/header/selector/selector.js";
import { getSwitchState, onSwitchChange, renderSwitch } from "../../../components/header/switch/switch.js";
import { getMostPlayedData } from "../../../logic/utils.js";
import { DonutChart } from "../../../components/donutChart/donutChart.js";
import { renderDataDetails } from "./shared.js";

export function renderPhoneMostPlayedPage(parent){
    const dataset = getMostPlayedData();

    const diagramContainer = document.createElement("div");
    const switchContainer = document.createElement("div");
    const dataDetailsContainer = document.createElement("div");
    diagramContainer.className = "diagram-container";
    switchContainer.id = "switch-container";
    dataDetailsContainer.id = "data-details-container";
    parent.appendChild(diagramContainer);
    parent.appendChild(switchContainer);
    parent.appendChild(dataDetailsContainer);

    renderSwitch(switchContainer);
    renderDataDetails(dataDetailsContainer, dataset[getSwitchState()][getSelectorValue()]);
    renderGrid(diagramContainer, dataset[getSwitchState()][getSelectorValue()]);
    renderAverageData(
        dataDetailsContainer, 
        dataset[getSwitchState()][getSelectorValue()], 
        "Average Artist Popularity"            
    );

    onSwitchChange(() => {
        renderDataDetails(dataDetailsContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderGrid(diagramContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderAverageData(
            dataDetailsContainer, 
            dataset[getSwitchState()][getSelectorValue()], 
            getSwitchState === "tracks" ? "Average Song Popularity" : "Average Artist Popularity"            
        );
    });

    onSelectorChange((event) => {
        renderDataDetails(dataDetailsContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderGrid(diagramContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderAverageData(
            dataDetailsContainer, 
            dataset[getSwitchState()][getSelectorValue()], 
            getSwitchState === "tracks" ? "Average Song Popularity" : "Average Artist Popularity"            
        );
    });
}

function renderAverageData(parent, data, title){
    const avgContainer = document.createElement("div");
    parent.appendChild(avgContainer);
    avgContainer.id = "average-popularity";
    avgContainer.className = "show";

    const popularityArr = data.map(item => item.popularity); 
    const avgPopularity = Math.round(d3.mean(popularityArr));

    const newDataset = [
        {label: "filled", value: avgPopularity},
        {label: "empty", value: 100 - avgPopularity} 
    ];

    avgContainer.innerHTML += `<div class="donut-chart"></div>
                               <h2>${title}</h2>`;
    
    new DonutChart(
        avgContainer.querySelector(".donut-chart"), 
        newDataset, ["var(--main-green-color)", "gray"], 
        100, 
        100
    );
}

function renderGrid(parent, dataset){
    parent.innerHTML = ``;
    dataset = dataset.slice(0, 24);

    dataset.forEach((item, i) => {
        const itemDom = document.createElement("div");
        itemDom.className = "item";
        itemDom.style.animationDelay = `${i * 40}ms`;
        parent.appendChild(itemDom);

        const img = document.createElement("img");
        img.setAttribute("src", item.image);
        itemDom.appendChild(img);

        itemDom.addEventListener("click", (event) => {
            if(event.currentTarget.className.includes("focus")){
                parent.querySelectorAll(".item").forEach(element => { 
                    element.classList.remove("gray");
                    element.classList.remove("focus");

                    const detailsItem = document.querySelector("#most-played-page #item-" + item.ranking);
                    detailsItem.classList.remove("show");
                });
                document.querySelector("#most-played-page #average-popularity").classList.add("show");
            }
            else{
                document.querySelectorAll("#most-played-page .item-details").forEach(element => element.classList.remove("show"));
                parent.querySelectorAll(".item").forEach(element => { 
                    element.classList.add("gray");
                    element.classList.remove("focus")
                });

                event.currentTarget.classList.add("focus");
                const detailsItem = document.querySelector("#most-played-page #item-" + item.ranking);
                detailsItem.classList.add("show");
                document.querySelector("#average-popularity").classList.remove("show");
            }
        });
    });

    if(dataset.length != 24){
        renderRestOfGridDefault(parent, 24 - dataset.length);
    }
}

function renderRestOfGridDefault(parent, count){
    for(let i = 0; i < count; i++){
        const itemDom = document.createElement("div");
        itemDom.className = "item default";
        itemDom.style.animationDelay = `${((24 - count) + i) * 40}ms`;
        parent.appendChild(itemDom);

        const img = document.createElement("img");
        img.setAttribute("src", "../../../media/icons/not-found-square.svg");
        itemDom.appendChild(img);
    }
}




