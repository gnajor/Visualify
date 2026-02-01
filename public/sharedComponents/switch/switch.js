import { updateMarker } from "../../logic/utils.js";

let switchElement = null;

export function renderSwitch(parent){
    switchElement = document.createElement("div");
    switchElement.className = "switch current";
    parent.appendChild(switchElement);
    switchElement.setAttribute("switch-state", "artists");

    const cwdImg = "../../../media/icons/";

    switchElement.innerHTML = `  <div id="artists">
                                    <img src="${cwdImg}artists.svg">
                                </div>
                                <div id="tracks">
                                    <img src="${cwdImg}tracks.svg">
                                </div>
                                <div id="switch-marker"></div>`;
}

export function onClickSwitch(callback){
        const marker = switchElement.querySelector("#switch-marker");
        const artistBox = switchElement.querySelector("#artists");

        artistBox.classList.add("marked");
        updateMarker(artistBox, switchElement, marker);

        switchElement.addEventListener("click", (event) => {
            const currentState = switchElement.getAttribute("switch-state");

            if(currentState === "artists"){
                switchElement.querySelector("#artists").classList.remove("marked");
                switchElement.setAttribute("switch-state", "tracks");
                switchElement.querySelector("#tracks").classList.add("marked");
            }
            else{
                switchElement.querySelector("#tracks").classList.remove("marked");
                switchElement.setAttribute("switch-state", "artists");
                switchElement.querySelector("#artists").classList.add("marked");
            }

            updateSwitchMarker();
            callback();
        })
}

export function updateSwitchMarker(){
    const elementMarked = switchElement.querySelector(".marked");
    const marker = switchElement.querySelector("#switch-marker");
    updateMarker(elementMarked, switchElement, marker);
}

export function removeSwitch(){switchElement.classList.remove("current");}
export function addSwitch(){switchElement.classList.add("current");}
export function getCurrentSwitchState(){return switchElement.getAttribute("switch-state")}


/*
export class Switch{
    static switchInstances = [];
    
    static getCurrentSwitchById(id){
        const instance = Switch.switchInstances.find(instance => instance.pageNumId === id);

        if(!instance){
            Switch.switchInstances.forEach(instance => instance.element.classList.remove("current")); 
            return null;
        } 
        return instance;
    }

    static getSwitchByPageId(id){
        const instance = Switch.switchInstances.find(instance => instance.pageId === id);

        if(!instance)return null
        return instance;
    }

    static updateSwitch(instance){
        Switch.switchInstances.forEach(instance => instance.element.classList.remove("current"));
        instance.element.classList.add("current");
    }

    static updateSwitchMarker(){
        const element = document.querySelector("#most-played-page-switch.switch .marked");
        const switchContainer = document.querySelector("#most-played-page-switch.switch");
        const marker = document.querySelector("#most-played-page-switch #switch-marker")
        updateMarker(element, switchContainer, marker);
    }

    constructor(parent, pageId, pageNumId){
        const switchDom = document.createElement("div");
        switchDom.id = pageId + "-switch";
        switchDom.className = "switch";
        parent.appendChild(switchDom);

        this.element = switchDom;
        this.pageId = pageId;
        this.pageNumId = pageNumId;
        this.currentSwitchState = "artists";
        Switch.switchInstances.push(this);
        this.render();
    }

    render(){
        const cwdImg = "../../../media/icons/";

        this.element.innerHTML = `  <div id="artists">
                                        <img src="${cwdImg}artists.svg">
                                    </div>
                                    <div id="tracks">
                                        <img src="${cwdImg}tracks.svg">
                                    </div>
                                    <div id="switch-marker"></div>`;
    }

    event(func){
        const marker = this.element.querySelector("#switch-marker");
        this.element.querySelector("#artists").classList.add("marked");
        updateMarker(this.element.querySelector("#artists"), this.element, marker);

        this.element.addEventListener("click", (event) => {
            if(this.currentSwitchState === "artists"){
                this.element.querySelector("#" + this.currentSwitchState).classList.remove("marked");
                this.currentSwitchState = "tracks";
                this.element.querySelector("#" + this.currentSwitchState).classList.add("marked");
            }
            else{
                this.element.querySelector("#" + this.currentSwitchState).classList.remove("marked");
                this.currentSwitchState = "artists";
                this.element.querySelector("#" + this.currentSwitchState).classList.add("marked");
            }

            Switch.updateSwitchMarker();
            func();
        })
    }
}*/