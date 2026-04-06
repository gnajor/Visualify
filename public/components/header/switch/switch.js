import { updateMarker } from "../nav/nav.js";

let switchElement = null;
let currentSwitchState = "artists";

const cwdImg = "../../../media/icons/";

export function renderSwitch(parent) {
    const switchDom = document.createElement("div");
    switchDom.id = "most-played-page-switch";
    switchDom.className = "switch";
    parent.appendChild(switchDom);

    switchDom.innerHTML = `<div id="artists">
                                <img src="${cwdImg}artists.svg">
                            </div>
                            <div id="tracks">
                                <img src="${cwdImg}tracks.svg">
                            </div>
                            <div id="switch-marker"></div>`;

    switchElement = switchDom;

    const marker = switchElement.querySelector("#switch-marker");
    switchElement.querySelector("#artists").classList.add("marked");
    updateMarker(switchElement.querySelector("#artists"), switchElement, marker);
}

export function onSwitchChange(func) {
    switchElement.addEventListener("click", () => {
        switchElement.querySelector("#" + currentSwitchState).classList.remove("marked");
        currentSwitchState = currentSwitchState === "artists" ? "tracks" : "artists";
        switchElement.querySelector("#" + currentSwitchState).classList.add("marked");

        updateSwitchMarker();
        func(currentSwitchState);
    });
}

export function getSwitchState() {
    return currentSwitchState;
}

export function updateSwitchMarker() {
    const marked = switchElement.querySelector(".marked");
    const marker = switchElement.querySelector("#switch-marker");
    updateMarker(marked, switchElement, marker);
}

export function displaySwitch(){switchElement.classList.remove("none");}
export function displayNoneSwitch(){switchElement.classList.add("none");}

