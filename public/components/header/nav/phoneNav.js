import { updateCurrentMainPage } from "../../../pages/mainPage/sharedStructure.js";

export function renderPhoneNav(parent){
    parent.innerHTML = `<div id="nav-items">
                            <div class="nav-item">Most Played</div>
                            <div class="nav-item">Decades</div>
                            <div class="nav-item">Genres</div>
                            <div class="nav-item">Moods</div>
                            <div class="nav-item">Map</div>
                            <div class="nav-item">Overview</div>
                        </div>`;
    
    const navItems = parent.querySelectorAll(".nav-item");
    let currentPageId = 0;

    navItems.forEach((element, i) => {
        element.addEventListener("click", () => {
            currentPageId = i;
            updateCurrentMainPage(`${- currentPageId * 100}vw`, 0, currentPageId);
            parent.className = "";
        });
    });
}