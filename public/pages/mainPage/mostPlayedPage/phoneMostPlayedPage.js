import { onSelectorChange, getSelectorValue } from "../../../components/header/selector/selector.js";
import { getSwitchState, onSwitchChange, renderSwitch } from "../../../components/header/switch/switch.js";
import { getMostPlayedData } from "../../../logic/utils.js";
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

    onSwitchChange(() => {
        renderDataDetails(dataDetailsContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderGrid(diagramContainer, dataset[getSwitchState()][getSelectorValue()]);
    });

    onSelectorChange((event) => {
        renderDataDetails(dataDetailsContainer, dataset[getSwitchState()][getSelectorValue()]);
        renderGrid(diagramContainer, dataset[getSwitchState()][getSelectorValue()]);
    });
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
                document.querySelectorAll("#most-played-page .item").forEach(item => { 
                    item.classList.remove("gray");
                    item.classList.remove("focus");

                    const detailsItem = document.querySelector("#most-played-page #item-" + item.ranking);
                    detailsItem.classList.remove("show");
                });
            }

            document.querySelectorAll("#most-played-page .item-details").forEach(item => item.classList.remove("show"));
            document.querySelectorAll("#most-played-page .item").forEach(item => { 
                item.classList.add("gray");
                item.classList.remove("focus")
            });

            event.currentTarget.classList.add("focus");
            const detailsItem = document.querySelector("#most-played-page #item-" + item.ranking);
            detailsItem.classList.add("show");
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




