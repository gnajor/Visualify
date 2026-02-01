import { Logo } from "../../../sharedComponents/logo/logo.js";
import { renderNav } from "../../../desktop/components/header/nav/nav.js";
import { renderSelector } from "../header/selector/selector.js";
import { renderSwitch } from "../../../sharedComponents/switch/switch.js";

export function renderHeader(parent){
    parent.innerHTML = `<div id="logo"></div>
                        <nav></nav>
                        <div id="properties-container">
                            <div id="switch-container"></div>
                            <div id="selector-container"></div>
                        </div>`;

    const logoParent = parent.querySelector("#logo");
    const navContainer = parent.querySelector("nav");
    const selectContainer = parent.querySelector("#selector-container");
    const switchContainer = parent.querySelector("#switch-container");
    const propertiesContainer = parent.querySelector("#properties-container");

    const width = "10rem";
    const height = "100%";
    const logo = new Logo(logoParent, width, height, 30, 150);
    logo.initLogo();
    renderNav(navContainer);

    propertiesContainer.style.width = width;
    propertiesContainer.style.height = height;

    renderSelector(selectContainer);
    renderSwitch(switchContainer);
}
