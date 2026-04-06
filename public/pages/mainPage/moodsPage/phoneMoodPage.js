import { getMoodsChartData } from "../../../logic/utils.js";
import { moodsChartController } from "./shared.js";

export function renderPhoneMoodPage(parent){
    const dataset = getMoodsChartData();

    const diagramContainer = document.createElement("div");
    diagramContainer.className = "diagram-container";
    parent.appendChild(diagramContainer);

    const controller = moodsChartController(diagramContainer, dataset, renderMoodGraph);
    controller.loadRange("short_term");

}

function renderMoodGraph(parent, data){
    const columnAmount = 40;

    for(const item of data){
        const container = document.createElement("div");
        container.id = (item.title + "-container").toLowerCase();
        parent.appendChild(container);

        container.innerHTML =  `<h2>${item.title}</h2>
                                <div class="column-container"></div>`;

        for(let i = 0; i < columnAmount; i++){
            const bar = document.createElement("div");
            bar.className = "bar";
            container.querySelector(".column-container").appendChild(bar);
        }
    }


    function update(data){
        for(const mood of data){
            const amountShouldColor = Math.round(columnAmount * mood.value);
            const columnContainer = parent.querySelector("#" + (mood.title + "-container").toLowerCase() + " .column-container");
            const columnsColored = columnContainer.children.length;

            const diff = amountShouldColor - columnsColored;

            if(diff < 0){
                for(let i = columnsColored; i < amountShouldColor; i++){
                    columnContainer.children[i].classList.add("show");
                }
            }
            else if(diff > 0){
                for(let i = amountShouldColor; i < columnsColored; i--){
                    columnContainer.children[i].classList.remove("show");
                }
            }
            else{
                return;
            }
        }
    }

    return { update }
}