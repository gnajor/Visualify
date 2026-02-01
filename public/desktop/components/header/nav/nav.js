import { updateMarker } from "../../../../logic/utils.js";
import { updateCurrentMainPage, updateSummaryPagePos } from "../../../pages/mainPage/structure.js";
import { addSwitch, removeSwitch } from "../../../../sharedComponents/switch/switch.js";

export function renderNav(parent){
    parent.innerHTML = `<div id="nav-items">
                            <div class="nav-item">Most Played</div>
                            <div class="nav-item">Decades</div>
                            <div class="nav-item">Genres</div>
                            <div class="nav-item">Moods</div>
                            <div class="nav-item">Map</div>
                        </div>
                        <div id="dashboard-nav-item">
                            <img id="white" src="../../../media/icons/dashboard.svg">
                            <img class="invisible" id="black" src="../../../media/icons/dashboard_black.svg">
                        </div>
                        <div id="marker"></div>`;
    
    const navItems = parent.querySelectorAll(".nav-item");
    const dashboardItem = parent.querySelector("#dashboard-nav-item"); 
    const marker = document.querySelector("header nav #marker");

    let currentPageId = 0;
    let moveAmount = 0;

    navItems[0].classList.add("marked");
    updateNavMarker();
    navItems.forEach((element, i) => {
        element.id = i;
        element.addEventListener("click", () => {
            moveAmount = i;
            currentPageId = i;
            navItems.forEach(element => element.classList.remove("marked"));
            element.classList.add("marked");
            updateNavMarker();
            updateCurrentMainPage(`${- moveAmount * 100}vw`, 0);
            dashboardIconChange("remove");
            updateSummaryPagePos(`${moveAmount * 100}vw`);
            marker.classList.remove("invisible");

            if(currentPageId == 0){
                addSwitch();
            }
            else{
                removeSwitch();
            }
        })
    });

    dashboardItem.addEventListener("click", () => {
        dashboardIconChange("add");
        removeSwitch();

        if(document.querySelector("header nav .nav-item.marked")){
            updateCurrentMainPage(`${-moveAmount * 100}vw`, "100vh");

            document.querySelector("header nav .nav-item.marked").classList.remove("marked");
            const marker = document.querySelector("header nav #marker");
            marker.classList.add("invisible"); 
        }
    });

    function dashboardIconChange(type){
        const blackIcon = dashboardItem.querySelector("img#black");
        const whiteIcon = dashboardItem.querySelector("img#white");

        if(type === "remove"){
            blackIcon.classList.add("invisible");
            whiteIcon.classList.remove("invisible");
            dashboardItem.classList.remove("marked");
        }
        else{
            blackIcon.classList.remove("invisible");
            whiteIcon.classList.add("invisible");
            dashboardItem.classList.add("marked");
        }
    }
}

export function updateNavMarker(){
    const markedElement = document.querySelector("header nav .nav-item.marked");

    if(markedElement){
        const menu = document.querySelector("header nav #nav-items");
        updateMarker(markedElement, menu, marker);
    }
}