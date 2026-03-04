import { updateSwitchMarker } from "../../components/header/switch/switch.js";

export function updateCurrentMainPage(width, height){
    const main = document.querySelector("main");
    main.style.transform = `translate(${width}, ${height})`;    
    updateSwitchMarker();
}