import { onSelectorChange, getSelectorValue } from "../../../components/header/selector/selector.js";
import { getMostPlayedData } from "../../../logic/utils.js";
import { renderDataDetails } from "./shared.js";

export function renderPhoneMostPlayedPage(parent){
    const dataset = getMostPlayedData();

    const dataDetailsContainer = document.createElement("div");
    const diagramContainer = document.createElement("div");
    dataDetailsContainer.id = "data-details-container";
    diagramContainer.className = "diagram-container";
    parent.appendChild(diagramContainer);
    parent.appendChild(dataDetailsContainer);

    renderDataDetails(dataDetailsContainer, dataset["tracks"][getSelectorValue()]);
    renderGrid(diagramContainer, dataset["tracks"][getSelectorValue()]);

    onSelectorChange((event) => {
        renderDataDetails(dataDetailsContainer, dataset["tracks"][getSelectorValue()]);
        renderGrid(diagramContainer, dataset["tracks"][getSelectorValue()]);
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
}




