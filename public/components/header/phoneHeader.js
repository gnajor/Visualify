import { Logo } from "../logo/logo.js";
import { renderPhoneNav } from "./nav/phoneNav.js";
import { renderSelector } from "./selector/selector.js";

export function renderPhoneHeader(parent, pageDoms){
    parent.innerHTML = `<div id="header-main">
                            <div id="logo"></div>
                            <div id="selector-container"></div>
                            <button id="menu-button">
                                <div id="first-line"></div>
                                <div id="second-line"></div>
                                <div id="third-line"></div>
                            </button>
                        </div>
                        <nav></nav>`;

    const logoParent = parent.querySelector("#logo");
    const navContainer = parent.querySelector("nav");
    const selectContainer = parent.querySelector("#selector-container");
    const menuButton = parent.querySelector("#menu-button");

    menuButton.addEventListener("click", () => {
        if(navContainer.className === "active")navContainer.className = "";
        else navContainer.className = "active";
    });

    const width = "9rem";
    const height = "100%";
    const logo = new Logo(logoParent, width, height, 80, 350);
    logo.initLogo();
    renderPhoneNav(navContainer);
    renderSelector(selectContainer);
}